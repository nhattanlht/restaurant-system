const express = require('express');
const router = express.Router(); 
const CartController=require('../controllers/cart_controller');

// Hiển thị giỏ hàng
router.get('/cart', CartController.renderCart);
// Nhận giỏ hàng từ client và lưu vào session hoặc xử lý tùy thích
router.post('/cart',CartController.saveCartFromClient);

// Xóa món ăn khỏi giỏ hàng (AJAX)
router.post('/cart/remove', CartController.removeItemFromCart);
//Sửa đổi số lượng món ăn
router.post('/cart/update', CartController.updateItemQuantity);

// POST chuyển đến trang checkout
router.post('/checkout', CartController.renderCheckout);

module.exports = router; 
