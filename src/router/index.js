import Vue from 'vue'
import Router from 'vue-router'
import app from '../App.vue'
import nav from '../components/nav.vue'
import canteen from '../components/canteen.vue'
import news from '../components/food-news.vue'
import foodDetail from '../components/food-detail.vue'
import canteen_comments from '../components/canteen_comments.vue'
import ranking from '../components/ranking.vue'
import messageBoard from '../components/messageBoard.vue'
import newsDetail from '../components/food-news-detail.vue'
import admin from '../components/admin.vue'
import store from '../store/index'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      component: news
    },
    {
    	path: '/canteen/:id',
    	name: 'canteen',
    	component: canteen
    },
    {
    	path: '/news',
    	component: news
    },
    {
      path: '/news/:id',
      name: 'newsDetail',
      component: newsDetail
    },
    {
      path: '/canteen/:location/:id',
      component: foodDetail
    },
    {
      path: '/:canteen_id/comments',
      component: canteen_comments
    },
    {
      path: '/compare',
      component: ranking
    },
    {
      path: '/messageBoard',
      component: messageBoard
    },
    {
      path: '/admin',
      component: admin
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path.slice(1) == 'admin' && sessionStorage.admin == 'admin') {
    console.log("进入管理员界面");
    store.dispatch('adminLogIn')
  }
  next();
});

export default router;