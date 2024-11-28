const db = require('./db');

db.raw('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(error => console.error('Database connection error:', error));

module.exports = db;
