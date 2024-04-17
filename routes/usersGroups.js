import { Router } from 'express';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import UserGroupsMiddleware from '../middlewares/ValidateUsersAndGroupsMiddleware.js';
import UsersGroups from '../model/UsersAndGroups.js';


const router = Router();

router.post('/', UserGroupsMiddleware, verifyToken, async (req, res) => {
      const { userId, groupId } = req.body;
      // Using model function addUserGroups  to insert user id and group id into users_actionsgroups table
      await UsersGroups.addUserGroups(userId, groupId);
      res.status(201).json({ message: 'User and group linked successfully' });
  });

export default router;