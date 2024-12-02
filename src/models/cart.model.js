class CartModel {
    // Lấy giỏ hàng hiện tại từ session
    static getCart(session) {
        return session.cart || [];
    }

    // Thêm món ăn vào giỏ hàng
    static addToCart(session, food) {
        const cart = session.cart || [];

        // Kiểm tra nếu món ăn đã tồn tại trong giỏ hàng
        const existingItem = cart.find(item => item.id === food.id);
        if (existingItem) {
            existingItem.quantity += 1; // Tăng số lượng
        } else {
            // Thêm món mới
            cart.push({ ...food, quantity: 1 });
        }

        session.cart = cart; // Lưu lại giỏ hàng trong session
        return cart;
    }

    // Xóa món ăn khỏi giỏ hàng
    static removeFromCart(session, foodId) {
        let cart = session.cart || [];

        // Loại bỏ món ăn có id trùng
        cart = cart.filter(item => item.id !== foodId);

        session.cart = cart; // Cập nhật giỏ hàng
        return cart;
    }


    // Cập nhật số lượng món ăn trong giỏ hàng
    static updateCart(session, foodId, quantity) {
        const cart = session.cart || [];

        // Tìm món ăn và cập nhật số lượng
        const item = cart.find(item => item.id === foodId);
        if (item) {
            item.quantity = Math.max(quantity, 1); // Đảm bảo số lượng >= 1
        }

        session.cart = cart; // Lưu lại giỏ hàng
        return cart;
    }
    // Lấy tổng số lượng sản phẩm trong giỏ hàng
    static getCartQuantity(session) {
        const cart = session.cart || [];
        const quantity = cart.reduce((total, item) => total + item.quantity, 0); // Tính tổng số lượng
        return quantity;
    }

}

module.exports = CartModel;
