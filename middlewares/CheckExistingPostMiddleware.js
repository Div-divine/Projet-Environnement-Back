import Posts from "../model/postsModel.js";

async function verifyExistPost(req, res, next) {
    try {
        const postId = req.params.postId;
        const existingPost = await Posts.getPost(postId);
        if (!existingPost.length > 0) {
            return res.status(404).json({message: 'Post not found' });
        }
        next();
    } catch (error) {
        console.error('Error getting post:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}


export default verifyExistPost;