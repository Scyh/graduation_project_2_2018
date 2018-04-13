<template>
	<nav>
		<div class="head-img"></div>
		<div class="container">
			<div class="row">
				<div class="navbar-header">
					<button type="button" id="btn-collapsed" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav-collapse" aria-expanded="false">				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span>
			    	</button>
				</div>
				<div class="collapse navbar-collapse col-sm-10 col-md-10 col-lg-10" id="nav-collapse">
					<ul class="nav navbar-bar">
						<li>
							<router-link to="/news">饮食资讯</router-link>
						</li>
						<li>
							<router-link to="/canteen/1001">仁苑</router-link>
						</li>
						<li>
							<router-link to="/canteen/1002">爱苑</router-link>
						</li>
						<li>
							<router-link to="/canteen/1003">义苑</router-link>
						</li>
						<li>
							<router-link to="/canteen/1004">平苑</router-link>
						</li>
						<li>
							<router-link to="/compare">排名</router-link>
						</li>
						<li>
							<router-link to="/messageBoard">留言板</router-link>
						</li>
					</ul>
				</div>
				<template v-if='!hasLogIn'>
					<ul class="nav navbar-right nav-form col-xs-4 col-sm-2 col-md-2 col-lg-2">
						<li><a class="btn-login" data-toggle="modal" data-target="#loginModal" href="javascript:void(0);">登录</a></li>
						<li><a class="btn-register" data-toggle="modal" data-target="#registerModal" href="javascript:void(0);">注册</a></li>
					</ul>
				</template>
				<template v-else>
					<ul class="nav navbar-right nav-form col-xs-4 col-sm-2 col-md-2 col-lg-2">
						<li>当前用户：{{ username }}</li>
						<li><a class="btn-logOut" @click="logOut" href="javascript:void(0);">退出</a></li>
					</ul>
				</template>
			</div>
		</div>
		
		<login id="loginModal"></login>
		<register id="registerModal"></register>
	</nav>
</template>
<script>
	import login from './login.vue'
	import register from './register.vue'
	import { mapGetters } from 'vuex'

	export default {
		data() {
			return {
				username: ''
			}
		},
		mounted() {
			if (sessionStorage.username == undefined || sessionStorage.username == '' || sessionStorage.username == 'undefined')  {
		        console.log(sessionStorage.username)
		        console.log("未登录");
		        this.$store.dispatch('logOut');
		    } else {
		        console.log("已登录")
		        console.log(sessionStorage.username);
		        this.username = sessionStorage.username;
		        this.$store.dispatch('logIn');
		    }
		},
		computed: {
			...mapGetters([
				'hasLogIn'
			]),
		},
		methods: {
			 // 退出登录
		    logOut: function() {
				sessionStorage.username = undefined;
				sessionStorage.forbidden = false;
				this.$router.push({path: '/'});
				this.$store.dispatch('logOut');
				// location.reload();
			},
		},
		components: {
			login,
			register
		}
	}
</script>
<style scoped>
	nav {
		border-bottom: 2px solid #e1e1e1;
		text-align: center;
	}
	.head-img {
		width: 100%;
		height: 140px;
		background-image: url(../assets/images/head-img.jpg);
	}
	ul.nav {

	}
	ul.nav li {
		display: inline-block;
		font-size: 15px;
	}
	ul.nav li a {
		padding: 15px 45px;
	}
	@media screen and (max-width: 1200px) {
		ul.nav li a {
			padding: 15px 30px;
		}	
	}
	@media screen and (max-width: 960px) {
		ul.nav li a {
			padding: 15px;
		}	
	}
	ul.nav-form {
		/*line-height: 45px;*/
	}
	ul.nav-form li a {
		padding: 15px 10px;
		outline: none;
		background: 0 0;
	}
	.btn-login:hover,
	.btn-register:hover {
		background: 0 0 !important;
	}
	#btn-collapsed {
		background-color: #eee;
	}
	#btn-collapsed span {
		background-color: #ccc;
	}
	@media screen and (min-width: 768px) {
		#btn-collapsed {
			float: right;
		}
		.nav-form {
			float: left;
		}
	}
</style>