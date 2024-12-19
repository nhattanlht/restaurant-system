const Database = require('../../dbs/init.mssql');
const db = new Database();
const CustomerModel = require('../../User/models/customer.model');
const { NotFoundRequest, BadRequest, UnauthorizedRequest, ForbiddenRequest } = require('../../response/error.response');
const bcrypt = require("bcrypt");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/user/images/uploads/avatars/');
        },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed!"));
    }
});
class ProfileController {
    uploadAvatar = upload.single('avatar');
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
        if (req.file) {
            console.log(`Uploaded avatar path: /public/user/images/uploads/avatars/${req.file.filename}`);

            customerData.avatar = `/public/user/images/uploads/avatars/${req.file.filename}`;

        }
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
        })
        console.log("foundCustomer", foundCustomer)
        if (foundCustomer.gender === 'F') {
            foundCustomer.gender = 'Female';
        } else {
            foundCustomer.gender = 'Male';
        }
        res.render('user/profile', { user: foundCustomer });
    }
}

module.exports = ProfileController;
