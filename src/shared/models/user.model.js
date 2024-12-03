'use strict'

const sql = require('mssql');
const TABLE_NAME = 'user'
const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = require('../../response/error.response');

class UserModel{
    // tạo account mới
    static async insertUser(userData, transaction){
        try{
            // tạo biến cho insert
            const request = transaction.request();
            // @user_name NVarChar(250) -> userData.user_name
            request.input('user_name', sql.NVarChar(250), userData.user_name)
            request.input('password', sql.NVarChar(255), userData.password)
            request.input('role', sql.NVarChar(50), userData.role)
            request.input('status', sql.Int, userData.status)
            request.input('public_key', sql.VarChar(sql.MAX), userData.public_key)
            request.input('private_key', sql.VarChar(sql.MAX), userData.private_key)

            // store procedure
            const result = await request.execute('SP_InsertNewUser')


            return result.recordset[0].user_id;
        } catch (error){
            throw new BadRequest('Insert new user failed')
        }
    }




    static async updateKeyToken(user_id, private_key, public_key, refreshToken, transaction) {
        const request = transaction.request()
        request.input('user_id', sql.Int, user_id)
        request.input('private_key', sql.NVarChar, private_key)
        request.input('public_key', sql.NVarChar,public_key)
        request.input('refresh_token', sql.NVarChar,refreshToken)


        await request.execute('SP_UpdateKeyTokenUser');
    }

    static async updateRefreshToken(user_id, newRefreshToken, oldRefreshToken, transaction) {
        const request = transaction.request();

        // Truyền các tham số vào stored procedure
        request.input('user_id', sql.Int, user_id);
        request.input('newRefreshToken', sql.NVarChar, newRefreshToken);
        request.input('refreshToken', sql.NVarChar, oldRefreshToken);

        // Thực thi stored procedure và lấy kết quả
        const result = await request.execute('SP_UpdateRefreshToken');

        // Kiểm tra kết quả từ stored procedure
        if (result.returnValue === 0) {
            return true; // Thành công
        }

        return false; // Không thành công
    }

    static async findUserByUserId(user_id, transaction) {
        const request = transaction.request();
        request.input('user_id', sql.Int, user_id);

        const result = await request.execute('SP_FindUserByUserId')
        return result.recordset[0];
    }
    static async findUserByUserName(user_name, transaction) {
            const request = transaction.request();
            request.input('user_name', sql.NVarChar, user_name);

            const result = await request.execute('SP_FindUserByUsername', [user_name])
            return result.recordset[0];
    }
    static async getPublicKey(user_name, transaction) {
        try{
            const request = transaction.request()
                request.input('user_name', sql.NVarChar(250), user_name)

            const query = `SELECT public_key FROM ${TABLE_NAME} WHERE user_name = @user_name`;
            const result = await request.query(query);
            return result.recordset[0];

        } catch (error) {
            console.error('Error retrieving public key:', error);
        }
    }
    static async deleteUser(user_name, transaction) {

        const holderUser = await UserModel.findUserByUserName(user_name);

        if(holderUser){
            const request = transaction.request()
            request.input('user_name', user_name)
            const result = await request.execute('SP_DeleteUser');
            if(result === 0) return true;
            return false
        }
        return false;
    }
    static async deleteKeyUserById(user_id, transaction){
        const request = transaction.request();
        request.input('user_id', user_id)
        const result = await request.execute('SP_DeleteKeyUserById')
        if (result.returnValue === 0) {
            return true; // Thành công
        }
        return false
    }
    static async findUserByRefreshTokenUsed(refreshToken, transaction) {
        const request = transaction.request();
        request.input('refreshToken', refreshToken)

        const result = await request.execute('SP_FindUserByRefreshTokenUsed')
        return result.recordset[0];
    }
    static async findUserByRefreshToken(refreshToken, transaction) {
        const request = transaction.request();
        request.input('refreshToken', refreshToken)

        const result = await request.execute('SP_FindUserByRefreshToken')
        return result.recordset[0];
    }
}

module.exports = UserModel