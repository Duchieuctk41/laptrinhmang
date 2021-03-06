var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var Account = require('../models/Accounts');

module.exports = function(passports) {
    //hàm được gọi khi xác thực thành công để lưu thông tin user vào session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    //hàm được gọi bởi passport.session .Giúp ta lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.user
    passport.deserializeUser(function(id, done) {
        Account.findOne({ _id: id }, function(err, acc) {
            if (acc == null) { return done(null, false, req.flash('error', 'Tài khoản không tồn tại.')); }
            if (err) return done(null, false, req.flash('error', 'Vui lòng kiêm tra lại thông tin tài khoản.'));
            if (acc) return done(null, acc);
        });
    });

    passport.use('local-Login', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            Account.findOne({ TaiKhoan: username, MatKhau: password }, function(err, user) {

                if (err) return done(null, false, req.flash('error', 'Vui lòng kiêm tra lại thông tin tài khoản.'));
                if (user == null) return done(null, false, req.flash('error', 'Tài khoản không tồn tại.'));

                return done(null, user);
            })
        }


    ))

}