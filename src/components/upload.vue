<template>
	<div id="upload">
		<div class="container-fluid">
			<div class="row">
				<div class="col-lg-2">
					<div class="upload-wrap" title="上传图片">
						<input type="file" multiple class="upload" @change="upload">
						<div class="upload-face">
							<img src="../assets/upload.png" alt="上传文件">
						</div>
					</div>
				</div>
				<div class="col-lg-6">
					<div class="upload-preView"></div>
				</div>
				<!-- <div class="col-lg-1" v-show="hasUpload">
					<button class="btn btn-upload" @click="confirmUpload">确认上传</button>
				</div> -->
			</div>
		</div>
	</div>
</template>
<script>

	export default {
		data() {
			return {
				hasUpload: 0
			}
		},
		methods: {

			// 上传并预览图片
			upload(ev) {
				let files = ev.target.files;	// 上传的文件
				let length = files.length;		// 上传文件的长度
				let exist = $(".preView").length;	// 已经上传的文件
				let arr = [];

				if ((length + exist) > 3) {
					alert("最多只能上传三张图片");
				} else {
					for(let i = 0; i < length; i++) {
						let reader = new FileReader();	// 新建FileReader对象	
						reader.readAsDataURL(files[i])
						reader.onload = ev => {
							var preViewItem = document.createElement('div');
							preViewItem.classList.add('preView');
							// var img = `<img src="${reader.result}" />`;
							var img = new Image();
							img.src = reader.result;
							// img.name = sessionStorage.username + '_' + files[i].lastModified + '_' + files[i].name;
							sessionStorage.username !== 'undefined' ? img.name =  sessionStorage.username + '_' + files[i].lastModified + '_' + files[i].name : img.name = 'admin'+ '_' + files[i].lastModified + '_' + files[i].name ;
							preViewItem.appendChild(img)
							var span = document.createElement('span');
							$(span).addClass('del-img glyphicon glyphicon-remove');
							span.addEventListener('click', ev => {
								let $target = $(ev.target);
								// console.log($(ev.target).parent())
								$target.parent().parent('.upload-preView').get(0).removeChild($target.parent().get(0))
								this.hasUpload --;
							} );
							preViewItem.appendChild(span)
							$(".upload-preView").append(preViewItem)
						}
						reader.onloadend = ev=> {
							this.hasUpload ++
						}
					}
				}
			},

			// 确认上传
			confirmUpload() {
			}
		},

	}
</script>
<style scoped>
	.upload-wrap {
		position: relative;
		margin-top: 25px;
		width: 160px;
		height: 160px;
		/*overflow: hidden;*/
	}
	.upload {
		width: 160px;
		height: 160px;
		border: 1px solid #ccc;
		box-sizing: border-box;
		cursor: pointer;
		position: absolute;
		z-index: 2;
		opacity: 0;
	}
	.upload-face {
		position: absolute;
		top: 0px;
		left: 0px;
		padding: 20px;
		z-index: 1;
		border: 1px dashed #bbb;
	}
	.upload-preView {
		margin-top: 21px;
	}
	.btn-upload {
		margin-top: 140px;
	}
</style>