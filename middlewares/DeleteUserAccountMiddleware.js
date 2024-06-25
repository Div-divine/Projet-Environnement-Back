import Users from "../model/usersModel.js";

async function deleteUserAccount(req, res, next) {

    try {
        const userId = req.params.id;
        const userIdFromToken = req.userId
        const userRoleId = req.body.userRoleId
        const userRole = await Users.getUserRole(userRoleId)
        // Check if user is admin. Disable account deletion if user is an admin
        const checkUserAdminStatus = await Users.getUserRole(userId)

        console.log('User Role:', userRole)
        console.log('Check user admin status:', checkUserAdminStatus)

        if (!userId) {
            return res.status(404).json({ error: 'No user found' });
        }
        if (userId != userIdFromToken && !userRole) {
            return res.status(401).json({ message: 'Unauthorized, unknown user trying to delete user account!' })
        }
        if (userId != userIdFromToken && userRole) {
            if (userRole.status_id == 2) {
                return res.status(401).json({ message: 'Unauthorized, user has no permission to delete account!' })
            }
            // enable only super admin with status 3 to delete any user account even other admins account
            if (checkUserAdminStatus.status_id != 2 && userRole.status_id != 3) {
                return res.status(401).json({ message: 'Unauthorized, Don\'t have status to delete admin account!' })
            }
            // Bloque deleting of super admin
            if (checkUserAdminStatus.status_id == 3 ) {
                return res.status(401).json({ message: 'Unauthorized, can\'t delete this account!' })
            }
        }

        next();
    } catch (error) {
        // Handle error
        console.error('Error Deleting User account:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}


export default deleteUserAccount;