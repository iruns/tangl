// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

import {db} from './firebase'
import VuexFirebase from './plugins/vuex-firebase'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(Vuetify, {
  theme: {
    primary: colors.teal.accent3,
    secondary: colors.teal.accent1,
    accent: colors.orange.accent2,
    error: colors.pink.accent3,
    warning: colors.deepOrange.base,
    info: colors.blue.lighten1,
    success: colors.teal.base,
  },
})

Vue.use(VuexFirebase, {
  store,
  firebase: db
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
