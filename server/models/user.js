var mongoose = require('mongoose'),
	schema_User = require('../schemas/schema_User.js');

var User = mongoose.model('User', schema_User, 'user');

module.exports = User;