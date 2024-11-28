const {HEADERS} = require('../../configs/header.config')
const getLayout = (req, res) => {
    try {
        const user = req.session.user
        return res.render('user/index', {user: user})
    }
    catch(err){
        return res.render('user/index', {user: null})
    }


};

module.exports = getLayout;
