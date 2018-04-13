var mongoose = require('mongoose');

// 建模
var schema_User = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	// trueName: {
	// 	type: String,
	// 	default: ''
	// },
	userProfile: {
		type: String,
		default: ''
	}
})

schema_User.statics = {
	uniqueUserName: function(params, data) {
		return this.find({
			'username': params.username
		}).count().exec(data);
	},

	checkUser: function(params, data) {
		// console.log()
		return this.find({
			'username': params.username,
			'password': params.password
		}, {'permission': 1}).exec(data);
	},
}

module.exports = schema_User