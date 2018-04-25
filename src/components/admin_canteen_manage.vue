<template>
	<div class="admin-canteen-manage">
		<table v-if="index == 0" class="table table-hover">
		    <thead>
		  	    <tr>
			  		<th>#</th>
			  		<th>食堂</th>
			  		<th>地址</th>
			  		<th>总评分</th>
			  		<th>服务评分</th>
			  		<th>环境评分</th>
		  		</tr>
		  	</thead>
		  	<tbody>
		  		<template v-for="(item, index) in canteens">
		  			<tr>
		  				<td>{{ index + 1 }}</td>
		  				<td>{{ item.canteen_id | switchCanteen }}</td>
		  				<td>{{ item.location }}</td>
		  				<td>{{ item.overall_score }}</td>
		  				<td>{{ item.service_score }}</td>
		  				<td>{{ item.environmental_score }}</td>
		  			</tr>
		  		</template>
		  	</tbody>
		</table>
		<updata-canteen-imgs v-else-if="index == 1"></updata-canteen-imgs>
		<canteen-comments-manage v-else-if="index == 2"></canteen-comments-manage>
	</div>
</template>
<script>
	import updataCanteenImgs from './admin_updata_canteen_imgs.vue'
	import canteenCommentsManage from './admin_canteen_comments_manage.vue'
	import bus from '../bus.js'

	export default {
		data() {
			return {
				canteens: [],
				index: 0
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
			init() {
				let that = this;
				$.get('http://localhost:3001/apis/admin/getCanteen').then(data => {
					that.canteens = data;
				}).catch(err => {
					console.log(err)
				})
			}
		},
		components: {
			updataCanteenImgs,
			canteenCommentsManage
		}
	}
</script>