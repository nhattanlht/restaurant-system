const Database = require('../../dbs/init.mssql');
const db = new Database();
const CustomerModel = require('../../User/models/customer.model');
const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = require('../../response/error.response');
const bcrypt = require("bcrypt");

class ProfileController {
    async updateProfile(req, res, next) {
        let { name, phone, gender } = req.body;
        const user_id = req.session.user.user_id;
        if (gender === 'Female') {
            gender = 'F';
        } else {
            gender = 'M';
        }
        console.log(name, phone, gender, user_id);
        let customerData = {
            name: name,
            phone_number: phone,
            gender: gender,
            user_id: user_id,
        };
        try {
            await db.runTransaction(async (transaction) => {
                const result = await CustomerModel.updateProfileCustomer(customerData, transaction);
                if (!result) {
                  return next(new BadRequest('Update profile failed'));
                }
            });
            res.redirect('/profile')
        } catch (error) {
            return next(new BadRequest('Update profile failed'));
        }

    }

    async getProfile(req, res, next) {
        const user_id = req.session.user.user_id;
        let foundCustomer
        await db.runTransaction(async (transaction) => {
            foundCustomer = await CustomerModel.findCustomerByUserId(user_id, transaction);
        }        )

        if (foundCustomer.gender === 'F') {
            foundCustomer.gender = 'Female';
        } else {
            foundCustomer.gender = 'Male';
        }
        res.render('user/profile', { user: foundCustomer });
    }
}

module.exports = ProfileController;
