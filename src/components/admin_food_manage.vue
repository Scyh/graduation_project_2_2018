<template>
	<div class="admin-food-manage">
		<public-canteen-head v-if="index == 0" v-on:transfer="init"></public-canteen-head>
		<div class="food-manage-body">
			<table v-if="index == 0" class="table table-hover">
				<thead>
					<tr>
						<th>#</th>
						<th>菜品名</th>
						<th>封面</th>
						<th>地址</th>
						<th>操作</th>
					</tr>
				</thead>
				<tbody>
					<template v-for="(item, index) in foods">
						<tr>
							<td>{{ index + 1 }}</td>
							<td>{{ item.food_name }}</td>
							<td>
								<img v-if="!item.food_cover_img" class="img-responsive" src="../assets/images/no_image.jpg">
								<img v-else :src="item.food_cover_img" class="img-responsive">
							</td>
							<td>{{ item.food_belongsTo | switchCanteen }}</td>
							<td><button class="btn btn-primary">查看</button>&nbsp;&nbsp;<button class="btn btn-danger">删除</button></td>
						</tr>
					</template>
				</tbody>
			</table>
			<add-new-food  v-else-if="index == 1" ></add-new-food>
		</div>

	</div>
</template>
<script>
	import publicCanteenHead from './admin_public_canteen_head.vue'
	import addNewFood from './addNewFood.vue'
	import bus from '../bus.js'

	export default {
		data() {
			return {
				foods: [],
				index: 0,
				page: 1,
			}
		},
		mounted() {
			this.init();
			bus.$on('switchIndex', val => {
				this.index = val;
			})
		},
		destroyed() {
			bus.$off('switchIndex');
		},
		methods: {

			// 获取 菜品
			getFoods() {
				let that = this;
				$.get('http://localhost:3001/apis/getFoods', {
					canteen: $('.selected').data('canteenid'),
					page: that.page
				}).then(data => {
					that.foods = data
				}).catch(err => {
					console.log(err)
				})
			},

			init(val) {
				console.log(val)
				this.page = 1;
				this.getFoods();
			}
		},
		components: {
			publicCanteenHead,
			addNewFood
		}
	}
</script>
<style scoped>
	tbody img {
		width: 60px;
		height: 60px;
	}
	tbody td {
		vertical-align: middle;
	}
</style>
