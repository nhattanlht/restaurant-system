'use strict';

const sql = require('mssql');
const TABLE_NAME = 'Order';
const connect = '../../configs/mssql.config';

class OrderModel {
    // Thêm đơn hàng vào bảng Order
    static async createOrder(orderData) {
        try {
            const { order_date, amount, total_amount, customer_id, payment_method, employee_id } = orderData;

            const pool = await sql.connect(require(connect));

            // Lấy order_id hiện tại từ bảng Order (lấy giá trị lớn nhất hiện tại)
            const resultOrderId = await pool.request()
                .query(`SELECT MAX(order_id) AS current_order_id FROM [Order]`);
            const currentOrderId = resultOrderId.recordset[0].current_order_id || 0; // Nếu chưa có đơn hàng thì lấy 0

            const newOrderId = currentOrderId + 1; // Tăng order_id lên 1

            // Thực hiện chèn đơn hàng mới vào bảng
            const result = await pool.request()
                .input('order_id', sql.Int, newOrderId)
                .input('order_date', sql.DateTime, order_date)
                .input('amount', sql.Int, amount)
                .input('total_amount', sql.Money, total_amount)
                .input('customer_id', sql.BigInt, customer_id)
                .input('payment_method', sql.NVarChar, payment_method)
                .input('employee_id', sql.BigInt, employee_id)
                .query(`
                    INSERT INTO [Order] (order_id, order_date, amount, total_amount, customer_id, payment_method, employee_id)
                    VALUES (@order_id, @order_date, @amount, @total_amount, @customer_id, @payment_method, @employee_id)
                `);

        // Kiểm tra số dòng bị ảnh hưởng và trả về order_id mới
        if (result.rowsAffected > 0) {
            return { order_id: newOrderId }; // Trả về order_id mới tạo
        }

        return null; // Trả về null nếu không thành công
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
    static async getIdOrderByCustormer(customerID){
       try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request()
                .input('customerID', sql.BigInt, customerID)
                .query(`SELECT order_id from [Order] WHERE customer_id=@customerID`);
            return result.recordset[0];
        } catch (error) {
            console.error('Error fetching customer by phone:', error);
            throw error;
        }
    }


}

module.exports = OrderModel;
