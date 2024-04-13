<template>
    <div class="wrapper">
        <nav class="navbar">
            <router-link class="navbar__link" v-show="!accessToken" :to="{ name: 'auth.login' }">
                Войти
            </router-link>
            <router-link class="navbar__link" v-show="!accessToken" :to="{ name: 'auth.signup' }">
                Регистрация
            </router-link>
            <router-link class="navbar__link" v-show="accessToken" :to="{ name: 'account.user' }">
                Профиль
            </router-link>
            <router-link class="navbar__link" v-show="accessToken" :to="{ name: 'artist.all' }">
                All artists 
            </router-link>
            <div class="navbar__dropdown-link" v-show="accessToken">
                Коллекция
                <div class="dropdown-list">
                    <router-link class="dropdown-list__item" :to="{ name:'favourite.songs' }">Любимые треки</router-link>
                    <router-link class="dropdown-list__item" :to="{ name:'playlist.all' }">Ваши плейлисты</router-link>
                    <router-link class="dropdown-list__item" :to="{ name:'favourite.albums' }">Любимые альбомы</router-link>
                    <router-link class="dropdown-list__item" :to="{ name:'favourite.artists' }">Любимые артисты</router-link>
                </div>
            </div>

            <a class="navbar__link navbar__logout" @click.prevent="logout" href="#" v-show="accessToken">
                Выйти
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
        z-index: 20;

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
        border-top: 0;

        /*background-color: rgba(125, 125, 125, 0.1);*/
        /*backdrop-filter: blur(20px);*/
        /* background-color: #121428; */
    }

    .navbar:before {
        content: '';
        position: absolute;
        z-index: -1;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        border-radius: 0px 0px 20px 20px;

        background-color: rgba(125, 125, 125, 0.1);
        backdrop-filter: blur(20px);
    }

    .navbar__link {
        color: rgba(1, 1, 1, 0.7);
        font-size: 20px;
        margin: 5px;
        padding: 5px 10px;
        cursor: pointer;
        transition: 
            background 0.5s ease-out,
            color 0.5s ease-out,
            opacity 0.1s ease-out;

        border-radius: 10px;
    }

    .navbar__link:hover {
        text-decoration: none;
        background-color: rgba(125, 125, 125, 0.2);
        color: rgba(1, 1, 1, 1);
    }

    .navbar__link:active {
        opacity: 50%;
    }

    .navbar__logout {
        margin-left: auto;
        color: rgb(197, 26, 55);
    }

    .navbar__logout:hover {
        background-color: rgb(197, 26, 55);
        color: white;
    }

    .navbar__dropdown-link {
        color: rgba(1, 1, 1, 0.7);
        font-size: 20px;
        margin: 5px;
        padding: 5px 10px;
        transition: background 0.5s, color 0.5s;

        border-radius: 10px;
        cursor: pointer;
    }

    .navbar__dropdown-link:hover .dropdown-list {
        opacity: 1;
        visibility: visible;
    }

    .dropdown-list {
        /* margin-top: 15px; */
        /* left: 245px; */
        position: absolute;
        z-index: 11;
        opacity: 0;
        visibility: hidden;
        transition: visibility 0.2s, opacity 0.2s;
        padding: 10px;
        background-color: rgba(125, 125, 125, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 10px;
    }

    .dropdown-list__item {
        margin: 5px;
        padding: 3px 10px;
        width: fit-content;
        border-radius: 10px;
        transition: background-color 0.2s;
        cursor: pointer;
        font-size: 16px;

        color: rgba(0, 0, 0, 0.8);
        word-break: unset;
        display: block;
    }

    .dropdown-list__item:hover {
        background-color: rgba(125, 125, 125, 0.4);
        color: rgba(0, 0, 0, 1);
        text-decoration: none;
    }

    .dropdown-list__item:active {
        background-color: rgba(125, 125, 125, 0.8);
    }

    .container {
        margin-top: 100px;
        margin-bottom: 60px;

        /* width: 80%; */
        width: fit-content;

        margin-left: auto;
        margin-right: auto;

        border-radius: 20px;
        /* border: solid 1px rgba(125, 125, 125, 0.5); */
        background-color: rgba(125, 125, 125, 0.1);

        /* justify-content: end; */
    }


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