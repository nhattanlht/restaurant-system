const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart_controller.js');

// Hiển thị giỏ hàng
router.get('/cart', CartController.renderCart);

// Thêm món vào giỏ hàng
router.post('/cart/add', CartController.addToCart);

// Xóa món khỏi giỏ hàng
router.post('/cart/remove', CartController.removeFromCart);

// Cập nhật số lượng món ăn
router.post('/cart/update', CartController.updateCart);

router.get('/cart/quantity', CartController.getCartQuantity); // Đảm bảo API này có trong routes


module.exports = router;
