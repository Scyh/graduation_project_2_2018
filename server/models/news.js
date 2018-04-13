var mongoose = require('mongoose'),
	schema_News = require('../schemas/schema_News.js');

var News = mongoose.model('News', schema_News, 'news');

module.exports = News;