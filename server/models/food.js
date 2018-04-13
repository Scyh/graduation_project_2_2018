var mongoose = require('mongoose'),
	schema_Food = require('../schemas/schema_Food.js');

var Food = mongoose.model('Food', schema_Food, 'food');

module.exports = Food;