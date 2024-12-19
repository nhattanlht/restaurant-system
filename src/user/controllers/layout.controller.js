const {HEADERS} = require('../../configs/header.config')
const CustomerModel = require("../models/customer.model");
const Database = require('../../dbs/init.mssql');
const db = new Database();

const getLayout = async (req, res) => {
    try {
        const user = req.session.user
        let foundCustomer

        await db.runTransaction(async (transaction) => {
            foundCustomer = await CustomerModel.findCustomerByUserId(user.user_id, transaction);
        })
        console.log("foundCustomer", foundCustomer)
        return res.render('user/index', {user: foundCustomer})
    }
    catch(err){
        return res.render('user/index', {user: null})
    }


};

module.exports = getLayout;
