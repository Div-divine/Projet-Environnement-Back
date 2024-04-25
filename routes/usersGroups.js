import { Router } from 'express';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import UserGroupsMiddleware from '../middlewares/ValidateUsersAndGroupsMiddleware.js';
import UsersGroups from '../model/UsersAndGroupsModel.js';
import enableOneUserInSameGroup from '../middlewares/EnableOneEntryUserAndSameGroupMiddleware.js';
import { dbQuery } from '../db/db.js';
import joinUsersWithGroups from '../middlewares/JoinUserWithGroupsMiddleware.js';


const router = Router();

router.post('/', enableOneUserInSameGroup, UserGroupsMiddleware, verifyToken, async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    // Check if the entry already exists
    const [existingEntry] = await dbQuery('SELECT * FROM users_actionsgroups WHERE user_id = ? AND group_id = ?', [userId, groupId]);
    if (existingEntry.length > 0) {
      // Entry already exists, send a response indicating this
      return res.status(200).json({ message: 'User and group already linked' });
    }
    // Insert the entry if it doesn't exist
    await UsersGroups.addUserGroups(userId, groupId);
    res.status(201).json({ message: 'User and group linked successfully' });
  } catch (error) {
    console.error('Error linking user and group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/joinusergroups/:id', joinUsersWithGroups, verifyToken, async (req,res)=>{
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
  }catch (error) {
    console.error('User and group not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


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
});




export default router;