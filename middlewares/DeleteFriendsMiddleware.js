function checkUsersToDelete(req, res, next) {

    try {
        const { user1Id, user2Id } = req.params;

        if (!user1Id) {
            return res.status(404).json({ status: 404, message: 'First user not found' });
        }
        if (!user2Id) {
            return res.status(404).json({ status: 404, message: 'Second user not found' });
        }
        next();
    } catch (error) {
        // Handle error
        console.error('Error Deleting friends:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

export default checkUsersToDelete;