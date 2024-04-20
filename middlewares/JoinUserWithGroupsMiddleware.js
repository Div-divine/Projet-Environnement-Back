import UsersGroups from "../model/UsersAndGroupsModel.js";

async function joinUsersWithGroups(req, res, next) {
    try {
        const userId = req.params.id;

        // Fetch users with groups excluding the specified user ID
        const usersWithGroups = await UsersGroups.SelectAllUsersWithGroupsExceptOne(userId);
        // Fetch all users excluding the specified user ID
        const allUsers = await UsersGroups.SelectAllUsers(userId);

        // Initialize an object to store users with their groups
        const groupedData = {};

        // Loop through each user with groups and add them to the groupedData object
        usersWithGroups.forEach(user => {
            if (!groupedData[user.user_id]) {
                groupedData[user.user_id] = {
                    user: {
                        user_id: user.user_id,
                        user_name: user.user_name,
                        user_email: user.user_email,
                        // Add other user information here
                    },
                    groups: [] // Initialize an array to store groups
                };
            }

            // Add the group to the user's groups array
            groupedData[user.user_id].groups.push({
                group_id: user.group_id,
                group_name: user.group_name,
                // Add other group information here
            });
        });

        // Loop through each user without groups and add them to the groupedData object
        allUsers.forEach(user => {
            if (!groupedData[user.user_id]) {
                groupedData[user.user_id] = {
                    user: {
                        user_id: user.user_id,
                        user_name: user.user_name,
                        user_email: user.user_email,
                        // Add other user information here
                    },
                    groups: [] // Empty array since the user has no groups
                };
            }
        });

        // Send the grouped data as a JSON response
        res.json(Object.values(groupedData));
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default joinUsersWithGroups;
