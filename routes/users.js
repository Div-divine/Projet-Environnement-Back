import { Router } from 'express';
import User from '../model/userModel.js';
import validateUserInput from '../middlewares/ValidateUsersMiddleware.js';

const router = Router();

router.post('/', validateUserInput, async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Set status by default to 2 which is a normal user
      const statusId = 2;
      // Using model function createUser to insert user info
      await User.createUser(username, password, email, statusId);
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;  