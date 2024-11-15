'use strict';

const sql = require('mssql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../configs/mssql.config');
const createTokenPair = require('./createToken.service');
const generateCustomerData = require('../../seeds/customer.seed');
const UserModel = require('../models/user.model');
const CustomerModel = require('../models/customer.model');
const UserKeysModel = require ('../models/UserKeys.model')


class AccessService {
    static signUp = async ({ name, email, password }) => {
        const pool = await sql.connect(config);
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();  // Bắt đầu transaction

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
                password: passwordHash
            };

            // Thêm người dùng mới vào bảng User và lấy ID
            userData.user_id = await UserModel.insertUser(userData, transaction);

            // Khởi tạo dữ liệu khách hàng
            const customersData = generateCustomerData(1);
            let customerData = customersData[0];
            customerData.name = name;
            customerData.email = email;
            customerData.user_id = userData.user_id;

            // Thêm khách hàng mới vào bảng Customer
            await CustomerModel.insertCustomer(customerData, transaction);

            // Tạo khóa RSA và lưu vào bảng UserKeys
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
            });
            const publicKeyString = publicKey.toString('utf8');


            //  Thêm vào User Keys
            let userKeysData = {
                user_id: userData.user_id,
                publicKeyString: publicKeyString,
            }


            // await UserKeysModel.insertUserKeys(userKeysData, transaction);
            await UserModel.insertPublicKey(transaction, userData.user_id, userKeysData.publicKeyString);
            // Tạo token
            const tokens = await createTokenPair({ userID: userData.user_id, email }, privateKey);

            await transaction.commit();  // Commit transaction khi tất cả thành công

            return {
                code: 201,
                metadata: {
                    user: { user_id: userData.user_id, email, name },
                    tokens
                }
            };
        } catch (error) {
            await transaction.rollback();  // Rollback transaction nếu có lỗi
            return {
                code: '20002',
                message: error.message,
                status: 'error'
            };
        }
    }
}

module.exports = AccessService;
