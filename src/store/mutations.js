export default {
  EMPTY_UNPROCESSED(state) {
    state.unprocessed = []
  },
  EMPTY_SUGGESTIONS(state) {
    state.suggestions = []
  },
  SET_UNPROCESSED(state, list) {
    state.unprocessed = list
  },
  INSERT_SUGGESTIONS(state, list) {
    state.suggestions.push(...list.map(x => x[0]))
  },
  REMOVE_FIRST(state) {
    state.suggestions.shift()
  },
  INSERT_FAVORITE(state, item) {
    state.favorites.unshift(item)
  },
  INSERT_REJECTED(state) {
    state.rejected.unshift(state.suggestions[0])
    state.rejected = state.rejected.splice(0, 5000)
  },
  REMOVE_FIRST_REJECTED(state) {
    state.rejected.shift()
  },
  INSERT_SUGGESTION_FRONT(state, item) {
    state.suggestions.unshift(item)
  },
  REMOVE_FAVORITE(state, item) {
    state.favorites.splice(state.favorites.indexOf(item), 1)
  },
  DELETE_FAVORITES(state) {
    state.favorites = []
  },
  DELETE_REJECTED(state) {
    state.rejected = []
  },
  ADD_SUFFIX(state, suffix) {
    state.suffix.push(suffix)
  },
  REMOVE_SUFFIX(state, suffix) {
    state.suffix.splice(state.suffix.indexOf(suffix), 1)
  },
  SET_INPUT(state, input) {
    state.input = input
  },
  SET_SYNONYM(state, input) {
    state.synonym = input
  }
}
