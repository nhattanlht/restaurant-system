'use strict'

// TODO: External modules
const express = require('express');
const router = express.Router();

// TODO: Internal modules
const { AccessController, getSignUp, getLogin } = require('../../controllers/access.controller');
const accessController = new AccessController();

const forwardError = require('../../../constants/forwardError');
const { authentication, authenticationV2 } = require('../../../shared/middleware/auth.middleware');
router.get('/login', getLogin)
router.get('/signup', getSignUp)
// TODO: route sign up

router.post('/signup', forwardError(accessController.signUp));
// TODO: route login


router.post('/login',  forwardError(accessController.login))

// TODO: route logout
// TODO: middleware authentication
// router.use(authenticationV2)
router.post('/logout', authenticationV2, forwardError(accessController.logout));

// TODO: route refresh token
router.post('/refreshToken', authenticationV2, forwardError(accessController.refreshToken));


module.exports = router;