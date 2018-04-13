<template>
	<div class="star-count" @click="marking">
		<ul class="bg-star">
			<li><i data-parent="bg" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="bg" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="bg" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="bg" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="bg" class="glyphicon glyphicon-star"></i></li>
		</ul>
		<ul class="real-star" :style="'width: ' + width + 'px'" :class="{changeColor: isCanteen}">
			<li><i data-parent="real" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="real" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="real" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="real" class="glyphicon glyphicon-star"></i></li>
			<li><i data-parent="real" class="glyphicon glyphicon-star"></i></li>
		</ul>
	</div>
</template>
<script>
	export default {
		props: {
			width: {
				default: 0
			},
			canClick: {
				default: false
			},
			isCanteen: {
				default: false
			}
		},
		methods: {
			marking(ev) {
				if (this.canClick) {
					let $target = $(ev.target)
					let parent = $target.data('parent')
					if (parent == 'bg') {
						$target.parents('.bg-star').next('.real-star').width(($target.parent().index() + 1) / 5 * 85.56);
					} else if (parent == 'real') {
						$target.parents('.real-star').width(($target.parent().index() + 1) / 5 * 85.56);
					}
				} else {
					console.log("不能点击")
				}
			}
		}
	}
</script>
<style scoped>
	/* 星级评分 */
.star-count {
  position: relative;
  display: inline-block;
} 
.star-count ul {
      white-space: nowrap;
}
.star-count ul li {
  display: inline-block;
}
.glyphicon-star {
  color: #c3c3c3;
}
.real-star .glyphicon-star {
  color: #F90;
}
.real-star.changeColor i{
	color: #e31b1b;
}
.real-star {
  position: absolute;
  top: 0;
  overflow: hidden;
  width: 0;
}
</style>