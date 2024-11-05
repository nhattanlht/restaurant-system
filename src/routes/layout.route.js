const express = require('express');
const getLayout = require('../controllers/layout.controller.js')

const router = express.Router()
router.get('/', getLayout)

module.exports = router
