class CartModel {
    // Hàm này sẽ lấy giỏ hàng từ session (hoặc cơ sở dữ liệu)
    static getCart(session) {
        return session.cart || [];  // Lấy giỏ hàng từ session
    }

    constructor(session) {
        this.session = session;
        this.items = this.session.cart ? this.session.cart : [];
    }

    // Add a new item or update the quantity if it exists
    addItem(item) {
        const existingItem = this.items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.updateSession();
    }

    // Get all cart items
    getItems() {
        return this.items;
    }

    // Update the session with the current cart state
    updateSession() {
        this.session.cart = this.items;
    }
}


module.exports=CartModel;



   
    // //Thêm món ăn vào giỏ
    // static addToCart(session,food){
    //     const cart=session.cart || [];
    //     //Kiểm tra món ăn nếu đã tồn tại trong giỏ hàng
    //     const existingItem=cart.find(item=>item.id===food.id);
    //     if (existingItem) {
    //         existingItem.quantity += 1; // Tăng số lượng
    //     } else {
    //         // Thêm món mới
    //         cart.push({ ...food, quantity:1 });
    //     }
    //     session.cart=cart; //Lưu lại giỏ hàng trong sesion
    //     return cart;
    // }
  
    // // Xóa món ăn khỏi giỏ hàng
    // static removeFromCart(session, foodId) {
    //     let cart = session.cart || [];

    //     // Loại bỏ món ăn có id trùng
    //     cart = cart.filter(item => item.id !== foodId);

    //     session.cart = cart; // Cập nhật giỏ hàng
    //     return cart;
    // }

    //  // Cập nhật số lượng món ăn trong giỏ hàng
    //  static updateCart(session, foodId) {
    //     const cart = session.cart || [];

    //     // Tìm món ăn và cập nhật số lượng
    //     const item = cart.find(item => item.id === foodId);
    //     if (item) {
    //         item.quantity = Math.max(quantity, 1); // Đảm bảo số lượng >= 1
    //     }

    //     session.cart = cart; // Lưu lại giỏ hàng
    //     return cart;
    // }
    
    //  // Lấy tổng số lượng sản phẩm trong giỏ hàng
    //  static getCartQuantity(session) {
    //     const cart = session.cart || [];
    //     const quantity = cart.reduce((total, item) => total + item.quantity, 0); // Tính tổng số lượng
    //     return quantity;
    // }
