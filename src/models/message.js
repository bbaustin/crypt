// Message Model
var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
  username: String,
  recipient: String,
  messageContent: String
  });

module.exports = mongoose.model('Message', MessageSchema);
