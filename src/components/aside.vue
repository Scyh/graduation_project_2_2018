<template>
	<div class="aside">
		<div class="container">
			<div class="row">
				<div class="col-lg-3">
					<div class="widget">
						<div class="widget-head">
							<h5>当前浏览食堂：<span>{{ whichCanteen | switchCanteen }}</span></h5>
						</div>
						<div class="widget-body">
							<div class="star-wrap" :title="canteen.overall_score">总体评价：
								<star-count :width="canteen.overall_score / 5 * 85.56" :isCanteen="true"></star-count>
							</div>
							<div class="star-wrap" :title="canteen.service_score">服务评分：
								<star-count :width="canteen.service_score / 5 * 85.56" :isCanteen="true"></star-count>
							</div>
							<div class="star-wrap" :title="canteen.environmental_score">卫生评分：
								<star-count :width="canteen.environmental_score / 5 * 85.56" :isCanteen="true"></star-count>
							</div>
						</div>
					</div>
					<div class="widget">
						<div class="widget-head">
							<h5>最新食堂评价</h5>
						</div>
						<div class="widget-body">
							<!-- <p>评价：xxxxxx</p>
							<p>评价：xxxxxx</p>
							<p>评价：xxxxxx</p> -->
							<template v-for="comment in comments">
								<div class="comment-item">
									<p>{{ comment.comment_text }}</p>
									<p>{{ comment.comment_author }}</p>
								</div>
							</template>
						</div>
						<div class="widget-footer">
							<router-link class="more pull-right" :to="'/' + whichCanteen + '/comments'">更多</router-link>
							<!-- <a href="##" class="more pull-right">更多</a> -->
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import starCount from './star_count.vue'
	export default {
		data() {
			return {
				canteen: {},
				comments: []
			}
		},
		computed: {
			whichCanteen() {
				return this.$route.params.id * 1;
			}
		},
		mounted() {
			// console.log(this.whichCanteen)
			this.initCanteenDetail(this.whichCanteen);
			this.initCanteenComments(this.whichCanteen);
		},
		watch: {
			$route() {
				this.initCanteenDetail(this.whichCanteen);
				this.initCanteenComments(this.whichCanteen);
			}
		},
		methods: {
			initCanteenDetail(canteen_id) {
				let that = this;
				that.canteen = {};
				that.comments = [];
				$.get('http://localhost:3001/apis/getCanteenDetail', {
					canteen_id: canteen_id
				}, function(data) {
					that.canteen = data[0];
				});
			},

			initCanteenComments(canteen_id) {
				let that = this;
				that.canteen = {};
				that.comments = [];
				$.get('http://localhost:3001/apis/getSomeCanteenComments',{
					belongsTo: canteen_id,
					commentsCount: 3,
					page: 1
				} ,function(data) {
					// console.log(data)
					for(let i in data) {
						that.comments.push(data[i])
					}
				});
			}
		},
		components: {
			starCount
		}
	}
</script>
<style scoped>
	.aside {
		padding-top: 10px;
	}
	.widget {
		padding: 10px 25px;
		background-color: #fff;
		min-height: 200px;
		box-shadow: 5px 8px 10px #ccc;
	}
	.aside .widget:not(:first-child) {
	 	margin-top: 35px;
	 }
	.widget-head {
		position: relative;
		border-bottom: 1px solid #EBEBEB;
	}
	.widget-head::after {
		content: '';
		display: inline-block;
		position: absolute;
		width: 100px;
		height: 1px;
		background-color: #F4645F;
	}
	.widget-head span {
		font-size: 18px !important;
		font-weight: 600;
	}
	.widget-body,
	.widget-footer {
		padding-top: 15px;
		overflow: hidden;
	}
	.widget-footer .more {
		color: #3879D9;
	}
	.star-wrap {
		display: inline-block;
		margin-bottom: 15px;
	}
	.comment-item {
		border-bottom: 1px dashed #ccc;
	}
	.widget-body .comment-item:not(:first-child) {
		padding-top: 15px;
	}
	.comment-item p:first-child {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 20px;
    	height: 20px;
	}
	.comment-item p:nth-child(2)::before {
		content: '---';
		margin-right: 5px;
	}
	.comment-item p:nth-child(2) {
		text-align: right;
		font-size: 14px;
		color: #ccc;
	}
</style>