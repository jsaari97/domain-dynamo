<template>
  <div class="form-container">
    <container>
      <router-link to="/favorites">
        <svg class="settings">
          <use :xlink:href="require('../assets/sprite.svg') + '#ic_close_black_24px'"></use>
        </svg>
      </router-link>
      <div class="results">
        <div class="suggestion-container">
          <h2 class="suggestion">{{ this.favorites[0] }}</h2>
        </div>
        <span class="res-icon undo" @click="Undo()" v-if="undo.length !== 0">
          <svg>
            <use :xlink:href="require('../assets/sprite.svg') + '#ic_undo_black_24px'"></use>
          </svg>
        </span>
        <span class="res-icon dislike" @click="Dislike()">
          <svg>
            <use :xlink:href="require('../assets/sprite.svg') + '#ic_thumb_down_black_24px'"></use>
          </svg>
        </span>
        <span class="res-icon like" @click="Like()">
          <svg>
            <use :xlink:href="require('../assets/sprite.svg') + '#ic_thumb_up_black_24px'"></use>
          </svg>
        </span>
      </div>
    </container>
  </div>
</template>

<script>
import Container from './Container.vue'

export default {
  components: {
    'container': Container
  },
  data() {
    return {
      undo: []
    }
  },
  computed: {
    favorites() {
      return this.$store.state.favorites
    }
  },
  created() {
    window.addEventListener('keydown', this.ArrowEvent, false)
  },
  beforeRouteLeave (to, from, next) {
    window.removeEventListener('keydown', this.ArrowEvent, false)
    next()
  },
  methods: {
    ArrowEvent: function(event) {
      if (this.favorites.length !== 0) {
        if (event.key === 'ArrowLeft') {
          this.Dislike()
        } else if (event.key === 'ArrowRight') {
          this.Like()
        }
      }
    },
    Like: function() {
      this.favorites.shift()
    },
    Dislike: function() {
      this.undo.push(this.favorites[0])
      this.$store.commit('REMOVE_FAVORITE', this.favorites[0])
    },
    Undo: function() {
      if (this.undo.length !== 0) {
        this.$store.commit('INSERT_FAVORITE', this.undo.pop())
      }
    }
  }
}
</script>