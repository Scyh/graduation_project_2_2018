<template>
	<div class="food-news">
		<div class="container">
			<div class="row">
				<!-- banner -->
				<div class="col-lg-5  col-md-5  col-sm-5 banner">
					<div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
					<!-- Indicators -->
						<ol class="carousel-indicators">
							<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
							<li data-target="#carousel-example-generic" data-slide-to="1"></li>
							<li data-target="#carousel-example-generic" data-slide-to="2"></li>
						</ol>

						<!-- Wrapper for slides -->
						<div class="carousel-inner" role="listbox">
							<div class="item active">
								<img class="img-responsive" src="../assets/food_1.jpg">
							</div>
							<div class="item">
								<img class="img-responsive" src="../assets/food_2.jpg">
							</div>
							<div class="item">
								<img class="img-responsive" src="../assets/food_3.jpg">
							</div>
						</div>

						<!-- Controls -->
						<a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
							<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
						</a>
						<a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
							<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
						</a>
					</div>
				</div>

				<!-- food-news -->
				<div class="col-lg-7  col-md-7  col-sm-7 news">
					<template v-for="latestNew in news">
						<div class="news-item">
							<p>
								<router-link :to="'/news/' + latestNew._id">{{ latestNew.news_title }}</router-link>
							</p>
							<span class="news-item-time pull-right">{{ latestNew.news_publish_time | getDate }}</span>	
						</div>
					</template>
				</div>
			</div>
		</div>
		<div class="container">
			<div class="row">
				<div class="col-lg-8 col-md-8 col-sm-8 hotNews">
					<div class="hotNews-head">
						<h5><span class='glyphicon glyphicon-chevron-down'></span>热门资讯</h5>
					</div>
					<div class="hotNews-body">
						<template v-for="item in hotNews">
							<div class="hotNews-item">
								<router-link :to="'/news/' + item._id">{{ item.news_title }}</router-link>
								<span class="pull-right">{{ item.news_publish_time | getDate }}</span>
								<span class="pull-right">{{ item.news_pv }}</span>
							</div>
						</template>
						
					</div>
				</div>

				<div class="col-lg-4 col-md-4 col-sm-4 hotNews">
					<div class="hotNews-head">
						<h5><span class='glyphicon glyphicon-chevron-down'></span>最新公告</h5>
					</div>
					<div class="hotNews-body recommend">
						<template v-for="item in announcements">
							<div class="recommend-item">
								<router-link :to="'/announcement/' + item._id">{{ item.announcement_title }}</router-link>
								<span class="pull-right">{{ item.announcement_date | getDate }}</span>
							</div>
						</template>
						
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				news: [],
				hotNews: [],
				announcements: []
			}
		},
		mounted() {
			this.initNews();
			this.initAnnouncement();
		},
		methods: {
			initNews() {
				let that = this;
				$.get('http://localhost:3001/apis/getLatestNews', {
					category: 'news'
				}).then(data => {
					that.news = data.news;
					that.hotNews = data.hotNews;
				}).catch(err => {
					console.log(err)
				})
			},

			initAnnouncement() {
				let that = this;
				$.get('http://localhost:3001/apis/getAnnouncements', {
					count: 6,
					page: 1
				}).then(data => {
					console.log(data)
					that.announcements = data;
				})
			}
		}
	}
</script>
<style scoped>
	.food-news {
		margin-top: 30px;
	}
	#carousel-example-generic {
		min-height: 240px;
	}
	.news-item {
		height: 40px;
		line-height: 40px;
		border-bottom: 1px dashed #ccc;
		overflow: hidden;
		cursor: pointer;
	}
	.news-item p {
		display: inline-block;
		position: relative;
		padding-left: 22px;
		margin-bottom: 0;
	}
	.news-item p::before {
		content: url(../assets/tip.png);
		display: inline-block;
		position: absolute;
		left: 0;
		top: 2px;
	}
	.news-item-time {
		color: #ba8716d1;
		font-size: 13px;
	}
	.news-item-time::before {
		content: '[';
		margin-right: 4px;
	}
	.news-item-time::after {
		content: ']';
		margin-left: 4px;
	}
	.hotNews {
		margin-top: 60px;
	}
	.hotNews-head {
		height: 35px;
		line-height: 35px;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-bottom: 0;
		background: linear-gradient(180deg, #fff 10%, #AAAAAA);
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
	}
	.hotNews-head h5 {
		font-weight: 600;
		padding-left: 30px;
		padding-top: 10px;
		position: relative;
	}
	.hotNews-head h5 span {
		position: absolute;
		left: 13px;
		top: 10px;
	}
	.hotNews-body {
		height: 229px;
		border: 1px solid #ccc;
		overflow: hidden;
	}
	.recommend-item,
	.hotNews-item {
		padding: 10px 0 6px 25px;
		border: 1px dashed #ccc;
	}
	.hotNews-item p {
		display: inline-block;
		/*line-height: 30px;*/
	}
	.hotNews-item p::before {
		content: url(../assets/hot.png);
		display: inline-block;
		position: absolute;
		left: 20px;
	}
	.recommend-item span,
	.hotNews-item span {
		display: inline-block;
		font-size: 12px !important;
		padding-right: 5px;
	}
	.hotNews-item span:first-of-type {
		margin-left: 25px;
		margin-right: 5px;
	}
	.carousel-inner {
		height: 238px
	}
</style>