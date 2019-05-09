import Vue from 'vue'
import Router from 'vue-router'
import Store from '@/store'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(Router)

const needAuthenticated = (to, from, next) => {
  if (Store.state.auth.decoded != null) {
    let now = Math.floor(Date.now() / 1000)
    if (Store.state.auth.decoded.exp > now) {
      next()
    }
    else {
      Store.dispatch('auth/logout')
    }
  }
  next('/login')
}

const needNotAuthenticated = (to, from, next) => {
  if (Store.state.auth.decoded === null) {
    next()
  }
  next('/')
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: needAuthenticated
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: needNotAuthenticated
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      beforeEnter: needAuthenticated
    }
  ]
})
