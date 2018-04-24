<template>
	<div class="admin-canteen-manage">
		<table class="table table-hover">
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
		  				<td>{{ item.name }}</td>
		  				<td>{{ item.location }}</td>
		  				<td>{{ item.overall_score }}</td>
		  				<td>{{ item.service_score }}</td>
		  				<td>{{ item.environmental_score }}</td>
		  			</tr>
		  		</template>
		  	</tbody>
		</table>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				canteens: []
			}
		},
		mounted() {
			this.init();
		},
		methods: {
			init() {
				let that = this;
				$.get('http://localhost:3001/apis/admin/getCanteen').then(data => {
					console.log(data)
					that.canteens = data;
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>