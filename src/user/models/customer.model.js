'use strict'

const sql = require('mssql')
const TABLE_NAME = 'Customer'
const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = require('../../response/error.response');

class CustomerModel {
    constructor(pool) {
        this.pool = pool; // Kết nối SQL
    }

    // insert a customer
    static async insertCustomer(customerData, transaction) {
        try {
            const request = transaction.request();

            // Thêm các tham số vào request

            request.input('customer_id', sql.BigInt, customerData.customer_id);
            request.input('name', sql.NVarChar(100), customerData.name);
            request.input('phone_number', sql.NVarChar(20), null);
            request.input('email', sql.NVarChar(100), customerData.email);
            request.input('identity_card', sql.NVarChar(20), customerData.identity_card);
            request.input('gender', sql.Char(1), 'F');
            request.input('card_type', sql.NVarChar(50), 'Membership');
            request.input('accumulated_spending', sql.Money, 0);
            request.input('created_at', sql.DateTime, customerData.created_at);
            request.input('user_id', sql.Int, customerData.user_id);
            request.input('support_employee_id', sql.Int, customerData.support_employee_id);

            // Gọi stored procedure
            return await request.execute('dbo.SP_InsertNewCustomer');
        } catch (error) {
            throw new BadRequest('Insert new customer error')
        }
    }
    // sp -> model -> controller -> service -> routes -> FE
    // BE -> hiệu suất
    // update customer
    static async updateCustomer(customer_id, updatedData) {
        try {
            const request = this.pool.request();
            request.input('customer_id', sql.Int, customer_id);
            request.input('name', sql.NVarChar(250), updatedData.name);
            request.input('email', sql.NVarChar(50), updatedData.email);
            request.input('card_type', sql.NVarChar(50), updatedData.card_type);
            request.input('accumulated_spending', sql.Int, updatedData.accumulated_spending);

            const query = `UPDATE ${TABLE_NAME} 
                           SET name = @name, email = @email, card_type = @card_type, 
                               accumulated_spending = @accumulated_spending
                           WHERE customer_id = @customer_id`;

            await request.query(query);
            console.log('Customer updated successfully');
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    }

    // delete customer
    static async deleteCustomer(customer_id) {
        try {
            const request = this.pool.request();
            request.input('customer_id', sql.Int, customer_id);

            const query = `DELETE FROM ${TABLE_NAME} WHERE customer_id = @customer_id`;
            await request.query(query);
            console.log('Customer deleted successfully');
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }

    // get customer
    static async getCustomerById(customer_id) {
        try {
            const request = this.pool.request();
            request.input('customer_id', sql.Int, customer_id);

            const query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = @customer_id`;
            const result = await request.query(query);
            return result.recordset[0];
        } catch (error) {
            console.error('Error retrieving customer:', error);
        }
    }
    static async findCustomerByUserId(user_id, transaction){
        const request = transaction.request();
        request.input('user_id', sql.Int, user_id)

        const query = `Select * from ${TABLE_NAME} WHERE user_id = @user_id`;
        const result = await request.query(query);
        return result.recordset[0];
    }

    static async updateProfileCustomer(customerData, transaction){
        const request = transaction.request();
        request.input('user_id', sql.Int, customerData.user_id)
        request.input('name', sql.NVarChar, customerData.name)
        request.input('phone', sql.NVarChar, customerData.phone_number)
        request.input('gender', sql.Char, customerData.gender)
        request.input('avatar', sql.NVarChar, customerData.avatar)

        const result = await request.execute('SP_UpdateCustomer')
        if(result.returnValue === 0){
            return true
        } return false
    }
    static async addPoints(customerData, transaction){
        const request = this.pool.request();

        // lấy thông tin khách hàng ra bởi customer_id
        // cộng điểm cho khách hàng bởi sp
    }

    // Lấy thông tin khách hàng theo số điện thoại
    // static async getCustomerByPhone(phoneNumber) {
    //     try {
    //         const pool = await sql.connect(require(connect));
    //         const result = await pool.request()
    //             .input('phone', sql.NVarChar, phoneNumber)
    //             const query = `SELECT * FROM ${TABLE_NAME} WHERE phone_number = @phone`;
    //         const result = await request.query(query);
    //         return result.recordset[0];
    //     } catch (error) {
    //         console.error('Error fetching customer by phone:', error);
    //         throw error;
    //     }
    // }

    // Cập nhật chi tiêu của khách hàng
    static async updateCustomerSpending(customerId, spending, transaction) {
        try {
            const request = transaction.request();

                request.input('customer_id', sql.BigInt, customerId)
                request.input('spending', sql.Money, spending)
                const  query = `UPDATE [Customer] SET accumulated_spending = accumulated_spending + @spending WHERE customer_id = @customer_id`;
                const result = await request.query(query);
            return result.rowsAffected > 0; // Trả về true nếu cập nhật thành công
        } catch (error) {
            console.error('Error updating customer spending:', error);
            throw error;
        }
    }
}

module.exports = CustomerModel;
