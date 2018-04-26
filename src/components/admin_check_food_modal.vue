<template>
		<div class="modal fade" tabindex="-1" role="dialog" id="admin_check_food_modal">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 class="modal-title">当前查看菜品详情</h4>
					</div>
					<div class="modal-body">
						<div class="container-fluid">
							<div class="row">
								<div class="col-lg-4 food-cover-img">
									<img v-if="!food.food_cover_img" class="img-responsive" src="../assets/images/no_image.jpg">
									<img v-else :src="food.food_cover_img" class="img-responsive">
									<div class="edit-photo" v-if="reEdit">
										<input type="file" @change="changePhoto">
										<span title="修改头像" class="edit-photo"><img src="../assets/edit_photo.png" alt="修改"></span>
									</div>
								</div>
								<div class="col-lg-8">
									<template v-if="!reEdit">
										<h3>{{ food.food_name }}</h3>
										<p><i>简介：</i>{{ food.food_brief }}</p>
										<p><i>评分☆：</i>{{ food.food_star }}</p>
										<p><i>人均￥：</i>{{ food.food_price }}</p>
										<p><i>地址：</i>{{ food.food_addr }}</p>
										<p><i>营业时间：</i>{{ food.open_time }}</p>
										<p><i>联系电话：</i>{{ food.food_tel }}</p>
									</template>

									<template v-else>
										<div class="reEdit">
											<input type="text" name="food_name" :value="food.food_name" class="form-control">
											<input type="text" name="food_brief" :value="food.food_brief"  class="form-control">
											<p><i>评分☆：</i>{{ food.food_star }}</p>
											<input type="text" name="food_price" :value="food.food_price"  class="form-control">
											<input type="text" name="food_addr" :value="food.food_addr"  class="form-control">
											<input type="text" name="food_open_time" :value="food.open_time"  class="form-control">
											<input type="text" name="food_tel" :value="food.food_tel"  class="form-control">
										</div>
									</template>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
						<button v-if="reEdit" type="button" class="btn btn-primary" @click=confirmChange>确认修改</button>
					</div>
				</div><!-- /.modal-content -->
			</div><!-- /.modal-dialog -->
		</div><!-- /.modal -->
</template>
<script>
	import bus from '../bus.js'

	export default {
		data() {
			return {
				food: {},
				reEdit: false,
				food_id: null,
			}
		},
		mounted() {
			bus.$on('transferFoodId', data => {
				this.reEdit = data.reEdit;
				this.food_id = data.food_id
				this.init(data.food_id);
			})
		},
		methods: {
			init(food_id) {
				let that = this;
				$.get('http://localhost:3001/apis/getFoodDetail', {
					food_id: food_id
				}).then(data => {
					that.food = data;
				}).catch(err => {
					console.log(err)
				})
			},

			// 修改头像
			changePhoto(ev) {
				var reader = new FileReader();
				console.log(ev.target.files[0])
				reader.readAsDataURL(ev.target.files[0])
				console.log(reader)
				reader.onload = function() {
					$(ev.target).parent().prev('img').prop('src', reader.result);
				}	
			},

			// 确认修改
			confirmChange() {
				let result = confirm('确认修改菜品信息？');
				if (result) {
					let that = this;
					$.post('http://localhost:3001/apis/admin/changeFoodInfo', {
						food_id: that.food_id,
						food_name: $("[name='food_name']").val(),
						food_brief: $("[name='food_brief']").val(),
						food_price: $("[name='food_price']").val(),
						food_tel: $("[name='food_tel']").val(),
						open_time: $("[name='open_time']").val(),
						food_addr: $("[name='food_addr']").val(),
						food_cover_img: $(".food-cover-img img").prop('src')
					}).then(data => {
						console.log(data)
						if (data.status == 'success') {
							alert('修改成功');
							$(".close").trigger('click');
							bus.$emit('changeSuccess')
						}
					})
				}
			},
		}
	}
</script>
<style scoped>
	img {
		width: 160px;
	}
	.modal-body h3 {
		margin-bottom: 15px;
	}
	.modal-body p i {
		color: #9d9d9d;
	}
	.reEdit input{
		margin: 10px 0;
	}
	.edit-photo {
		display: block;
		position: relative;
	    margin-top: -40px;
	    margin-left: 65px;
	    width: 40px;
	    height: 40px;
	    text-align: center;
	    overflow: hidden;
	}
	.edit-photo input {
		position: absolute;
		display: inline-block;
		left: 0;
		bottom: 0;
		z-index: 9;
		width: 40px;
		height: 40px;
		opacity: 0;
	}
	.edit-photo span {
		position: absolute;
		z-index: 8;
		bottom: 0;
		left: -65px;
	}
	.edit-photo span img {
		width: 40px;
		height: 40px;
	}
</style>