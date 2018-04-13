import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state = {
	login: false,	// 是否登录
	admin: false,	// 是否是管理员登录
}

const getters = {
	hasLogIn: state => state.login,
	isAdmin: state => state.admin,
}

const actions = {
	logIn: ({ commit }) => {
		commit('logIn');
	},
	logOut: ({ commit }) => {
		commit('logOut');
	},

	adminLogIn: ({ commit }) => {
		commit('adminLogIn');
	},
	adminLogOut: ({ commit }) => {
		commit('adminLogOut');
	}
}

const mutations = {
	logIn(state) {
		state.login = true
	},
	logOut(state) {
		state.login = false
	},
	adminLogIn(state) {
		state.admin = true
	},
	adminLogOut(state) {
		state.admin = false
	}
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations
})