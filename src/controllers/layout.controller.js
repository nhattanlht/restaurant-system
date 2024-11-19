const getLayout = (req, res) =>{
    const user = req.session.user;
    console.log(user);
    res.render('index', { user });
}


module.exports = getLayout
