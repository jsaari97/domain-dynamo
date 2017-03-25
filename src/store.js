import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'

import state from './store/state'
import mutations from './store/mutations'
import * as getters from './store/getters'
import * as actions from './store/actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  plugins: [createPersistedState({
    paths: ['favorites', 'rejected']
  })]
})
