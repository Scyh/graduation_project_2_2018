import Vue from 'vue'

// 转换食堂id
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

//转换文章分类
Vue.filter('switchNews', val => {
	switch(val) {
		case 'news':
			return '新闻'
			break;
		case 'hotNews':
			return '热门资讯'
			break;
		default: 
			return '新闻'
	}
})

// 转换留言消息状态
Vue.filter('switchMsgStatusType', function(value) {
	switch(value) {
		case 'notRead':
			return "未读";
			break;
		case 'hasRead':
			return "已读";
			break
		default:
			return "未读"
	}
})

// 转换并统一日期格式
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
