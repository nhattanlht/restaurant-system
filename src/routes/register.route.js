// register.routes.js
const express = require('express');
const router = express.Router();
const {RegisterController, getRegister} = require('../controllers/register.controller'); // Controller for registration

router.get('/', getRegister);
// SignUp Route
router.post('/', RegisterController.register);

module.exports = router;
