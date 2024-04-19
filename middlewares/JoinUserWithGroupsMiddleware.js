import UsersGroups from "../model/UsersAndGroupsModel.js";

async function joinUsersWithGroups(req, res, next) {

    const result = await UsersGroups.SelectAllUsersWithGroups();
    // Initialize an empty object to store the grouped data
    const groupedData = {};
    if(!result.length){
        return res.status(400).json({ message: 'Bad response' });
    }
    // Loop through each row in the result set
    result.forEach(row => {
        // Extract user and group information from the row
        const user = {
            userId: row.user_id,
            userName: row.user_name,
            userStatus: row.user_status,
            userCreated: row.user_created,
            userUpdated: row.user_updated,
            userEmail: row.user_email    // Am going to use the user email in the back ofiice not on the front
        };

        const group = {
            groupId: row.group_id,
            groupName: row.group_name,
            // Add other group information here
        };

        // Check if the user is already in the grouped data
        if (!(row.user_id in groupedData)) {
            // If not, initialize an empty array for the user
            groupedData[row.user_id] = {
                user: user,
                groups: []
            };
        }

        // Add the group to the user's groups array
        groupedData[row.user_id].groups.push(group);
    });

    // Send the grouped data as a JSON response
    res.json(groupedData);
    next();
}

export default joinUsersWithGroups;