<template>
	<!-- LogIn Modal -->
	<div class="modal fade" id="modalRegister" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title">注册</h4>
				</div>
				<div class="modal-body">
					<form>
			         	<div class="form-group">
			           		<label for="username" class="col-lg-2">用户名：</label>
			           		<div class="col-lg-10">
			           			<input type="text" class="form-control username" @keyup="checkName" name="reg-username"><span class="tip"></span>
			           		</div>
			           	</div>
			           	<div class="form-group">
			           		<label for="password" class="col-lg-2">密码：</label>	
			           		<div class="col-lg-10">
			           			<input type="password" @keyup="checkPwd" class="form-control password" name="reg-password"><span class="tip"></span>
			           		</div>	
			           	</div>
			            <div class="form-group">
			           		<label for="password" class="col-lg-2">确认密码：</label>	
			           		<div class="col-lg-10">
			           			<input type="password" @keyup="pwdConfirm" class="form-control password" name="reg-pwdConfirm"><span class="tip"></span>
			           		</div>	
			           	</div>
			           	<div class="form-group">
							 <label class="col-lg-2">请输入验证码：</label>
							 <div class="col-lg-10">
							 	<input type="text" name="verfiCode" class="form-control" @keyup="checkVerfiCode" maxlength='4'><span class="tip"></span>
							 </div>
							 <span class="tip"></span>
				              <span @click="getCaptcha" class="svgCode" v-html="svg"></span>
              				<span>看不清？点击图片切换</span>
						</div>
			        </form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					<button type="button" @click="confirmReg" class="btn btn-primary">确认注册</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				svg: '',	// 验证码图片
				text: '',	// 验证码
			}
		},
		mounted() {
			let that = this;
			$("#registerModal").on('show.bs.modal', function() {
				that.getCaptcha();
			}).on('hide.bs.modal', function() {
				that.resetInput();
			})
		},
		methods: {

			// 获取验证码
			getCaptcha() {
				let that = this;
				this.$http.get('http://localhost:3001/apis/captcha').then(req => {
					that.svg = req.data.code;
					that.text = req.data.text.toLowerCase();
				}).catch(req => {
					console.log(req)
				})
			},

			// 验证用户名
			checkName: function (event) {
				let username = $(event.currentTarget).val();
				let $tip = $(event.currentTarget).next('.tip');
				let reg = /^[a-zA-Z0-9\_]{3,13}$/
				if (reg.test(username)) {
				  	// 验证通过
					$tip.removeClass('nameErr ERROR').addClass('checked');

				  	// 判断用户名唯一
				    $.get('http://localhost:3001/apis/uniqueUserName', {
				    	username: username
				  	}, function(data) {
				  		if (typeof data == 'string') {
				  			data = JSON.parse(data)
				  		}
				    if (data.status == 'fail') {
				      // 用户名存在
				    	$tip.removeClass('checked nameErr ERROR').addClass('nameExist ERROR')
				    } else if (data.status == 'success') {
				      // 用户名不存在
				      	$tip.removeClass('nameErr nameExist ERROR').addClass('checked')
				    	}
					});
				} else {
				  $tip.removeClass('checked nameExist ERROR').addClass('nameErr ERROR');
				}

				if (username == '') {
				  $tip.removeClass('checked nameErr nameExist ERROR').addClass('ERROR');
				}
			},

		    // 验证密码
			checkPwd: function(event) {
				let password = $(event.currentTarget).val();
				let $pwdConfirm = $("[name='reg-pwdConfirm']");
				let $tip = $(event.currentTarget).next('.tip');
				let $pwdConfirmTip = $pwdConfirm.next('.tip');
				let reg = /^[a-zA-Z0-9\.\-\_\@\!]{6,16}$/
				
				if (reg.test(password)) {
					// 验证通过
					$tip.removeClass('pwdErr ERROR').addClass('checked');

					if ($pwdConfirm.val() && $pwdConfirm.val() == password) {
		
					} else {
						$pwdConfirmTip.removeClass('checked').addClass('pwdConfirmErr ERROR');
					}

				} else {
					$tip.removeClass('checked').addClass('pwdErr ERROR');
				}

				if (password == '') {
					$tip.removeClass('checked pwdErr ERROR').addClass('ERROR');
				}
			},

			// 验证确认密码
			pwdConfirm: function (event) {
				let password = $("[name='reg-password']").val();
				let pwdConfirm = $(event.currentTarget).val();
				let $tip = $(event.currentTarget).next('.tip');

				if (password == pwdConfirm) {
					$tip.removeClass('pwdConfirmErr ERROR').addClass('checked');
				} else {
					$tip.removeClass('checked').addClass('pwdConfirmErr ERROR');
				}

				if (pwdConfirm == '') {
					$tip.removeClass('checked pwdConfirmErr ERROR').addClass('ERROR');
				}
			},

			// 验证码
			checkVerfiCode: function (event) {
				let verfiCode = $(event.currentTarget).val().toLowerCase();
				let $tip = $(event.currentTarget).next('.tip');
				if (verfiCode == this.text.toLowerCase()) {
					$tip.removeClass('verfiCode ERROR').addClass('checked');
				} else {
					$tip.removeClass('checked').addClass('verfiCode ERROR');
				}

				if (verfiCode == '') {
					$tip.removeClass('checked verfiCode ERROR').addClass('ERROR');
				}
			},

			// 清空所有输入框
			resetInput: function() {
				$("[name='reg-username']").val("");
				$("[name='reg-password']").val("");
				$("[name='reg-pwdConfirm']").val("");
				$("[name='verfiCode']").val("");
				$(".tip").removeClass('nameErr nameExist pwdErr pwdConfirmErr verfiCode checked ERROR');
			},

			// // 确认注册
			confirmReg: function () {
				let that = this;
				let username = $("[name='reg-username']").val();
				let password = $("[name='reg-password']").val();
				let pwdConfirm = $("[name='reg-pwdConfirm']").val();
				let verfiCode = $("[name='verfiCode']").val();

				if (verfiCode == '') {
					$(".verfiCode").next(".tip").addClass('verfiCode ERROR');
				}

				if (username == '' || password == ''  || pwdConfirm == '' || verfiCode == '') {
				} else {
					if ($(".tip").hasClass('ERROR')) {
						// console.log("不提交")
					} else {
						// console.log("提交");
						$.post('http://localhost:3001/apis/regUser', {
							username: username,
							password: password
						}).then(req => {
							alert("注册成功");
                  			$(".close").trigger('click');
						}).catch(req => {
							alert("注册失败")
							console.log('fail')
							console.log(req)
						})
					}
				}
			}
		}
	}
</script>
<style scoped>
	.modal-body,
	.form-group {
		overflow: hidden;
	}
	label {
		padding-right: 0;
		text-align: right;
	}
	.form-control {
		width: 94% !important;
		display: inline-block;
	}
	.svgCode~span{
		font-size: 12px;
	}
	.tip {
		display: inline;
	}
	input[name='verfiCode'] {
	/*margin-left: 15px;*/
	}
	.checked::before {
		content: url(../assets/sign_check.png);
		position: absolute;
		display: inline-block;
		margin-top: 9px;
		margin-left: 8px;

	}
	.nameErr::before,
	.nameExist::before,
	.pwdErr::before,
	.pwdConfirmErr::before,
	.verfiCode::before {
		content: url(../assets/sign_error.png);
		position: absolute;
		display: inline-block;
		margin-top: 6px;
		margin-left: 8px;
	}

	.nameErr::after,
	.pwdErr::after,
	.pwdConfirmErr::after,
	.nameExist::after,
	.verfiCode::after {
		display: block;
		color: red;
		font-size: 14px;
	}
	.nameErr::after {
		content: '用户名格式错误, 请输入由字母、数字或下划线组成的3-13位用户名!';
	}
	.nameExist::after {
		content: '用户名已存在!';
	}
	.pwdErr::after {
		content: '密码格式错误,请输入由字母、数字或. - _ @ ! 字符组成的6-16位密码!'
	}
	.pwdConfirmErr::after {
		content: '两次密码不一致!'
	}
	.verfiCode::after {
		content: '验证码输入错误'
	} 
</style>