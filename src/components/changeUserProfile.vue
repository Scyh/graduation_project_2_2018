<template>
	<!-- 选择头像模态框 -->
	<div class="modal fade" tabindex="-1" role="dialog" id="changeProfile">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal"></button>
	        <label for="file" class="file-label">请选择头像<input type="file" id="file" @change="preview"></label>
	      </div>
	      <div class="modal-body">
	        <div class="tempImg-wrap">
	            <div class="row">
	            	<div class="col-md-4">
	            		<img v-if="userProfile == ''" src="../assets/index.png" id="tempImgLG">
	            		<img v-else :src="userProfile" id="tempImgLG">
	            	</div>
			        <div class="col-md-2 col-md-offset-1">
			            <div>
			                <div class="imgPreview">
			                </div>
			            </div>
			        </div>
			        <div class="col-md-2 col-md-offset-2">
			            <div>
			                <div class="imgPreview imgPreviewRound">
			                </div>
			            </div>
			        </div>
	      		</div>
	        </div>
	      	</div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
	        <button type="button" class="btn btn-primary" @click="crop">保存</button>
	      </div>
	    </div><!-- /.modal-content -->
	  </div><!-- /.modal-dialog -->
	</div><!-- modal 结束-->
</template>
<script>
	import cropper from 'cropper'

	export default {
		props: ['userProfile'],
		mounted() {
			$("#changeProfile").on('show.bs.modal', () => {
				console.log(1)
				this.initProfile();
			})
		},
		methods: {

			// 预览图片
			preview: function (event) {
				if (!event.target.files || !event.target.files[0]) {
					return 
				}

				// // 判断传入类型
				// let reg = /^image\//;
				// if (reg.test(event.target.files[0].type)) {
				// 	let reader = new FileReader();
				// 	reader.onload = function (ev) {
				// 		$("#tempImgLG").prop('src',ev.target.result);
				// 		$("#tempImgMD").prop('src',ev.target.result);
				// 		$("#tempImgSM").prop('src',ev.target.result);
				// 		// $(".tempImg-wrap").css("background-image",'url(' + ev.target.result + ')')
				// 	}
				// 	reader.readAsDataURL(event.target.files[0])
				// } else {
				// 	alert("请上传图片文件！");
				// }
				let $img = $("#tempImgLG");
				let options = {
					aspectRatio: 1,
					viewMode: 2,		
                	preview: '.imgPreview' // 预览图的class名
				};
				let files = event.target;
				let uploadedImageURL;
				let reg = /^image\//;
				// console.log(files.files[0])
				$img.cropper(options);
				if (URL) {
						let file = files.files[0];
						console.log(file)
						if (reg.test(event.target.files[0].type)) {
							if (uploadedImageURL) {
                                URL.revokeObjectURL(uploadedImageURL);
                            }
                            uploadedImageURL = URL.createObjectURL(file);
                            // 销毁cropper后更改src属性再重新创建cropper
                            $img.cropper('destroy').prop('src', uploadedImageURL).cropper(options);
                            $(event.target).val('');
					}
				}

			},

			// 裁剪
			crop : function () {
	        	let  that = this;
				var $image = $('#tempImgLG');
				var $target = $('#userProfile');
				let srcStr = $image.cropper('getCroppedCanvas',{
				    width:300, // 裁剪后的长宽
				    height:300
				}).toDataURL('image/jpeg');
				$target.prop('src', srcStr);

				// 更新到数据库中
				$.post('http://localhost:3001/apis/updateUserProfile', {
					username: sessionStorage.username,
					srcStr: srcStr
				}, function(data, textStatus, xhr) {
					console.log(data);
					if (data.status == 'fail') {
						alert("上传失败")
					} else if (data.status == 'success') {
						alert("上传成功");
						$(".close").trigger('click');
					}
				});
	        }, // crop end

	        initProfile() {
	        	let that = this;
	        	$.get('http://localhost:3001/apis/getUserProfile', {
	        		username: sessionStorage.username
	        	}).then(data => {
	        		
	        		$("#tempImgLG").prop('src', data[0].userProfile)
	        	})
	        }
		}
	}
</script>
<style scoped>
	.edit-userInfo {
		position: absolute;
		display: none;
		top: 0;
		right: 0;
		width: 30px;
	}
	.img-wrap {
		display: inline-block;
		position: relative;
		width: 150px;
		height: 150px;
	}
	.img-wrap img:first-child {
		width: 100%;
	}
	#file {
		position: absolute;
		opacity: 0;
		z-index: 2;
		width: 32px;
		left: 60px;
		bottom: 14px;
	}
	.img-wrap:hover > .edit_photo {
		display: inline-block;
	}
	.edit_photo {
		display: none;
		position: absolute;
		bottom: 10px;
		left: 60px;
	}
	.file-label {
		padding: 4px 8px;
		background-color: #41B886;
		color: #FFF;
	}
	.modal-body {
		height: 230px;
		padding: 10px;
	}
	.tempImg-wrap {
		height: 240px;
		overflow: hidden;
		/*background-size: 100%;
		background-size: cover;*/
	}
	.tempImg img {
		width: 100%;
	}
	#tempImgLG {
		width: 200px;
		height: 200px;
	}
	.info-null {
		color: #e9733a !important;
		font-size: 14px !important;
	}
	.modal-body {
		height: auto;
	}
    .imgPreview {
    	overflow: hidden;
		width: 150px;
		height: 150px;
    }
	.imgPreviewRound {
		border-radius: 50%;
		width: 70px;
		height: 70px;
	}
</style>