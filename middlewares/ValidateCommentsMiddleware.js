function validateComment(req, res, next) {
    try {
        const { commentMsg, postId, userId } = req.body;

        if (!commentMsg && !postId && !userId) {
            return res.status(404).json({ message: 'Unable to make a comment' });
        }
        if(!commentMsg){
            return res.status(404).json({ message: 'No message found' }); 
        }
        if(!postId){
            return res.status(404).json({ message: 'No post found' }); 
        }
        if(!userId){
            return res.status(404).json({ message: 'No user found' }); 
        }
        
        next();

    } catch (error) {
        // Handle error
        console.error('Error Sending user comment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default validateComment;