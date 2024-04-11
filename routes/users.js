import { Router } from 'express';
import User from '../model/userModel.js';
import validateUserInput from '../middlewares/ValidateUsersMiddleware.js';
import loginValidation from '../middlewares/UserLoginMiddleware.js';

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

// Route for user authentication
router.post('/login', loginValidation, (req, res) => {
  // Authentication successful, no need to handle it here
  // Just send a success response if needed
  res.status(200).json({ message: 'Login successful' });
});

export default router;
