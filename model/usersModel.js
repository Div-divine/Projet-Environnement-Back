import { dbQuery } from "../db/db.js";
import bcrypt from 'bcrypt';
import { promisify } from 'util';

const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);

class Users {
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

    static async checkUserExist(email) {
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_email = ?', [email]);
        return rows[0];
    }

    static async getUserById(userId){
      const[row] = await dbQuery('SELECT * FROM users WHERE user_id= ?', [userId]);
      return row[0];
    }
    static async getAllUser(userId){
        const[row] = await dbQuery('SELECT user_id, user_name FROM users WHERE user_id != ? ORDER BY user_created DESC', [userId]);
      return row;
    }
    static async getOnlyFourUser(userId){
        const[row] = await dbQuery('SELECT user_id, user_name FROM users WHERE user_id != ? ORDER BY user_created DESC LIMIT 4',[userId]);
      return row;
    }
}

export default Users;
