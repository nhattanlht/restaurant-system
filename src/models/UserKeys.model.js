// 'use strict'
//
// const sql = require('mssql')
// const TABLE_NAME = 'UserKeys'
//
// class UserKeysModel{
//     constructor(pool){
//         this.pool = pool
//     }
//
//     static async insertUserKeys(UserKeysData, transaction) {
//         try{
//             await transaction.request()
//                 .input('user_id', sql.Int, userId)
//                 .input('public_key', sql.VarChar, publicKeyString)
//                 .query(`
//                     INSERT INTO [UserKeys] (user_id, public_key)
//                     VALUES (@user_id, @public_key);
//                 `);
//         } catch(error){
//             console.log('Error inserting user keys', error);
//         }
//     }
// }
//
// module.exports = UserKeysModel
//
