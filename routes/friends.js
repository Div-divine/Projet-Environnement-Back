import { Router } from 'express';
import validateFriendRequest from '../middlewares/ValidateFriendshipMiddleware.js';
import Friends from '../model/UserfriendsModel.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';

const router = Router();


router.post('/', validateFriendRequest, verifyToken, async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;
        const friendshipRequest = await Friends.createFriends(user1Id, user2Id);

        res.send('Friend request sent successfully'); // Send only the count value
    } catch (error) {
        console.error('Error creting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;