import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import backend from './services/backend'

Vue.config.productionTip = false

const auth_token = localStorage.getItem('boilerplate_token')

if (auth_token !== null) {
  backend.instance.interceptors.response.use((response) => {
    return response
  }, error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('auth/logout')
      router.push('/login')
    }

    return Promise.reject(error)
  })

  backend.instance.defaults.headers['Authorization'] = `Bearer ${auth_token}`
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
