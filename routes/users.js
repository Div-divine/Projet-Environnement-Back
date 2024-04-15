import { Router } from 'express';
import User from '../model/usersModel.js';
import validateUserInput from '../middlewares/ValidateUsersMiddleware.js';
import loginValidation from '../middlewares/UserLoginMiddleware.js';
import getUserById from '../middlewares/GetUserByIdMiddleware.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import Users from '../model/usersModel.js';

const router = Router();

router.post('/', validateUserInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Set status by default to 2 which is a normal user not an admin
    const statusId = 2;
    // Using model function createUser to insert user info
    await Users.createUser(username, password, email, statusId);
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

// Define route to get user by ID
router.get('/info', verifyToken, async (req, res) => {
  try {
      // Access user ID from request object
      const userId = req.userId;

      // Get user info using id gotten from web token
      const userData = await Users.getUserById(userId);

      // Check if user data exists
      if (!userData) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Send user data in the response
      res.json({ message: 'Protected route accessed', user: userData });
  } catch (error) {
      // Handle any errors
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
