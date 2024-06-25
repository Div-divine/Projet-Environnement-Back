import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import Users from "../model/usersModel.js";
import deleteUserImgFromServer from "../middlewares/deleteUserImgMiddleware.js";

const router = Router();

// Get the directory name using import.meta.url
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Retrieve public path from .env
// Default to relative path if PUBLIC_PATH is not set
const publicPath = process.env.PUBLIC_PATH || path.join(__dirname, '../public/assets');

// Set up storage for multer to save files in the public/assets directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(publicPath)) {
      fs.mkdirSync(publicPath, { recursive: true });
    }
    cb(null, publicPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/upload-img/:userId', verifyToken, upload.single('file'), (req, res, next) => {
  try {
    const userIdFromToken = req.userId
    const userId = req.params.userId;
    const file = req.file;
    if (userId != userIdFromToken) {
      return res.status(401).json({ message: 'Unauthorized, unknown user trying to upload image!' })
    }
    if (userId == userIdFromToken) {
      if (!file) {
        return res.status(400).send('No file uploaded');
      }
      res.send({ message: 'File uploaded successfully', filename: file.originalname });
    }
  } catch (error) {
    res.status(400).send('Error uploading file');
  }
});

router.post('/delete-img/:userId', verifyToken, deleteUserImgFromServer, async (req, res) => {
  try {
    const userId = req.params.userId;
    const filename = await Users.getUserImgFileName(userId);

    const filePath = path.join(publicPath, filename.user_img);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({ message: 'Image deleted successfully' });
    } else {
      return res.json({ message: 'Image not found' });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
