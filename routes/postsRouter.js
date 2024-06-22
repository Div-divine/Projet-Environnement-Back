import { Router } from 'express';
import Posts from '../model/postsModel.js';
import verifyToken from "../middlewares/webtokenMiddleware.js";
import postInsertion from '../middlewares/validatePostsInsertMiddleware.js';
import getPosts from '../middlewares/getPostMiddleware.js';
import validateComment from '../middlewares/validateCommentsMiddleware.js';
import Comments from '../model/commentsModel.js';
import getPostComments from '../middlewares/getPostCommentsMiddleware.js';
import checkPostUpdate from '../middlewares/checkPostToUpdateMiddleware.js';
import checkUpdateComment from '../middlewares/updateCommentMiddleware.js';
import verifyExistPost from '../middlewares/checkExistingPostMiddleware.js';


const router = Router();

router.post('/', postInsertion, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { postContent, groupId, userId } = req.body;
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized, violation trying to make a post' })
        }
        if (userId == userIdFromToken) {
            const createPost = await Posts.insertUserDataIntoPost(postContent, groupId, userId);
            res.send('Post created successfully'); // Send only the count value
        }
    } catch (error) {
        console.error('Error creting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/incognito', postInsertion, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { postContent, groupId, userId } = req.body;
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized, violation trying to set another user to incognito' })
        }
        if (userId == userIdFromToken) {
            const createPost = await Posts.insertUserDataIntoPostIncognito(postContent, groupId, userId);
            res.send('Incognito Post created successfully'); // Send only the count value
        }
    } catch (error) {
        console.error('Error creting Incognito post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', getPosts, verifyToken, async (req, res) => {
    try {
        const groupId = req.params.id;
        const getPost = await Posts.selectAllPostWithUser(groupId);
        if (!getPost.length > 0) {
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
        const userIdFromToken = req.userId
        const { commentMsg, postId, userId } = req.body;
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized, violation trying to make a comment without identification' })
        }
        if (userId == userIdFromToken) {
            const makeComment = await Comments.createPostComments(commentMsg, postId, userId);
            res.send('Post comment created successfully!');
        }
    } catch (error) {
        console.error('Error creting post comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-comments/:postId', verifyExistPost, verifyToken, async (req, res) => {
    try {
        const postId = req.params.postId;

        const getComments = await Posts.selectAllPostComments(postId);
        if (!getComments.length > 0) {
            return res.json({ message: 'No comment found for this post' });
        }

        res.send(getComments); // Send comments of post
    } catch (error) {
        console.error('Error creting post comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/:postId/:userId', verifyExistPost, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { postId, userId } = req.params;
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized, violation trying to delete another user post' })
        }
        if (userId == userIdFromToken) {
            // Delete post comments first because of the foreign key
            await Comments.deleteComments(postId);
            // Delete post
            await Posts.deletePosts(postId, userId);
            res.send('Post deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:postId/:userId', verifyExistPost, checkPostUpdate, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { postId, userId } = req.params;
        const postContent = req.body.postContent;
        // update post
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized, violation trying to update another user post' })
        }
        if (userId == userIdFromToken) {
            await Posts.updateUserPost(postId, postContent, userId);
            res.send('Post updated successfully');
        }
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/comment/:commentId/:userId', verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { commentId, userId } = req.params;
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized, Unknown user trying to delete comment' })
        }
        if (userId == userIdFromToken) {
            // Delete post comment
            await Comments.deleteUserCommentOnly(commentId);
            res.send('comment deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/comment/:commentId/:userId', checkUpdateComment, verifyToken, async (req, res) => {
    try {
        const userIdFromToken = req.userId
        const { commentId, userId } = req.params;
        const updateContent = req.body.updateContent;
        // update comment
        if (userId != userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized, Unknown user trying to delete comment' })
        }
        if(userId == userIdFromToken){
            await Comments.updateUserComment(commentId, updateContent, userId)
            res.send('Comment updated successfully');
        }
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;