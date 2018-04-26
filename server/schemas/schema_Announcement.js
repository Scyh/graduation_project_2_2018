var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema_Announcement = new Schema({
	announcement_title: {
		type: String,
		require: true
	},
	announcement_content: {
		type: String,
		require: true
	},
	announcement_date: {
		type: Number,
		default: new Date().valueOf()
	},
	announcement_author: {
		type: String,
		default: 'admin'
	}
})

schema_Announcement.statics = {
	getAnnouncements(params, data) {
		return this.find({})
			.sort({'announcement_date': -1})
			.limit(params.count * 1)
			.skip((params.page - 1) * params.count)
			.exec(data)
	},

	delOne: function(id, data) {
		return this.remove({"_id": id}).exec(data)
	},
}


module.exports = schema_Announcement