<template>
	<div id="admin_User_Manage">
		<table class="table table-page">
			<thead>
				<tr>
					<td>Page：{{currentPage}}</td>
				</tr>
				<tr>
					<th>#</th>
					<th>头像</th>
					<th>用户名</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="(item, index) in user">
					<tr class="user-info" :id="item._id" :data-permission="item.permission">
						<td>{{ index + 1 }}</td>
						<td>
							<img v-if="item.userProfile" :src="item.userProfile" />
				    		<img v-else src="../assets/index.png" />
						</td>
						<td id="username">{{ item.username }}</td>
						<td><button class='btn btn-danger' :data-id="item._id" @click="deleteUser($event)">删除</button>
						</td>
					</tr>
				</template>
			</tbody>
		</table>

		<nav>
			<ul class="pagination">
			    <li>
				    <a href="javascript:void(0)"  @click="change('prev')" title="前一页">
			        <span class="glyphicon glyphicon-chevron-left"></span>
			    	</a>
			    </li>
			    <li><span>第{{ currentPage }}/{{ maxPage }}页</span></li>
			    <li>
				    <a href="javascript:void(0)" @click="change('next')" title="后一页">
			        <span class="glyphicon glyphicon-chevron-right"></span>
			      </a>
			    </li>
		    </ul>
		</nav>	<!-- 切换分页 end -->

		<div class="modal fade bs-example-modal-sm" tabindex="-1" id="confirmModal">
		    <div class="modal-dialog modal-sm" role="document">
		        <div class="modal-content">
		     		<div class="modal-body">
		     			<p>确认删除？</p>
		     		</div>
		     		<div class="modal-footer">
		     			<button type="button" class="btn btn-default" id="cancleDelUser" data-dismiss="modal">取消</button>
        				<button type="button" class="btn btn-primary" id="confirmDelUser" @click="deleteUser($event)" >确认</button>
		     		</div>
		    	</div>
		    </div>
		</div>	<!-- 确认删除 modal end-->
	</div>
</template>
<script>
	import bus from '../bus.js'

	export default {
		data() {
			return {
				user:[],
				count: 0,
				currentPage: 1,
				maxPage: 1,
			}
		},
		mounted() {
			sessionStorage.userPage = 1;
			this.currentPage = 1;
			this.init(this.currentPage);
		},
		methods: {

			init(page) {
				let that = this;
				that.user = [];
				this.currentPage = page;
				$.get('http://localhost:3001/apis/admin/getUserInfo', {
					page: page
				}, function(data) {
					data.users.forEach((item, index) => {
						if (item.username == 'admin') {
							return
						} else {
							that.user.push(item);
						}
					})
					that.maxPage = Math.ceil(data.count / 6);
				});
			},	// init end

			// 传参
			transfer(event) {
				bus.$emit("transferUserName", $(event.target).parent().siblings("#username").text())
			},

			change(type) {
				if (type == 'prev' && this.currentPage > 1) {
					this.currentPage--;
				} else if (type == 'next' && this.currentPage < this.maxPage) {
					this.currentPage++;
				}
				this.init(this.currentPage);
			},	// change end
			
			deleteUser(event) {
				let that = this;
				$.post('http://localhost:3001/apis/admin/deleteUser', {
					id: $(event.target).data().id
				}, function(data, textStatus, xhr) {
					if (data.status == 'success') {
						alert("删除用户成功");
						$("#cancleDelUser").trigger('click');
						that.init(that.currentPage)
					}
				});
			},	// deleteUser end			
		},
		components: {
		}
	}
</script>
<style scoped>
	.user-info img{
		width: 50px;
		border-radius: 50%;
	}
	.user-info td {
		line-height: 40px;
	}
	.refresh {
		margin-left: 30px;
		cursor: pointer;
	}
	thead tr:first-child {
		display: inline-block;
		padding-bottom: 15px;
		font-size: 18px;
	}
	#search {
		position: absolute;
		border-radius: 5px;
		box-shadow: none;
		font-weight: normal;
	}
	::-webkit-input-placeholder {
    	color: #999;
    	font-size: 14px;
 	}
    :-moz-placeholder {
    	color: #999;
    	font-size: 14px;
    }
  	::-moz-placeholder {
    	color: #999;
    	font-size: 14px;
  	}
  	:-ms-input-placeholder {
    	color: #999;
    	font-size: 14px;
  	}
</style>