var mongoose = require('mongoose');

var roomSchema = new mongoose.Schema({
  TenNhom: String,
  Name: Array
});

var Room = mongoose.model('Rooms', roomSchema, 'Room');
module.exports = Room;