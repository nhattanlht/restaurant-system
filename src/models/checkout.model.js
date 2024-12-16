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
        const { name, phone_number, email, card_type, accumulated_spending, created_at } = customerData;
        try {
            const pool = await sql.connect(require(connect));
    
            // Lấy customer_id hiện tại từ bảng Customer (lấy giá trị lớn nhất hiện tại)
            const resultCustomerId = await pool.request()
                .query(`SELECT MAX(customer_id) AS current_customer_id FROM [Customer]`);
            const currentCustomerId = resultCustomerId.recordset[0].current_customer_id || 0; // Nếu chưa có đơn hàng thì lấy 0
            const newCustomerId = currentCustomerId + 1; // Tăng customer_id lên 1
    
            const result = await pool.request()
                .input('customer_id', sql.BIGINT, newCustomerId)
                .input('name', sql.NVarChar, name)
                .input('phone_number', sql.NVarChar, phone_number)
                .input('email', sql.NVarChar, email)
                .input('identity_card', sql.NVarChar, null)  // Truyền null cho identity_card
                .input('gender', sql.Char, null)              // Truyền null cho gender
                .input('card_type', sql.NVarChar, card_type)
                .input('accumulated_spending', sql.Money, accumulated_spending)
                .input('created_at', sql.DateTime, created_at || new Date())
                .input('user_id', sql.Int, null)              // Truyền null cho user_id
                .input('support_employee_id', sql.Int, null)  // Truyền null cho support_employee_id
                .query(`
                    INSERT INTO [Customer]
                    (customer_id, name, phone_number, email, identity_card, gender, card_type, accumulated_spending, created_at, user_id, support_employee_id)
                    VALUES
                    (@customer_id, @name, @phone_number, @email, @identity_card, @gender, @card_type, @accumulated_spending, @created_at, @user_id, @support_employee_id)
                `);
    
            return result.rowsAffected > 0; // Trả về true nếu thêm thành công
        } catch (error) {
            console.error('Error adding customer:', error);
            throw error;
        }
    }
    // Hàm tìm mã giảm giá trong database
    static async findDiscountByCode(code) {
        try {
            // Connect to the database
            const pool = await sql.connect(require(connect));

            // Execute the query with parameter binding
            const result = await pool.request()
                .input('code', sql.Int, code) // Bind the 'code' parameter
                .query(`SELECT * FROM discount WHERE discount_id = @code`); // Use @code as the placeholder

            // Check if a discount was found
            return result.recordset.length > 0 ? result.recordset[0] : null;
        } catch (error) {
            console.error('Error finding discount:', error); // Updated error message
            throw error; // Re-throw the error for further handling
        } finally {
            // Ensure the pool is closed to avoid connection leaks
            sql.close();
        }
    }

    // Hàm tính tổng tiền sau khi áp dụng mã giảm giá
    static async calculateTotalAmount(initialAmount, shippingFee, discountCode) {
        const discount = await this.findDiscountByCode(discountCode);
        const discountValue = discount ? discount.discount_value : 0;
        return {
            discountValue,
            totalAmount: initialAmount + shippingFee - discountValue,
        };
    }
}

module.exports = CustomerModel