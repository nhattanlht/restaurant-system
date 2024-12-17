'use strict'

const sql = require('mssql');
const TABLE_NAME = 'User'

class UserModel{
    // connect db
    constructor(pool){
        this.pool = pool
    }
    static async insertUser(userData, transaction){
        try{
            const request = transaction.request();
            request.input('user_name', sql.NVarChar(250), userData.user_name)
            request.input('password', sql.NVarChar(255), userData.password)
            request.input('role', sql.NVarChar(50), userData.role)
            request.input('status', sql.Int, userData.status)

            const query =`INSERT INTO ${TABLE_NAME} VALUES (
                @user_name, @password, @role, @status
                SELECT SCOPE_IDENTITY() AS user_id;
            )`

            await request.query(query)
            console.log('User inserted successfully')
        } catch (error){
            console.error('Error inserting user:', error)
        }
    }

    static async getUserById(email) {
        try {
            const request = this.pool.request();
            request.input('user_name', sql.NVarChar(250), email);

            const query = `SELECT * FROM ${TABLE_NAME} WHERE customer_id = @customer_id`;
            const result = await request.query(query);
            return result.recordset[0];
        } catch (error) {
            console.error('Error retrieving customer:', error);
        }
    }
}

module.exports = UserModel