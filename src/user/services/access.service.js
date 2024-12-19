'use strict';

// External modules
const bcrypt = require('bcrypt');

const SALTY_ROUNDS = 10;
const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = require('../../response/error.response');
const { getRandomString } = require('./index');

const sql = require('mssql');
const Database = require('../../dbs/init.mssql'); // Singleton instance of MSSQL connection pool
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new BadRequest('Password must contain at least one uppercase letter, one number, and one special character.');
  }
  return true;
};
const generateCustomerData = require('../../../seeds/customer.seed');
const UserModel = require('../../shared/models/user.model');
const CustomerModel = require('../models/customer.model');
const TokenService = require('../../shared/service/token.service');
const { verifyJWT } = require('../../shared/middleware/auth.middleware');


const db = new Database();
class AccessService {
   createNewCustomer(name, email, user_id, phone_number){
    const customerData = generateCustomerData(1)[0];
    customerData.name = name;
    customerData.email = email;
    customerData.user_id = user_id;
    customerData.phone_number =  phone_number;

    return customerData

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
      });

      return {
        user: { user_id: foundUser.user_id, user_name: foundUser.user_name , role: foundUser.role },
        tokens,
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw new BadRequest('Login failed');
    }
  }
  static async signUp({ name, email, password, confirm_password }) {
    if (email === "" || password === "") {
      throw new BadRequest('Username or password cannot be empty');
    }
    if (!validatePassword(password) || password !== confirm_password) {
      throw new BadRequest('Confirm password does not match');
    }
    let userData, tokens
    try {
      // Begin the transaction here
      await db.runTransaction(async (transaction) => {
        // Step 1: Check if username already exists
        const holderUser = await UserModel.findUserByUserName(email, transaction);
        if (holderUser) {
          throw new BadRequest('Username is already taken');
        }

        // Step 2: Create new user and customer
        const passwordHash = await bcrypt.hash(password, SALTY_ROUNDS);
        const publicKey = getRandomString(64);
        const privateKey = getRandomString(64);

        userData = {
          user_id: null,
          user_name: email,
          password: passwordHash,
          role: 'customer',
          public_key: publicKey,
          private_key: privateKey,
        };

        // Insert user vào database
        userData.user_id = await UserModel.insertUser(userData, transaction);

        if (userData.user_id) {
          // Generate customer data and insert it
            const customerData = createNewCustomer(name, email, userData.user_id, null);

          const newCustomer = await CustomerModel.insertCustomer(customerData, transaction);
          if (!newCustomer) {
            throw new BadRequest('Registration failed');
          }
        }

        // Step 3: Generate tokens
        const tokenPayload = {
          user_id: userData.user_id,
          user_name: userData.user_name,
        };
        tokens = TokenService.createTokenPair(tokenPayload, privateKey, publicKey);

        // Step 4: Save key token
        await UserModel.updateKeyToken(userData.user_id, publicKey, privateKey, tokens.refreshToken, transaction);
      });

      return {
        code: 201,
        user: { user_id: userData.user_id, user_name: userData.user_name },
        tokens,
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error; // Re-throw the error to ensure the appropriate response is returned
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
  static async refreshToken({ refreshToken }) {
    try {
      let tokens;

      // Run the transaction block
      await db.runTransaction(async (transaction) => {
        // Step 1: Find user by refreshToken
        const holderToken = await UserModel.findUserByRefreshToken(refreshToken, transaction);
        if (!holderToken) {
          throw new UnauthorizedRequest('Invalid token');
        }

        // Step 2: Verify the refresh token
        const { user_id, user_name } = verifyJWT(refreshToken, holderToken.privateKey);
        const foundUser = await UserModel.findUserByUserName(user_name, transaction);

        if (!foundUser) {
          throw new UnauthorizedRequest('User is not registered');
        }

        // Step 3: Generate new accessToken and refreshToken
        tokens = TokenService.createTokenPair({ user_id, user_name }, holderToken.privateKey, holderToken.publicKey);

        // Step 4: Update the refresh token atomically
        await UserModel.updateKeyToken(foundUser.user_id, holderToken.privateKey, holderToken.publicKey, tokens.refreshToken, transaction);
        await UserModel.updateRefreshToken(holderToken.user_id, tokens.refreshToken, refreshToken, transaction);
      });

      return {
        user: { user_id: user_id, user_name: user_name },
        tokens,
      };
    } catch (error) {
      console.error('Refresh token failed:', error);
      throw new UnauthorizedRequest('Refresh token failed');
    }
  }
  static async refreshTokenV2({ refreshToken, user, keyStore }) {
    const { user_id, user_name } = user;

    try {
      // Run the transaction block
      await db.runTransaction(async (transaction) => {
        // Step 1: Check if the refreshToken has already been used
        if (keyStore.refresh_token_used.includes(refreshToken)) {
          await UserModel.deleteKeyUserById(user_id, transaction);
          throw new ForbiddenRequest('Something went wrong! Please login again');
        }

        // Step 2: Verify if the refreshToken matches the stored token
        if (keyStore.refreshToken !== refreshToken) {
          throw new UnauthorizedRequest('Invalid token');
        }

        // Step 3: Find the user by user_name
        const foundUser = await UserModel.findUserByUserName(user_name, transaction);
        if (!foundUser) {
          throw new UnauthorizedRequest('User is not registered');
        }

        // Step 4: Generate new accessToken and refreshToken
        const tokenPayload = {
          user_id: user_id,
          user_name: user_name,
        };
        const tokens = TokenService.createTokenPair(tokenPayload, foundUser.privateKey, foundUser.publicKey);

        // Step 5: Update the refreshToken atomically
        await UserModel.updateRefreshToken(foundUser.user_id, tokens.refreshToken, refreshToken, transaction);

        // Return updated user and tokens after the transaction
        return {
          user,
          tokens,
        };
      });
    } catch (error) {
      console.error('Refresh token failed:', error);
      throw new UnauthorizedRequest('Refresh token failed');
    }
  }

}


module.exports = AccessService
