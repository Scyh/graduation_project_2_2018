<template>
	<div class="admin_updata_canteen_imgs">

		<public-canteen-head v-on:transfer="init"></public-canteen-head>
		<div class="updata-body">
			<ul>
				<template v-for="item in imgsArr">
					<li>
						<span @click="delImg">x</span>
						<img :src="item" alt="图片走丢了">
					</li>
				</template>	
			</ul>
			
		</div>
		<div class="updata-foot">
			<upload></upload>
			<hr>
			<button class="btn btn-primary" @click="confirm">确认修改</button>
		</div>
	</div>	
</template>
<script>
	import publicCanteenHead from './admin_public_canteen_head.vue'
	import upload from './upload.vue'

	export default {
		data() {
			return{
				imgsArr: []
			}
		},
		mounted() {
			this.getImgs('1001')
		},
		methods: {

			// 获取图片
			getImgs(canteen_id) {
				let that = this;
				$.get('http://localhost:3001/apis/admin/getCanteenImgs', {
					canteen_id: canteen_id
				}).then(data => {
					that.imgsArr = data[0].canteen_imgs;
				}).catch(err => {
					console.log(err);
				})
			},

			init(val) {
				this.getImgs(val);
			},

			// 删除图片
			delImg(ev) {
				var result = confirm('确认删除么？')
				if (result) {
					$(ev.target).parent().remove();
				}
			},

			// 确认修改，并上传图片
			confirm() {
				if ($(".selected").length <= 0) {
					alert('尚未选择食堂');
					return 
				} else {
					var result = confirm('确认上传并更新图片？');
					if (result) {
						let newArr1 = [];
						let newArr2 = [];
						let canteen_id = $(".selected").data('canteenid');
						// 获取新上传的照片
						let p = new Promise((reslove, reject) => {
							if ($(".upload-preView img").length <= 0 ) {
								reslove('success')
							} else {
								$(".upload-preView img").each(function(index, el) {
									let img = {}
									img.name = canteen_id + el.name;
									img.src = $(el).prop('src').replace(/^data:image\/\w+;base64,/, ''),
									newArr1.push(img);
									$.post('http://localhost:3001/apis/uploadImg', {
										imgArr: JSON.stringify(newArr1)
									}).then(data => {
										let imgObj = JSON.parse(data.imgsURL)
										for(let i in imgObj) {
											newArr2.push(imgObj[i]);
										}
										reslove('success')
									}).catch(err => {
										console.log(err);
										reject('fail')
									})
								}); // end
							}
						})

						p.then(() => {

							// 放入旧照片
							$(".updata-body li img").each(function(index, el) {
								newArr2.push($(el).prop('src'))
							});
							// console.log(newArr2)


							// 更新食堂照片
							$.post('http://localhost:3001/apis/admin/updateCanteenImgs', {
								canteen_id: canteen_id,
								canteen_imgs: JSON.stringify(newArr2)
							}).then(data => {
								console.log(data)
								alert('更新成功');
								$(".selected").trigger('click');
								$(".upload-preView").empty();
							}).catch(err => {
								alert('更新失败1')
							})
							// console.log(newArr2)
						}).catch((err) => {
							alert(err + "更新失败2")
						})

					}
				}
			},
		},
		components: {
			upload,
			publicCanteenHead
		}
	}
</script>
<style scoped>
	.updata-body {
		min-height: 200px;
	}
	.updata-body li {
		position: relative;
		border: 1px dashed #ccc;
		margin: 10px;
	}
	.updata-body li span{
		position: absolute;
		top: 0;
		right: 5px;
		color: #ccc;
		font-size: 22px;
		cursor: pointer;
	}
	.updata-body img {
		display: inline-block;
		margin: 20px;
		width: 120px;
		height: 120px;
	}
</style>