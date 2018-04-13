var mongoose = require('mongoose');
	
module.exports = function() {
	var DB_CONN_STR = 'mongodb://localhost:27017/canteen';
	mongoose.connect('mongodb://localhost/canteen');

	var db = mongoose.connection;
	db.on('open', function(){
	    console.log('MongoDB Connection Successed');
	});
	// 连接失败
	db.on('error', function(){
	    console.log('MongoDB Connection Error');
	});

	return db;
}