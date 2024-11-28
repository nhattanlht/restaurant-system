const crypto = require('crypto');
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for token creation

class TokenService {
    // Generate a new RSA key pair
    static createKeyToken() {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
        });
        return { privateKey, publicKey };
    }

    // Create token pair (access and refresh)
    static createTokenPair(userData, privateKey, publicKey) {
        // Signing the token with RS256 using the private key
        const accessToken = jwt.sign({ user_id: userData.user_id, username: userData.user_name},  publicKey, {
            expiresIn: '2h'
        })

        const refreshToken = jwt.sign({ user_id: userData.user_id, username: userData.user_name},  privateKey, {
            expiresIn: '7 days'
        })
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
