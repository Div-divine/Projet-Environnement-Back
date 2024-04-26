function postInsertion(req, res, next){
    try {
        const { postContent, groupId, userId } = req.body;
        
        if (!userId && !groupId && !postContent) {
            return res.status(404).json({ message: 'failed to create post' });
        }
        if (!userId) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!groupId) {
            return res.status(404).json({ message: 'Group not found' });
        }
        if (!groupId) {
            return res.status(404).json({ message: 'No post found' });
        }
        
        // If validation passes, proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error creating post', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default postInsertion;