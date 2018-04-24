<template>
	<div class="food-news-detail">
		<div class="container">
			<div class="row">
				<div class="col-md-10 col-md-offset-1">
					<article>
						<div class="news-title">
							<h2>{{ newsDetail.news_title }}</h2>
						</div>
						<div class="news-meta">
							<span>{{ newsDetail.news_author }}</span>
							<span>{{ newsDetail.news_publish_time | getDate}}</span>
						</div>
						<div class="news-content">
							<p>{{ newsDetail.news_text }}</p>
						</div>
					</article>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				newsDetail: {}
			}
		},
		mounted() {
			this.init(this.newsId)
		},
		computed: {

			// 获取新闻_id
			newsId() {
				return this.$route.name == 'newsDetail' && this.$route.params.id;
			},
		},
		methods: {
			init(_id) {
				let that = this;
				$.get('http://localhost:3001/apis/getOneNew', {
					news_id: _id
				}).then(data => {
					console.log(data);
					that.newsDetail = data;
				})
			}
		}

	}
</script>
<style scoped>
	article {
		margin-top: 30px;
		padding: 20px 30px;
    	background: #fff;
    	border-radius: 5px;
	}
	.news-title {
		text-align: center;
	}
	.news-meta {
		padding: 15px;
		color: #999;
		font-size: 13px;
		text-align: center;
	}
	.news-content {
		min-height: 400px;
		line-height: 30px;
		font-size: 18px;
		text-indent: 36px;
	}
</style>