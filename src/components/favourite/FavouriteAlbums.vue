<template>
    <div class="favourite-albums">
        <template v-for="album in favouriteAlbums">
            <album-card :album="album"></album-card>
        </template>
    </div>
</template>

<script>
import api from '@/api'
import AlbumCard from '../album/AlbumCard.vue'
    export default {
        name: "FavouriteAlbums",

        components: { AlbumCard },

        data() {
            return {
                favouriteAlbums: null,
            }
        },

        mounted() {
            this.getFavouriteAlbums()
        },

        methods: {
            getFavouriteAlbums() {
                api.get('http://music.local/api/favourite/albums')
                .then( res => {
                    this.favouriteAlbums = res.data
                })
            }
        }
    }
</script>

<style scoped>
    .favourite-artists {
        width: 400px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px;
        background-color: white;
        border-radius: 20px;
    }
</style>