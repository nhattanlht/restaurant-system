'use strict';

const sql = require('mssql');
const TABLE_NAME = 'Customer';
const connect = '../configs/mssql.config';

class CustomerModel {
    // Lấy thông tin khách hàng theo số điện thoại
    static async getCustomerByPhone(phoneNumber) {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request()
                .input('phone', sql.NVarChar, phoneNumber)
                .query(`SELECT * FROM ${TABLE_NAME} WHERE phone_number = @phone`);
            return result.recordset[0];
        } catch (error) {
            console.error('Error fetching customer by phone:', error);
            throw error;
        }
    }

    // Cập nhật chi tiêu của khách hàng
    static async updateCustomerSpending(customerId, spending) {
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request()
                .input('customer_id', sql.BigInt, customerId)
                .input('spending', sql.Money, spending)
                .query(`UPDATE [Customer]
                        SET accumulated_spending = accumulated_spending + @spending
                        WHERE customer_id = @customer_id`);
            return result.rowsAffected > 0; // Trả về true nếu cập nhật thành công
        } catch (error) {
            console.error('Error updating customer spending:', error);
            throw error;
        }
    }

    // Thêm khách hàng mới
    static async addCustomer(customerData) {
        const { name, phone_number, email, identity_card, gender, card_type, accumulated_spending, created_at, user_id, support_employee_id } = customerData;
        try {
            const pool = await sql.connect(require(connect));
            const result = await pool.request()
                .input('name', sql.NVarChar, name)
                .input('phone_number', sql.NVarChar, phone_number)
                .input('email', sql.NVarChar, email)
                .input('identity_card', sql.NVarChar, identity_card)
                .input('gender', sql.Char, gender)
                .input('card_type', sql.NVarChar, card_type)
                .input('accumulated_spending', sql.Money, accumulated_spending)
                .input('created_at', sql.DateTime, created_at || new Date())
                .input('user_id', sql.Int, user_id)
                .input('support_employee_id', sql.Int, support_employee_id)
                .query(`
                    INSERT INTO  [Customer]
                    (name, phone_number, email, identity_card, gender, card_type, accumulated_spending, created_at, user_id, support_employee_id)
                    VALUES 
                    (@name, @phone_number, @email, @identity_card, @gender, @card_type, @accumulated_spending, @created_at, @user_id, @support_employee_id)
                `);
            return result.rowsAffected > 0; // Trả về true nếu thêm thành công
        } catch (error) {
            console.error('Error adding customer:', error);
            throw error;
        }
    }
}

module.exports = CustomerModel