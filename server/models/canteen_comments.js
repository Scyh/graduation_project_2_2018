var mongoose = require('mongoose'),
	schema_Canteen_Comments = require('../schemas/schema_Canteen_Comments.js');

var Canteen_Comments = mongoose.model('Canteen_Comments', schema_Canteen_Comments, 'canteen_comments');

module.exports = Canteen_Comments;