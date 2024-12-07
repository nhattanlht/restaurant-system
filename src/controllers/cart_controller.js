const CartModel = require('../models/cart.model');

class CartController {
    // Hiển thị giỏ hàng
    static async renderCart(req, res) {
        try {
            console.log("Body Request: ", req.body); // Kiểm tra toàn bộ dữ liệu trong body
            const cart = req.body.cart; // Nhận giỏ hàng từ request body
            if (!cart) {
                return res.status(400).json({ message: "Giỏ hàng không có giá trị" });
            }
            res.json({ cart }); // Trả về giỏ hàng dưới dạng JSON
        } catch (error) {
            console.error('Error fetching cart data:', error);
            res.status(500).json({ message: 'Error fetching cart data', error });
        }
    }
    
    

    // Thêm món vào giỏ hàng
    static async addToCart(req, res) {
        try {
            const { cart, food } = req.body; // Nhận dữ liệu từ request body
            const updatedCart = CartModel.addToCart(cart, food);
            res.json({ success: true, cart: updatedCart });
        } catch (error) {
            console.error('Error adding item to cart:', error);
            res.status(500).json({ message: 'Error adding item to cart', error });
        }
    }

    // Cập nhật số lượng món trong giỏ hàng
    static async updateCart(req, res) {
        try {
            const { cart, id, quantity } = req.body; // Nhận dữ liệu từ request body
            const updatedCart = CartModel.updateCart(cart, id, quantity);
            res.json({ success: true, cart: updatedCart });
        } catch (error) {
            console.error('Error updating cart:', error);
            res.status(500).json({ message: 'Error updating cart', error });
        }
    }

    // Xóa món ăn khỏi giỏ hàng
    static async removeFromCart(req, res) {
        try {
            const { cart, id } = req.body; // Nhận dữ liệu từ request body
            const updatedCart = CartModel.removeFromCart(cart, id);
            res.json({ success: true, cart: updatedCart });
        } catch (error) {
            console.error('Error removing item from cart:', error);
            res.status(500).json({ message: 'Error removing item from cart', error });
        }
    }

    // Lấy tổng số lượng sản phẩm trong giỏ hàng
    static async getCartQuantity(req, res) {
        try {
            const cart = CartModel.getCart(req); // Nhận giỏ hàng từ body request
            const quantity = CartModel.getCartQuantity(cart);
            res.json({ quantity });
        } catch (error) {
            console.error('Error fetching cart quantity:', error);
            res.status(500).json({ message: 'Error fetching cart quantity', error });
        }
    }
}

module.exports = CartController;
