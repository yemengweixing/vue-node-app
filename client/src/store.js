import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_IS_AUTNENTIATED: 'SET_IS_AUTNENTIATED', // 是否认证通过
  SET_USER: 'SET_USER' // 用户信息
}

const state = { // 需要维护的状态
  isAutnenticated: false,  // 是否认证
  user: {}   // 存储用户信息
}

const getters = { //获取state里的数据
  isAutnenticated: state => state.isAutnenticated,//获取用户状态
  user: state => state.user  //获取用户信息
}

const mutations = {
  [types.SET_IS_AUTNENTIATED](state, isAutnenticated) {
    if (isAutnenticated)
      state.isAutnenticated = isAutnenticated  //state.里面的isAutnenticated 被更新为getters得到的isAutnenticated
    else
      state.isAutnenticated = false
  },
  [types.SET_USER](state, user) {
    if (user)
      state.user = user
    else
      state.user = {}
  }
}

const actions = {
  setIsAutnenticated: ({ commit }, isAutnenticated) => {
    commit(types.SET_IS_AUTNENTIATED, isAutnenticated)
  },
  setUser: ({ commit }, user) => {
    commit(types.SET_USER, user)
  },
  clearCurrentState: ({ commit }) => {  //退出    
    commit(types.SET_IS_AUTNENTIATED, false)//state 真 变成 加
    commit(types.SET_USER, null)//state 清空
  }
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
