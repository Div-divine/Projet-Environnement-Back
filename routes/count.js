import { Router } from 'express';
import Count from '../model/countModel.js';
import verifyToken from '../middlewares/webtokenMiddleware.js';


const router = Router();

router.get('/', verifyToken, async (req, res) => {
    try {
      const userCount = await Count.getNbrOfUsers();
      res.json({ count: userCount.nbr }); // Send only the count value
    } catch (error) {
      console.error('Error fetching user count:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

export default router;