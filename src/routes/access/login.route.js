const express = require('express');
const router = express.Router();
const LoginController = require('../../controllers/login.controller');

router.get('/', LoginController.getLogin)
router.post('/', LoginController.login)

// Route đăng xuất
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/profile'); // Nếu có lỗi, chuyển hướng về trang hồ sơ
        }
        res.redirect('/login'); // Sau khi đăng xuất, chuyển hướng về trang đăng nhập
    });
});


module.exports = router