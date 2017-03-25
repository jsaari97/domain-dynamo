<template>
  <div class="form-container">
  <container>
    <router-link to="/settings">
      <svg class="settings">
        <use :xlink:href="require('../assets/sprite.svg') + '#ic_settings_black_24px'"></use>
      </svg>
    </router-link>
    <form>
      <div class="input-container">
        <label>Keywords</label>
        <input type="text" active="true" v-model="input" placeholder="Keywords separated with a space" autofocus></input>
      </div>
      
      <div class="input-container small">
        <label>Synonym</label>
        <input type="text" v-model="synonym" placeholder="Optional, one word"></input>
      </div>
      <div class="gutter"></div>
      <div class="input-container small">
        <label>Domains</label>
        <div class="domains">
          <label class="checked" v-for="domain in suffix">{{ domain }}<input @click="RemoveSuffix($event)" type="checkbox" :value="domain" v-model="suffix"></input></label>

          <span v-if="suffix.length < 3" @click="ShowInput()" class="suffix-icon" :class="{ active: newSuffix }">
            <svg v-if="newSuffix === false">
              <use :xlink:href="require('../assets/sprite.svg') + '#ic_close_black_24px'"></use>
            </svg>
            <input id="suffix-input" v-else type="text" value="" @keyup.enter="AddSuffix($event)" autofocus placeholder="Enter a suffix..."></input>
          </span>
          
        </div>
      </div>
    </form>

    <div class="form-button">
      <button @click="Start()" v-if="processing === false" :disabled="!isDisabled">Generate</button>
      <loader color="#03A9F4" v-else></loader>
    </div>
  </container>

  <fav-button></fav-button>
  
  </div>
</template>

<script>
import Container from './Container.vue'
import FavButton from './FavButton.vue'
import Loader from 'vue-spinner/src/RotateLoader.vue'

export default {
  data() {
    return {
      input: '',
      synonym: '',
      processing: false,
      newSuffix: false
    }
  },
  computed: {
    isDisabled() {
      return this.input.length > 2 && this.suffix.length !== 0
    },
    suffix() {
      return this.$store.state.suffix
    }
  },
  created() {
    this.input = this.$store.state.input
    this.synonym = this.$store.state.synonym
  },
  methods: {
    Start: function() {
      this.$store.commit('SET_INPUT', this.input)
      this.$store.commit('SET_SYNONYM', this.synonym)
      this.processing = true
      this.$store.dispatch('generateNames',
        {
          input: JSON.stringify(this.input),
          synonym: JSON.stringify(this.synonym)
        })
      .then(() => {
        this.processing = false
        this.$router.push('/results')
      }, error => {
        console.log(Error(error))
        this.processing = false
      })
    },
    ShowInput() {
      this.newSuffix = true
      window.addEventListener('mouseup', this.Defocus, false)
    },
    Defocus(event) {
      if (event.target !== document.getElementById('suffix-input')) {
        this.newSuffix = false
        window.removeEventListener('mouseup', this.Defocus, false)
      }
    },
    AddSuffix(event) {
      var suffix = event.target.value
      if (suffix.length > 1 && suffix.length < 12) {
        if (suffix[0] !== '.') {
          suffix = '.' + suffix
        }
        if (this.suffix.includes(suffix, 0) === false) {
          this.$store.commit('ADD_SUFFIX', suffix.toLowerCase())
        }
        event.target.value = ''
        this.newSuffix = false
        window.removeEventListener('mouseup', this.Defocus, false)
      }
    },
    RemoveSuffix(event) {
      this.$store.commit('REMOVE_SUFFIX', event.target.value)
    }
  },
  components: {
    'container': Container,
    'fav-button': FavButton,
    'loader': Loader
  }
}
</script>