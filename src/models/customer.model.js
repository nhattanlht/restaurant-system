'use strict'

const sql = require('mssql')
const TABLE_NAME = 'Customer'

class CustomerModel {
    constructor(pool) {
        this.pool = pool; // Kết nối SQL
    }

    // insert a customer
    static async insertCustomer(customerData) {
        try {
            const request = this.pool.request();
            request.input('customer_id', sql.BigInt, customerData.customer_id)
            request.input('name', sql.NVarChar(250), customerData.name)
            request.input('date_of_birth', sql.Date, customerData.date_of_birth)
            request.input('phone_number', sql.NVarChar(15), customerData.phone_number)
            request.input('email', sql.NVarChar(50), customerData.email)
            request.input('identity_card', sql.Int, customerData.identity_card)
            request.input('gender', sql.Int, customerData.gender)
            request.input('member_card_number', sql.Int, customerData.member_card_number)
            request.input('card_type', sql.NVarChar(50), customerData.card_type)
            request.input('accumulated_spending', sql.Int, customerData.accumulated_spending)
            request.input('created_at', sql.DateTime, customerData.created_at)
            request.input('user_id', sql.Int, customerData.user_id)
            request.input('support_employee_id', sql.Int, customerData.support_employee_id)

            const query = `INSERT INTO ${TABLE_NAME} VALUES (
                @customer_id, @name, @date_of_birth, @phone_number, @email,
                @identity_card, @gender, @member_card_number, @card_type, 
                @accumulated_spending, @created_at, @user_id, @support_employee_id
            )`

            await request.query(query);
            console.log('Customer inserted successfully');
        } catch (error) {
            console.error('Error inserting customer:', error);
        }
    }

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

    //  Bulk Insert
    static async bulkInsert(customers) {
        try {
            const customerSchema = new sql.Table(TABLE_NAME);
            customerSchema.create = true; // Tạo mới bảng nếu chưa tồn tại
            customerSchema.columns.add('customer_id', sql.Int, { nullable: false });
            customerSchema.columns.add('name', sql.NVarChar(250), { nullable: false });
            customerSchema.columns.add('date_of_birth', sql.Date, { nullable: true });
            customerSchema.columns.add('phone_number', sql.NVarChar(15), { nullable: true });
            customerSchema.columns.add('email', sql.NVarChar(50), { nullable: false });
            customerSchema.columns.add('identity_card', sql.Int, { nullable: true });
            customerSchema.columns.add('gender', sql.Int, { nullable: true });
            customerSchema.columns.add('member_card_number', sql.Int, { nullable: false });
            customerSchema.columns.add('card_type', sql.NVarChar(50), { nullable: false });
            customerSchema.columns.add('accumulated_spending', sql.Int, { nullable: false });
            customerSchema.columns.add('created_at', sql.DateTime, { nullable: false });
            customerSchema.columns.add('user_id', sql.Int);
            customerSchema.columns.add('support_employee_id', sql.Int);

            // insert data into table template
            customers.forEach(customer => {
                customerSchema.rows.add(
                    customer.customer_id, customer.name, customer.date_of_birth,
                    customer.phone_number, customer.email, customer.identity_card,
                    customer.gender, customer.member_card_number, customer.card_type,
                    customer.accumulated_spending, customer.created_at,
                    customer.user_id, customer.support_employee_id
                );
            });

            // Implement Bulk Insert
            await this.pool.request().bulk(customerSchema);
            console.log('Bulk insert successful');
        } catch (error) {
            console.error('Error performing bulk insert:', error);
        }
    }
}

module.exports = CustomerModel;
