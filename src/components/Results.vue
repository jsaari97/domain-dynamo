<template>
  <div class="form-container">
    <container>
      <router-link to="/">
        <svg class="settings">
          <use :xlink:href="require('../assets/sprite.svg') + '#ic_close_black_24px'"></use>
        </svg>
      </router-link>
      <p class="suggestion-count">{{ suggestions.length }}</p>
      <div class="results" v-if="suggestions.length !== 0">
        <div class="suggestion-container">
          <h2 class="suggestion">{{ this.suggestions[0].split('.')[0] }}</h2>
        </div>
        <span class="res-icon undo" @click="Undo()">
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

      <div v-else class="settings-container">
        <h2 class="settings-title">No more suggestions.</h2>
        <router-link to="/"><button>New Query</button></router-link>
        <router-link to="/favorites"><button>View Favorites</button></router-link>
      </div>
      
    </container>
    <fav-button></fav-button>
  </div>
</template>

<script>
import Container from './Container.vue'
import FavButton from './FavButton.vue'

export default {
  components: {
    'container': Container,
    'fav-button': FavButton
  },
  computed: {
    suggestions () {
      return this.$store.state.suggestions
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
      if (this.suggestions.length !== 0) {
        if (event.key === 'ArrowLeft') {
          this.Dislike()
        } else if (event.key === 'ArrowRight') {
          this.Like()
        }
      }
    },
    Like: function() {
      this.$store.dispatch('Like')
    },
    Dislike: function() {
      this.$store.dispatch('Dislike')
    },
    Undo: function() {
      this.$store.dispatch('Undo')
    },
    MoreNames: function() {
      if (this.$store.state.suggestions.length < 20 && this.$store.state.unprocessed.length !== 0) {
        this.$store.dispatch('getNames')
      }
    }
  }
}
</script>