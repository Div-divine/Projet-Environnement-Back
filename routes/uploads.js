import { Router } from "express";
import verifyToken from "../middlewares/webtokenMiddleware.js";
import multer from "multer";
import path from 'path';
import fs from 'fs';

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

router.post('/upload-img', verifyToken, upload.single('file'), (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        res.send({ message: 'File uploaded successfully', filename: file.originalname });
    } catch (error) {
        res.status(400).send('Error uploading file');
    }
});

export default router;
