const crypto = require('crypto');

// Tạo cặp khóa RSA
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Độ dài khóa, ở đây là 2048 bits
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    }
});

console.log("Public Key:");
console.log(publicKey);

console.log("Private Key:");
console.log(privateKey);
