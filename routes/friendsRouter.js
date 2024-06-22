import { Router } from 'express';
import validateFriendRequest from '../middlewares/validateFriendshipMiddleware.js';
import Friends from '../model/UserfriendsModel.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import verifyFriendPair from '../middlewares/ensureOneFriendrequestMiddleware.js';
import checkUserFriends from '../middlewares/getUserFriendsMiddleware.js';
import checkUsersToDelete from '../middlewares/deleteFriendsMiddleware.js';

const router = Router();


router.post('/', verifyFriendPair, validateFriendRequest, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { user1Id, user2Id } = req.body;
        // ensure user sending the request is the user connected
        if (user1Id != userIdFromToken && user2Id != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthairized action, user does not match' })
        }
        if (user1Id == userIdFromToken || user2Id == userIdFromToken) {
            await Friends.createFriends(user1Id, user2Id);
            res.send('Friend request sent successfully'); // Send only the count value
        }
    } catch (error) {
        console.error('Error creting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', checkUserFriends, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const userId = req.params.id;
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthairized action, user does not match' })
        }
        if (userId == userIdFromToken) {
            const getUserfriends = await Friends.getAllUsersFriends(userId)
            res.send(getUserfriends); // Send user frineds
        }
    } catch (error) {
        console.error('Error getting user friends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:user1Id/:user2Id', checkUsersToDelete, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { user1Id, user2Id } = req.params;
        // ensure user making the deleting is the user connected
        if (user1Id != userIdFromToken && user2Id != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthairized action, don\'t have right to delete user' })
        }
        if (user1Id == userIdFromToken || user2Id == userIdFromToken) {
            await Friends.deleteUsersFromFriends(user1Id, user2Id);
            res.send('Friend deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;