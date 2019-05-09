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