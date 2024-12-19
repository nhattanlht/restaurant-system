'use strict';

const sql = require('mssql');
const TABLE_NAME = 'Order_Detail';
const connect = '../../configs/mssql.config';


class OrderDetailModel {

    // Thêm chi tiết đơn hàng vào bảng Order_Detail
    static async addOrderDetail(orderId, itemId, quantity, price) {
        try {
              const pool = await sql.connect(require(connect));

            // Chạy câu lệnh SQL để thêm chi tiết đơn hàng vào bảng Order_Detail
            const result = await pool.request()
                .input('order_id', sql.Int, orderId)
                .input('item_id', sql.Int, itemId)
                .input('quantity', sql.Int, quantity)
                .input('price', sql.Money, price)
                .query(`
                    INSERT INTO [Order_Detail] (order_id, item_id, quantity, price)
                    VALUES (@order_id, @item_id, @quantity, @price)
                `);

            // console.log(`Đã thêm chi tiết đơn hàng với order_id ${orderId} và item_id ${itemId}`);
            return result.rowsAffected > 0;  // Trả về true nếu có bản ghi được thêm vào
        } catch (error) {
            console.error("Lỗi khi thêm chi tiết đơn hàng:", error);
            throw error;
        }
    }
}

module.exports = OrderDetailModel;
