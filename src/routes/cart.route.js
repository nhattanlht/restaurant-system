const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart_controller.js');

// Route xử lý khi truy cập vào /cart
router.get('/', CartController.renderCart);  // Kiểm tra route /cart

module.exports = router;
