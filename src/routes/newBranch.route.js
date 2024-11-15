const express = require('express');
const router = express.Router();

const {NewBranchController, getNewBranch} = require('../controllers/newBranch.controller')

router.get('/', getNewBranch);
router.post('/', NewBranchController.newBranch)

module.exports = router