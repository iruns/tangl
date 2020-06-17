import Vue from 'vue'
import Vuex from 'vuex'

// import _ from 'lodash'

import account from './modules/account'
import pack from './modules/pack'
import spread from './modules/spread'
import item from './modules/item'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    account,
    pack,
    spread,
    item,
  },
  state: {
    // list of languages used, ordered by priority
    languages: [
      'lang_en'
    ]
  },
  getters: {},
  actions: {
    setState (context, payload) {
      // console.log('setState', payload.path)
      // console.log(JSON.stringify(
      //   payload.value, undefined, 2
      // ))

      context.commit('setState', payload)
    },
  },
  mutations: {
    setState (state, {path, value}) {
      path = path.split('.')
      let point = state
      const lastStep = path.pop()
      path.map(step => {
        let newPoint = point[step]
        if (newPoint === undefined) {
          newPoint = typeof step === 'string' ? {} : []
          Vue.set(point, step, newPoint)
        }
        point = newPoint
      })
      if (value !== undefined) {
        Vue.set(point, lastStep, value)
      } else {
        Vue.delete(point, lastStep)
      }
    },
  },
})
