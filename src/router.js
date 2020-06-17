import Vue from 'vue'
import Router from 'vue-router'
import Pack from './views/Pack.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/pack/:packId',
      name: 'Pack',
      props: true,
      component: Pack,
    },
    {
      path: '/',
      name: 'home',
      component: Home
    },
  ]
})
