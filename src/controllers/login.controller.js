const LoginService = require('../services/login.service');
class LoginController{
    static getLogin = (req, res) => {
        res.render('login')
    }
    static login = async(req, res, next) =>{
        try{
            const {username, password} = req.body
            try {
                const result = await LoginService.login({ username, password });
                res.json(result);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }catch(err){
            return res.status(400).json({error: err});
        }
    }
}
module.exports = LoginController