import Users from "../model/usersModel.js";

async function updateUserEmail(req, res, next) {
    try {
        const userId = req.params.id;
        const newEmail = req.body.newEmail;
        // Email address pattern using RegEx 
        const emailPattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
        // Test email to see if valid (returns boolean)
        const isValidEmail = emailPattern.test(newEmail);
        const alreadyExistsEmail = await Users.ensureUpdateEmailDoesNotAlreadyExists(newEmail, userId);

        if (!isValidEmail) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        if (alreadyExistsEmail.length > 0) {
            return res.status(409).json({ error: "User email already exists" });
        }
        if (!userId) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!newEmail) {
            return res.status(404).json({ error: "Enter a name to update" });
        }

        next();

    } catch (error) {
        console.error('Error updating user email:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default updateUserEmail;