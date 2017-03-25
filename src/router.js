import Vue from 'vue'
import VueRouter from 'vue-router'
import Favorites from './components/Favorites.vue'
import Form from './components/Form.vue'
import Settings from './components/Settings.vue'
import Results from './components/Results.vue'
import Filter from './components/FavFilter.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Form },
  { path: '/favorites', component: Favorites },
  { path: '/settings', component: Settings },
  { path: '/results', component: Results },
  { path: '/filter', component: Filter }
]

export default new VueRouter({
  mode: 'history',
  base: 'domain',
  routes
})
