const sql = require('mssql');
const config = require('../configs/mssql.config');

class BooktableModel {
    static async NewOrderforBooking(infotable = {}) {
        try {
            const { customer_id, table, arrival_time } = infotable;
            await sql.connect(config);

            // // Lấy id order
            // const maxIdQuery = `SELECT ISNULL(MAX(order_id), 0) + 1 AS new_order_id FROM [Order]`;
            // const maxIdRequest = new sql.Request();
            // const maxIdResult = await maxIdRequest.query(maxIdQuery);
            // const newOrderId = maxIdResult.recordset[0].new_order_id;

            // // Thêm thông tin đơn hàng mới với customer_id
            // const OrderinsertQuery = `
            // INSERT INTO [Order] (order_id, customer_id)
            // VALUES (@OrderId, @CustomerId)
            // `;

            // const OrderinsertRequest = new sql.Request();
            // OrderinsertRequest.input('OrderId', sql.Int, newOrderId);
            // OrderinsertRequest.input('CustomerId', sql.BigInt, customer_id);

            // await OrderinsertRequest.query(OrderinsertQuery);

            // console.log('Order inserted successfully');
            let newOrderId = 501;

            // Thêm thông tin đơn hàng ăn tại chỗ mới với order_id
            const TableNumber = Math.floor(Math.random() * 50) + 1; // Tạo số bàn ngẫu nhiên từ 1 đến 50

            // const Dine_In_OrderinsertQuery = `
            // INSERT INTO [Dine_In_Ordering] (order_id, table_number, arrival_time, guest_count)
            // VALUES (@OrderId, @TableNumber, @ArrivalTime, @GuestCount)
            // `;

            const Dine_In_OrderinsertQuery = `
            INSERT INTO [Dine_In_Ordering] (order_id, table_number, guest_count)
            VALUES (@OrderId, @TableNumber, @GuestCount)
            `;

            const Dine_In_OrderinsertRequest = new sql.Request();
            Dine_In_OrderinsertRequest.input('OrderId', sql.Int, newOrderId);
            Dine_In_OrderinsertRequest.input('TableNumber', sql.Int, TableNumber);
            // Dine_In_OrderinsertRequest.input('ArrivalTime', sql.Time, arrival_time);  // Make sure arrival_time is in the right format
            Dine_In_OrderinsertRequest.input('GuestCount', sql.Int, table);

            await Dine_In_OrderinsertRequest.query(Dine_In_OrderinsertQuery);

            console.log('Dine_In_Ordering inserted successfully');

            return newOrderId;
        } catch (error) {
            console.error('Error in NewOrderforBooking:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }

    static async checkOrCreateCustomer(infocustomer = {}) {
        try {
            const { name, phone, email, identity, gender } = infocustomer;

            await sql.connect(config);

            // Kiểm tra email trong bảng Customer
            const emailCheckQuery = `SELECT customer_id FROM Customer WHERE email = @Email`;
            const emailRequest = new sql.Request();
            emailRequest.input('Email', sql.NVarChar, email);
            const result = await emailRequest.query(emailCheckQuery);

            if (result.recordset && result.recordset.length > 0) {
                // Email đã tồn tại, trả về customer_id
                return result.recordset[0].customer_id;
            } else {
                // Email chưa tồn tại, tạo customer_id mới
                const maxIdQuery = `SELECT ISNULL(MAX(customer_id), 0) + 1 AS new_customer_id FROM Customer`;
                const maxIdRequest = new sql.Request();
                const maxIdResult = await maxIdRequest.query(maxIdQuery);
                const newCustomerId = maxIdResult.recordset[0].new_customer_id;

                // Thêm thông tin khách hàng mới với customer_id
                const insertQuery = `
                    INSERT INTO Customer (customer_id, name, phone_number, email, identity_card, gender)
                    VALUES (@CustomerId, @Name, @Phone, @Email, @Identity, @Gender)
                `;

                const insertRequest = new sql.Request();
                insertRequest.input('CustomerId', sql.BigInt, newCustomerId);
                insertRequest.input('Name', sql.NVarChar, name || null);
                insertRequest.input('Phone', sql.NVarChar, phone || null);
                insertRequest.input('Email', sql.NVarChar, email);
                insertRequest.input('Identity', sql.NVarChar, identity || null);
                insertRequest.input('Gender', sql.Char, gender || null);

                await insertRequest.query(insertQuery);

                console.log('User inserted successfully');

                return newCustomerId; // Trả về customer_id vừa tạo
            }
        } catch (error) {
            console.error('Error in checkOrCreateCustomer:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
}

module.exports = BooktableModel;