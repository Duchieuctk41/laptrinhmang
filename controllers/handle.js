let account = require('../models/Accounts');
const passport = require('passport');
var arrayUsers = ['Chat All'];

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
    return res.render('./message', {
      user: req.user.TaiKhoan
    });
  }
}
module.exports.isLogined_next = async function (req, res, next) {
  if (req.isAuthenticated('local-Login')) return next();
  return res.redirect('/');
}
///Chat Nhóm
// module.exports.Ajax_InsertUserRoom = function (req, res) {
//   var user = req.user.TaiKhoan;
//   res.send(user);

// }