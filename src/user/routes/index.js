const express = require('express');
const router = express.Router();
const getLayout = require('../controllers/layout.controller')
const ProfileController = require('../controllers/profile.controller')
const { authenticationV2, isUser } = require('../../shared/middleware/auth.middleware');
const forwardError = require("../../constants/forwardError");
const profileController = new ProfileController();
router.get('/', getLayout); // customer mới vào được trang chính
router.get('/profile', authenticationV2, profileController.getProfile);
router.post('/profile/:id', authenticationV2, profileController.updateProfile);
module.exports = router;
