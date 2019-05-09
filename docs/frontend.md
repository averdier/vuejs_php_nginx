# Frontend

Le frontend est une PWA VueJs contenant :
- Un page de login
- Une page necessitant une authentification et listant des ressources
- Un routeur avec protection des routes
- Un store pour la centralisation des données

## Todo
- Mise en place du PWA

## Prérequis
- La dernière version de NodeJS LTS
- La dernière version de VueCLI

## Détails de la création du projet

### Installation
Installation du projet
```
vue create frontend

> Manually select features
>(*) Babel
>(*) Progressive Web App (PWA) Support
>(*) Router
>(*) Vuex
>(*) Linter / Formatter

? Use history mode for router? (Requires proper server setup for index fallback in production) (Y/n) : n

? Pick a linter / formatter config: (Use arrow keys)
> ESLint with error prevention only

? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
>(*) Lint on save

? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? (Use arrow keys)
> In dedicated config files

? Save this as a preset for future projects? (y/N): N
```

Installation des dépendances
```
cd frontend
npm i axios
npm i jwt-decode

vue add vuetify

? Choose a preset: (Use arrow keys)
> Default (recommended)
```

### Mise en place du service

Création d'un fichier `frontend/src/services/backend.js` permettant de faire des requêtes au backend.

Le service est composé de :
- Une instance du client HTTP axios
- Une méthode d'authentifiation, quand l'authentification est un succès l'instance est modifiée afin de mettre à jours les headers
- Une méthode permettant de lister des resources

```js
import axios from 'axios'

const apiClient = axios.create({
    baseURL: `http://localhost`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

export default {
    /**
     * API Instance
     */
    instance: apiClient,

    /**
     * Login user
     * 
     * @param {*} username 
     * @param {*} password 
     * 
     * @return Http response
     */
    login (username, password) {
        return this.instance.post('/login.php', {
            username: username,
            password: password
        }).then(response => {
            this.instance.defaults.headers['Authorization'] = `Bearer ${response.data.token}`

            return response
        })
    },

    /**
     * Get resources
     * 
     * @return Http response
     */
    getResources () {
        return this.instance.get('/resources.php')
    }
}
```

### Mise en place du store

Le store est un pattern de programmation puissant qui permet de centraliser les données et de définir un flux unidirectionnel, voir [Vuex](https://vuex.vuejs.org/)

![Store](https://vuex.vuejs.org/vuex.png)

Le projet généré par VueCLI contient déjà un fichier `store.js`, afin de rentre le projet plus propre :

- Création d'un dossier `frontend/src/store`
- Déplacer et renomer le fichier `frontend/src/store.js` en `frontend/src/store/index.js`
- Création d'un dossier `frontend/src/store/modules` pour contenir les différents modules du store

Création du module d'authentification `frontend/src/store/auth.js`

Le module d'authentification est composé de :
- Un status pouvant prendre 4 états
    - null
    - success
    - loading
    - error
- Le token de l'utilisateur qui est chargé automatiquement si il est présent dans le local storage
- Une méthode d'authentification
- Une méthode de déconnexion

```js
import backend from '@/services/backend'
import jwt_decode from 'jwt-decode'

export const namespaced = true


const getDefaultState = () => {
    let payload = {
        status: null,
        token: null,
        decoded: null
    }

    const token = localStorage.getItem('boilerplate_token') || null
    try {
        payload.decoded = jwt_decode(token)
        payload.token = token
    } catch (unused) {
        payload.decoded = null
    }

    return payload
}

export const state = getDefaultState()

export const mutations = {
    SET_TOKEN(state, token) {
        state.token = token
        if (token === null) {
            localStorage.removeItem('boilerplate_token')
            state.decoded = null
        }
        else {
            try {
                let decoded = jwt_decode(token)
                state.decoded = decoded
                localStorage.setItem('boilerplate_token', token)
            } catch (unused) {
                state.decoded = null
                state.token = null
            }
        }
    },
    SET_STATUS(state, status) {
        state.status = status
    }
}

export const actions = {
    login ({
        commit
    }, { username, password }) {
        commit('SET_STATUS', 'loading')

        return backend.login(username, password)
        .then(response => {
            commit('SET_TOKEN', response.data.token)
            commit('SET_STATUS', 'success')

            return response.data
        })
        .catch(error => {
            commit('SET_TOKEN', null)
            commit('SET_STATUS', 'error')

            throw error
        })
    },

    logout ({
        commit
    }) {
        commit('SET_TOKEN', null)
    }
}
```

Création du module d'accès aux ressources `frontend/src/store/modules/resources.js`

Le module d'accès aux ressources est composé de :
- Un status pouvant prendre 4 états
    - null
    - success
    - loading
    - error
- La tableau des éléments récupérés

```js
import backend from '@/services/backend'

export const namespaced = true

export const state = {
    status: null,
    items: []
}

export const mutations = {
    SET_ITEMS(state, items) {
        state.items = items
    },
    SET_STATUS(state, status) {
        state.status = status
    }
}

export const actions = {
    getItems ({
        commit
    }) {
        commit('SET_STATUS', 'loading')

        return backend.getResources()
        .then(response => {
            console.log('response: ' + response)
            commit('SET_ITEMS', response.data.items)
            commit('SET_STATUS', 'success')

            return response.data
        })
        .catch(error => {
            commit('SET_ITEMS', [])
            commit('SET_STATUS', 'error')
            throw error
        })
    }
}
```

Ajout des modules dans le store `frontend/src/store/index.js`
```js
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './modules/auth'
import * as resources from './modules/resources'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    auth, resources
  }
})
```

### Mise en place du chargement automatique des tokens et la gestion des tokens invalides

Au démarrage de l'application (chargement par le navigateur, reload), si un token est présent dans le local storage : 
- Mettre à jour le service avec le token présent
- Si un token est présent l'utilisateur est considéré comme connecté, dans ce cas si le backend retourne un code 401 on entamme la déconnexion

`frontend/src/main.js`
```js
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
```

### Mise en place de la page de login 

Création d'une page `frontend/src/views/Login.vue`

La page contient :
- Un champ identifiant
- Un champ mot de passe
- Un bouton permettant de lancer l'authentification

A l'aide des états définis dans le store :
- Les champs texte et le bouton sont désactivés quand l'état est `loading`
- Un message d'erreur est visible quand l'état est `error`

```html
<template>
    <v-layout fill-height align-center justify-center style="width: 100%;">
        <v-flex xs11 sm8 md4 lg3>

            <v-form ref="loginForm" @submit="loginClient">
                <v-text-field
                    prepend-icon="person"
                    name="username"
                    label="Identifiant"
                    type="text"
                    v-model="loginForm.username"
                    :rules="[loginForm.rules.required]"
                    :disabled="status === 'loading'"
                    required>
                </v-text-field>

                <v-text-field
                    prepend-icon="lock"
                    name="password"
                    label="Mot de passe"
                    type="password"
                    v-model="loginForm.password"
                    :rules="[loginForm.rules.required]"
                    :disabled="status === 'loading'"
                    required>
                </v-text-field>

                <div class="text-xs-center">
                    <v-btn type="submit" :loading="status === 'loading'">Connexion</v-btn>
                </div>

            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
    data: () => ({
        loginForm: {
            username: null,
            password: null,
            rules: {
                required: value => !!value || 'Requis'
            },
            error: null
        }
    }),
    computed: mapState({
        status: state => state.auth.status
    }),

    methods: {
        loginClient (e) {
            e.preventDefault()

            if (this.$refs.loginForm.validate()) {
                this.$store.dispatch('auth/login', this.loginForm)
                .then(() => {
                    this.$router.push('/')
                })
                .catch(error => {
                    this.loginForm.error = 'Une erreur est survenue, veuillez réessayer plus tard.'
                })
            }
        }
    }
}
</script>
```

### Mise en place des routes

La mise en place des routes est réalisée à l'aide de [vuerouter](https://router.vuejs.org/) dans le fichier `frontend/src/router.js`

- Création d'une sécurité permettant de s'assurer que l'utilisateur est authentifié
- Création d'une sécurité permettant de s'assurer que l'utilisateur n'est pas authentifié
- Mise en place des sécurités sur les routes à l'aide de `beforeEnter`

> `beforeEnter` est un moyen d'intercepter l'application avant la navigation sur une page

```js
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
```

- Modification du fichier `frontend/src/App.vue` afin de prendre en compte le routeur

```html
<template>
  <v-app>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {}
</script>
```

### Mise en place de la page de ressources

Modification de la page `frontend/src/views/Home.vue`

La page contient :
- Un loader quand les ressources sont en chargement
- La liste des ressources en cas de succès
- Un message d'erreur si une erreur est survenue

```html
<template>
  <v-layout v-if="status === 'loading'" justify-center align-center fill-height>
     <v-flex text-xs-center>
            <v-progress-circular indeterminate></v-progress-circular>
        </v-flex>
  </v-layout>

  <v-layout v-else-if="status === 'error'" justify-center align-center fill-height>
      <v-flex text-xs-center shrink>
          <v-icon large>error</v-icon>
          <p class="mt-2">Something goes wrong</p>
      </v-flex>
  </v-layout>

  <v-list v-else-if="status === 'success'" two-line style="width: 100%">
    <v-list-tile v-for="item in items" :key="item.id">

          <v-list-tile-avatar>
              <img src="@/assets/elo_user.png" alt="avatar">
          </v-list-tile-avatar>

          <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.description }}</v-list-tile-sub-title>
          </v-list-tile-content>

      </v-list-tile>
  </v-list>

</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: mapState({
      status: state => state.resources.status,
      items: state => state.resources.items
    }),
    created () {
      this.$store.dispatch('resources/getItems')
    }
  }
</script>
```