const sql = require('mssql')
const instanceMSSQL = require('../db/init.mssql')


class RegisterService{
    static register = async(req,res, next) => {
        const {name, email, password, confirmPassword} = req.body


    }
}