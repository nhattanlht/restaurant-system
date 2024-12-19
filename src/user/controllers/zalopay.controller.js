const axios = require('axios');

const config = {
    app_id: "2554", // Your app ID from ZaloPay
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn", // Your secret key 1
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf", // Your secret key 2
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create', // ZaloPay API endpoint for creating payment
};

class ZaloPayController {
    static async createPayment(req, res) {
        try {
            const cart = req.session.cart || [];
            const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const orderId = 'ORD' + Date.now(); // Tạo order ID duy nhất

            // Dữ liệu cần thiết cho yêu cầu tạo thanh toán
            const data = {
                app_id: config.app_id,
                app_trans_id: orderId,
                amount: totalAmount + 40000, // Tính phí giao hàng vào tổng tiền
                app_user: req.body.name, // Tên người dùng, có thể lấy từ form
                phone: req.body.phone,
                email: req.body.email,
                order_info: 'Thanh toán cho đơn hàng', // Mô tả đơn hàng
                return_url: 'http://localhost:3000/payment/success', // URL trả về khi thanh toán thành công
                cancel_url: 'http://localhost:3000/payment/cancel', // URL nếu thanh toán bị hủy
                notify_url: 'http://localhost:3000/payment/notify', // URL để ZaloPay gửi kết quả thanh toán
            };

            // Gửi yêu cầu tạo thanh toán đến ZaloPay
            const response = await axios.post(config.endpoint, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Kiểm tra kết quả từ ZaloPay
            if (response.data.return_code === 1) {
                // Redirect đến URL thanh toán của ZaloPay
                const urlRedirect = response.data.order_url;
                res.redirect(urlRedirect);
            } else {
                res.status(500).send('Lỗi khi tạo thanh toán.');
            }
        } catch (err) {
            console.error('Error creating ZaloPay payment:', err);
            res.status(500).send('Có lỗi xảy ra khi kết nối với ZaloPay.');
        }
    }
}

module.exports = ZaloPayController;
