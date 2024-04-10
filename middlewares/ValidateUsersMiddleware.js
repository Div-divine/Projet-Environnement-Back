
function validateUserInput(req, res, next) {
    // Email address pattern using RegEx 
    const emailPattern = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
    // Assign pattern to password
    const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Get user info from body
    const { username, email, password } = req.body;

    // Test email to see if valid (returns boolean)
    const isValidEmail = emailPattern.test(email);
    // Test password to see if valid (returns boolean)
    const isValidPwd = pwdPattern.test(password);

    // Ensure that username, email, and password exist
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }
    // Email validation
    if (!isValidEmail) {
        return res.status(400).json({ message: 'Invalid email address' });
    }
    // Password validation
    if (!isValidPwd) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    next();
}

export default validateUserInput;
