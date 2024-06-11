import { Router } from 'express';
import validateUserInput from '../middlewares/ValidateUsersMiddleware.js';
import loginValidation from '../middlewares/UserLoginMiddleware.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import Users from '../model/usersModel.js';
import blockRegistrationOfSameUser from '../middlewares/CheckUserAlreadyExistsMiddleWare.js';
import updateUserName from '../middlewares/updateUserNameMiddleware.js';
import updateUserEmail from '../middlewares/updateUserEmailMiddleware.js';
import updateUserPwd from '../middlewares/updateUserPwdMiddleware.js';

const router = Router();

router.post('/', blockRegistrationOfSameUser, validateUserInput, async (req, res) => {
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
  // send a success response
  res.status(200).json({ message: 'Login successful' });
});

// Send user image name to database
router.post('/usr-img', verifyToken, async (req, res) => {
  try {
    const { userId, imageName } = req.body
    // Get user image from database if already exists
    const getImg = await Users.getUserImg(userId)

    if (getImg.user_img != imageName) {
      // If there is an existing image, we update the image to the current user uploaded image
      await Users.updateUserImg(imageName, userId)
      res.status(201).json({ message: 'User image updatted successfully' });
    }

    return ;
    
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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

// Define route to get user by ID
router.get('/user-data/:id', verifyToken, async (req, res) => {
  try {
    // Access user ID from request object
    const userId = req.params.id;

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


// Route to get all users
router.get('/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  const users = await Users.getAllUser(userId);
  if (users.length < 0) {
    return res.status(404).json({ error: 'No user found' });
  }
  res.send(users);
})


// Route to get all only four users
router.get('/limitusers/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  const users = await Users.getOnlyFourUser(userId);
  if (users.length < 0) {
    return res.status(404).json({ error: 'No user found' });
  }
  res.send(users);
})

// Update user name
router.put('/update-name/:id', updateUserName, verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const newName = req.body.newName;
    await Users.updateUserName(newName, userId);
    res.json({ message: 'User name updated successfully' });
  } catch (error) {
    console.error('Error updating user name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Update user name
router.put('/update-email/:id', updateUserEmail, verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const newEmail = req.body.newEmail;
    await Users.updateUserEmail(newEmail, userId);
    res.json({ message: 'User email updated successfully' });
  } catch (error) {
    console.error('Error updating user name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Update user name
router.put('/update-pwd/:id', updateUserPwd, verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { confPwd, newPwd } = req.body;
    await Users.updateUserPwd(newPwd, userId);
    res.json({ message: 'User password updated successfully!' });
  } catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


export default router;
