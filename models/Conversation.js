var mongoose = require('mongoose');

var conversationSchema = new mongoose.Schema({
  TenNhom: String,
  namePerson: Array,
  dialogue: Array
});

var Conversation = mongoose.model('Conversations', conversationSchema, 'Conversation');
module.exports = Conversation;