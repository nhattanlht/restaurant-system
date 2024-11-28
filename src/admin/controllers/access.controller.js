// access.controller.js
const accessService = require('../services/access.service');
const {CreatedResponse} = require("../../response/success.response"); // Access service for user registration

class AccessController {

        async signUp (req, res, next) {
        try {
            const metadata = await accessService.signUp(req.body);
            new CreatedResponse({
                message: 'Registered successfully',
                metadata
            }).send(res);
        } catch (error) {
            res.render('admin/register', { error: error.message });
        }
    };

    async logout(req, res, next) {

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send("Error logging out");
            }
            res.redirect('/admin/login'); // Redirect to login after logout
        });
    }

    async login  (req, res, next){
        try {
            const metadata = await accessService.login(req.body);
            req.session.user = metadata.user; // Store user in session
            req.session.tokens = metadata.tokens;
            return res.redirect('/');
        } catch (error) {
            res.render('admin/login', { error: error.message });
        }
    };

}


module.exports = {AccessController};



