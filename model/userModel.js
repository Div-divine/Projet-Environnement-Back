import { dbQuery } from "../db/db.js";
import bcrypt from 'bcrypt';
import { promisify } from 'util';

const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);

class User {
    static async createUser(name, pwd, email, statusId) {
        try {
            // Generate a salt
            const salt = await genSalt(10);

            // Hash the password using the salt
            const hashedPassword = await hash(pwd, salt);

            // Insert the user into the database
            const [result, filed] = await dbQuery('INSERT INTO users (user_name, user_pwd, user_email, status_id) VALUES (?, ?, ?, ?)',
                [name, hashedPassword, email, statusId]
            );

            console.log('User created successfully');
        } catch (err) {
            // Handle errors
            console.error('Error creating user:', err);
        }
    }

    static async checkUserExist(id) {
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_id = ?', [id]);
        return rows[0];
    }
}

export default User;
