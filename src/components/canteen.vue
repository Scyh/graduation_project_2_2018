<template>
		<div class="canteen">
			<div class="container">
				<div class="row">
					<div class="col-lg-9">
						<div class="row">
							<template v-for="food in foods">
								<div class="col-xs-12 col-sm-6 col-lg-4">
									<div class="card">
										<div class="card-head">
											<router-link :to="'/canteen/' + food.food_belongsTo + '/' + food._id">
												<img v-if="!food.food_cover_img" class="img-responsive" src="../assets/images/no_image.jpg">
												<img v-else :src="food.food_cover_img" class="img-responsive">
											</router-link>
										</div>
										<div class="card-body">
											<p>{{ food.food_brief }}</p>
										</div>
										<div class="card-footer">
											<starCount :width='food.food_star / 5 * 85.56'></starCount>
											<span>{{ food.food_star }}分</span>
											<span class="price">人均￥ {{ food.food_price }}元</span>
										</div>
									</div>	
								</div>
							</template>
						</div>
					</div>
					<div class="col-lg-3">
						<cusAside></cusAside>	
					</div>
				</div>
				
				<div class="row">
					<div class="col-lg-2 col-lg-offset-4">
						<div class="more">
							<span v-if="hasMore" class="hasMore" @click="moreFood">点击加载更多</span>
							<span v-else>不能加载更多啦！！</span>
						</div>
					</div>
				</div>

			</div>
		</div>
</template>
<script>
	import cusAside from './aside.vue'
	import starCount from './star_count.vue'
	export default {
		data() {
			return {
				foods: [],
				page: 1,
				hasMore: true,
			}
		},
		watch: {
			$route(to, from) {
				if (to.name == 'canteen') {
					// console.log(to.params.id)
					this.foods = [];
					this.hasMore = true;
					this.page = 1;
					this.initCanteen(this.$route.name && this.$route.params.id, 1);
				}
			}
		},
		mounted() {
			this.page = sessionStorage.canteenPage = 1;
			this.initCanteen(this.currentCanteen, this.page);
		},
		computed: {
			currentCanteen() {
				return this.$route.name && this.$route.params.id
			}
		},
		methods: {
			// 初始化 菜品列表, 所属食堂, 加载更多
			initCanteen(canteen, page) {
				let that = this;
				$.get('http://localhost:3001/apis/getFoods', {
					canteen: canteen,
					page: page
				},function(data) {
					data.length > 0 ? that.hasMore = true : that.hasMore = false
					for(let i in data) {
						that.foods.push(data[i])
					}
				});
			},

			// 加载更多
			moreFood() {
				this.page++;
				this.initCanteen(this.currentCanteen, this.page);
			},
		},
		components: {
			cusAside,
			starCount
		}
	}
</script>
<style scoped>
	.canteen {
		padding-top: 20px;
	}
	.card {
		margin: 10px;
		padding: 15px 10px;
		text-align: center;
		box-shadow: 2px 2px 8px #ccc;
		cursor: pointer;
	}
	.card-head {
		width: 100%;
		height: 272.48px;
		text-align: center;
	}
	.card-body p{
		height: 40px;
		overflow: hidden;
		text-overflow:ellipsis;
		/*white-space: nowrap;*/
	}
	.card-footer {
		text-align: left;
	}
	.price {
		float: right;
		margin-right: 7px;
	}
	
</style>