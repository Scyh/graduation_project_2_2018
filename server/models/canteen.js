var mongoose = require('mongoose'),
	schema_Canteen = require('../schemas/schema_Canteen.js');

var Canteen = mongoose.model('Canteen', schema_Canteen, 'canteen');

module.exports = Canteen;