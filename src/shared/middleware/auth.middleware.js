// 'use strict'
// const JWT = require('jsonwebtoken');
// const { HEADERS } = require("../../configs/header.config");
// const UserModel = require('../../shared/models/user.model');
// const Database = require('../../dbs/init.mssql'); // Singleton instance of MSSQL connection pool
// const db = new Database();
// const { NotFoundRequest, UnauthorizedRequest } = require('../../response/error.response');
// const forwardError = require('../../constants/forwardError');
//
// const authentication = forwardError(async (req, res, next) => {
//     /**
//      * 1. Check user_id is existed
//      * 2. get Access Token from header
//      * 3. Verify Access Token
//      * 4. Check Access Token is existed in DB
//      * 5. check Access Token in keys Store
//      */
//
//         // TODO: Step 1: Check user_id and accessToken is existed
//     const user_id = req.headers[HEADERS.CLIENT_ID]
//     const accessToken = req.headers[HEADERS.AUTHORIZATION]
//
//     if (!user_id || !accessToken) {
//         throw new UnauthorizedRequest('Invalid Request')
//     }
//
//     // TODO: Step 2: Found key token
//     await db.runTransaction(async (transaction) => {
//         const keyStore = await UserModel.findUserByUserId(user_id, transaction);
//         console.log('keyStore::', keyStore)
//         if (!keyStore) {
//             throw new NotFoundRequest('Not found key token')
//         }
//         try {
//             const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
//
//             if (decodeUser.user_id !== user_id) {
//                 throw new UnauthorizedRequest('Invalid Request')
//             }
//
//             req.keyStore = keyStore
//             req.user = decodeUser // payload = { user_id, email }
//             return next()
//         } catch (error) {
//             console.log('error', error)
//             throw error
//         }
//     })
//
//     // TODO: Step 3: Verify Access Token
//
// })
//
// const authenticationV2 = forwardError(async (req, res, next) => {
//     // Lấy thông tin user_id, accessToken và refreshToken từ headers
//     const user_id = req.headers[HEADERS.CLIENT_ID];
//     const accessToken = req.headers[HEADERS.AUTHORIZATION];
//     const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];
//
//
//     if (!user_id || (!accessToken && !refreshToken)) {
//         throw new UnauthorizedRequest('Invalid Request headers');
//     }
//
//     // Run transaction
//     await db.runTransaction(async (transaction) => {
//         const keyStoreUser = await UserModel.findUserByUserId(user_id, transaction);
//         if (!keyStoreUser) {
//             throw new NotFoundRequest('Not found key token');
//         }
//
//         // Kiểm tra token
//         if (refreshToken) {
//             // Case: Verify Refresh Token
//             try {
//                 const decodeUser = JWT.verify(refreshToken, keyStoreUser.private_key);
//                 if (decodeUser.user_id != user_id) {
//                     throw new UnauthorizedRequest('Invalid Request decoded user');
//                 }
//
//                 req.keyStore = keyStoreUser;
//                 req.user = decodeUser;
//                 req.refreshToken = refreshToken;
//
//                 return next();
//             } catch (error) {
//                 throw new UnauthorizedRequest('Refresh Token verification failed');
//             }
//         } else {
//             // Case: Verify Access Token
//             try {
//                 const decodeUser = JWT.verify(accessToken, keyStoreUser.public_key);
//                 if (decodeUser.user_id !== user_id) {
//                     throw new UnauthorizedRequest('Invalid Request decoded user');
//                 }
//
//                 req.keyStore = keyStoreUser;
//                 req.user = decodeUser;
//                 console.log('keyStore', keyStoreUser)
//
//                 return next();
//             } catch (error) {
//                 throw new UnauthorizedRequest('Access Token verification failed');
//             }
//         }
//     });
// });
//
// const verifyJWT = (token, keySecret) => {
//     return JWT.verify(token, keySecret);
// };
//
// module.exports = {
//     authenticationV2,
//     verifyJWT
// };


'use strict'
const express = require('express');
const JWT = require('jsonwebtoken');
const { HEADERS } = require("../../configs/header.config");
const UserModel = require('../../shared/models/user.model');
const Database = require('../../dbs/init.mssql'); // Singleton instance of MSSQL connection pool
const db = new Database();
const { NotFoundRequest, UnauthorizedRequest } = require('../../response/error.response');
const forwardError = require('../../constants/forwardError');

const authentication = forwardError(async (req, res, next) => {
    const user_id = req.session.user.user_id
    const accessToken = req.session.tokens.accessToken

    // Step 1: Check user_id and accessToken
    if (!user_id || !accessToken) {
        throw new UnauthorizedRequest('Invalid Request');
    }

    // Step 2: Verify Access Token
    await db.runTransaction(async (transaction) => {
        const keyStore = await UserModel.findUserByUserId(user_id, transaction);
        if (!keyStore) {
            throw new NotFoundRequest('Not found key token');
        }

        try {
            // Decode the JWT token
            const decodeUser = JWT.verify(accessToken, keyStore.private_key);

            // Check user ID in the token matches the one in the request
            if (decodeUser.user_id !== user_id) {
                throw new UnauthorizedRequest('Invalid Request');
            }

            // Assign keyStore and decoded user to request object
            req.keyStore = keyStore;
            req.user = decodeUser;
            return next();

        } catch (error) {
            console.log('error', error);
            throw new UnauthorizedRequest('Invalid Token');
        }
    });
});

// Alternative for handling Access Token and Refresh Token separately
const authenticationV2 = forwardError(async (req, res, next) => {
    const { tokens, user } = req.session || {};
    const refreshToken = tokens?.refreshToken;
    const user_id = user?.user_id;
    const accessToken = tokens.accessToken;

    // Step 1: Check for required headers
    if (!user_id || (!refreshToken)) {
        throw new UnauthorizedRequest('Invalid Request headers');
    }

    // Step 2: Find User by User ID
    await db.runTransaction(async (transaction) => {
        const keyStoreUser = await UserModel.findUserByUserId(user_id, transaction);
        if (!keyStoreUser) {
            throw new NotFoundRequest('User not found');
        }

        // Step 3: Token verification
        if (refreshToken) {
            // Case: Verify Refresh Token
            try {
                const decodeUser = JWT.verify(refreshToken, keyStoreUser.private_key);
                if (decodeUser.user_id !== user_id) {
                    throw new UnauthorizedRequest('Invalid Request decoded user');
                }
                req.keyStore = keyStoreUser;
                req.user = decodeUser;
                req.refreshToken = refreshToken;
                return next();
            } catch (error) {
                throw new UnauthorizedRequest('Refresh Token verification failed');
            }
        } else {
            // Case: Verify Access Token
            try {
                const decodeUser = JWT.verify(accessToken, keyStoreUser.public_key);
                if (decodeUser.user_id !== user_id) {
                    throw new UnauthorizedRequest('Invalid Request decoded user');
                }

                req.keyStore = keyStoreUser;
                req.user = decodeUser;
                return next();
            } catch (error) {
                throw new UnauthorizedRequest('Access Token verification failed');
            }
        }
    });
});

const isAdmin = async (req, res, next) => {
    try {
        const { tokens, user } = req.session || {};
        const refreshToken = tokens?.refreshToken;
        const user_id = user?.user_id;
        // Kiểm tra session hợp lệ
        if (!user_id || !refreshToken) {
            throw new UnauthorizedRequest('Invalid request: Missing user ID or refresh token.');
        }

        // Thực hiện transaction
        await db.runTransaction(async (transaction) => {
            // user, tokens -> user_id ... -> tokens accessToken 2h refreshToken 7 days
            const keyStore = await UserModel.findUserByUserId(user_id, transaction);
            if (!keyStore) {
                throw new NotFoundRequest('Key token not found.');
            }
            try {
                // Giải mã token
                const decodedUser = JWT.verify(refreshToken, keyStore.private_key);
                if(decodedUser.user_id !== user_id) {
                    throw new UnauthorizedRequest('Invalid Request headers');
                }
                const foundUser = await UserModel.findUserByUserId(decodedUser.user_id,transaction);

                // Kiểm tra role
                if (!['employee', 'manager'].includes(foundUser.role)) {
                    throw new UnauthorizedRequest('Access denied: Insufficient permissions.');
                }
                    // Gắn keyStore và thông tin người dùng vào req
                    req.keyStore = keyStore;
                    req.user = decodedUser;

                    // Tiếp tục xử lý middleware tiếp theo
                    return next();



            } catch (jwtError) {
                console.error('JWT Verification Error:', jwtError.message);
                throw new UnauthorizedRequest('Invalid or expired token.');
            }
        });
    } catch (error) {
        // Gọi next để xử lý lỗi
        return next(error);
    }
};
const isUser = async (req, res, next) => {
    try {
        const { tokens, user } = req.session || {};
        const refreshToken = tokens?.refreshToken;
        const user_id = user?.user_id;

        if (!user_id || !refreshToken) {
            throw new UnauthorizedRequest('Invalid request: Missing user ID or refresh token.');
        }

        await db.runTransaction(async (transaction) => {
            const keyStore = await UserModel.findUserByUserId(user_id, transaction);
            if (!keyStore) {
                throw new NotFoundRequest('Key token not found.');
            }

            try {
                const decodedUser = JWT.verify(refreshToken, keyStore.private_key);

                if (decodedUser.user_id !== user_id) {
                    throw new UnauthorizedRequest('Token user ID does not match session user ID.');
                }

                const foundUser = await UserModel.findUserByUserId(decodedUser.user_id, transaction);
                const allowedRoles = ['customer', 'admin', 'manager']; // Thêm các role cần hỗ trợ
                if (!allowedRoles.includes(foundUser.role)) {
                    throw new UnauthorizedRequest('Access denied: Insufficient permissions.');
                }

                req.keyStore = keyStore;
                req.user = decodedUser;

                return next();
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    throw new UnauthorizedRequest('Token expired. Please re-login.');
                }
                throw new UnauthorizedRequest('Invalid or expired token.');
            }
        });
    } catch (error) {
        console.error('Middleware isUser error:', error.message);
        return next(error);
    }
};

// Helper function to verify JWT
const verifyJWT = (token, keySecret) => {
    return JWT.verify(token, keySecret);
};

module.exports = {
    authentication,
    authenticationV2,
    verifyJWT,
    authenticate: isAdmin,
    isUser
};
