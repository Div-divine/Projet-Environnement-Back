import { dbQuery } from "../db/db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function loginValidation(req, res, next) {
    const { email, password } = req.body;
    const secretKey = process.env.JWT_SECRET_KEY;
    try {
        // Await the result of the dbQuery function
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_email = ?', [email]);

        if (!rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the hashed password from the first row
        const hashedPassword = rows[0].user_pwd;
        // Compare the password with the hashed password
        const match = await bcrypt.compare(password, hashedPassword);

        // Ensure that the password matches
        if (!match) {
            return res.status(400).json({ message: 'Incorrect password' });
        }
        console.log(rows[0])
        // Generate JWT token 
        const token = jwt.sign({ userId: rows[0].user_id, username: rows[0].user_name }, secretKey, { expiresIn: '10h' });
        console.log(token)
        // Attach token to response send it as data 
        res.status(200)
        .header("authentification", token)
        .json({ token, userId: rows[0].user_id.toString() });


    } catch (error) {
        // Handle error
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export default loginValidation;
