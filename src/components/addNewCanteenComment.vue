<template>
	<div class="new-canteen-comment">
		<div class="new-canteen-comment-head">
			<h4>快来添加你对这个食堂的印象吧</h4>
		</div>
		<div class="new-canteen-comment-body">
			<p>
				<span>服务打分：</span>
				<star-count :canClick='true' class="service-score"></star-count>
			</p>
			<p>
				<span>卫生打分：</span>
				<star-count :canClick='true' class="environmental-score"></star-count>
			</p>
			<textarea class="new-canteen-comment-text"></textarea>
		</div>
		<div class="new-canteen-comment-footer">
			<button class="btn btn-primary" @click="addNew">提交</button>
		</div>
	</div>
</template>
<script>
	import starCount from './star_count.vue'
	import { mapGetters } from 'vuex'

	export default {
		props: ['belongsTo'],
		computed: {
			...mapGetters([
				'hasLogIn'
			]),
		},
		methods: {
			addNew() {
				let service_score = Math.round(($(".service-score .real-star").width() / 85.56) * 10 / 2);
				let environmental_score = Math.round(($(".environmental-score .real-star").width() / 85.56) * 10 / 2);
				let canteen_comment_text = $(".new-canteen-comment-text").val().trim();
				
				if (service_score <= 0 || environmental_score <= 0 || canteen_comment_text == '' || !this.hasLogIn) {
					alert('当前无法提交, 请登录或完整的评价！');
				} else {
					let that = this;
					$.post('http://localhost:3001/apis/addNewCanteenComment', {
						comment_author: sessionStorage.username,
						comment_time: new Date().valueOf(),
						comment_text: canteen_comment_text,
						comment_belongsTo: that.belongsTo,
						comment_service_score: service_score,
						comment_environmental_score: environmental_score
					})
						.then(data => {
							console.log(data)
							alert("评论成功！")
							that.reset();
						}).catch(err => {
							console.log(err)
						})
				}
			},

			// 清空
			reset() {
				$(".new-canteen-comment .real-star").width(0);
				$('.new-canteen-comment-text').val('');
			}

		},
		components: {
			starCount
		}
	}
</script>
<style scoped>
	.new-canteen-comment {
		position: fixed;
		top: 220px;
		margin-left: 25px;
		background-color: #fff;
		border-radius: 5px;
		padding: 15px 10px;
	}
	.new-canteen-comment-text {
		width: 270px;
		height: 156px;
		border: 1px solid #ccc;
		resize: none;
		outline: none;
		border-radius: 5px;
		background-color: #f2f0ed91;
	}

	@media screen and (max-width: 992px) {
		.new-canteen-comment {
			position: static;
			/*top: 220px;
			margin-left: 25px;
			background-color: #fff;
			border-radius: 5px;
			padding: 15px 10px;*/
		}	
	}
	@media screen and (max-width: 1300px) {
		.new-canteen-comment {
			position: static;
			margin-left: 0;
			margin-right: 15px;
		}
		.new-canteen-comment-text {
			width: 100%;
		}
	}
</style>