import { Router } from 'express';
import Posts from '../model/postsModel.js';
import verifyToken from "../middlewares/webtokenMiddleware.js";
import postInsertion from '../middlewares/ValidatePostsInsertMiddleware.js';


const router = Router();

router.post('/', postInsertion, verifyToken, async (req, res) => {
    try {
        const { postContent, groupId, userId } = req.body;
        const createPost = await Posts.insertUserDataIntoPost(postContent, groupId, userId);

        res.send('Post created successfully'); // Send only the count value
    } catch (error) {
        console.error('Error creting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;