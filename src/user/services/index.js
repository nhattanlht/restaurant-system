const crypto = require('crypto');
const getRandomString = (length = 64) => {
    return crypto.randomBytes(length).toString('hex');
}

module.exports = {getRandomString};