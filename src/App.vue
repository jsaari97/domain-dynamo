<template>
  <div class="app">
    <app-header></app-header>
    <router-view></router-view>
    <div class="back"></div>
    <p class="copyright">&copy; Jim Saari 2017</p>
  </div>
</template>

<script>
import Header from './components/Header.vue'
export default {
  components: {
    'app-header': Header
  }
}
</script>
