import UsersGroups from "../model/UsersAndGroupsModel.js";

async function getUserAndGroups(req, res, next) {
    try {
        const userId = req.query.userId
        if (userId) {
            // Query the database to get the user by and with groups
            const data = await UsersGroups.selectUserWithGroups(userId);
            console.log("Rows:", data);

            // Check if user exists
            if (!data) {
                return res.status(404).json({ message: 'No group found' });
            }
            res.send(data);
            next();
        }

    } catch (error) {
        // Handle error
        console.error('Error fetching user with groups:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getUserAndGroups;