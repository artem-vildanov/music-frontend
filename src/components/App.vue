<template>
    <div class="wrapper">
        <nav class="navbar">
            <router-link class="navbar__link" v-show="!accessToken" :to="{ name: 'auth.login' }">
                Login
            </router-link>
            <router-link class="navbar__link" v-show="!accessToken" :to="{ name: 'auth.signup' }">
                SignUp
            </router-link>
            <router-link class="navbar__link" v-show="accessToken" :to="{ name: 'auth.personal' }">
                Personal
            </router-link>
            <router-link class="navbar__link" v-show="accessToken" :to="{ name: 'artist.all' }">
                All artists 
            </router-link>
            <a class="navbar__link" @click.prevent="logout" href="#" v-show="accessToken">
                Logout
            </a>
        </nav>
        
        <div class="container">
            <router-view class="container__content"></router-view>
        </div>
        <div class="container__audio-player"></div>
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
    }

    .navbar {
        width: 100%;
        height: 80px;
        display: flex;
        position: static;
        flex-direction: row;
        justify-content: start;
        align-items: center;
        background-color: #121428;
    }

    .navbar__link {
        color: white;
        font-weight: bold;
        font-size: 20px;
        margin: 5px 0px;
        padding: 5px 10px;
        transition: 
            background 0.5s ease-out,
            color 0.5s ease-out,
            opacity 0.1s ease-out;

        border-radius: 10px;
    }

    .navbar__link:hover {
        text-decoration: none;
        background-color: #f4f8fd;
        color: #121428;
    }

    .navbar__link:active {
        opacity: 50%;
    }

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 0;

        /* justify-content: end; */
    }

    .container__content {
        /* width: 100%;
        height: 100%; */
        /* display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-grow: 0; */
    }

    .container__audio-player {
        position: fixed;
        bottom: 0px;
        /* bottom: 0; */
        width: 100%;
        height: 40px;
        background-color: #121428;
    }
</style>