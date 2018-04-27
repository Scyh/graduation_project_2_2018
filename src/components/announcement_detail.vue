<template>
	<div class="announcement-detail">
		<div class="container">
			<div class="row">
				<div class="col-md-10 col-md-offset-1">
					<article>
						<div class="announcement-title">
							<h2>{{ announcement.news_title }}</h2>
						</div>
						<div class="announcement-meta">
							<span>{{ announcement.announcement_author }}</span>
							<span>{{ announcement.announcement_date | getDate}}</span>
						</div>
						<div class="announcement-content">
							<p v-html="announcement.announcement_content"></p>
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
				announcement: {},
			}
		},
		mounted() {
			this.init();
		},
		computed: {
			announcement_id() {
				return this.$route.name == 'announcement' && this.$route.params.id
			}
		},
		methods: {
			init() {
				let that = this;
				$.get('http://localhost:3001/apis/getOntAnnouncement', {
					id: that.announcement_id
				}).then(data => {
					that.announcement = data;
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
	.announcement-title {
		text-align: center;
	}
	.announcement-meta {
		padding: 15px;
		color: #999;
		font-size: 13px;
		text-align: center;
	}
	.announcement-content {
		min-height: 400px;
		line-height: 30px;
		font-size: 18px;
		text-indent: 36px;
	}
</style>