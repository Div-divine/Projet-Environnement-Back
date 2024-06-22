import { Router } from 'express';

const router = Router();

// GET 
router.get('/', (req, res) => {
    const scriptUrl = 'http://localhost:5173/src/main.jsx';
    res.render('index', {
        nonce: res.locals.nonce,
        scriptUrl
    });
});

export default router;
