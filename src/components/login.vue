<template>
	<!-- LogIn Modal -->
	<div class="modal fade" tabindex="-1" role="dialog" id="login">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title">登录</h4>
				</div>
				<div class="modal-body">
					<form>
			         	<div class="form-group">
			           		<label for="username" class="col-lg-2">用户名：</label>
			           		<div class="col-lg-10">
			           			<input type="text" class="form-control username" name="username">
			           		</div>
			           	</div>
			           	<div class="form-group">
			           		<label for="password" class="col-lg-2">密码：</label>
			           		<div class="col-lg-10">
			           			<input type="password" class="form-control password" name="password">
			           		</div>	
			           	</div>
			            
			        </form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					<button type="button" @click="confirmLogin" class="btn btn-primary">登录</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {}
		},
		mounted: function() {
			let that = this;
			$('#modalLogin').on('hide.bs.modal', function () {
				that.resetInput();
			})
	    },
		methods: {
			 
			// 验证登录
			confirmLogin: function() {
				let that = this;
				let username = $(".username").val();
				let password = $(".password").val();
				if (username != '' && password != '') {
					$.ajax({
					url: 'http://localhost:3001/apis/checkUser',
					dataType: 'JSON',
					data: {
					username: username,
					password: password
					},
				})
				.done(function(data) {
					if (data.status == 'success') {
						// 验证成功，用户存在
						console.log(username)
						// 跳转管理员界面
						if (username == 'admin') {
							console.log("管理员登录")
							sessionStorage.admin = 'admin';
							that.$router.push('/admin');
							that.$store.dispatch("adminLogIn");
							$(".close").trigger('click');
							// location.reload();
						} else {
							// 普通用户登录
							sessionStorage.username = username;
							that.$store.dispatch("logIn");
							$(".close").trigger('click');
							that.$emit('userProfile', data.userData)
							// location.reload();
						}

					} else if (data.status == 'fail') {
						// 验证失败，用户不存在
						alert("验证失败")
					} else {
						console.log("验证发生错误")
					}
				})
				.fail(function() {
					console.log("error");
					})
				}
			},
			// 清空输入框
			resetInput: function() {
				$(".username").val("");
				$(".password").val("");
		    },
		}
	}
</script>
<style scoped>
	.modal-body,
	.form-group {
		overflow: hidden;
	}
</style>