import { dbQuery } from "../db/db.js";

async function blockRegistrationOfSameUser(req, res, next) {
    const { username, email } = req.body;
    try {
        // Await the result of the dbQuery function
        const [rowsEmail] = await dbQuery('SELECT user_name FROM users WHERE user_email = ?', [email]);
        const [rowsName] = await dbQuery('SELECT user_email FROM users WHERE user_name = ?', [username]);
        if (rowsEmail.length && rowsName.length) {
            return res.status(409).json({ status: 409, message: 'Erreur lors de l\'inscription, Nom ou Email exist déjas' });
        }
        if (rowsEmail.length) {
            return res.status(409).json({ status: 409, message: 'Erreur lors de l\'inscription, Nom ou Email exist déjas' });
        }
        if (rowsName.length) {
            return res.status(404).json({ status: 409, message: 'Erreur lors de l\'inscription, Nom ou Email exist déjas' });
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