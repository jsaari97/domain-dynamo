<template>
  <container>
    <router-link to="/">
      <svg class="settings">
        <use :xlink:href="require('../assets/sprite.svg') + '#ic_close_black_24px'"></use>
      </svg>
    </router-link>
    <div class="settings-container">
      <h2 class="settings-title">Settings</h2>
      <button @click="DeleteFavorites">Delete Favorites</button>
      <button @click="DeleteRejected">Reset Rejected</button>
    </div>
  </container>
</template>

<script>
import Container from './Container.vue'

export default {
  data() {
    return {
      svg: this.$store.state.svg
    }
  },
  methods: {
    DeleteFavorites: function() {
      this.$store.commit('DELETE_FAVORITES')
    },
    DeleteRejected: function() {
      this.$store.commit('DELETE_REJECTED')
    }
  },
  components: {
    'container': Container
  }
}
</script>