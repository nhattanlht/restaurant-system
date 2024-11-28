'use strict';

const instanceMSSQL = require('../../dbs/init.mssql');  // Singleton instance of MSSQL connection pool
const bcrypt = require('bcrypt');
const generateEmployeeID = require('../../../seeds/employee.seed');
const UserModel = require('../../shared/models/user.model');
const EmployeeModel = require('../models/employee.model');
const TokenService = require('../../shared/service/token.service');
const { getRandomString } = require('./index');
const SALTY_ROUNDS = 10;
const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = require('../../response/error.response');
const Database = require('../../dbs/init.mssql'); // Singleton instance of MSSQL connection pool
const db = new Database();

class AccessService {
    static signUp = async({name, number}) => {

        let userData, tokens, employee_id
        try {
            await db.runTransaction(async (transaction) => {
                const employee_data = generateEmployeeID(number);
              // Generate employee ID
                employee_id = employee_data;  // Store the generated employee ID
                const employee_id_string = `${employee_id}`;

                // check employee id ? existed
                const holderUser = await UserModel.findUserByUserName(employee_id_string, transaction);
                if (holderUser) {
                    throw new BadRequest('Username is already taken');
                }

                    const password = employee_id_string



                    // Step 2: Create new user and employee
                    const passwordHash = await bcrypt.hash(password, 10);

                    const publicKey = getRandomString(64);
                    const privateKey = getRandomString(64);

                    userData = {
                        user_id: null,
                        user_name: employee_id_string,
                        password: passwordHash,
                        role: 'employee',
                        public_key: publicKey,
                        private_key: privateKey,
                    };


                    // Thêm người dùng mới vào bảng user
                    userData.user_id = await UserModel.insertUser(userData, transaction);
                    if (userData.user_id) {

                        // Khởi tạo dữ liệu khách hàng
                        let employeeData = {
                            employee_id: employee_id,
                            name: name,
                            dept_id: 1,
                            user_id: userData.user_id,
                        }

                        // Thêm khách hàng mới vào bảng Customer
                        await EmployeeModel.insertEmployee(employeeData, transaction);
                        console.log(employeeData);

                        // Step 3: Generate tokens
                        const tokenPayload = {
                            user_id: userData.user_id,
                            user_name: employee_id,
                        };


                        // Tạo token
                        tokens = TokenService.createTokenPair(tokenPayload, privateKey, publicKey);
                        // Step 4: Save key token
                        await UserModel.updateKeyToken(userData.user_id, publicKey, privateKey, tokens.refreshToken, transaction);

                    }

            });
            return {

                code: 201,
                metadata: {
                    user: { user_id: userData.user_id, user_name: employee_id, name: name },
                    tokens
                }
            };

        } catch (error) {
            console.error('Transaction failed:', error);
            throw error; // Re-throw the error to ensure the appropriate response is returned
        }
    }
    static async login({ user_name, password, refreshToken = null }) {
        try {
            let tokens;
            let foundUser
            console.log('user_name', user_name)
            console.log('password', password)
            // Run the transaction block
            await db.runTransaction(async (transaction) => {
                // Step 1: Find the user by username
                foundUser = await UserModel.findUserByUserName(user_name, transaction);
                if (!foundUser) {
                    throw new NotFoundRequest('User is not registered');
                }

                // Step 2: Check password
                const match = await bcrypt.compare(password, foundUser.password);
                if (!match) {
                    throw new UnauthorizedRequest('Authentication failed');
                }

                // Step 3: Create accessToken and refreshToken
                const publicKey = getRandomString(64);
                const privateKey = getRandomString(64);

                const tokenPayload = {
                    user_id: foundUser.user_id,
                    user_name: foundUser.user_name,
                };
                tokens = TokenService.createTokenPair(tokenPayload, privateKey, publicKey);
                refreshToken = tokens.refreshToken
                // Step 4: Update key token for the user

                await UserModel.updateKeyToken(foundUser.user_id, privateKey, publicKey, refreshToken, transaction)

                // if(!resultUpdate){
                //     throw new BadRequest('Update key token failed');
                // }
                // console.log(foundUser)
                // console.log(tokens)

            });

            return {
                user: { user_id: foundUser.user_id, user_name: foundUser.user_name },
                tokens,
            };
        } catch (error) {
            console.error('Login failed:', error);
            throw new BadRequest('Login failed');
        }
    }
    static async logout(keyStore) {
        console.log('keyStore', keyStore)
        try {
            // Run the transaction block
            await db.runTransaction(async (transaction) => {
                // Step 1: Delete the key for the user
                const deleted = await UserModel.deleteKeyUserById(keyStore.user_id, transaction);
                if (!deleted) {
                    throw new BadRequest('Logout failed');
                }
            });

            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            throw new BadRequest('Logout failed');
        }
    }
}


module.exports = AccessService;
