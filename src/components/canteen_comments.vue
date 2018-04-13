<template>
	<div class="container">
		<div class="row canteen-comments-wrap">
			<div class="col-sm-12 col-md-9 col-lg-9">
				<div class="canteen_comments">
					<div class="canteen_comments_head">
						<h3>当前正在浏览: {{ Canteen | switchCanteen }}食堂的评论区</h3>
					</div>
					<div class="canteen_comments_body">
						<template v-for="canteen_comment in canteen_comments">
							<div class="row comment-item">
								<div class="col-lg-2">
									<div class="user-profile">
										<h4 class="user-name">用户：{{ canteen_comment.comment_author }}</h4>	
									</div>
								</div>
								<div class="col-lg-10 comment-content">
									<span class="pull-right comment-time">{{ canteen_comment.comment_time }}</span>
									<span>服务打分：</span><star-count :width="canteen_comment.comment_service_score / 5 * 85.56"></star-count>
									<br>
									<span>卫生打分：</span><star-count :width="canteen_comment.comment_environmental_score / 5 * 85.56"></star-count>
									<p class="comment-text">{{ canteen_comment.comment_text }}</p>
								</div>
							</div>
						</template>

						<!-- <div class="row comment-item">
							<div class="col-lg-1">
								<div class="user-profile">
									<img src="../assets/images/user.jpg">
								</div>
							</div>
							<div class="col-lg-11 comment-content">
								<h4 class="user-name">用户名</h4>
								<p class="comment-time">2018年2月26日</p>
								<div class="star-count">
									<ul class="bg-star">
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
									</ul>
									<ul class="real-star">
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
										<li><i class="glyphicon glyphicon-star"></i></li>
									</ul>
								</div>
								<p class="comment-text">
									猪蹄好好吃(⊙o⊙)哦！猪蹄好好吃(⊙o⊙)哦
								</p>
								<p class="imgs">
									<ul>
										<li @click="view"><img src="../assets/images/comment_1.jpg"></li>
										<li @click="view"><img src="../assets/images/comment_2.jpg"></li>
										<li @click="view"><img src="../assets/images/comment_3.jpg"></li>
									</ul>
								</p>
								<div class="imgs-view">
										<img class="img-responsive" src="">
								</div>
							</div>
						</div> -->
					</div>
					<div class="canteen_comment_footer">
						<div class="row">
							<div class="col-lg-3 col-lg-offset-4">
								<div class="more">
									<span v-if="hasMore" class="hasMore" @click="moreCanteenComments">点击加载更多</span>
									<span v-else>不能加载更多啦！！</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-sm-12 col-md-3 col-lg-3">
				<new-canteen-comment :belongsTo="Canteen"></new-canteen-comment>
			</div>
		</div>
	</div>
</template>
<script>
	import starCount from './star_count.vue'
	import newCanteenComment from './addNewCanteenComment.vue'

	export default {
		data() {
			return {
				canteen_comments: [],
				page: 1,
				hasMore: true,
			}
		},
		computed: {
			Canteen() {
				return this.$route.params.canteen_id * 1;
			},
		},
		watch: {
			$route() {
				this.Canteen = this.$route.params.canteen_id * 1;
			}
		},
		mounted() {
			console.log(this.Canteen)
			this.initCanteenComments2(this.Canteen, this.page);
		},
		methods: {
			
			initCanteenComments2(canteen_id, page) {
				let that = this;
				$.get('http://localhost:3001/apis/getSomeCanteenComments', {
					belongsTo: that.Canteen,
					commentsCount: 5,
					page: page
				}).then(data => {
					data.length > 0 ? that.hasMore = true : that.hasMore = false;
					for(let i in data) {
						that.canteen_comments.push(data[i]);
					}
				}).catch(err => {
					console.log(err)
				})
			},

			// view(ev) {
			// 	let $target = $(ev.target);
			// 	$(".imgs-view").hide();
			// 	$target.parents('.imgs').next('.imgs-view').find('img').prop('src', $target.prop('src')).end().show();
			// },

			moreCanteenComments() {
				this.page ++;
				this.initCanteenComments2(this.Canteen, this.page);
			}
		},
		components: {
			starCount,
			newCanteenComment
		}		
	}
</script>
<style scoped>
	.comments {
		margin-top: 60px;
		margin-bottom: 25px;
		background-color: #fff;
		padding: 25px 20px;
	}
	.imgs li {
		display: inline-block;
		margin: 10px;
		cursor: pointer;
	}
	.imgs img {
		width: 60px;
		height: 60px;
	}
	.imgs-view {
		width: 460px;
		min-height: 500px;
		max-height: 674px;
		display: none;
		padding-bottom: 15px; 
	}
	.comment-item {
		margin-top: 20px;
	}
	.comment-item .comment-content {
		border-bottom: 1px solid #ccc;
	}
	.comment-text {
		margin-top: 20px;
	}
</style>