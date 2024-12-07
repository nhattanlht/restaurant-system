class CartModel {
    // Lấy giỏ hàng từ localStorage (phía client sẽ gửi qua request)
    static getCart(req) {
        const cart = req.body && req.body.cart; // Kiểm tra nếu req.body tồn tại
        console.log("Giỏ hàng trước kiểm tra:", cart);
        return cart || [];
    }    

    // Thêm món ăn vào giỏ hàng
    static addToCart(cart, food) {
        // Kiểm tra nếu món ăn đã tồn tại trong giỏ hàng
        const existingItem = cart.find(item => item.id === food.id);
        if (existingItem) {
            // Nếu món ăn đã có trong giỏ hàng, tăng số lượng lên 1
            existingItem.quantity += 1;
        } else {
            // Nếu món ăn chưa có, thêm mới vào giỏ hàng với số lượng 1
            food.quantity = 1;
            cart.push(food);
        }

        return cart;
    }

    // Xóa món ăn khỏi giỏ hàng
    static removeFromCart(cart, foodId) {
        // Loại bỏ món ăn có id trùng
        return cart.filter(item => item.id !== foodId);
    }

    // Cập nhật số lượng món ăn trong giỏ hàng
    static updateCart(cart, foodId, quantity) {
        // Tìm món ăn và cập nhật số lượng
        const item = cart.find(item => item.id === foodId);
        if (item) {
            item.quantity = Math.max(quantity, 1); // Đảm bảo số lượng >= 1
        }
        return cart;
    }

    // Lấy tổng số lượng sản phẩm trong giỏ hàng
    static getCartQuantity(cart) {
        return cart.reduce((total, item) => total + item.quantity, 0); // Tính tổng số lượng
    }
}

module.exports = CartModel;