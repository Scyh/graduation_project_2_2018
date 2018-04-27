var mongoose = require('mongoose'),
	schemaMessage = require('../schemas/schema_Message.js');

var Message = mongoose.model('Message', schemaMessage, 'message')

module.exports = Message;