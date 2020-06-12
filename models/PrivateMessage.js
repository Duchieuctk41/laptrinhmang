var mongoose = require('mongoose');

var privateMessageSchema = new mongoose.Schema({
  TenNhom: String,
  namePerson: Array,
  dialogue: Array
});

var PrivateMessage = mongoose.model('PrivateMessages', privateMessageSchema, 'PrivateMessage');
module.exports = PrivateMessage;