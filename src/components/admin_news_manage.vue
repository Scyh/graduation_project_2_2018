<template>
	<div class="admin-food-manage">
<!-- 		<public-canteen-head v-if="index == 0" v-on:transfer="init"></public-canteen-head> -->
		<div class="food-manage-body">
			<table v-if="index == 0" class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>文章标题</th>
						<th>发布时间</th>
						<th>文章分类</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<template v-for="(item, index) in news">
						<tr>
							<td>{{ index + 1 }}</td>
							<td>{{ item.news_title }}</td>
							<td>{{ item.news_publish_time | getDate }}</td>
							<td>{{ item.news_category | switchNews }}</td>
							<td :id="item._id">
								<button class="btn btn-primary" data-toggle="modal" data-target="#newsDetail" @click="showModal">查看</button>&nbsp;&nbsp;
								<button class="btn btn-danger" @click="delOne">删除</button></td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<nav>
					    <ul class="pagination">
					    	<li class="prev" @click="loadNews('prev')"><span>&laquo;</span></li>
					    	<li><span>第{{ page }} / {{ maxPage }}页</span></li>
					    	<li class="next" @click="loadNews('next')"><span>&raquo;</span></li>
					    </ul>
					</nav>
				</tfoot>
			</table>
			<publish-new-news  v-else-if="index == 1" v-on:publish="reInit"></publish-new-news>
			<check-news-modal></check-news-modal>
		</div>
	</div>
</template>
<script>
	import publishNewNews from './admin_publish_new_news.vue'
	import checkNewsModal from './admin_check_news_modal.vue'
	import bus from '../bus.js'

	export default {
		data() {
			return {
				news: [],
				index: 0,
				page: 1,
				maxPage: 1,
			}
		},
		mounted() {
			this.getNewsCount();
			this.getNews(this.page);
			bus.$on('switchIndex', val => {
				this.index = val;
			});
		},
		destroyed() {
			bus.$off('switchIndex');
		},
		methods: {
			getNews(page) {
				let that = this;
				that.news = [];
				$.get('http://localhost:3001/apis/admin/getNews', {
					count: 5,
					page: page
				}).then(data => {
					console.log(data)
					that.news = data;
				})
			},

			getNewsCount() {
				let that = this;
				$.get('http://localhost:3001/apis/admin/getNewsCount')
				.then(data => {
					if (data.status == 'success')
					that.maxPage = Math.ceil(data.count / 5)
				})
			},

			loadNews(type) {
				if (type == 'prev' && this.page > 1) {
					this.page--;
				} else if (type == 'next' && this.page < this.maxPage) {
					this.page++;
				}
				console.log(this.page)
				this.getNews(this.page);
			},

			delOne(ev) {
				let result = confirm('确认删除？')
				if (result) {
					let that = this;
					$.post('http://localhost:3001/apis/admin/delOneNews', {
						id: $(ev.target).parent().prop('id')
					}).then(data => {
						if (data.status == 'success') {
							alert("删除成功");
							that.getNews(that.page)
						}
					})
				}
			},

			// 重新初始化
			reInit() {
				this.index = 0;
				this.getNews(this.page)
			},

			// 传送新闻id
			showModal(ev) {
				bus.$emit('transferNewsId', $(ev.target).parent().prop('id'))
			}
		},
		components: {
			publishNewNews,
			checkNewsModal
		}
	}
</script>

