import Groups from "../model/groupsModel.js";
import Users from "../model/usersModel.js";


const UserGroupsMiddleware = async (req, res, next) => {
    try {
        const { userId, groupId } = req.body;
        const user = await Users.getUserById(userId);
        const group = await Groups.SelectOneFromGroups(groupId);
        
        if (!user && !group) {
            return res.status(404).json({ message: 'User and Group not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        
        // If validation passes, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error Fetching data', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


export default UserGroupsMiddleware;