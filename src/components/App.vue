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
        
        
        <router-view class="container"></router-view>
        
        <div class="audio-player">Audio player</div>
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
        width:100%;
        /* height: 100%; */
        display: flex;
        flex-direction: column;
    }

    .navbar {
        z-index: 10;

        right: 20%;
        left: 20%;
        width: 60%;
        height: 80px;
        border-radius: 0px 0px 20px 20px;
        display: flex;
        position: fixed;
        flex-direction: row;
        justify-content: start;
        align-items: center;

        border: gray 1px solid;
        border-top: 0;

        backdrop-filter: blur(10px);
        /* background-color: #121428; */
    }

    .navbar__link {
        color: rgb(34, 34, 34);
        font-weight: bold;
        font-size: 20px;
        margin: 5px;
        padding: 5px 10px;
        transition: 
            background 0.5s ease-out,
            color 0.5s ease-out,
            opacity 0.1s ease-out;

        border-radius: 10px;
    }

    .navbar__link:hover {
        text-decoration: none;
        background-color: rgb(34, 34, 34);
        color: white;
    }

    .navbar__link:active {
        opacity: 50%;
    }

    .container {
        
        /* right: 20%;
        left: 20%;
        width: 60%;
        height: 80%;
        position: fixed;
        border: gray solid 1px;
        overflow-y: auto; */



        margin-top: 100px;
        margin-bottom: 60px;

        width: 80%;
        margin-left: auto;
        margin-right: auto;

        border-radius: 20px;

        background-color: rgb(242, 243, 248);

        

        /* justify-content: end; */
    }

    .container__content {

    }

    /* .container__footer {
        padding: 20px;
        display: flex;
        flex-direction: column;
    } */

    .audio-player {
        position: fixed;
        bottom: 0px;
        /* bottom: 0; */
        left: 20%;
        right: 20%;
        width: 60%;
        height: 40px;
        background-color: #353855;

        text-align: center;
        padding: 5px;
        color: white;
        font-weight: bold;
        border-radius: 20px 20px 0px 0px;
    }
</style>