import { Router } from 'express';

const router = Router();

// GET /
router.get('/', (req, res) => {
    res.send('Welcome to environment project backend index route!');
});

export default router;
