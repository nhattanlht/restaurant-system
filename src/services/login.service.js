'use strict';
const instanceMSSQL = require('../db/init.mssql');
const TokenService = require("../services/token.service");
const sql = require('mssql')
const bcrypt = require('bcrypt');

class LoginService {
    static login = async({ username: user_name, password }) => {
        let transaction;
        try {
            // Khởi tạo transaction
            transaction = await instanceMSSQL.getTransaction();

            // Truy vấn lấy thông tin người dùng
            const userResult = await transaction.request()
                .input('user_name', sql.NVarChar, user_name)
                .query('SELECT * FROM [User] WHERE user_name = @user_name');

            if (userResult.recordset.length === 0) {
                return {
                    code: '20004',
                    message: 'Invalid username or password',
                    status: 'error'
                };
            }

            const user = userResult.recordset[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return {
                    code: '20004',
                    message: 'Invalid password',
                    status: 'error'
                };
            }

            // Đã đăng nhập thành công
            transaction.commit();

            // Tạo token
            const privateKey = user.private_key;
            const tokens = TokenService.createTokenPair({ userID: user.user_id, email: user.username }, privateKey);

            return {
                code: 200,
                message: 'Login successful',
                status: 'success',
                metadata: { tokens }
            };
        } catch (error) {
            transaction.rollback();
            return {
                code: '20005',
                message: error.message,
                status: 'error'
            };
        }
    }
}

module.exports = LoginService;
