import Axios from 'axios'
import shuffle from 'lodash/shuffle'
import Filter from './filter'
var isBusy = false // Used by Like and Dislike actions

const inputSequence = (input) => {
  input = input.split(' ')
  return new Promise((resolve, reject) => {
    Filter.ReplaceNordics(input)
      .then(Filter.LimitLength)
      .then(Filter.RemoveSpecialChars)
      .then(Filter.RemoveDuplicates)
      .then(Filter.SortSuffixAndPrefix)
      .then((result) => { resolve(result) },
      (error) => { reject(error) })
  })
}

const synonymSequence = (synonym) => {
  return new Promise((resolve, reject) => {
    Axios.get('https://domain-dynamo-api.herokuapp.com/api/' + synonym)
      .then(Filter.FlattenObject)
      .then(Filter.RemoveMultiWords)
      .then(Filter.LimitLength)
      .then(Filter.RemoveSpecialChars)
      .then(Filter.RemoveDuplicates)
      .then((result) => { resolve(result) },
      () => { resolve([]) })
  })
}

export const generateNames = ({dispatch, commit, state}, params) => {
  return new Promise((resolve, reject) => {
    Promise.all([synonymSequence(JSON.parse(params.synonym)), inputSequence(JSON.parse(params.input))])
      .then(Filter.MergeSynonyms)
      .then(Filter.CombineWords)
      .then(Filter.LimitLength)
      .then(Filter.RemoveDuplicates)
      .then(Filter.AddDomainSuffix.bind(null, state.suffix))
      .then(Filter.RemoveSaved.bind(null, [ state.favorites, state.rejected ]))
      .then((names) => {
        commit('EMPTY_UNPROCESSED')
        commit('EMPTY_SUGGESTIONS')
        commit('SET_UNPROCESSED', shuffle(names))
        dispatch('getNames')
          .then(() => resolve())
      })
      .catch(err => { reject(err) })
  })
}

export const getNames = ({commit, state}) => {
  return new Promise((resolve, reject) => {
    const unprocessed = state.unprocessed
    Axios.get('https://domain-dynamo-api.herokuapp.com/api/check/' + JSON.stringify(unprocessed.splice(0, 20)))
      .then(response => {
        commit('SET_UNPROCESSED', unprocessed)
        commit('INSERT_SUGGESTIONS', response.data.output)
        resolve()
      })
  })
}

export const Like = ({commit, state, dispatch}) => {
  commit('INSERT_FAVORITE', state.suggestions[0])
  commit('REMOVE_FIRST')

  if (state.suggestions.length < 20 && state.unprocessed.length !== 0 && isBusy === false) {
    isBusy = true
    dispatch('getNames')
      .then(() => { isBusy = false })
  }
}

export const Dislike = ({commit, state, dispatch}) => {
  commit('INSERT_REJECTED')
  commit('REMOVE_FIRST')

  if (state.suggestions.length < 20 && state.unprocessed.length !== 0 && isBusy === false) {
    isBusy = true
    dispatch('getNames')
      .then(() => { isBusy = false })
  }
}

export const Undo = ({commit, state}) => {
  commit('INSERT_SUGGESTION_FRONT', state.rejected[0])
  commit('REMOVE_FIRST_REJECTED')
}
