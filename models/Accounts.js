var mongoose = require('mongoose');

var accountSchema = new mongoose.Schema({
  TaiKhoan: String,
  MatKhau: String,
  Status: Boolean
});

var Account = mongoose.model('Accounts', accountSchema, 'Account');
module.exports = Account;