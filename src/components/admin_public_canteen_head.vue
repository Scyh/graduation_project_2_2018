<template>
	<div class="canteen-comments-manage-head">
			<ul>
				<span>选择食堂：</span>
				<li data-canteenid='1001' class="selected" @click="init">仁苑</li>
				<li data-canteenid='1002' @click="init">爱苑</li>
				<li data-canteenid='1003' @click="init">义苑</li>
				<li data-canteenid='1004' @click="init">平苑</li>
			</ul>
		</div>
</template>
<script>
	export default {
		methods: {
			init(ev) {
					$(ev.target).addClass('selected').siblings().removeClass('selected');
				this.$emit('transfer', $(ev.target).data('canteenid'))
			}
		}
	}
</script>
<style scoped>
	.canteen-comments-manage-head li {
		padding: 15px;
		font-size: 18px;
	}
	.canteen-comments-manage-head li:not(:first-child) {
		color: #3879D9;
		cursor: pointer;
	}
	.selected {
		color: rgba(240, 0, 0, 0.5) !important;
	}
	.pagination li {
		cursor: pointer;
	}
</style>