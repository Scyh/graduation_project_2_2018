<template>
	<main>
		<div class="container">
			<div class="row">
				<div class="col-md-9">
					<router-view></router-view>
				</div>
				<div class="col-md-3">
					
				</div>
			</div>
		</div>
	</main>
</template>
<script>
	import canteen from './canteen.vue'
	export default {
		data() {
			return {
				isCanteen: false
			}
		},
		methods: {

		},
		watch: {
			$route(to, from) {
				if (to.name == 'canteen') {
					this.isCanteen = true
				} else {
					this.isCanteen = false
				}
			}
		},
		components: {
			canteen,
		}
	}
</script>
<style scoped>
	main {
		width: 100%;
		min-height: 800px;
		background-color: #EBEBEB;
	}
</style>