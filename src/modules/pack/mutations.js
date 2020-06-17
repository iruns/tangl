import Vue from 'vue'

export default {
  // set selection
  select (state, payload) {
    Vue.set(state, 'selectedId', payload)
  },
}
