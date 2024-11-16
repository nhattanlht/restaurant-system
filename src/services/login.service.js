'use strict';
const instanceMSSQL = require('../db/init.mssql');
const TokenService = require("../services/token.service");
const sql = require('mssql')
const bcrypt = require('bcrypt');


class LoginService {
    static login = async({ username: user_name, password }) => {
        let transaction
        try {
            // Ensure the pool is initialized
            transaction = await instanceMSSQL.getTransaction();  // Wait for the pool to be available

            // Query to fetch the user by username
            const userResult = await transaction.request()  // Use pool.request() now that it's available
                .input('user_name', sql.NVarChar, user_name)
                .query('SELECT * FROM [User] WHERE user_name = @user_name');

            console.log(userResult);
            if (userResult.recordset.length === 0) {
                return {
                    code: '20004',
                    message: 'Invalid username or password',
                    status: 'error'
                };
            }

            const user = userResult.recordset[0];

            // Compare the provided password with the stored password hash
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return {
                    code: '20004',
                    message: 'Invalid password',
                    status: 'error'
                };
            }

            transaction.commit()
            // Generate tokens after user is authenticated
            const privateKey = user.private_key;  // Assuming private_key is stored in the database
            const tokens = TokenService.createTokenPair({ userID: user.user_id, email: user.username }, privateKey);

            return {
                code: 200,
                message: 'Login successful',
                status: 'success',
                metadata: { tokens }
            };
        } catch (error) {
            transaction.rollback()
            return {
                code: '20005',
                message: error.message,
                status: 'error'
            };
        }
    }
}

module.exports = LoginService;
