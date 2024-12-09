const CartModel= require('../models/cart.model');
class CartController{
    // Hiển thị giỏ hàng
    static renderCart(req,res){
        try{
            const cart = req.session.cart || [];  // Lấy giỏ hàng từ session hoặc từ request
             // Log session để kiểm tra nếu giỏ hàng có tồn tại
             console.log('Session Cart:', req.session.cart); 
            // Nếu giỏ hàng không có dữ liệu, trả về lỗi 404 hoặc thông báo
        if (!cart|| cart.length === 0) {
        return res.status(404).json({ message: 'Cart is empty' });
      }
           const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);  // Tính tổng tiền giỏ hàng
           
           res.render('cart', { cart, totalAmount });  // Render giỏ hàng và tổng tiền
        }catch(error){
            console.error('Error fetching cart data:', error);
            // Đảm bảo trả về mã lỗi 500 đúng cách
            res.status(500).json({ message: 'Error fetching cart data', error: error.message });  // Trả về thông tin lỗi hợp lệ
        }
    }
    //Lưu giỏ hàng từ client lên server
    static saveCartFromClient(req, res) {
        try {
            const cart = req.body.cart;  // Nhận giỏ hàng từ client gửi lên
            console.log("Giỏ hàng đã nhận từ client:",cart);
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
        //Thêm món vào giỏ hàng
    static addToCart(req,res ){
        try{
            const{id,name,price}=req.body;
            const food={id,name,price};
            const cart= CartModel.addToCart(req.session,food);
            res.json({sucsess:true,cart}); //Phan hoi với giỏ hàng mới
        }catch(error){
            res.status(500).json({message: 'Error adding item to cart', error});
        }
    }
    
    // Cập nhật số lượng của mỗi món trong giỏ hàng
    static async updateCart(req,res){
        try{
            const{id,quantity}=req.body;
            const food={id,quantity};
            const cart=CartModel.updateCart(food);
            res.json({sucsess:true,cart}); 

        }catch(error){
            res.status(500).json({message: 'Error update cart '},error);
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
module.exports=CartController;
