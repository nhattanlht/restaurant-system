const sql = require('mssql');
const config = require('../../configs/mssql.config'); // Import database connection

class EmployeeModel {
    static async searchCustomer(criteria) {
        try {
            await sql.connect(config);
            const request = new sql.Request();

            if (!criteria) {
                return [];
            }

            let query = `SELECT * FROM Customer WHERE `;
            const conditions = [];

            // Dynamically add conditions based on which criteria fields are provided\
            // Assuming criteria is a string
            if (typeof criteria === 'string') {
                if (criteria.includes('@') && !/^\d+$/.test(criteria)) {
                    conditions.push(`email LIKE '%${criteria}%'`);
                    request.input('email', sql.NVarChar, criteria);
                } else if (/^\d+$/.test(criteria) && Number(criteria) < 1000000000) {
                    conditions.push(`phone_number = @phone_number`);
                    request.input('phone_number', sql.NVarChar, criteria);
                } else {
                    // Handle as customer_id (ensure it's a valid BigInt if needed)
                    conditions.push(`customer_id = @customer_id`);
                    request.input('customer_id', sql.BigInt, criteria);
                }
            }


            query += conditions


            const result = await request.query(query);
            console.log('result',result.recordset);
            return result.recordset;
        } catch (error) {
            console.error('Error while searching customers:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }

    static async updateCustomer(customerId, updates) {
        try {
            await sql.connect(config);
            const request = new sql.Request();
            const query = `
                UPDATE Customer
                SET name = @name, phone_number = @phone_number, email = @email, 
                    identity_card = @identity_card, gender = @gender, 
                    card_type = @card_type, accumulated_spending = @accumulated_spending
                WHERE customer_id = @customerId
            `;

            request.input('customerId', sql.BigInt, customerId);
            request.input('name', sql.NVarChar, updates.name);
            request.input('phone_number', sql.NVarChar, updates.phone_number);
            request.input('email', sql.NVarChar, updates.email);
            request.input('identity_card', sql.NVarChar, updates.identity_card);
            request.input('gender', sql.Char, updates.gender);
            request.input('card_type', sql.NVarChar, updates.card_type);
            request.input('accumulated_spending', sql.Money, updates.accumulated_spending || null);

            await request.query(query);
        } catch (error) {
            console.error('Error while updating customer:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }

    static async deleteCustomer(customerId) {
        try {
            await sql.connect(config);
            const request = new sql.Request();

            request.input('customerId', sql.BigInt, customerId);

            const query = `
                Delete FROM Customer
                WHERE customer_id = @customerId
                `;

            const result = await request.query(query);
            return result.recordset;
        } catch (error) {
            console.error('Error while deleting customers:', error);
            throw new Error(error.message);
        } finally {
            await sql.close();
        }
    }
    static async insertCustomer(infocustomer = {}) {
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
                return newCustomerId; 
            }
        } catch (error) {
            console.error('Error in insertCustomer:', error);
            throw error;
        } finally {
            await sql.close();
        }
    }
}

module.exports = EmployeeModel;