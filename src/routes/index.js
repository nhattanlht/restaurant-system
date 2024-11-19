const express = require('express');
const router = express.Router();
const getLayout = require('../controllers/layout.controller')
const getProfile = require('../controllers/profile.controller')

router.get('/', getLayout)
router.get('/profile', getProfile)
module.exports = router;
