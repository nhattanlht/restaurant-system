const jwt = require('jsonwebtoken');

const createTokenPair = ({ userID, email }, privateKey) => {
    return new Promise((resolve, reject) => {
        try {
            // Tạo Access Token sử dụng privateKey RSA
            const accessToken = jwt.sign(
                { userID, email },
                privateKey, // Sử dụng privateKey RSA
                { algorithm: 'RS256', expiresIn: '1h' }
            );

            // Tạo Refresh Token sử dụng privateKey RSA
            const refreshToken = jwt.sign(
                { userID, email },
                privateKey, // Sử dụng privateKey RSA
                { algorithm: 'RS256', expiresIn: '7d' }
            );

            resolve({ accessToken, refreshToken });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = createTokenPair;
