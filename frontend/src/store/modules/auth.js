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