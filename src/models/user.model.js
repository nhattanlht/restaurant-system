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
            // const request = transaction.request();
            // request.input('user_name', sql.NVarChar(250), userData.user_name)
            // request.input('password', sql.NVarChar(255), userData.password)
            // request.input('role', sql.NVarChar(50), userData.role)
            // request.input('status', sql.Int, userData.status)
            // request.input('public_key', sql.Varchar(MAX), userData.public_key)
            //
            // const query =`INSERT INTO ${TABLE_NAME} VALUES (
            //     @user_name, @password, @role, @status, @public_key
            //     SELECT SCOPE_IDENTITY() AS user_id;
            // )`
            //
            // await request.query(query)
            const request = transaction.request();
            request.input('user_name', sql.NVarChar(250), userData.user_name)
            request.input('password', sql.NVarChar(255), userData.password)
            request.input('role', sql.NVarChar(50), userData.role)
            request.input('status', sql.Int, userData.status)
            request.input('public_key', sql.Varchar(MAX), userData.public_key)

            const result = await request.execute('SP_InsertNewUser')
            console.log('User inserted successfully, user_id:', result.recordset[0].user_id);
            console.log('User inserted successfully')
        } catch (error){
            console.error('Error inserting user:', error)
        }
    }
    static async insertPublicKey(transaction, user_id, public_key) {
        try {
            const userIDResult = await transaction.request()
                .input('user_id', sql.Int, user_id)
                .query('SELECT * FROM [User] WHERE user_id = @user_id');

            if (userIDResult.recordset.length === 0) {
                throw new Error(`User with ID ${user_id} does not exist.`);
            }

            // Chèn khóa công khai
            await transaction.request()
                .input('user_id', sql.Int, user_id)
                .input('public_key', sql.VarChar(MAX), public_key)
                .query('INSERT INTO PublicKeys (user_id, public_key) VALUES (@user_id, @public_key)');

            console.log('Public key inserted successfully.');
        } catch (error) {
            console.error('Error inserting public key:', error);
            throw error; // Ném lỗi ra ngoài để rollback nếu cần
        }
    }

    static async getUserById(email, transaction) {
        try {
            const request = transaction.request();
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