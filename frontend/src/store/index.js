import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './modules/auth'
import * as resources from './modules/resources'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    auth, resources
  }
})
