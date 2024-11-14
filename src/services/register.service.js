const sql = require('mssql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../configs/mssql.config');
const createTokenPair = require('./createToken.service');

const generateCustomerData = require('../../seeds/customer.seed');
const customer_data = generateCustomerData(1);
let customer_id;
customer_data.forEach(customer => {
    customer_id = customer.customer_id;
});

class AccessService {
    static signUp = async ({ name, email, password }) => {
        const pool = await sql.connect(config);
        const transaction = new sql.Transaction(pool);  // Khởi tạo transaction
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
                    message: 'Email đã tồn tại',
                    status: 'error'
                };
            }

            // Hash password trước khi lưu
            const passwordHash = await bcrypt.hash(password, 10);

            // Thêm người dùng mới vào bảng User
            const insertResultUser = await transaction.request()
                .input('user_name', sql.NVarChar, email)
                .input('password', sql.VarChar, passwordHash)
                .query(`
                    INSERT INTO [User] (user_name, password)
                    VALUES (@user_name, @password);
                    SELECT SCOPE_IDENTITY() AS user_id;
                `);
            const user_id = insertResultUser.recordset[0].user_id;

            // Thêm khách hàng mới vào bảng Customer
            await transaction.request()
                .input('customer_id', sql.Int, customer_id)
                .input('name', sql.NVarChar, name)
                .input('email', sql.NVarChar, email)
                .input('card_type', sql.NVarChar, 'Membership')
                .input('accumulated_spending', sql.Money, 0)
                .input('created_at', sql.DateTime, new Date())
                .input('user_id', sql.Int, user_id)
                .input('support_employee_id', sql.Int, null)
                .query(`
                    INSERT INTO [Customer] (customer_id, name, email, card_type, accumulated_spending, created_at, user_id, support_employee_id)
                    VALUES (@customer_id, @name, @email, @card_type, @accumulated_spending, @created_at, @user_id, @support_employee_id);
                `);

            // Tạo khóa RSA và lưu vào bảng UserKeys
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
            });
            const publicKeyString = publicKey.toString('utf8');

            await transaction.request()
                .input('user_id', sql.Int, user_id)
                .input('public_key', sql.VarChar, publicKeyString)
                .query(`
                    INSERT INTO [UserKeys] (user_id, public_key)
                    VALUES (@user_id, @public_key);
                `);

            // Tạo token
            const tokens = await createTokenPair({ userID: user_id, email }, privateKey);

            await transaction.commit();  // Commit transaction khi tất cả thành công

            return {
                code: 201,
                metadata: {
                    user: { user_id, email, name },
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
