<template>
	<div id="admin">
		<div class="row">
			<div class="menu-header">
				<div>
					<div>
						食堂综合服务评价系统
					</div>
				</div>
			</div>
			<div class="row menu">
				<div class="col-md-2 menu-left">
					<dl>
						<dt @click="fn($event)" title="userManage" id="userManage"><span class="glyphicon glyphicon-user"></span>用户管理</dt>
					</dl>
					<dl>
						<dt @click="fn($event),translateIndex($event)" data-index='0' title="canteenManage" id="canteenManage"><span class="glyphicon glyphicon-list"></span>食堂管理</dt>
						<dd @click="fn($event),translateIndex($event)" data-index='1' title="canteenManage">更新食堂图片</dd>
						<dd @click="fn($event),translateIndex($event)" data-index='2' title="canteenManage">食堂评论管理</dd>
					</dl>
					<dl>
						<dt @click="fn($event),translateIndex($event)" data-index='0' title="foodManage" id="foodManage"><span class="glyphicon glyphicon-list"></span>食堂菜品管理</dt>
						<dd @click="fn($event),translateIndex($event)" data-index='1' title="foodManage">食堂菜品添加</dd>
					</dl>
					<dl>
						<dt @click="fn($event),translateIndex($event)" title="newsManage" data-index='0' id="newsManage"><span class="glyphicon glyphicon-object-align-bottom"></span>文章管理</dt>
						<dd @click="fn($event),translateIndex($event)" title="newsManage" data-index='1'>发布文章</dd>
					</dl>
					<dl>
						<dt @click="fn($event),translateIndex($event)" title="announcementManage" data-index='0' id="announcementManage"><span class="glyphicon glyphicon-bullhorn"></span>公告管理</dt>
						<dd @click="fn($event),translateIndex($event)" title="announcementManage" data-index='1'>发布公告</dd>
					</dl>
					<dl>
						<dt @click="fn($event)" title="message" id="message"><span class="glyphicon glyphicon-tags"></span>留言</dt>
					</dl>
				</div>
				<div class="col-md-10 menu-right">
				<div class="menu-right-top">
					{{ currentPath }}
				</div>
				<div class="menu-right-body">
					<admin-user-manage v-if="currentContent == 'userManage'"></admin-user-manage>
					<admin-canteen-manage v-if="currentContent == 'canteenManage'"></admin-canteen-manage>
					<admin-food-manage v-if="currentContent == 'foodManage'"></admin-food-manage>
					<admin-announcement-manage v-if="currentContent == 'announcementManage'"></admin-announcement-manage>
					<admin-news-manage v-if="currentContent == 'newsManage'"></admin-news-manage>
					<admin-message-manage v-if="currentContent == 'message'"></admin-message-manage>
				</div>
			</div>
			</div>
		</div>
	</div>
</template>
<script>
	import adminUserManage from './admin_user_manage.vue'
	import adminCanteenManage from './admin_canteen_manage.vue'
	import adminFoodManage from './admin_food_manage.vue'
	import adminAnnouncementManage from './admin_announcement_manage.vue'
	import adminNewsManage from './admin_news_manage.vue'
	import adminMessageManage from './admin_message_manage.vue'
	import bus from '../bus.js'

	export default {
		data() {
			return {
				currentPath: '首页',
				currentContent: '',
			}
		},
		beforeCreate() {
			if (sessionStorage.admin !== 'admin') {
				alert("管理员已退出或当前不是管理员登录")
				this.$router.replace('/')
			}
		},
		mounted() {
			$("#admin").parent().removeClass('col-md-9')
		},
		methods: {

			// 添加选中样式
			fn(event) {
				let targetType = event.target.nodeName.toLowerCase();
				if (targetType == 'dt') {
					$(event.target).addClass('activeDT').siblings().slideDown().removeClass('activeDt activeDD1 activeDD2').end().parent().siblings().find('dt').removeClass('activeDT').end().find('dd').removeClass('acticeDD1 activeDD2').slideUp()
					this.currentPath = $(event.target).text()
				} else if (targetType == 'dd') {
					$(event.target).addClass('activeDD' + $(event.target).index()).siblings().removeClass('activeDD1 activeDD2 activeDT').parent().siblings().children().removeClass('activeDT');
					this.currentPath = $(event.target).prevAll('dt').text() + ' / ' + $(event.target).text();
				} else { return false }
					this.currentContent = $(event.target).attr('title');
			},

			translateIndex(ev) {
				bus.$emit('switchIndex', $(ev.target).data('index'))
			}
		},
		components: {
			adminUserManage,
			adminCanteenManage,
			adminFoodManage,
			adminAnnouncementManage,
			adminNewsManage,
			adminMessageManage
		}
	}
</script>
<style scoped>
	.row {
		margin: 0 !important;
	}
	#admin {
		/*width: 100%;*/
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
	}
	.menu {
		height: calc(100% - 88px);
	}
	.menu-header {
		padding: 30px;
		background-color: #438EB9;
		color: #FFF;
		font-size: 18px;
	}
	.menu-left {
		height: 100%;
		padding: 0;
		background-color: #F2F2F2;
		border-right: 1px solid #CCC;
		/*color: #6E8096;*/
	}
	.menu-right {
		height: 100%;
		padding: 0;
		background-color: #F2F2F2;
	}
	dl {
		position: relative;
		margin-bottom: 0;
		box-sizing: border-box;
		padding: 20px 0 20px 60px;
		border-bottom: 1px dashed #CCC;
		background-color: #FFF;
	}
	dl dt{
		font-weight: normal;
		cursor: pointer;
	}
	dt span {
		margin-right: 10px;
	}
	dl dd {
		display: none;
		margin-left: 30px;
		padding: 10px;
		cursor: pointer;
	}
	.menu-right-top {
		padding: 15px 0 15px 15px;
		border-bottom: 1px solid #CCC;
		font-size: 17px;
		color: #999;
	}
	.menu-right-body {
		padding: 15px;
		min-height: 600px;
		background-color: #FFF;
	}
	.activeDT::after,
	.activeDD1::after,
	.activeDD2::after {
		content: '';
		position: absolute;
		top: 16px;
		right: 0;
		display: inline-block;
		
	    border-right: 15px solid #41B886;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
	}
	.activeDD1::after {
		top: 50px;
	}
	.activeDD2::after {
		top: 90px;
	}
</style>