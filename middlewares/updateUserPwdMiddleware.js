import { dbQuery } from '../db/db.js';
import bcrypt from 'bcrypt';

async function updateUserPwd(req, res, next) {
    try {
        const userId = req.params.id;
        const { confPwd, newPwd } = req.body;

        if(!confPwd){
            return res.status(400).json({ error: "Confirm password!" });
        }
        if(!newPwd){
            return res.status(400).json({ error: "Enter your new password!" });
        }
        if(!userId){
            return res.status(400).json({ error: "No user found!" });
        }

        const getUserPwd = await dbQuery('SELECT user_pwd FROM users WHERE user_id = ? ', [userId]);

        console.log('User pwd to update is:', getUserPwd)


        if (!getUserPwd.length > 0) {
            return res.status(404).json({ error: "User not found" });
        }
        if(!getUserPwd[0].length > 0){
            return res.status(404).json({ error: "User not found" });
        }
        // Store hashed password
        const hashedPwd = getUserPwd[0][0].user_pwd;

        // Compare the confirmation password with the hashed password
        const match = await bcrypt.compare(confPwd, hashedPwd);

        if (!match) {
            return res.status(400).json({ error: "Unauthorized, wrong password!" });
        }

        // Assign pattern to password
        const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // Test password to see if valid (returns boolean)
        const isValidPwd = pwdPattern.test(newPwd);

        // Email validation
        if (!isValidPwd) {
            return res.status(400).json({ message: 'New password is not valid!' });
        }

        next();

    } catch (error) {
        console.error('Error updating user password : ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default updateUserPwd;