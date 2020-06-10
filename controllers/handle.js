let account = require('../models/Accounts');
const passport = require('passport');
module.exports.getIndex = async(req, res, next) => {
    return res.render('./login');
}
module.exports.checkLogin = passport.authenticate('local-Login', {
    successRedirect: '/login',
    failureRedirect: '/',
    failureFlash: true
});
module.exports.postLogin = async(req, res) => {
    var name = req.body.name;
    var pass = req.body.pass;
    account.findOne({ TaiKhoan: name, MatKhau: pass }, (err, result) => {
        if (result) {
            res.render('./message');
        } else {

            res.render('./login');

        }
    })
}