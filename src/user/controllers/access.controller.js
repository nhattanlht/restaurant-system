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
            req.session.user = metadata.user; // Store user in session
            req.session.tokens = metadata.tokens;
            // new OkResponse({
            //     message: 'Login successfully',
            //     metadata
            // }).send(res);
            return res.redirect('/');
        } catch (error) {
            res.render('user/login', { error: error.message });
        }
        // const metadata = await accessService.login(req.body);
        // // Send JSON response
        // new OkResponse({
        //     message: 'Login successfully',
        //     metadata
        // }).send(res);
};





    // TODO: API signup
  async signUp(req, res, next) {
    // new CreatedResponse({
    //   message: 'Registered successfully',
    //   metadata: await accessService.signUp(req.body)
    // }).send(res)
      try {
          const metadata = await accessService.signUp(req.body);
          new CreatedResponse({
              message: 'Registered successfully',
              metadata
          }).send(res);
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
  return res.render('user/login', {error: null})
}


module.exports = { AccessController, getLogin, getSignUp };
