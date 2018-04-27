var mongoose = require('mongoose');

// 建模
var schema_News = new mongoose.Schema({
	news_title: String,
	news_text: String,
	news_author: {
		type: String,
		default: 'admin'
	},

	// 出版时间
	news_publish_time: {
		type: Number,
		default: new Date().valueOf()
	},

	// 浏览量
	news_pv: {
		type: Number,
		default: 0,
	},

	// 文章分类: news(新闻) 、 hotNews(热门资讯)
	news_category: {
		type: String,
		default: 'news'
	}
})

schema_News.statics = {

	// 查找最新时间的新闻
	findByTime(category, data) {
		return this.find({"news_category": category}, {
			'news_title': 1,
			'news_publish_time': 1
		}).sort({
			"news_publish_time": -1
		}).limit(6).exec(data)
	},

	// 根据页数查找news
	findByPage(page, data) {
		console.log(page)
		return this.find({}).limit(5).skip((page - 1) * 5).exec(data)
	},

	// 查找文章数量
	findCount(data) {
		return this.find({}).count().exec(data)
	},

	// 删除文章
	delOne(id, data) {
		return this.remove({'_id': id}).exec(data);
	},

	// 更新pv
	updatePv(id, data) {
		return this.update({
			"_id": id
		}, {
			$inc: {
				"news_pv": 1
			}
		}).exec(data)
	}
}

module.exports = schema_News