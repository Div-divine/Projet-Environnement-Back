import { Router } from 'express';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import UserGroupsMiddleware from '../middlewares/ValidateUsersAndGroupsMiddleware.js';
import UsersGroups from '../model/UsersAndGroupsModel.js';
import enableOneUserInSameGroup from '../middlewares/EnableOneEntryUserAndSameGroupMiddleware.js';
import { dbQuery } from '../db/db.js';
import joinUsersWithGroups from '../middlewares/JoinUserWithGroupsMiddleware.js';
import updateGroupUserQuits from '../middlewares/handleGroupWhenUserQuitsMiddleware.js';
import Comments from '../model/commentsModel.js';
import Posts from '../model/postsModel.js';




const router = Router();

router.post('/', UserGroupsMiddleware, verifyToken, async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    // Check if the entry already exists
    const [existingEntry] = await dbQuery('SELECT * FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId]);
    console.log('Exist count:', existingEntry);
    if (existingEntry.length > 0 && existingEntry[0].quit_group == 0) {
      // Entry already exists, send a response indicating this
      return res.status(200).json({ message: 'User and group already linked' });
    }
    if (existingEntry.length > 0 && existingEntry[0].quit_group == 1) {
      const quitGroup = false;
      const quitPost = false;
      const quitComment = false;
      await UsersGroups.updateGroupStatusOnceUserQuitsGroup(quitGroup, userId, groupId);
      await Posts.updatePostStatusOnceUserQuitsGroup(quitPost, groupId, userId);
      await Comments.updateCommentStatusOnceUserQuitsGroup(quitComment, userId, groupId)
    }
    if (existingEntry.length < 1) {
      // Insert the entry if it doesn't exist
      await UsersGroups.addUserGroups(userId, groupId);
      res.status(201).json({ message: 'User and group linked successfully' });
    }
  } catch (error) {
    console.error('Error linking user and group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/joinusergroups/:id', joinUsersWithGroups, verifyToken, async (req, res) => {
  // No need to do anything here , all has been taken care of in middleware
})

router.get('/userwithgroups', verifyToken, async (req, res) => {
  try {
    const userId = req.query.userId; // Access query parameter
    console.log('User id log', userId)
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }
    const data = await UsersGroups.selectUserWithGroups(userId)
    res.send(data)
  } catch (error) {
    console.error('User and group not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a user if part of a group
router.post('/check-user-in-group/', verifyToken, async (req, res, next) => {
  try {
    const { userId, groupId } = req.body
    if (!groupId && !userId) {
      return res.status(404).json({ message: 'User and Group not found' });
    }
    const userInGroup = await UsersGroups.checkUserBelongsToAGroup(userId, groupId);
    if (!userInGroup) {
      return res.json({ message: 'User with Group not found' });
    }
    res.send(userInGroup);
  } catch (error) {
    console.error('User and group not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/group-with-users/:id', verifyToken, async (req, res, next) => {
  try {
    const groupId = req.params.id;
    if (!groupId) {
      return res.status(404).json({ message: 'Group not found' });
    }
    const groupUsers = await UsersGroups.selectAllUsersOfAgroup(groupId);
    res.send(groupUsers);
  } catch (error) {
    console.error('User and group not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.put('/quit-group/:id', updateGroupUserQuits, verifyToken, async (req, res) => {
  try {
    const postQuitSet = true;
    const maskComment = true;
    const quitGroup = true;
    const groupId = req.params.id;
    const userId = req.body.userId;

    // Update user posts and comments once user quits group and remove group from user group listing

    await UsersGroups.updateGroupStatusOnceUserQuitsGroup(quitGroup, userId, groupId);
    await Posts.updatePostStatusOnceUserQuitsGroup(postQuitSet, groupId, userId);
    await Comments.updateCommentStatusOnceUserQuitsGroup(maskComment, userId, groupId)

    res.send('User No more in group');
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/user-quit-group-status/:userId/:groupId', verifyToken, async (req, res, next) => {
  try {
    const { userId, groupId } = req.params;
    const response = await UsersGroups.selectUserQuitGroupState(userId, groupId);
    if (response) {
      res.send(response);
    } else {
      res.status(404).send('User group status not found');
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



export default router;