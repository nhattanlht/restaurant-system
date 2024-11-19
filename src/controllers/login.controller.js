const LoginService = require('../services/login.service');
class LoginController {
    static getLogin = (req, res) => {
        res.render('login');
    }

    static login = async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const result = await LoginService.login({ username, password });

            if (result.status === 'success') {
                // Nếu login thành công, lưu token vào session (hoặc cookie)
                req.session.user = {
                    username: username,
                    token: result.metadata.tokens.accessToken // Ví dụ: Lưu access token vào session
                };

                // Chuyển hướng người dùng đến trang hồ sơ
                return res.redirect('/'); // Địa chỉ trang hồ sơ của người dùng
            } else {
                // Nếu đăng nhập thất bại, trả thông báo lỗi và vẫn ở lại trang đăng nhập
                return res.render('login', { message: result.message });
            }
        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
}

module.exports = LoginController;
