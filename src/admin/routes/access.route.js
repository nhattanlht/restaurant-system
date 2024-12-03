// register.routes.js
const express = require('express');
const router = express.Router();
const {AccessController} = require('../controllers/access.controller'); // Controller for registration
const accessController = new AccessController();
const forwardError = require('../../constants/forwardError');
const { authenticate } = require('../../shared/middleware/auth.middleware');

router.post('/admin/signup', forwardError(accessController.signUp));
// TODO: route login

//
// router.post('/admin/login', authenticate, forwardError(accessController.login))
//
// // TODO: route logout
// // TODO: middleware authentication
// // router.use(authenticationV2)
// router.post('/admin/logout', authenticate, forwardError(accessController.logout));
//
//
module.exports = router;
