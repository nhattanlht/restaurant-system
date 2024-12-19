const CustomerModel = require('../models/customer.model');
const OrderModel = require('../models/orderModel');
const OrderDetailModel = require('../models/OrderDetailModel');
const Database = require('../../dbs/init.mssql');
const db = new Database
const accessController = require('../services/access.service')

class CheckoutController {
    static async processCheckout(req, res) {
        const { name, phone, email, totalAmount, items } = req.body;
        const user_id = req.session.user.user_id
        // console.log("Dữ liệu checkout nhận được từ frontend:", req.body);

        try {
            // Xử lý khách hàng
            let customer
            await db.runTransaction(async (transaction) => {
                customer = await CustomerModel.findCustomerByUserId(user_id, transaction);
                if (!customer) {
                    customer = accessController.createNewCustomer(name, email, user_id, phone)
                    await CustomerModel.insertCustomer(customer, transaction);
                }

                console.log("Cập nhật chi tiêu cho khách hàng:", customer.customer_id);
                await CustomerModel.updateCustomerSpending(customer.customer_id, totalAmount, transaction);
            })

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

            // console.log("Đang tạo đơn hàng:", orderData);
            const orderCreated = await OrderModel.createOrder(orderData);

            if (!orderCreated) {
                return res.status(400).json({ message: "Không thể tạo đơn hàng" });
            }

            let orderId = orderCreated.order_id;
            // console.log("OrderId: ", orderId);

            // Duyệt qua từng item và thêm vào Order_Detail
            for (let item of items) {
                const { id, quantity, price } = item;
                // console.log("Kiểm tra món ăn: ", id, quantity, price);

                // Gọi model để thêm chi tiết đơn hàng vào bảng Order_Detail
                const success = await OrderDetailModel.addOrderDetail(orderId, id, quantity, price);
                if (!success) {
                    return res.status(400).json({ message: "Lỗi khi thêm chi tiết đơn hàng vào Order_Detail." });
                }
            }

            console.log(totalAmount)
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

        if (req.session.info) {
            var { order_id, name, phone, email, totalAmount } = req.session.info;
            req.session.info = null;
        }
        try {
            // Render trang cảm ơn với thông tin nhận được từ query string
            res.render('user/thank-you', { order_id, name, phone, email, totalAmount });
        } catch (err) {
            console.error("Error rendering thank-you page:", err);
            res.status(500).send('Có lỗi xảy ra khi render trang cảm ơn.');
        }
    }

    // Xử lý mã giảm giá
    static async applyDiscount(req, res) {
        const { initialAmount, shippingFee, code } = req.body; // Nhận dữ liệu từ client
        // Kiểm tra mã giảm giá có được nhập không
        if (!code || code.trim() === '') {
            return res.status(400).json({ message: 'Bạn cần nhập mã giảm giá!' });
        }
        try {
            const { discountValue, totalAmount } = await CustomerModel.calculateTotalAmount(
                initialAmount,
                shippingFee,
                code
            );

            res.json({
                discountValue, // Giá trị giảm giá
                totalAmount,  // Tổng tiền sau khi giảm
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi áp dụng mã giảm giá' });
        }
    }
}



module.exports = CheckoutController;
