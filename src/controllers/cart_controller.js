const CartModel = require('../models/cart.model.js');

class CartController {
    // Hiển thị giỏ hàng
    static async renderCart(req, res) {
        try {
            const cart = CartModel.getCart(req.session); // Lấy giỏ hàng từ model
            res.render('cart', { cart }); // Render giao diện giỏ hàng
        } catch (error) {
            res.status(500).json({ message: 'Error fetching cart data', error });
        }
    }

    // Thêm món vào giỏ hàng
    static async addToCart(req, res) {
        try {
            const { id, name, price, image } = req.body; // Nhận dữ liệu món ăn từ client
            const food = { id, name, price, image }; // Tạo đối tượng món ăn
            const cart = CartModel.addToCart(req.session, food); // Sử dụng hàm model để thêm món
            res.json({ success: true, cart }); // Phản hồi client
        } catch (error) {
            res.status(500).json({ message: 'Error adding item to cart', error });
        }
    }

    // Cập nhật số lượng món trong giỏ hàng
    static async updateCart(req, res) {
        try {
            const { id, quantity } = req.body; // Nhận id và số lượng từ client
            const cart = CartModel.updateCart(req.session, id, quantity); // Sử dụng model để cập nhật
            res.json({ success: true, cart });
        } catch (error) {
            res.status(500).json({ message: 'Error updating cart', error });
        }
    }

    // Lấy tổng số lượng sản phẩm trong giỏ hàng
    static getCartQuantity(req, res) {
        try {
            const quantity = CartModel.getCartQuantity(req.session); // Lấy số lượng từ model
            res.json({ quantity }); // Phản hồi tổng số lượng
        } catch (error) {
            res.status(500).json({ message: 'Error fetching cart quantity', error });
        }
    }
}

module.exports = CartController;
