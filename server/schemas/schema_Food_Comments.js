var mongoose = require('mongoose');

// 建模
var schema_Food_Comments = new mongoose.Schema({
	f_comment_author: {
		type: String,
		require: true
	},
	f_commment_time: {
		type: Number,
		require: true
	},
	f_comment_text: {
		type: String,
		require: true,
	},
	f_comment_belongsTo: {
		type: String,
	},
	f_score: {
		type: Number,
		default: 0,
	},
	f_upload_imgArr: {
		type: String
	}
})

schema_Food_Comments.statics = {
	fetchSomeFoodComments(params, data) {
		return this.find({'f_comment_belongsTo': params.food_id}).limit(4).skip((params.page - 1) * 4).exec(data)
	},

	// 获取评论数
	fetchCommentsCount(food_id, data) {
		return this.find({'f_comment_belongsTo': food_id}).count().exec(data);
	},

	// 获取food的所有评分
	fetchAllScore(food_id, data) {
		return this.find({'f_comment_belongsTo': food_id}, {'f_score': 1}).exec(data)
	},
}

module.exports = schema_Food_Comments