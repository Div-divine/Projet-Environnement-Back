function getPosts(req, res, next) {
    try {
        const groupId = req.params.id
        
        // Check if user exists
        if (!groupId) {
            return res.status(404).json({ message: 'Group not found' });
        }

        next();
    } catch (error) {
        // Handle error
        console.error('Error fetching user by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getPosts;