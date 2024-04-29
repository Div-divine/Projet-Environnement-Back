import { Router } from 'express';
import Posts from '../model/postsModel.js';
import verifyToken from "../middlewares/webtokenMiddleware.js";
import postInsertion from '../middlewares/ValidatePostsInsertMiddleware.js';
import getPosts from '../middlewares/GetPostMiddleware.js';
import validateComment from '../middlewares/ValidateCommentsMiddleware.js';
import Comments from '../model/commentsModel.js';
import getPostComments from '../middlewares/GetPostCommentsMiddleware.js';


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
router.post('/incognito', postInsertion, verifyToken, async (req, res) => {
    try {
        const { postContent, groupId, userId } = req.body;
        const createPost = await Posts.insertUserDataIntoPostIncognito(postContent, groupId, userId);

        res.send('Incognito Post created successfully'); // Send only the count value
    } catch (error) {
        console.error('Error creting Incognito post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', getPosts, verifyToken, async (req, res) => {
    try {
        const groupId = req.params.id;
        const getPost = await Posts.selectAllPostWithUser(groupId);
        if(!getPost.length > 0){
            return res.status(404).json({ message: 'No post found' });
        }
        res.send(getPost); // Send only the count value
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/comment', validateComment, verifyToken, async (req, res) => {
    try {
        const { commentMsg, postId, userId } = req.body;

        const makeComment = await Comments.createPostComments(commentMsg, postId, userId);

        res.send('Post comment created successfully!'); // Send only the count value
    } catch (error) {
        console.error('Error creting post comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-comments/:id', getPostComments, verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;

        const getComments = await Posts.selectAllPostComments(postId);
        if(!getComments.length > 0){
            return res.status(404).json({ message: 'No comment found for this post' });
        }

        res.send(getComments); // Send comments of post
    } catch (error) {
        console.error('Error creting post comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;