function getPostComments(req, res, next) {
    try {
        const postId = req.params.postId

        if(!post){
            return res.status(404).json({ message: 'post not found' });
        }
        next();

    } catch (error) {
        // Handle error
        console.error('Error fetching comments by post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getPostComments;