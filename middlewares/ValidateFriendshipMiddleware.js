function validateFriendRequest(req, res, next) {
    try {
        const { user1Id, user2Id } = req.body;

        if (!user1Id && !user2Id) {
            return res.status(404).json({ message: 'No user found' });
        }
        if(!user1Id){
            return res.status(404).json({ message: 'user sending frined request not found' }); 
        }
        if(!user2Id){
            return res.status(404).json({ message: 'Second user not found' }); 
        }
        
        next();

    } catch (error) {
        // Handle error
        console.error('Error Sending friend request:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default validateFriendRequest;