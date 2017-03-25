<template>
  <container>
    <router-link :to="route">
      <svg class="settings">
        <use :xlink:href="require('../assets/sprite.svg') + '#ic_close_black_24px'"></use>
      </svg>
    </router-link>
    <div class="favorites-container">
      <h2 class="favorites-header">Favorites</h2>
      <div class="favorites-table">
        <div class="item-container" v-for="item in favorites">
          <p class="item-name">{{ item }}</p>
        </div>
      </div>
      <router-link to="/filter" class="filter-button">
        <button>Filter Favorites</button>
      </router-link>
    </div>
  </container>
</template>

<script>
import Container from './Container.vue'

export default {
  components: {
    'container': Container
  },
  computed: {
    favorites() {
      return this.$store.state.favorites
    },
    route() {
      if (this.$store.state.suggestions.length !== 0) {
        return '/results'
      }
      return '/'
    }
  }
}
</script>