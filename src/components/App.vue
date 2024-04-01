<template>
    <div class="wrapper">
        <nav class="navbar">
            <router-link class="navbar__link" v-show="!accessToken" :to="{ name: 'auth.login' }">Login</router-link>
            <router-link class="navbar__link" v-show="!accessToken" :to="{ name: 'auth.signup' }">SignUp</router-link>
            <router-link class="navbar__link" v-show="accessToken" :to="{ name: 'auth.personal' }">Personal</router-link>
            <a class="navbar__link" @click.prevent="logout" href="#" v-show="accessToken">logout</a>
        </nav>
        <router-view class="content-container"></router-view>
    </div>
</template>

<script>
    import api from '@/api.js'
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
                        this.$router.push({name: 'auth.login'})
                    })
            }
        }

    }
</script>

<style scoped>
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        align-items: center;
    }

    .navbar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: start;
    }

    .navbar__link {
        color: #060818;
        font-weight: bold;
        font-size: 30px;
        margin-left: 5%;
        margin-right: 5%;
    }

    .navbar__link:hover {
        text-decoration: none;
    }

    .content-container {
        margin-top: 5%;
    }
</style>