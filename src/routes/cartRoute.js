const express = require('express');
const router = express.Router(); 
const CartController=require('../controllers/cardController');

// Hiển thị giỏ hàng
router.get('/cart', CartController.renderCart);
// Nhận giỏ hàng từ client và lưu vào session hoặc xử lý tùy thích
router.post('/cart',CartController.saveCartFromClient);

// // Thêm món vào giỏ hàng
// router.post('/cart/add', CartController.addToCart);

// // Xóa món khỏi giỏ hàng
// router.post('/cart/remove', CartController.removeFromCart);

// // Cập nhật số lượng món ăn
// router.post('/cart/update', CartController.updateCart);

// router.get('/cart/quantity', CartController.getCartQuantity); 

module.exports = router; 
