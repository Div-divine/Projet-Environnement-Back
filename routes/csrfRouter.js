import { Router } from 'express';
import verifyToken from '../middlewares/webtokenMiddleware.js';
import { generateCsrfToken } from '../middlewares/csrfTokenMiddleware.js';

const router = Router();

// Set up a route to send the CSRF token to the frontend
router.get('/:id', verifyToken, generateCsrfToken, (req, res) => {
    const userId = req.params.id;
    const userIdInToken = req.userId
    try{
      if(userId != userIdInToken){
        return res.status(401).json({message: 'Unauthorized user access to csrf!'})
      }
      res.json({ csrfToken: req.csrfToken });
    }catch(error){
      console.error('Error getting csrf access:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
           