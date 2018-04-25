var mongoose = require('mongoose');

// 建模
var schema_Canteen_Comments = new mongoose.Schema({
	comment_author: {
		type: String,
		require: true
	},
	comment_time: {
		type: Number,
		require: true,
		default: new Date().valueOf()
	},
	comment_text: {
		type: String,
		require: true,
	},
	comment_belongsTo: {
		type: Number,
		default: 1000
	},
	comment_service_score: {
		type: Number,
		default: 0
	},
	comment_environmental_score: {
		type: Number,
		default: 0
	},
})

schema_Canteen_Comments.statics = {

	// 通过所属食堂id查找
	findByCanteen_id(params, data) {
		return this.find({'comment_belongsTo': params.belongsTo})
					.sort({'comment_time': -1})
					.limit(params.commentsCount * 1)
					.skip((params.page - 1 ) * params.commentsCount)
					.exec(data)
	},

	// 查找所以评论的 服务和卫生评分
	fetchAllScore(comment_belongsTo, data) {
		return this.find({'comment_belongsTo': comment_belongsTo}, {
			'comment_service_score': 1,
			'comment_environmental_score': 1
		}).exec(data);
	},

	fetchAllCount(comment_belongsTo, data) {
		return this.find({'comment_belongsTo': comment_belongsTo}).count().exec(data)
	},

	delOne(comment_id, data) {
		return this.remove({"_id": comment_id}).exec(data)
	}
}

module.exports = schema_Canteen_Comments