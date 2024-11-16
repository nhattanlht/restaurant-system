const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/login.controller');

router.get('/', LoginController.getLogin)
router.post('/', LoginController.login)
module.exports = router