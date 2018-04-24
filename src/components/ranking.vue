<template>
	<div class="container ranking">
		<div class="container">
			<div class="row">
				<div class="col-md-9 col-lg-9">
					<table class="table table-hover table-rank">
						<thead>
							<tr>
								<th>美食</th>
								<th>预览</th>
								<th class="showRanging" @click="changeRanking">评分<span class="glyphicon glyphicon-arrow-up"></span></th>
								<th>人均￥</th>
								<th>所属食堂</th>
							</tr>
						</thead> 
						<tbody>
							<!-- <tr>
								<td>烤猪蹄</td>
								<td>
									<img src="../assets/images/1.jpg" alt="">
								</td>
								<td>4.2</td>
								<td>￥11</td>
								<td>仁苑</td>
							</tr> -->
							<template v-for="food in foods">
								<tr>
									<td>{{ food.food_name }}</td>
									<td>
										<img v-if="!food.food_cover_img" src="../assets/images/no_image.jpg" alt="">
										<img v-else :src="food.food_cover_img" alt="">
									</td>
									<td>{{ food.food_star }}分</td>
									<td>{{ food.food_price }}</td>
									<td>{{ food.food_belongsTo | switchCanteen }}</td>
								</tr>
							</template>
						</tbody>
					</table>
				</div>
			</div>

			<div class="row">
				<div class="col-lg-2 col-lg-offset-4">
					<div class="more">
						<span v-if="hasMore" class="hasMore" @click="moreRankingFood">点击加载更多</span>
						<span v-else>不能加载更多啦！！</span>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				foods: [],
				ranking: 'asc',
				rankingPage: 1,
				hasMore: true,
			}
		},
		mounted() {
			this.foods = [];
			this.initRanking(this.ranking);
		},
		methods: {

			// 初始化
			initRanking(ranking, page) {
				let that = this;
				$.get('http://localhost:3001/apis/getFoodByStar', {
					ranking: ranking,
					rankingPage: page
				}).then(data => {
					data.length > 0 ? that.hasMore = true : that.hasMore = false;
					for(let i in data) {
						that.foods.push(data[i]);
					}
				})
			},

			moreRankingFood() {
				this.rankingPage ++;
				this.initRanking(this.ranking, this.rankingPage);
			},

			// 改变排序顺序
			changeRanking(ev) {
				let flag = this.ranking == 'asc';
				// if (flag) {
					flag ? $(".showRanging span").removeClass('glyphicon-arrow-up').addClass('glyphicon-arrow-down') : $(".showRanging span").removeClass('glyphicon-arrow-down').addClass('glyphicon-arrow-up')
				// } 
				flag ? this.ranking = 'desc' : this.ranking = 'asc';
				this.foods = [];
				this.rankingPage = 1;
				this.initRanking(this.ranking, this.rankingPage);

			}
		},
	}
</script>
<style scoped>
	.table-rank {
		margin-top: 25px;
		font-size: 18px;
		color: #333;
	}
	td,
	th {
		text-align: center;
	}
	.table-rank tbody td{
		padding: 15px 0;
		vertical-align: middle;
	}
	td img {
		width: 70px;
		border-radius: 50%;
	}
</style>