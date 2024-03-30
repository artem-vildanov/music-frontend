import axios from "axios";

const api = axios.create()

// start request
api.interceptors.request.use(config => {
    if (localStorage.getItem('access_token')) {
        config.headers.authorization = `Bearer ${localStorage.getItem('access_token')}`
    }

    return config
}, error => {
    console.log(error)
})
// end request

// start response
api.interceptors.response.use( config => {
    if (localStorage.getItem('access_token')) {
        config.headers.authorization = `Bearer ${localStorage.getItem('access_token')}`
    }

    return config
}, error => {
    if ('token expired' === error.response.data.message) {
        return axios.post('http://music.local/api/auth/refresh', {}, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then( res => {
            localStorage.setItem('access_token', res.data.access_token)

            error.config.headers.authorization = `Bearer ${res.data.access_token}`

            return api.request(error.config)
        })
    }

    // if (error.response.status === 401) {
    //     router.push({name: 'user.login'})
    // }
})
// end response

export default api
