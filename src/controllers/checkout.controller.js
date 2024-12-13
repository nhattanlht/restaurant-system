const CustomerModel= require('../models/customer.model');
const OrderModel=require('../models/orderModel');
const OrderDetailModel=require('../models/OrderDetailModel');
class CheckoutController {
    static async processCheckout(req, res) {
        const { name, phone, email, totalAmount, items } = req.body;

        console.log("Dữ liệu checkout nhận được từ frontend:", req.body);

        try {
            // Xử lý khách hàng
            let customer = await CustomerModel.getCustomerByPhone(phone);
            if (!customer) {
                console.log("Khách hàng chưa tồn tại, thêm mới.");
                await CustomerModel.addCustomer({
                    name,
                    phone_number: phone,
                    email,
                    card_type: "Membership",
                    accumulated_spending: totalAmount,
                    created_at: new Date(),
                });

                customer = await CustomerModel.getCustomerByPhone(phone); // Lấy lại thông tin khách hàng sau khi thêm
            } else {
                console.log("Cập nhật chi tiêu cho khách hàng:", customer.customer_id);
                await CustomerModel.updateCustomerSpending(customer.customer_id, totalAmount);
            }
            const customer_id = customer.customer_id;

            // Xử lý đơn hàng
            let amount = 0;
            let order_total = 0;
            items.forEach(item => {
                amount += item.quantity;
                order_total += item.quantity * item.price;
            });

            const orderData = {
                order_date: new Date(),
                amount,
                total_amount: order_total,
                customer_id,
                payment_method: "Credit Card",
                employee_id: null,
            };

            console.log("Đang tạo đơn hàng:", orderData);
            const orderCreated = await OrderModel.createOrder(orderData);

            if (!orderCreated) {
                return res.status(400).json({ message: "Không thể tạo đơn hàng" });
            }

            let orderId = orderCreated.order_id;
            console.log("OrderId: ", orderId);

            // Duyệt qua từng item và thêm vào Order_Detail
            for (let item of items) {
                const { id, quantity, price } = item;
                console.log("Kiểm tra món ăn: ", id, quantity, price);

                // Gọi model để thêm chi tiết đơn hàng vào bảng Order_Detail
                const success = await OrderDetailModel.addOrderDetail(orderId, id, quantity, price);
                if (!success) {
                    return res.status(400).json({ message: "Lỗi khi thêm chi tiết đơn hàng vào Order_Detail." });
                }
            }

           // Sau khi tạo đơn hàng và chi tiết đơn hàng thành công, trả về JSON thay vì redirect
        return res.status(200).json({
            order_id: orderId,
            name,
            phone,
            email,
            totalAmount: parseInt(totalAmount),
        });
        } catch (err) {
            console.error("Error during checkout:", err);
            // Trả về lỗi cho client
            return res.status(500).json({ message: "Lỗi trong quá trình checkout", error: err.message });
        }
    }
     // Phương thức render trang cảm ơn
     static async renderThankYou(req, res) {
        const { order_id, name, phone, email, totalAmount } = req.query;

        try {
            // Render trang cảm ơn với thông tin nhận được từ query string
            res.render('thank-you', { order_id, name, phone, email, totalAmount });
        } catch (err) {
            console.error("Error rendering thank-you page:", err);
            res.status(500).send('Có lỗi xảy ra khi render trang cảm ơn.');
        }
    }
}



module.exports = CheckoutController;
