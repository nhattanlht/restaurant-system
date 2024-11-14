// auth.middleware.js
const jwt = require('jsonwebtoken');
const { SECRET_ACCESS } = process.env; // Your secret key from environment variables

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided!' });
    }

    // Verify the JWT token
    jwt.verify(token, SECRET_ACCESS, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token!' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateJWT;
