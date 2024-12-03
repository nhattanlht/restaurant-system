const express = require('express');
const router = express.Router();
const getLayout = require('../controllers/layout.controller')
const getProfile = require('../controllers/profile.controller')
const { authenticationV2, isUser } = require('../../shared/middleware/auth.middleware');

router.get('/', getLayout); // customer mới vào được trang chính
router.get('/profile', authenticationV2, getProfile);

module.exports = router;
