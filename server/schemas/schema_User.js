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

	// 获取用户头像
	getProfile(username, data) {
		return this.find({'username': username}, {
			'userProfile': 1,
		}).exec(data)
	},

	// 更新用户头像
	updateProfile(params, data) {
		return this.update({'username': params.username}, {
			$set: {
				'userProfile': params.userProfile
			}
		}).exec(data)
	},

	// 管理员获取用户信息
	adminFetchSome(index, data) {
		return this.find({}).limit(6).skip((index - 1) * 6).exec(data)
	},

	// 删除用户
	deleteUser(id, data) {
		return this.remove({"_id": id}).exec(data)
	},
}

module.exports = schema_User