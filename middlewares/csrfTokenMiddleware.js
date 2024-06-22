import Tokens from 'csrf';

const tokens = new Tokens();
const csrfTokens = {}; // This will store the secrets for each user

const generateCsrfToken = (req, res, next) => {
    const userId = req.userId; 
    if (!csrfTokens[userId]) {
        const secret = tokens.secretSync();
        csrfTokens[userId] = secret;
    }
    req.csrfToken = tokens.create(csrfTokens[userId]);
    next();
};

const verifyCsrfToken = (req, res, next) => {
    const token = req.headers['CSRF-Token'];
    const userId = req.userId;
    const secret = csrfTokens[userId];

    if (!token || !secret) {
        return res.status(403).json({ error: 'CSRF token missing or incorrect' });
    }

    if (!tokens.verify(secret, token)) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    next();
};

export { generateCsrfToken, verifyCsrfToken };
