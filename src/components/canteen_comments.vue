<template>
	<div class="container">
		<div class="row canteen-comments-wrap">
			<div class="col-sm-12 col-md-9 col-lg-9">
				<div class="canteen_comments">
					<div class="canteen_comments_head">
						<h3>当前正在浏览: {{ Canteen | switchCanteen }}食堂的评论区</h3>
						<div>
							<span>总体评分：</span><star-count :isCanteen="true" :width="canteen.overall_score / 5 * 85.56"></star-count>&nbsp;&nbsp;&nbsp;{{ canteen.overall_score }}分
							&nbsp;&nbsp;&nbsp;&nbsp;
							<span>服务评分：</span><star-count :isCanteen="true" :width="canteen.service_score / 5 * 85.56"></star-count>&nbsp;&nbsp;&nbsp;{{ canteen.service_score }}分
							&nbsp;&nbsp;&nbsp;&nbsp;
							<span>卫生评分：</span><star-count :isCanteen="true" :width="canteen.environmental_score / 5 * 85.56"></star-count>&nbsp;&nbsp;&nbsp;{{ canteen.environmental_score }}分
						</div>
						<div class="canteen-imgs">
							<div class="imgs-box">
								<div class="box-head">
									<span @click="close"><img src="../assets/close.png" alt="关闭"></span>
								</div>
								<div class="box-body">
									<span @click="changeImg('prev', $event)"></span>		
									<span @click="changeImg('next', $event)"></span>
								</div>
							</div>
							<div class="box-foot">
								<template v-for="item in canteen.canteen_imgs">
									<img class="canteen-imgs-item" :src="item" @click="view">
								</template>
							</div>
						</div>
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
									<span class="pull-right comment-time">{{ canteen_comment.comment_time | getDate}}</span>
									<span>服务打分：</span><star-count :width="canteen_comment.comment_service_score / 5 * 85.56"></star-count>
									<br>
									<span>卫生打分：</span><star-count :width="canteen_comment.comment_environmental_score / 5 * 85.56"></star-count>
									<p class="comment-text">{{ canteen_comment.comment_text }}</p>
								</div>
							</div>
						</template>
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
	import bus from '../bus.js'

	export default {
		data() {
			return {
				canteen: {},
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
			this.initCanteen(this.Canteen).then(() => {
				this.initCanteenComments2(this.Canteen, this.page);	
			});

			bus.$on('init', () => {
				location.reload();
				// console.log(1)
				// this.initCanteen(this.Canteen).then(() => {
				// 	this.initCanteenComments2(this.Canteen, this.page);	
				// })	
			});
		},
		methods: {
			// 初始化食堂
			initCanteen(canteen_id) {
				let that = this;
				var p = new Promise((resolve, reject) => {
					$.get('http://localhost:3001/apis/getCanteenDetail', {
						canteen_id: canteen_id
					}).then(data => {
						that.canteen = data[0];
						resolve('success')
					}).catch(err => {
						console.log(err);
						reject('fail')
					})
				})
				return p;
			},

			// 初始化食堂评论
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

			// 加载更多食堂评论
			moreCanteenComments() {
				this.page ++;
				this.initCanteenComments2(this.Canteen, this.page);
			},

			// 查看食堂图片
			view(ev) {
				$("#mask").show();
				$(".imgs-box").slideDown(400);
				// $(".imgs-box .box-body img").prop('src', $(ev.target).prop('src'));
				$(".imgs-box").css('backgroundImage', 'url('+ $(ev.target).prop('src') +')').data('currentimg', $(ev.target).index());
				console.log($(".imgs-box").data('currentimg'));
			},

			close() {
				$(".imgs-box").fadeOut();
				$("#mask").hide();
			},

			 changeImg(type, event) {
			 	let max = $(".canteen-imgs-item").length;
			 	let current = $(".imgs-box").data('currentimg')
			 	if (type=='prev' && current > 0) {
			 		current--;
			 		$(".imgs-box").data('currentimg', current)
			 		console.log(current)
			 		$(".imgs-box").css('backgroundImage', 'url('+ $(".canteen-imgs-item").eq(current).prop('src') +')')
			 		;
			 	} else if (type=='next' && current < max - 1) {
			 		current++;
			 		$(".imgs-box").data('currentimg', current)
			 		console.log(current)
			 		$(".imgs-box").css('backgroundImage', 'url('+ $(".canteen-imgs-item").eq(current).prop('src') +')')
			 	}
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
	.canteen-imgs-show {
		width: 400px;
		height: 300px;
	}
	.canteen-imgs-item {
		width: 80px;
		height: 80px;
		display: inline-block;
	}
	.imgs-box {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		width: 800px;
		height: 700px;
		background-color: rgba(255,255,255,.8);
		z-index: 10;
		background-size: cover;
		background-repeat: no-repeat;
	}
	.box-head span{
		float: right;
		padding: 20px 20px 0;
	}
	.box-body img {
		display: block;
		width: 600px;
		height: 600px;
		margin: 40px auto;
	}
	.box-body span {
		display: block;
		position: absolute;
		top: 45%;
		width: 64px;
		height: 64px;
		cursor: pointer;
	}
	.box-body span:first-child {
		background: url(../assets/leftArrow.png) no-repeat;
		left: 0;
	}
	.box-body span:last-child {
		background: url(../assets/rightArrow.png) no-repeat;
		right: 0;
	}
	.canteen-imgs-item {
		display: inline-block;
		margin-top: 10px;
		margin-right: 20px;
	}
</style>