const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for token creation

class TokenService {
    // Generate a new RSA key pair
    static generateKeyPair() {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
        });
        return { privateKey, publicKey };
    }

    // Create token pair (access and refresh)
    static createTokenPair(userData, privateKey) {
        // Signing the token with RS256 using the private key
        const accessToken = jwt.sign(
            { userID: userData.user_id, email: userData.email },
            privateKey, // Private key is used for signing
            { algorithm: 'RS256', expiresIn: '1h' } // Access token expiration (1 hour)
        );

        const refreshToken = jwt.sign(
            { userID: userData.user_id, email: userData.email },
            privateKey, // Private key is used for signing
            { algorithm: 'RS256', expiresIn: '7d' } // Refresh token expiration (7 days)
        );

        return { accessToken, refreshToken };
    }

    // Verify the JWT using the public key
    static verifyToken(token, publicKey) {
        try {
            const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            return { isValid: true, decoded };
        } catch (error) {
            return { isValid: false, message: error.message };
        }
    }
}

module.exports = TokenService;
