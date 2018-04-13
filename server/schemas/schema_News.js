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
	},

	// 浏览量
	news_pv: {
		type: Number,
		default: 0,
	},

	// 文章分类: news(新闻) 、 hotNews(热门资讯)
	news_category: {
		type: String,
		default: 'hotNews'
	}
})

schema_News.statics = {

	// 查找最新时间的新闻
	findByTime(data) {
		return this.find({"news_category": 'news'}, {
			'news_title': 1,
			'news_publish_time': 1
		}).sort({
			"news_publish_time": -1
		}).limit(6).exec(data)
	}
}

module.exports = schema_News