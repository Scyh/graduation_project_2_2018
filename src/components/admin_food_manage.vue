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
							<td :id="item._id">
								<button class="btn btn-primary" data-toggle="modal" data-target="#admin_check_food_modal" @click="showModal(false,$event)">查看</button>&nbsp;&nbsp;
								<button class="btn btn-warning" data-toggle="modal" data-target="#admin_check_food_modal" @click="showModal(true,$event)">修改</button>&nbsp;&nbsp;
								<button class="btn btn-danger" @click="delFood">删除</button></td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<nav>
					    <ul class="pagination">
					    	<li class="prev" @click="loadFood('prev')"><span>&laquo;</span></li>
					    	<li><span>第{{ page }} / {{ maxPage }}页</span></li>
					    	<li class="next" @click="loadFood('next')"><span>&raquo;</span></li>
					    </ul>
					</nav>
				</tfoot>
			</table>
			<add-new-food  v-else-if="index == 1" ></add-new-food>
		</div>
		<admin-check-food-modal></admin-check-food-modal>
	</div>
</template>
<script>
	import publicCanteenHead from './admin_public_canteen_head.vue'
	import addNewFood from './addNewFood.vue'
	import adminCheckFoodModal from './admin_check_food_modal.vue'

	import bus from '../bus.js'

	export default {
		data() {
			return {
				foods: [],
				index: 0,
				page: 1,
				maxPage: 1,
			}
		},
		mounted() {
			this.init();
			this.getFoodCount();
			bus.$on('switchIndex', val => {
				this.index = val;
			});
			bus.$on('changeSuccess', () => {
				this.getFoods();
			})
		},
		destroyed() {
			bus.$off('switchIndex');
			bus.$off('changeSuccess')
		},
		methods: {

			// 获取 菜品
			getFoods() {
				let that = this;
				that.foods = [];
				$.get('http://localhost:3001/apis/getFoods', {
					canteen: $('.selected').data('canteenid'),
					page: that.page
				}).then(data => {
					that.foods = data
				}).catch(err => {
					console.log(err)
				})
			},

			getFoodCount() {
				let that = this;
				$.get('http://localhost:3001/apis/admin/getFoodCount', {
					canteen_id: $('.selected').data('canteenid')
				}).then(data => {
					if (data.status == 'success') {
						that.maxPage = Math.ceil(data.count / 6);
					}
				})
			},

			init(val) {
				this.page = 1;
				this.getFoods();
				this.getFoodCount();
			},

			// 将菜品id 传送给模态框
			showModal(reEdit, ev) {
				bus.$emit('transferFoodId', {
					'reEdit': reEdit,
					food_id: $(ev.target).parent().prop('id')
				})
			},

			// 加载更多菜品
			loadFood(type) {
				if (type == 'prev' && this.page > 1) {
					this.page--;
				} else if (type == 'next' && this.page < this.maxPage) {
					this.page++;
				}
				this.getFoods();
			},

			delFood(ev) {
				let result = confirm('确认删除？');
				if (result) {
					$.post('http://localhost:3001/apis/admin/delOneFood', {
						food_id: $(ev.target).parent().prop('id')
					}).then(data => {
						if (data.status == 'success') {
							alert('删除成功');
							this.getFoods();
						}
					}).catch(err => {
						console.log(err)
					})
				}
			}
		},
		components: {
			publicCanteenHead,
			addNewFood,
			adminCheckFoodModal
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
