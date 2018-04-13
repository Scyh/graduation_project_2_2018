var mongoose = require('mongoose');

// 建模
var schema_Canteen_Comments = new mongoose.Schema({
	comment_author: {
		type: String,
		require: true
	},
	commment_time: {
		type: Number,
		require: true
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
}

module.exports = schema_Canteen_Comments