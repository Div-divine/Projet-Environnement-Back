import { dbQuery } from "../db/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from "../model/adminModel.js";

async function adminLoginValidation(req, res, next) {
    const { email, password } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY;

    try {
        if (!email) {
            return res.status(404).json({ message: 'Enter email!' });
        }
        if (!password) {
            return res.status(404).json({ message: 'Enter password!' });
        }
        // Await the result of the dbQuery function
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_email = ?', [email]);

        if (!rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Get user status
        const userStatus = await Admin.getRoleByEmail(email)
        if (!userStatus) {

        }
        if (userStatus.status_id == 2) {
            return res.status(401).json({ message: 'Unauthorized user!' });
        }

        // Extract the hashed password from the first row
        const hashedPassword = rows[0].user_pwd;
        // Compare the password with the hashed password
        const match = await bcrypt.compare(password, hashedPassword);

        // Ensure that the password matches
        if (!match) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        // Generate JWT token 
        const token = jwt.sign({ userId: rows[0].user_id, username: rows[0].user_name }, secretKey, { expiresIn: '10h' });
        // Attach token to headers send it as data 
        res.status(200)
            .header("Authorization", token)
            .header("Admin-Auth", token)
            .json({ token, userId: rows[0].user_id.toString() });
    } catch (error) {
        // Handle error
        console.error('Error in admin login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default adminLoginValidation;
