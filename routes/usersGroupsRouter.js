import { Router } from 'express';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import UserGroupsMiddleware from '../middlewares/validateUsersAndGroupsMiddleware.js';
import UsersGroups from '../model/UsersAndGroupsModel.js';

import { dbQuery } from '../db/db.js';
import joinUsersWithGroups from '../middlewares/JoinUserWithGroupsMiddleware.js';
import updateGroupUserQuits from '../middlewares/handleGroupWhenUserQuitsMiddleware.js';
import Comments from '../model/commentsModel.js';
import Posts from '../model/postsModel.js';




const router = Router();

router.post('/', UserGroupsMiddleware, verifyToken, async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const userIdFromToken = req.userId

    if (userId != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthorized, unknown user trying to make a post!' })
    }
    if (userId == userIdFromToken) {
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
    }
  } catch (error) {
    console.error('Error linking user and group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/joinusergroups/:id', joinUsersWithGroups, verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const userIdFromToken = req.userId
    if (userId != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthorized, unknown user trying to access group data!' })
    }
    if (userId == userIdFromToken) {
      // Fetch users with groups excluding the specified user ID
      const usersWithGroups = await UsersGroups.SelectAllUsersWithGroupsExceptOne(userId);
      // Fetch all users excluding the specified user ID
      const allUsers = await UsersGroups.SelectAllUsers(userId);

      // Initialize an object to store users with their groups
      const groupedData = {};

      // Function to format date in French format
      const formatDate = (date) => {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
      };

      // Loop through each user with groups and add them to the groupedData object
      usersWithGroups.forEach(user => {
        if (!groupedData[user.user_id]) {
          groupedData[user.user_id] = {
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              user_email: user.user_email,
              user_created: formatDate(user.user_created), // Format datetime in French format
              status_id: user.status_id,
              user_img: user.user_img,
              show_user_image: user.show_user_image
              // Add other user information here
            },
            groups: [] // Initialize an array to store groups
          };
        }

        // Add the group to the user's groups array
        groupedData[user.user_id].groups.push({
          group_id: user.group_id,
          group_name: user.group_name,
          // Add other group information here
        });
      });

      // Loop through each user without groups and add them to the groupedData object
      allUsers.forEach(user => {
        if (!groupedData[user.user_id]) {
          groupedData[user.user_id] = {
            user: {
              user_id: user.user_id,
              user_name: user.user_name,
              user_email: user.user_email,
              user_created: formatDate(user.user_created), // Format datetime in French format
              status_id: user.status_id,
              user_img: user.user_img,
              show_user_image: user.show_user_image
              // Add other user information here
            },
            groups: [] // Empty array since the user has no groups
          };
        }
      });
      // Send the grouped data as a JSON response
      res.json(Object.values(groupedData));
    }
  } catch (error) {
    console.error('Error linking user and group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

router.get('/userwithgroups/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id; // Access query parameter
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
    const userIdFromToken = req.userId
    const { userId, groupId } = req.body
    if (!groupId && !userId) {
      return res.status(404).json({ message: 'User and Group not found' });
    }
    if (userId != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthorized, unknown user in group!' })
    }
    if (userId == userIdFromToken) {
      const userInGroup = await UsersGroups.checkUserBelongsToAGroup(userId, groupId);
      if (!userInGroup) {
        return res.json({ message: 'User with Group not found' });
      }
      res.send(userInGroup);
    }
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
    const userIdFromToken = req.userId

    if (userId != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthorized, unknown user trying to quit group!' })
    }
    if (userId == userIdFromToken) {
      // Update user posts and comments once user quits group and remove group from user group listing

      await UsersGroups.updateGroupStatusOnceUserQuitsGroup(quitGroup, userId, groupId);
      await Posts.updatePostStatusOnceUserQuitsGroup(postQuitSet, groupId, userId);
      await Comments.updateCommentStatusOnceUserQuitsGroup(maskComment, userId, groupId)

      res.send('User No more in group');
    }
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
      return res.json({ message: 'User not in group' });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/upload-usr-img/', verifyToken, async (req, res, next) => {
  try {
    const userIdFromToken = req.userId
    const { userImg, userId } = req.body
    if (!groupId && !userId) {
      return res.status(404).json({ message: 'User and Group not found' });
    }
    if (userId != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthorized, unknown user trying to upload image!' })
    }
    if (userId == userIdFromToken) {
      const userInGroup = await UsersGroups.checkUserBelongsToAGroup(userId, groupId);
      if (!userInGroup) {
        return res.json({ message: 'User with Group not found' });
      }
      res.send(userInGroup);
    }
  } catch (error) {
    console.error('User and group not found:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


export default router;