import { Router } from "express";
import adminLoginValidation from "../middlewares/adminLoginAccessMiddleware.js";
import verifyAdminToken from "../middlewares/adminTokenMiddleware.js";

const router = Router();

// Route for user authentication
router.post('/login', adminLoginValidation, (req, res) => {
    // Authentication successful, no need to handle it here
    // send a success response
    res.status(200).json({ message: 'Login successful' });
});

// Admin authentification verification route
router.get('/authentification', verifyAdminToken, (req, res) => {
  // Send the admin information as response
  res.json({ userId: req.userId, userName: 'Admin User' });
});

export default router;
