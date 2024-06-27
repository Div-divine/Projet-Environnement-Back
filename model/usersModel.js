import { dbQuery } from "../db/db.js";
import bcrypt from 'bcrypt';
import { promisify } from 'util';

const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);

class Users {
    static async createUser(name, pwd, email, statusId, showUserImg = true) {
        try {
            // Generate a salt
            const salt = await genSalt(8);

            // Hash the password using the salt
            const hashedPassword = await hash(pwd, salt);

            // Insert the user into the database
            const [result, filed] = await dbQuery('INSERT INTO users (user_name, user_pwd, user_email, status_id, show_user_image) VALUES (?, ?, ?, ?, ?)',
                [name, hashedPassword, email, statusId, showUserImg]
            );

        } catch (err) {
            // Handle errors
            console.error('Error creating user:', err);
        }
    }

    static async checkUserExist(email) {
        const [rows] = await dbQuery('SELECT * FROM users WHERE user_email = ?', [email]);
        return rows[0];
    }

    static async getUserNameAndEmail(userId) {
        const [row] = await dbQuery('SELECT user_name, user_email FROM users WHERE user_id= ?', [userId]);
        return row[0];
    }

    static async getUserById(userId) {
        const [row] = await dbQuery('SELECT * FROM users WHERE user_id= ?', [userId]);
        return row[0];
    }
    static async getAllUser(userId) {
        const [row] = await dbQuery('SELECT user_id, user_name, user_email, user_img, status_id FROM users WHERE user_id != ? ORDER BY user_created DESC', [userId]);
        return row;
    }
    static async getOnlyFourUser(userId) {
        const [row] = await dbQuery('SELECT user_id, user_name FROM users WHERE user_id != ? ORDER BY user_created DESC LIMIT 4', [userId]);
        return row;
    }

    static async getUserRole(userId) {
        const [row] = await dbQuery('SELECT status_id FROM users WHERE user_id= ?', [userId]);
        return row[0];
    }
    static async getUserImgFileName(userId) {
        const [row] = await dbQuery('SELECT user_img FROM users WHERE user_id= ?', [userId]);
        return row[0];
    }
    static async checkUserDeletingImg(userImg) {
        const [row] = await dbQuery('SELECT user_id FROM users WHERE user_img= ?', [userImg]);
        return row[0];
    }

    static async ensureUpdateNameDoesNotAlreadyExists(updateName, userId) {
        const [row] = await dbQuery('SELECT user_name FROM users WHERE user_name = ? AND user_id != ?', [updateName, userId]);
        return row;
    }
    static async ensureUpdateEmailDoesNotAlreadyExists(updateEmail, userId) {
        const [row] = await dbQuery('SELECT user_email FROM users WHERE user_email = ? AND user_id != ?', [updateEmail, userId]);
        return row;
    }

    static async updateUserName(updateName, userId) {
        const [row] = await dbQuery('UPDATE users SET user_name = ? WHERE user_id = ?', [updateName, userId]);
        return row;
    }
    static async updateUserEmail(updateEmail, userId) {
        const [row] = await dbQuery('UPDATE users SET user_email = ? WHERE user_id = ?', [updateEmail, userId]);
        return row;
    }
    static async updateUserPwd(updatePwd, userId) {
        try {

            // Generate a salt
            const salt = await genSalt(8);

            // Hash the password using the salt
            const hashedPassword = await hash(updatePwd, salt);
            const [row] = await dbQuery('UPDATE users SET user_pwd = ? WHERE user_id = ?', [hashedPassword, userId]);
            return row;

        } catch (err) {
            // Handle errors
            console.error('Error creating user:', err);
        }
    }
    static async getUserImg(userId) {
        try {
            const [row] = await dbQuery('SELECT user_img FROM users WHERE  user_id = ?', [userId]);
            return row[0];
        } catch (err) {
            // Handle errors
            console.error('Error creating user:', err);
        }
    }
    static async updateUserImg(newImgName, userId) {
        try {
            const [row] = await dbQuery('UPDATE users SET user_img = ? WHERE user_id = ?', [newImgName, userId]);
            return row;
        } catch (err) {
            // Handle errors
            console.error('Error creating user:', err);
        }
    }

    static async removeDisplayedUserImg(showUserImg, userId){
        const [row] = await dbQuery('UPDATE users SET show_user_image = ? WHERE user_id = ?', [showUserImg, userId]);
        return row;
    }

    static async displayUserImg(showUserImg, userId){
        const [row] = await dbQuery('UPDATE users SET show_user_image = ? WHERE user_id = ?', [showUserImg, userId]);
        return row;
    }
    static async closeUserAccountSetToUnknown(userName, userEmail, userImg, userId){
        const [row] = await dbQuery('UPDATE users SET user_name = ?, user_email = ?, user_img = ? WHERE user_id = ?', [userName, userEmail, userImg, userId]);
        return row;
    }

}

export default Users;
