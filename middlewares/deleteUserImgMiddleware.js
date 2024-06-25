import Users from "../model/usersModel.js";

async function deleteUserImgFromServer(req, res, next) {
    try {
        const userIdInToken = req.userId
        const userId = req.params.userId;
        const userRoleId = req.body.userRoleId
        const userRole = await Users.getUserRole(userRoleId)
        // Check if user is admin. Disable account deletion if user is an admin
        const checkUserAdminStatus = await Users.getUserRole(userId)

        if (!userId) {
            return res.status(404).json({ error: 'No user found' });
        }
        if (userId != userIdInToken && !userRole) {
            return res.status(401).json({ message: 'Unauthorized, unknown user trying to delete user image!' })
        }
        if (userId != userIdInToken && userRole) {
            if (userRole.status_id == 2) {
                return res.status(401).json({ message: 'Unauthorized, user has no permission to delete image!' })
            }
            // enable only super admin with status 3 to delete any user account even other admins account
            if (checkUserAdminStatus.status_id != 2 && userRole.status_id != 3) {
                return res.status(401).json({ message: 'Unauthorized, Don\'t have status to delete user image!' })
            }
            // Bloque deleting of super admin image
            if (checkUserAdminStatus.status_id == 3) {
                return res.status(401).json({ message: 'Unauthorized, can\'t delete this user image!' })
            }
        }

        next()
    } catch (error) {

    }
}

export default deleteUserImgFromServer;