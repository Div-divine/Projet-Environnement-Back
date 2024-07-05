import jwt from 'jsonwebtoken';
import Users from '../model/usersModel.js';

function verifyAdminToken(req, res, next) {
    const token = req.header('Admin-Auth');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        const id = req.userId
        const userRole = Users.getUserRole(id)
        if(!userRole){
            return res.status(404).json({ error: 'User not found' });
        }
        if(userRole.status_id == 2){
            return res.status(401).json({ error: 'Access denied' });
        }
        console.log('User connected Id from token is:', id)
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

export default verifyAdminToken;
