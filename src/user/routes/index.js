const express = require('express');
const router = express.Router();
const getLayout = require('../controllers/layout.controller')


const cart = require('./cart.route');
const menu = require('./menu.route');
const checkoutRoute = require("./checkout.route");
const accessRoute = require('./access/access.route');
const profile = require('./profile.route')
const zalopay = require('./zalopay.route')
router.get('/', getLayout); // customer mới vào được trang chính
router.use(accessRoute)

router.use(profile);
router.use(checkoutRoute);
router.use(cart);
router.use(menu);
router.use(zalopay)
module.exports = router;
