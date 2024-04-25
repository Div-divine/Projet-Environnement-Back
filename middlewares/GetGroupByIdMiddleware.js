// Route handler to get a user by ID
async function getGroupById(req, res, next) {

    try {
        // Extract user ID from request parameters
        const groupId = req.params.id;
        // Check if user exists
        if (!groupId) {
            return res.status(404).json({ message: 'Group not found' });
        }
        next();
    } catch (error) {
        // Handle error
        console.error('Error fetching Group by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getGroupById;
