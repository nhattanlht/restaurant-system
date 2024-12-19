'use strict'

const { CreatedResponse, OkResponse } = require("../../response/success.response");
const accessService = require("../services/access.service");
const getLayout = require('./layout.controller');
const { HEADERS } = require('../../configs/header.config'); // Đảm bảo bạn đã import header từ file tương ứng

class AccessController {

  // TODO: API login
// Controller xử lý đăng nhập

    async login  (req, res, next){
        try {
            const metadata = await accessService.login(req.body);
            console.log(metadata);
            if(metadata && metadata.user && metadata.tokens){
                req.session.user = metadata.user; // Store user in session
                req.session.tokens = metadata.tokens;
                if(metadata.user.role == 'employee' || metadata.user.role == 'manager'){
                    return res.redirect('/admin');
                }
                else return res.redirect('/');
            }
            res.render('user/login', { error: 'Invalid login credentials. Please try again.' });

        } catch (error) {
            res.render('user/login', { error: error.message });
        }
};





    // TODO: API signup
    // TODO: API signup
    async signUp(req, res, next) {
        try {
            const metadata = await accessService.signUp(req.body);

            if (metadata && metadata.user && metadata.tokens) {
                req.session.error = 'Sign up successfully! Please log in.';
                return res.redirect('/login');
            }

            res.render('user/register', { error: 'Registration failed. Please try again.' });
        } catch (error) {
            res.render('user/register', { error: error.message });
        }
    }


    // TODO: API logout
  async logout(req, res, next) {
    // new OkResponse({
    //   message: 'Logout successfully',
    //   metadata: await accessService.logout(req.keyStore) // keyStore is from middleware authentication
    // }).send(res)
      req.session.destroy((err) => {
          if (err) {
              return res.status(500).send("Error logging out");
          }
          res.redirect('/login'); // Redirect to login after logout
      });
  }

  // TODO: API refresh token
  async refreshToken(req, res, next) {
    // new OkResponse({
    //   message: 'Refresh token successfully',
    //   metadata: await accessService.refreshToken(req.body)
    // }).send(res)

    // TODO: v2 optimize
    new OkResponse({
      message: 'Refresh token successfully',
      metadata: await accessService.refreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      }) // middleware authenticationV2
    }).send(res)
  }

}

const getSignUp = (req, res) => {
  return res.render('user/register', {error: null})
}

const getLogin = (req, res) =>{
    if(req.session.user){
        return res.redirect('/logout');
    }
    const error = req.session.error;

  return res.render('user/login', {error: error})
}


module.exports = { AccessController, getLogin, getSignUp };
