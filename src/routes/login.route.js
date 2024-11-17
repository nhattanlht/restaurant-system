const express = require('express');
const router = express.Router();
const getLogin = require('../controllers/login.controller');

router.get('/', getLogin)

module.exports = router