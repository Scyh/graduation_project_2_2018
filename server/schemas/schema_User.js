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
	
	// 检查用户名的唯一性
	uniqueUserName: function(params, data) {
		return this.find({
			'username': params.username
		}).count().exec(data);
	},

	// 查找用户是否存在
	checkUser: function(params, data) {
		// console.log()
		return this.find({
			'username': params.username,
			'password': params.password
		}).exec(data);
	},

	// 管理员获取用户信息
	adminFetchSome(index, data) {
		return this.find({}).limit(6).skip((index - 1) * 6).exec(data)
	},
}

module.exports = schema_User