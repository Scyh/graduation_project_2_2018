import Vue from 'vue'

Vue.filter('switchCanteen', function(val) {
	switch(val) {
		case 1001:
			return '仁苑'
			break;
		case 1002:
			return '爱苑'
			break;
		case 1003:
			return '义苑'
			break;
		case 1004:
			return '平苑'
			break;
		default:
			return '安理工新校区'
	}
});

Vue.filter('getDate', function(value) {
	if (!value) {
		return
	} else {
		let newDate = new Date((value * 1));
		let year = newDate.getFullYear();
		let month = newDate.getMonth() + 1;
		(month + '').length == 1 ? month = '0' + month : month;
		let day = newDate.getDate();
		(day + '').length == 1 ? day = '0' + day : day;
		let hour = newDate.getHours();
		(hour + '').length == 1 ? hour = '0' + hour : hour;
		let minute = newDate.getMinutes();
		(minute + '').length == 1 ? minute = '0' + minute : minute;


		return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
	}
});

export default Vue.filter
