import { dbQuery } from "../db/db.js";

async function blockRegistrationOfSameUser(req, res, next) {
    const { username, email } = req.body;
    try {
        // Await the result of the dbQuery function
        const [rowsEmail] = await dbQuery('SELECT * FROM users WHERE user_email = ?', [email]);
        const [rowsName] = await dbQuery('SELECT * FROM users WHERE user_name = ?', [username]);
        if (rowsEmail.length && rowsName.length) {
            return res.status(404).json({ status: 404, message: 'User Already Exists' });
        }
        if (rowsEmail.length) {
            return res.status(404).json({ status: 404, message: 'Email Already Exists' });
        }
        if (rowsName.length) {
            return res.status(404).json({ status: 404, message: 'Name Already Exists' });
        }
        console.log('User Created successfully');
        next();
    } catch (error) {
        // Handle error
        console.error('Error registring user:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
}

export default blockRegistrationOfSameUser;