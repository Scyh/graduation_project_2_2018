<template>
	<div class="add-new-food">
		<div class="container-fluid">
			<form class="form-horizontal">
				<div class="form-group">
					<label for="title" class="control-label col-md-2">菜品名</label>
					<div class="col-md-6">
						<input type="text" @keyup="check" class="form-control" id="food_name" placeholder="请填写菜品名">
					</div>
				</div>
				<div class="form-group">
					<label for="content" class="control-label col-md-2">菜品简介</label>
					<div class="col-md-6">
						<input type="text" @keyup="check" class="form-control" id="food_brief" placeholder="请填写菜品简介">
					</div>
				</div>
				<div class="form-group">
					<label for="content" class="control-label col-md-2">营业时间</label>
					<div class="col-md-6">
						<input type="text" @keyup="check" class="form-control" id="open_time" placeholder="请填写营业时间">
					</div>
				</div>
				<div class="form-group">
					<label for="content" class="control-label col-md-2">地址</label>
					<div class="col-md-6">
						<input type="text" @keyup="check" class="form-control" id="food_addr" placeholder="请填写地址">
					</div>
				</div>
				<div class="form-group">
					<label for="content" class="control-label col-md-2">联系电话</label>
					<div class="col-md-6">
						<input type="text" @keyup="checkTel" class="form-control" id="food_tel" placeholder="请填写联系电话">
					</div>
				</div>
				<div class="form-group">
					<label for="content" class="control-label col-md-2">均价</label>
					<div class="col-md-6">
						<input type="text" @keyup="checkPrice" class="form-control" id="food_price" placeholder="请填写人均价格">
					</div>
				</div>
				<div class="form-group">
					<label for="content" class="control-label col-md-2">所属食堂</label>
					<div class="col-md-6">
						仁苑：<input type="radio" @click="check" name="canteen" value="1001">&nbsp;&nbsp;
						爱苑：<input type="radio" @click="check" name="canteen" value="1002">&nbsp;&nbsp;
						义苑：<input type="radio" @click="check" name="canteen" value="1003">&nbsp;&nbsp;
						平苑：<input type="radio" @click="check" name="canteen" value="1004">&nbsp;&nbsp;
					</div>
				</div>
				<div class="form-group">
					<label for="content" class="control-label col-md-2">请上传菜一张品封面图片</label>
					<div class="col-md-6">
						<upload :uploadCount="1"></upload>
					</div>
				</div>
				<div class="form-group">
					<div class="col-md-offset-7">
						<button type="reset" class="btn reset" @click="reset">清空</button>
						<input type="button" class="btn btn-primary" @click="checkInput" value="提交">
					</div>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
	import upload from './upload.vue'
	export default {
		methods: {

			// 输入框通用检测事件
			check(ev) {
				if ($(ev.target).val() != '') {
					$(ev.target).parent().removeClass('ERROR').addClass('checked');
				} else {
					$(ev.target).parent().removeClass('ERROR checked');
				}
			},

			// 检测输入价格
			checkPrice(ev) {
				let reg = /^\d{1,2}$/;
				let val = $(ev.target).val();
				if (reg.test(val)) {
					$(ev.target).parent().removeClass('ERROR').addClass('checked');
				} else {
					$(ev.target).parent().removeClass('checked').addClass('ERROR');
				}
				if (val == '') {
					$(ev.target).parent().removeClass('ERROR checked');	
				}
			},

			// 检测输入电话
			checkTel(ev) {
				let reg = /^[\d-]{6,13}$/;
				let val = $(ev.target).val();
				if (reg.test(val)) {
					$(ev.target).parent().removeClass('ERROR').addClass('checked');
				} else {
					$(ev.target).parent().removeClass('checked').addClass('ERROR');
				}
				if (val == '') {
					$(ev.target).parent().removeClass('ERROR checked');	
				}
			},

			// 提交按钮检测事件
			checkInput() {
				$("input[type='text']").each(function(index, el) {
					if ($(el).val() == '') {
						$(el).parent().addClass('ERROR');
					}
				});

				// 检测食堂选择
				let canteen = $("input[name='canteen']:checked").val();
				if (canteen == undefined) {
					alert('请选择所属食堂');
					$("input[name='canteen']").eq(0).parent().removeClass('checked').addClass('ERROR')
					return;
				}

				// 检测是否上传菜品封面图片
				let length = $(".preView").length;
				let result = true;
				if (length == 0) {
					result = confirm('当前尚未上传菜品封面图，将会使用默认图片，确认添加菜品么')
				}

				if ($('.ERROR').length > 0) {
					$(".ERROR input").focus();
					return;
				} else {
					if (result) {
						$.post('http://localhost:3001/apis/admin/addNewFood', {
							food_name: $("#food_name").val(),
							food_brief: $("#food_brief").val(),
							food_price: $("#food_price").val(),
							food_tel: $("#food_tel").val(),
							open_time: $("#open_time").val(),
							food_addr: $("#food_addr").val(),
							food_belongsTo: canteen,
							food_cover_img: $(".preView img").prop("src")
						}).then(data => {
							if (data.status == 'success') {
								alert('上传成功');
								$(".reset").trigger('click')
							}
						}).catch(err => {
							console.log(err)
						})
					}
				}
			},

			reset() {
				$(".form-group > div").removeClass('ERROR checked');
			}
		},
		components: {
			upload,
		}
	}
</script>
<style scoped>
	.form-group label::after {
		content: '*';
		display: inline-block;
		margin: 0 4px;
		font-size: 17px;
		color: #F00;
	}
	.form-horizontal .form-group:nth-child(8) label::after {
		content: '';
	}
	.checked::after,
	.ERROR::after {
		position: absolute;
		right: -5px;
		top: 10px;
	}
	.checked::after {
		content: url(../assets/sign_check.png);	
	}
	.ERROR::after {
		content: url(../assets/sign_error.png);	
	}
</style>