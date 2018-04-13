var mongoose = require('mongoose');

// 建模
var schema_Canteen = new mongoose.Schema({
	name: {
		type: String,
		unique: true,
		require: true
	},
	location: {
		type: String,
		require: true
	},
	canteen_id: {
		type: Number,
		require: true,
		default: 1000,
		unique: true
	},
	overall_score: {
		type: Number,
		default: 0
	},
	service_score: {
		type: Number,
		default: 0
	},
	environmental_score: {
		type: Number,
		default: 0
	},
})

schema_Canteen.statics = {
	
	findByCanteen_id(canteen_id, data) {
		return this.find({'canteen_id': canteen_id}).exec(data)
	},

	// 添加评论后 修改最新的评分
	updateScore(params, data) {
		return this.update({'canteen_id': params.canteen_id}, {
			$set: {
				'service_score': params.service_score,
				'environmental_score': params.environmental_score,
				'overall_score': params.overall_score
			}
		}).exec(data);
	}
}

module.exports = schema_Canteen