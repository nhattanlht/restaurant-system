const express = require("express");
const router = express.Router();
const CheckoutController = require("../controllers/checkout.controller");
const CartController = require("../controllers/cart.controller");
// Route xử lý khách hàng
//router.post("/checkout/customer",CheckoutController.tableCustomer);


// POST chuyển đến trang checkout
router.post('/checkout', CartController.renderCheckout);

// router.post('/checkout', CartController.renderCheckout);
router.post("/checkout/insert", CheckoutController.processCheckout);
// Endpoint để áp dụng mã giảm giá
router.post('/apply-discount', CheckoutController.applyDiscount);

// Hiển thị trang cảm ơn sau khi chuyển hướng từ checkout thành công
router.get('/thank-you', CheckoutController.renderThankYou);
module.exports = router;