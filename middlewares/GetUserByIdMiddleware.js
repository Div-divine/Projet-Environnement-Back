import { dbQuery } from "../db/db.js";

// Route handler to get a user by ID
async function getUserById(req, res) {
    // Extract user ID from request parameters
    const userId = req.params.userId;

    try {
        // Query the database to get the user by ID
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_id = ?', [userId]);
        // Check if user exists
        if (!rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details
        res.status(200).json(rows[0]);
    } catch (error) {
        // Handle error
        console.error('Error fetching user by ID:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default getUserById;
