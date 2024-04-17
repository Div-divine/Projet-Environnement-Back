import { Router } from 'express';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import UserGroupsMiddleware from '../middlewares/ValidateUsersAndGroupsMiddleware.js';
import UsersGroups from '../model/UsersAndGroupsModel.js';
import enableOneUserInSameGroup from '../middlewares/EnableOneEntryUserAndSameGroupMiddleware.js';
import { dbQuery } from '../db/db.js';
import getUserAndGroups from '../middlewares/GetUserWithGroupsMiddleware.js';


const router = Router();

router.post('/', enableOneUserInSameGroup, UserGroupsMiddleware, verifyToken, async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    // Check if the entry already exists
    const [existingEntry] = await dbQuery('SELECT * FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId]);
    if (!existingEntry.length > 0) {
      // Insert the entry if it doesn't exist
      await UsersGroups.addUserGroups(userId, groupId);
      res.status(201).json({ message: 'User and group linked successfully' });
    }
    res.send('User and group already linked')
  } catch (error) {
    console.error('User and group already linked:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.get('/userwithgroups', getUserAndGroups, verifyToken, async (req, res) => {

  const userId = req.body;
  console.log('User id log', userId.userId)
  if (userId) {
    const data = await UsersGroups.selectUserWithGroups(userId.userId)
    res.send(data);
  }

})


export default router;