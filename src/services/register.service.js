const sql = require('mssql');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('../configs/mssql.config'); // Assuming this file holds your MSSQL config
const createTokenPair = require('./createToken.service'); // Đảm bảo đường dẫn đúng
class AccessService {
    static signUp = async ({ name, email, password}) => {
        try {
            // Connect to the database
            const pool = await sql.connect(config);

            // Check if email already exists in the User table
            const userResult = await pool.request()
                .input('email', sql.NVarChar, email)
                .query('SELECT * FROM [User] WHERE user_name = @email');

            if (userResult.recordset.length > 0) {
                return {
                    code: '20001',
                    message: 'Email already exists',
                    status: 'error'
                };
            }

            // Hash the password before storing
            const passwordHash = await bcrypt.hash(password, 10);
            const user_id = 324679
// Insert the new user into the User table
            const insertResultUser = await pool.request()
                .input('user_id', sql.Int, user_id)  // Cung cấp giá trị cho user_id
                .input('user_name', sql.NVarChar, email)
                .input('password', sql.VarChar, password)
                .query(`
        INSERT INTO [User] (user_id, user_name, password)
        VALUES (@user_id, @user_name, @password);
        SELECT SCOPE_IDENTITY() AS user_id;  -- Trả về user_id vừa được chèn vào
    `);

            // const user_id = insertResultUser.recordset[0].user_id;

// Kiểm tra nếu user_id hợp lệ
            if (!user_id) {
                throw new Error('Failed to insert user or retrieve user_id');
            }

// Insert the new customer into the Customer table
            const insertResultCustomer = await pool.request()
                .input('customer_id', sql.Int, 69122)
                .input('name', sql.NVarChar, name)
                .input('email', sql.NVarChar, email)
                .input('member_card_number', sql.NVarChar, 'MCN001') // Assuming a default member card number for now
                .input('card_type', sql.NVarChar, 'Membership')
                .input('accumulated_spending', sql.Money, 0)
                .input('created_at', sql.DateTime, new Date())
                .input('user_id', sql.Int, user_id)
                .input('support_employee_id', sql.Int, null) // Assuming no employee support for now
                .query(`
        INSERT INTO [Customer] (customer_id, name, email, member_card_number, card_type, accumulated_spending, created_at, user_id, support_employee_id)
        VALUES (@customer_id, @name, @email, @member_card_number, @card_type, @accumulated_spending, @created_at, @user_id, @support_employee_id);
    `);

// Insert the RSA keys into the UserKeys table
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
                privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
            });

            const publicKeyString = publicKey.toString('utf8');
            const keyInsertResult = await pool.request()
                .input('user_id', sql.Int, user_id)  // Ensure user_id is passed correctly
                .input('public_key', sql.VarChar, publicKeyString)
                .query(`
        INSERT INTO [UserKeys] (user_id, public_key)
        VALUES (@user_id, @public_key)
    `);

            // Generate tokens (implement `createTokenPair`)
            // const tokens = await createTokenPair({ userID: user_id, email }, publicKeyString, privateKey);
            const tokens = await createTokenPair({ userID: user_id, email }, privateKey);

            return {
                code: 201,
                metadata: {
                    user: { user_id, email, name },
                    tokens
                }
            };
        } catch (error) {
            return {
                code: '20002',
                message: error.message,
                status: 'error'
            };
        }
    }
}

module.exports = AccessService;
