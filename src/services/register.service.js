'use strict';

const sql = require('mssql');
const instanceMSSQL = require('../db/init.mssql');  // Singleton instance of MSSQL connection pool
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};
const bcrypt = require('bcrypt');
const generateCustomerData = require('../../seeds/customer.seed');
const UserModel = require('../models/user.model');
const CustomerModel = require('../models/customer.model');
const TokenService = require('../services/token.service');


class AccessService {
    static signUp = async({username, email, password, confirm_password}) => {

        console.log(username, email, password, confirm_password)
        if(validatePassword(password) && (password !== confirm_password)){
            return{
                code: '20004',
                message: 'Password do not match or password is not validate',
                status: 'error'
            }
        }
        let transaction
        try {
            transaction = await instanceMSSQL.getTransaction()

            // Kiểm tra xem email đã tồn tại chưa
            const userResult = await transaction.request()
                .input('email', sql.NVarChar, email)
                .query('SELECT * FROM [User] WHERE user_name = @email');

            if (userResult.recordset.length > 0) {
                await transaction.rollback();  // Rollback transaction nếu email đã tồn tại
                return {
                    code: '20001',
                    message: 'Email existed',
                    status: 'error'
                };
            }

            // Hash password trước khi lưu
            const passwordHash = await bcrypt.hash(password, 10);

            // Khởi tạo dữ liệu người dùng
            let userData = {
                user_id: null,
                user_name: email,
                password: passwordHash,
                public_key: null,
                private_key: null,
            };



            // Khởi tạo dữ liệu khách hàng
            const customersData = generateCustomerData(1);
            let customerData = customersData[0];
            customerData.name = username;
            customerData.email = email;
            customerData.user_id = userData.user_id;

            // Thêm khách hàng mới vào bảng Customer
            await CustomerModel.insertCustomer(customerData, transaction);

            // Tạo khóa RSA và lưu vào bảng UserKeys
            const { privateKey, publicKey } = TokenService.generateKeyPair();
            const publicKeyString = publicKey.toString('utf8');


            //  Thêm vào User
            userData.public_key = publicKeyString;
            userData.private_key = privateKey
            // Thêm người dùng mới vào bảng User
            userData.user_id = await UserModel.insertUser(userData, transaction);

            // Tạo token
            const tokens = TokenService.createTokenPair({ userID: userData.user_id, email }, privateKey);

            await transaction.commit();  // Commit transaction khi tất cả thành công

            return {

                code: 201,
                metadata: {
                    user: { user_id: userData.user_id, email, username },
                    tokens
                }
            };

            console.log('Public Key:', publicKey);
            console.log('Length:', publicKey.length);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            return {
                code: '20002',
                message: error.message,
                status: 'error'
            };
        }
    }

}


module.exports = AccessService;


// class AccessService{
//     static signUp = async({username, email, password, confirm_password}) => {
//
//         console.log(username, email, password, confirm_password)
//         if(validatePassword(password) && (password !== confirm_password)){
//             return{
//                 code: '20004',
//                 message: 'Password do not match or password is not validate',
//                 status: 'error'
//             }
//         }
//
//         let transaction
//         try {
//             transaction = await instanceMSSQL.getTransaction()
//
//              const userResult = await transaction.request()
//                  .input('user_name', sql.NVarChar, username)
//                  .query('SELECT * FROM [User] WHERE user_name = @user_name');
//
//             if(userResult.recordset.length > 0) {
//                 return {
//                     code: '20005',
//                     message: 'Email existed',
//                     status: 'error'
//                 }
//             }
//
//             return{
//                 code: '201',
//                 message: 'Successfully',
//             }
//
//         await transaction.commit()
//         } catch(error){
//             await transaction.rollback()
//             return {
//                 code: '20004',
//                 message: 'Invalid username or password',
//                 status: 'error',
//             }
//         }
//
//     }
// }
//
// module.exports = AccessService
