// register.routes.js
const express = require('express');
const router = express.Router();
const {RegisterController} = require('../../controllers/register.controller'); // Controller for registration

router.get('/', RegisterController.getRegister);
// SignUp Route
router.post('/', RegisterController.register);

module.exports = router;
