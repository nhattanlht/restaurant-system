const knex = require('knex');
const config = require('../configs/knexfile.js')

const db = knex(config);

module.exports = db;
