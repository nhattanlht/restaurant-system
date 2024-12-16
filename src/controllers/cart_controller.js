const CartModel = require('../models/cart.model');
class CartController {
    // Hiển thị giỏ hàng
    static renderCart(req, res) {
        try {
            const cart = req.session.cart || [];  // Lấy giỏ hàng từ session hoặc từ request
            // Nếu giỏ hàng không có dữ liệu, trả về lỗi 404 hoặc thông báo
            if (!cart || cart.length === 0) {
                return res.status(404).json({ message: 'Cart is empty' });
            }
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);  // Tính tổng tiền giỏ hàng

            res.render('cart', { cart, totalAmount });  // Render giỏ hàng và tổng tiền
        } catch (error) {
            console.error('Error fetching cart data:', error);
            // Đảm bảo trả về mã lỗi 500 đúng cách
            res.status(500).json({ message: 'Error fetching cart data', error: error.message });  // Trả về thông tin lỗi hợp lệ
        }
    }
    //Lưu giỏ hàng từ client lên server
    static saveCartFromClient(req, res) {
        try {
            const cart = req.body.cart;  // Nhận giỏ hàng từ client gửi lên
            console.log("Giỏ hàng đã nhận từ client:", cart);
            if (!cart || cart.length === 0) {
                return res.status(400).json({ message: 'No items in the cart' });
            }
            // Lưu giỏ hàng vào session
            req.session.cart = cart;

            res.status(200).json({ message: 'Giỏ hàng đã được lưu thành công.' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi lưu giỏ hàng', error });
        }
    }
    // Xóa món ăn khỏi giỏ hàng
    static removeItemFromCart(req, res) {
        try {
            // Log toàn bộ request body để kiểm tra
            console.log("Yêu cầu xóa món ăn:", req.body);
            const itemId = req.body.itemId  // Lấy ID của món ăn cần xóa
            let cart = req.session.cart || [];

            // Lọc ra món ăn không phải itemId
            cart = cart.filter(item => item.id !== itemId);

            // Lưu lại giỏ hàng đã cập nhật vào session
            req.session.cart = cart;
            //Cập nhật lại localStorage


            // Tính lại tổng tiền
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Trả về giỏ hàng mới đã xóa món ăn
            res.json({ cart, totalAmount });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi xóa món ăn', error });
        }
    }

    // Controller xử lý cập nhật số lượng món ăn trong giỏ hàng
    static updateItemQuantity(req, res) {
        try {
            console.log("Yêu cầu thay đổi số lượng món ăn ", req.body);
            const updatedCart = req.body.cart;
            let cart = req.session.cart || [];


            updatedCart.forEach(updatedItem => {
                const item = cart.find(item => item.id === updatedItem.itemId);

                // Debug: Kiểm tra nếu tìm thấy món
                if (item) {
                    console.log(`Cập nhật món ${item.id}: Số lượng cũ = ${item.quantity}, Số lượng mới = ${updatedItem.quantity}`);
                    item.quantity = updatedItem.quantity;
                }
            });

            // Tính lại tổng tiền
            const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Lưu giỏ hàng vào session
            req.session.cart = cart;

            // Debug: Kiểm tra giỏ hàng sau khi cập nhật
            console.log("Giỏ hàng sau khi cập nhật:", cart);

            // Trả về giỏ hàng và tổng tiền đã cập nhật
            res.json({ cart, totalAmount });
        } catch (error) {
            console.error("Lỗi khi cập nhật giỏ hàng:", error);
            res.status(500).json({ message: 'Lỗi khi cập nhật giỏ hàng', error });
        }
    };


    static renderCheckout(req, res) {
        try {
            // Get cart from session, or default to empty array if not found
            const cart = req.session.cart || [];

            // Calculate the total amount if cart exists
            const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Xử lý dữ liệu và render trang checkout
            res.render('checkout', {
                items: cart, // Pass the cart to the checkout page
                totalAmount: totalAmount, // Pass the total amount to the checkout page
            });
        } catch (err) {
            console.error('Error in checkout:', err);
            res.status(500).send('Có lỗi xảy ra.');
        }
    };


}
module.exports = CartController;
