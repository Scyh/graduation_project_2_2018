var mongoose = require('mongoose'),
	schema_Food_Comments = require('../schemas/schema_Food_Comments.js');

var schema_Food_Comments = mongoose.model('schema_Food_Comments', schema_Food_Comments, 'food_comments');

module.exports = schema_Food_Comments;