var mongoose = require('mongoose'),
	schema_Announcement = require('../schemas/schema_Announcement.js');

var Announcement = mongoose.model('Announcement',schema_Announcement,'announcement');

module.exports = Announcement;