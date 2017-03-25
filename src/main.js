/* eslint-disable*/

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/main.scss'

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
