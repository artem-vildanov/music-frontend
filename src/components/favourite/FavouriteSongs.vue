<template>
    <div class="favourite-songs">
        <div class="title">Любимые треки</div>
        <div id="songs" class="songs" v-if="songsCollection">
            <template v-for="song in songsCollection">
                <song-card :songProps="song"></song-card>
            </template>
        </div>
    </div>
    
</template>

<script>
import api from '@/api'
import SongCard from '../audio/SongCard.vue'
    export default {
        name: "FavouriteSongs",

        components: { SongCard },

        data() {
            return {
                songsCollection: null,
                userInfo: null
            }
        },


        mounted() {
            this.getFavouriteSongs();
            this.getUserInfo();
        },

        methods: {
            getUserInfo() {
                api.get('http://music.local/api/auth/me')
                    .then( res => {
                        this.userInfo = res.data;
                    });
            },

            getFavouriteSongs() {
                api.get('http://music.local/api/favourite/songs')
                .then( res => {
                    this.songsCollection = res.data
                }) 
            },
        }
    }
</script>

<style scoped>
    .favourite-songs {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .title {
        /* font-weight: 600; */
        font-size: 25px;
        background-color: rgba(125, 125, 125, 0.1);
        width: fit-content;
        padding: 5px 10px;
        border-radius: 10px;
    }   

    .songs {
        width: 440px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 15px 20px;
        background-color: rgba(125, 125, 125, 0.1);
        border-radius: 20px;
    }
    

    
</style>