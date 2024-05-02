import { Router } from 'express';
import validateFriendRequest from '../middlewares/ValidateFriendshipMiddleware.js';
import Friends from '../model/UserfriendsModel.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import verifyFriendPair from '../middlewares/EnsureOneFriendrequestMiddleware.js';
import checkUserFriends from '../middlewares/GetUserFriendsMiddleware.js';
import checkUsersToDelete from '../middlewares/DeleteFriendsMiddleware.js';

const router = Router();


router.post('/', verifyFriendPair, validateFriendRequest, verifyToken, async (req, res) => {
    try {
        const { user1Id, user2Id } = req.body;
        const friendshipRequest = await Friends.createFriends(user1Id, user2Id);

        res.send('Friend request sent successfully'); // Send only the count value
    } catch (error) {
        console.error('Error creting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', checkUserFriends, verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;

        const getUserfriends = await Friends.getAllUsersFriends(userId)

        res.send(getUserfriends); // Send user frineds
    } catch (error) {
        console.error('Error getting user friends:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:user1Id/:user2Id', checkUsersToDelete, verifyToken, async (req, res) => {
    try {
        const { user1Id, user2Id } = req.params;

        await Friends.deleteUsersFromFriends(user1Id, user2Id);

        res.send('Friend deleted successfully');
    } catch (error) {
        console.error('Error deleting friend:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;