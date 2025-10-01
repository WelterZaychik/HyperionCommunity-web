import Vue from 'vue'
import Vuex from 'vuex'
// import * as getters from './getters.js'

Vue.use(Vuex)

/** 状态定义 */
export const state = {
  themeObj: 0,//主题
  keywords:'',//关键词
  baseURL:'http://localhost:6689/'
}

export default new Vuex.Store({
    state,
})
