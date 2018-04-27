<template>
	<div class="announcement-detail">
		<div class="modal fade" id="newsDetail" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
		  <div class="modal-dialog" role="document">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h4 class="modal-title">
		        	{{ news.news_title }}
		        </h4>
		        <div class="announcement_meta">
		        	<span>
		        		{{ news.news_publish_time | getDate }}
		        	</span>
		        	<span>
		        		{{ news.news_author }}
		        	</span>
		        </div>
		      </div>
		      <div class="modal-body">
		        <p v-html="news.news_text"></p>
		      </div>
		      <div class="modal-footer">
		      	<span class="pull-left">
		        		浏览次数{{ news.news_pv }}
		        	</span>
		        <button type="button" class="btn btn-primary" data-dismiss="modal">关闭</button>
		      </div>
		    </div>
		  </div>
		</div>
	</div>
</template>
<script>
	import bus from '../bus.js'
	export default {
		data() {
			return {
				news: {}
			}
		},
		mounted() {
			bus.$on('transferNewsId', data => {
				if (data) {
					let that = this;
					$.get('http://localhost:3001/apis/getOneNew', {
						news_id: data
					}).then(data => {
						that.news = data;
					})
				}
			})
		}
	}
</script>
<style scoped>
	.modal-header {
		padding-bottom: 0;
	}
	.modal-title {
		text-align: center;
	}
	.announcement_meta {
		font-size: 12px;
		color: #999;
		text-align: center;
		padding: 10px 0;
	}
	.modal-body {
		min-height: 200px;
		text-indent: 32px;
	}
</style>
