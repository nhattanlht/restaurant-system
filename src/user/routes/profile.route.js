const {authenticationV2, isUser} = require("../../shared/middleware/auth.middleware");
const ProfileController = require("../controllers/profile.controller");
const profileController = new ProfileController();
const express = require('express');
const router = express.Router();

router.get('/profile', authenticationV2 , profileController.getProfile);
router.post('/profile/:id', authenticationV2 , profileController.updateProfile);

module.exports = router;