import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import adminLoginValidation from "../middlewares/adminLoginAccessMiddleware.js";

const router = Router();

// Route for user authentication
router.post('/login', adminLoginValidation, (req, res) => {
    // Authentication successful, no need to handle it here
    // send a success response
    res.status(200).json({ message: 'Login successful' });
  });

  export default router;
