<template>
	<div class="food-detail">
		<div class="container">
			<div class="row location">
				<div class="col-lg-12">
					<div class="food-location">
						<h4>{{ food.food_belongsTo | switchCanteen }} > {{ food.food_name }}</h4>
					</div>
				</div>
			</div>
			<div class="row detail">
				<div class="col-lg-8">
					<h2>{{ food.food_name }}</h2>
					<div :data-star="food.food_star">
						<star-count :width='food.food_star / 5 * 85.56'></star-count>
					</div>
					<span>{{ food.food_star }}分</span>
					<span class="price">人均￥{{ food.food_price }}</span>
					<hr>
					<p class="address">地址：{{ food.food_addr }}</p>
					<p class="tel">联系电话：{{ food.food_tel }}</p>
					<p class="open-time">{{ food.open_time }}</p>
				</div>
				<div class="col-lg-4">
					<!-- <div class="food-view">
						<div class="current-food-img">
							<img class="img-responsive" src="../assets/images/1.jpg">
						</div>
						<div class="other-food-img">
							<ul>
								<li><img src="../assets/images/1_1.jpg"></li>
								<li><img src="../assets/images/1_2.jpg"></li>
								<li><img src="../assets/images/1_3.jpg"></li>
							</ul>
						</div>
					</div> -->
					<div class="food-view">
						<img v-if="!food.food_cover_img" class="img-responsive" src="../assets/images/no_image.jpg">
						<img v-else :src="food.food_cover_img" class="img-responsive">
					</div>
				</div>
			</div>
		</div>
		
		<div class="container reply">
			<template v-if="hasLogIn">
				<div class="row">
					
					<div class="textarea-wrap">
						<textarea class="col-sm-8 col-md-8 col-lg-8" name="replyTextarea" placeholder="快来评论吧" @input="calcChar"></textarea>
						<span class="leave-char">还剩{{ 100 - words }}个字符可输入</span>
					</div>

					<div class="marking-grade col-lg-2">
						<p>请打分：</p>
						<star-count id="score" :width="0" :canClick="true"></star-count>
					</div>
					<div class="col-lg-1">
						<button class="btn btn-primary" @click="reply">发表回复</button>
					</div>
					<div class="col-lg-12">
						<upload></upload>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="row">
					<p>尚未登录, 登陆后可评论哦~</p>
				</div>
			</template>
		</div>

		<template v-if="!food_comments.length">
			<p class="container comments">暂无评价哦！！快来添加你的评价吧~~</p>
		</template>
		<template v-else>
			<div class="container comments">
				<template v-for="food_comment in food_comments">
					<div class="row comment-item">
						<div class="col-lg-1">
							<div class="user-profile">
								<img src="../assets/images/user.jpg">
							</div>
						</div>
						<div class="col-lg-11 comment-content">
							<h4 class="user-name">{{ food_comment.f_comment_author }}</h4>
							<p class="comment-time">{{ food_comment.f_commment_time }}</p>
							<star-count :width="food_comment.f_score * 8.556 * 2"></star-count>
							<p class="comment-text">{{ food_comment.f_comment_text}}</p>
							<p class="imgs">
								<ul>
									<template v-if="!food_comment.f_upload_imgArr.length">
										<template  v-for="(img, index) in food_comment.f_upload_imgArr">
											<li @click="view"><img :src="img" alt="图片丢了..."></li>
										</template>
									</template>
								</ul>
							</p>
							<div class="imgs-view">
									<img class="img-responsive" src="">
							</div>
						</div>
					</div>
				</template>

				<div class="row">
					<div class="col-lg-2 col-lg-offset-4">
						<div class="more">
							<span v-if="hasMore" class="hasMore" @click="moreFoodComments">点击加载更多</span>
							<span v-else>不能加载更多啦！！</span>
						</div>
					</div>
				</div>
			</div>
			

		</template>
	</div>
</template>
<script>
	import starCount from './star_count.vue'
	import upload from './upload.vue'
	import { mapGetters } from 'vuex'

	export default {
		data() {
			return {
				food: {},
				words: 0,
				imgArr: '',
				comments_page: 1,
				food_comments: [],
				hasMore: true,
			}
		},
		mounted() {
			this.hasMore = true;
			this.initFoodDetail(this.food_id).then(() => {
				this.initFoodComments(this.food_id, this.comments_page)
			})
		},
		computed: {
			...mapGetters([
				'hasLogIn'
			]),

			food_id() {
				return this.$route.params.id
			}
		},
		methods: {
			
			// 初始化, 获取 food 的具体信息
			initFoodDetail(food_id) {
				let that = this;

				let p = new Promise((resolve, reject) => {
					$.get('http://localhost:3001/apis/getFoodDetail', {
						food_id: food_id
					}).then(data => {
						that.food = data;
						resolve('initFoodDetail success');
					}).catch(err => {
						console.log(err);
						reject('initFoodDetail fail')
					})
				})
				return p
			},

			initFoodComments(food_id, comments_page) {
				let that = this;
				$.get('http://localhost:3001/apis/getFoodComments', {
					food_id: food_id,
					page: comments_page
				}).then(data => {
					// console.log(JSON.parse(data[0].f_upload_imgArr))

					data.length > 0 ? that.hasMore = true : that.hasMore = false;
					
					for(let i in data) {
						console.log(data[i])
						// if ($.isEmptyObject(JSON.parse(data[i].f_upload_imgArr))) {

						// }else {
							
						// }
						data[i].f_upload_imgArr = JSON.parse(data[i].f_upload_imgArr);
						that.food_comments.push(data[i])
					}

					
				}).catch(err => {
					console.log(err)
				})
			},

			// 查看 评论中的图片
			view(ev) {
				let $target = $(ev.target);
				$(".imgs-view").hide();
				$target.parents('.imgs').next('.imgs-view').find('img').prop('src', $target.prop('src')).end().show();
			},

			// 添加评论
			reply() {
				let reply = $('[name="replyTextarea"]').val().trim();
				let that = this;
				
				// Math.round((68.4375 / 85.5625) * 10 / 2)
				let score = Math.round(($("#score .real-star").width() / $("#score").width() * 5))

				if (reply == '') {
					alert("请输入评论内容! ")
				} else if (score <= 0) {
					alert("给这美食打个分吧~")
				} else {
					this.uploadImg().then(function() {
						// alert("上传图片成功")
						console.log(that.imgArr)
						$.post('http://localhost:3001/apis/uploadFoodComment', {
							f_comment_author: sessionStorage.username,
							f_commment_time: new Date().valueOf(),
							f_comment_text: reply,
							f_comment_belongsTo: that.$route.params.id,
							f_score: score,
							f_upload_imgArr: that.imgArr
						}).then(data => {
							console.log(data);
							alert("评论成功~");
						}).catch(err => {
							alert("评论失败...");
							console.log(err)
						})
					});
				}
			},

			// 上传图片
			uploadImg() {
				let that = this;
				let imgArr = [];
				
				let p = new Promise((resolve, reject) => {
					$(".preView img").each(function(index, el) {
						let img = {}
						img.name = el.name;
						img.src = $(el).prop('src').replace(/^data:image\/\w+;base64,/, ''),
						imgArr.push(img)
					});

						$.post('http://localhost:3001/apis/uploadImg', {
							imgArr: JSON.stringify(imgArr)
						}).done(data => {
							console.log(data)
							that.imgArr = data.imgsURL;
							resolve('uploadImg success')
						}).catch(err => {
							console.log(err);
							reject('uploadImg fail')
						})
				})

				return p
			},

			// 计算剩余字符
			calcChar(ev) {
				
				let length = $('[name="replyTextarea"]').val().length;
				 length > 0 ? this.words = length : this.words = 0;
			},

			// 加载更多评论
			moreFoodComments() {
				this.comments_page ++ ;
				this.initFoodComments(this.food_id, this.comments_page)
			}
		},
		components: {
			upload,
			starCount
		}
	}
</script>
<style scoped>
	.food-location {
		margin: 25px 0 15px 0;
	}
	.detail {
		padding: 25px 10px;
		background-color: #fff;
		border-radius: 10px;
	}
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
		border-bottom: 1px solid #E5E5E5;
	}
	.reply {
		margin: 25px 0;
		padding: 15px 0;
		background-color: #FFF;
	}
	.reply textarea {
		margin: 0 30px;
		padding: 10px 0 0 10px;
		resize: none;
		min-height: 80px;
		height: auto;
		outline: none;
		border-radius: 10px;
	}
	.reply button {
		margin-top: 45px;
	}
	.star-count + span {
		margin-right: 20px;
	}
	.reply .textarea-wrap {
		position: relative;
	}
	.leave-char {
		position: absolute;
		right: 24px;
		color: #ccc;
	}
</style>