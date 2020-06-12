let account = require('../models/Accounts');
const passport = require('passport');
var arrayUsers = ['Chat All'];
var index = require('../index');
const session = require('express-session');
const { find, findByIdAndUpdate } = require('../models/Accounts');

module.exports.getIndex = async (req, res, next) => {
  if (req.isAuthenticated('local-Login')) {
    return res.redirect('/message');
  } else {
    return res.render('./login');
  }
}
module.exports.postLogin = passport.authenticate('local-Login', {
  successRedirect: '/message',
  failureRedirect: '/',
  failureFlash: true
});

module.exports.getLogin = function (req, res) {
  if (req.isAuthenticated('local-Login')) {
    
    account.updateOne({ TaiKhoan: req.user.TaiKhoan }, { $set: { Status: true } });
    return res.render('./message', {
      user: req.user.TaiKhoan
    });
  }
}

module.exports.isLogined_next = async function (req, res, next) {
  if (req.isAuthenticated('local-Login')) return next();
  return res.redirect('/');
}
module.exports.Logout = async function (req, res) {
  account.findOneAndUpdate({ TaiKhoan: req.user.TaiKhoan }, { Status:false });
  req.session.destroy();
  res.redirect('/');
}

