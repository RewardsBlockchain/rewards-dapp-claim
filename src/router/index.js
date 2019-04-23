import Vue from 'vue'
import Router from 'vue-router'
import Blank from '@/containers/Blank'


import Claiming from '@/views/claim'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      name: 'Blank',
      component: Blank,
      children: [
        {
          path: '/',
          name: 'Claim',
          component: Claiming
        }
      ]
    }
  ]
})
