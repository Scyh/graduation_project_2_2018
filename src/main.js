// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index.js'

import './assets/css/bootstrap.min.css'
import './assets/css/normalize.css'
import './assets/js/bootstrap.min'


Vue.prototype.$http = axios

Vue.config.productionTip = false

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})