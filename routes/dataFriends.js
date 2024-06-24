import { Router } from 'express';
import Friends from '../model/UserfriendsModel.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';

const router = Router();

router.get('/user-friends-data/:id', verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const userId = req.params.id;
        if (!userIdFromToken) {
            return res.status(401).json({ message: 'Unauthairized action, user does not match' })
        }
        if (userIdFromToken) {
            const getAllUsersFriendsData = await Friends.getAllUsersFriendsData(userId)
            res.send(getAllUsersFriendsData); // Send user frineds
        }
    } catch (error) {
        console.error('Error getting user friends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;