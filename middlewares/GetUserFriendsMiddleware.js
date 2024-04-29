function checkUserFriends(req, res, next) {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(404).json({ message: 'user not found found' });
        }

        next();

    } catch (error) {
        // Handle error
        console.error('Error getting user\'s friends :', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default checkUserFriends;