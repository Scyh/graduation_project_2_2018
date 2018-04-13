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

Vue.use(Router)

export default new Router({
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
    }
  ]
})
