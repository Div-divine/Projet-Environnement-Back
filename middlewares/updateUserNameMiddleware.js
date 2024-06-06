
function updateUserName(req, res, next) {
    try {
        const userId = req.params.id;
        const newName = req.body.newName
        if (!userId) {
            res.status(400).json({ error: "User not found" });
        }
        if (!newName) {
            res.status(400).json({ error: "Enter a name to update" });
        }

        next();

    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default updateUserName;