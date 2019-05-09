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