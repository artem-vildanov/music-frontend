<template>
    <div>
        <nav>
            <router-link v-show="!accessToken" :to="{ name: 'auth.login' }">Login</router-link>
            <router-link v-show="!accessToken" :to="{ name: 'auth.signup' }">SignUp</router-link>
            <router-link v-show="accessToken" :to="{ name: 'auth.personal' }">Personal</router-link>
            <a @click.prevent="logout" href="#" v-show="accessToken">logout</a>
            <router-view></router-view>
        </nav>
    </div>
</template>

<script>
    import api from 'src/api.js'
    export default {
        name: "App",

        data() {
            return {
                accessToken: null
            }
        },

        mounted() {
            this.getAccessToken()
        },

        watch: {
            $route(to, from) {
                this.getAccessToken()
            },
        },


        methods: {
            getAccessToken() {
                this.accessToken = localStorage.getItem('access_token')
            },

            logout() {
                api.post('http://music.local/api/auth/logout', {})
                    .then( res => {
                        localStorage.removeItem('access_token')
                        this.$router.push({name: 'user.login'})
                    })
            }
        }

    }
</script>

<style scoped>

</style>