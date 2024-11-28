const getProfile = (req, res) => {
    const user = req.session.user;
    res.render('user/profile', { user });
}

module.exports = getProfile;