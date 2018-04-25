<template>
	<div class="admin-canteen-comments-manage">
		<public-canteen-head v-on:transfer="init"></public-canteen-head>
		<div class="canteen-comments-manage-body">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>评论作者</th>
						<th>评论内容</th>
						<th>服务打分</th>
						<th>环境打分</th>
						<th>评价时间</th>
						<th>所属食堂</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<template v-for="(item, index) in canteen_comments">
						<tr>
							<td>{{ index + 1 }}</td>
							<td>{{ item.comment_author }}</td>
							<td>{{ item.comment_text }}</td>
							<td>{{ item.comment_service_score }}</td>
							<td>{{ item.comment_environmental_score }}</td>
							<td>{{ item.comment_time | getDate }}</td>
							<td>{{ item.comment_belongsTo | switchCanteen }}</td>
							<td :id="item._id"><button class="btn btn-danger" @click="delComment">删除</button></td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<nav>
					    <ul class="pagination">
					    	<li class="prev" @click="loadComment('prev')"><span>&laquo;</span></li>
					    	<li><span>第{{ page }}页</span></li>
					    	<li class="next" @click="loadComment('next')"><span>&raquo;</span></li>
					    </ul>
					</nav>
				</tfoot>
			</table>
		</div>
	</div>
</template>
<script>
	import publicCanteenHead from './admin_public_canteen_head.vue'
	export default {
		data() {
			return {
				canteen_comments: [],
				page: 1,
				hasMore: true,
			}
		},
		mounted() {
			this.init('1001', this.page)
		},
		methods: {

			// 获取食堂评论
			getCanteenComments() {
				let that = this;
				that.canteen_comments = [];
				$.get('http://localhost:3001/apis/getSomeCanteenComments',{
					belongsTo: $(".selected").data('canteenid'),
					commentsCount: 8,
					page: that.page,
				}).then(data => {
					data.length > 0 ? that.hasMore = true : that.hasMore = false;
					console.log(that.hasMore)
					if (that.hasMore) {
						that.canteen_comments = data;	
					}
				})
			},
			init(val) {
				this.page = 1;
				this.getCanteenComments();	
			},

			// 加载更多食堂评论
			loadComment(type) {
				if (type == 'prev' && this.page >1) {
					this.page--;
				} else if (type == 'next' && this.hasMore) {
					this.page++;
				};

				this.getCanteenComments();
			},

			// 删除评论
			delComment(ev) {
				console.log()
				$.post('http://localhost:3001/apis/admin/delCanteenComment', {
					comment_id: $(ev.target).parent().prop('id')
				}).then(data => {
					console.log(data)
					alert('删除成功');
					this.getCanteenComments();
				}).catch(err => {
					alert('删除失败')
				})
			},
		},
		components: {
			publicCanteenHead
		}
	}
</script>
<style scoped>
	.canteen-comments-manage-head li {
		padding: 15px;
		font-size: 18px;
	}
	.canteen-comments-manage-head li:not(:first-child) {
		color: #3879D9;
		cursor: pointer;
	}
	.selected {
		color: rgba(240, 0, 0, 0.5) !important;
	}
	.pagination li {
		cursor: pointer;
	}
</style>