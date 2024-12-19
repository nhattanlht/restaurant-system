const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');

// Hiển thị giỏ hàng
router.get('/cart', CartController.renderCart);
// Nhận giỏ hàng từ client và lưu vào session hoặc xử lý tùy thích
router.post('/cart', CartController.saveCartFromClient);

// Xóa món ăn khỏi giỏ hàng (AJAX)
router.post('/cart/remove', CartController.removeItemFromCart);
//Sửa đổi số lượng món ăn
router.post('/cart/update', CartController.updateItemQuantity);

// Route to add an item to the cart
router.post('/cart/add', CartController.addToCart);

// Route to retrieve cart items
router.get('/cart/items', CartController.getCartItems);

router.post('/cart/save', CartController.saveCartToDatabase);



module.exports = router; 
