<template>
    <div class="favourite-albums">
        <div class="title">
            Любимые альбомы
        </div>
        <div class="albums">
            <template v-for="album in favouriteAlbums">
                <album-card :album="album"></album-card>
            </template>
        </div>
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
    .favourite-albums {
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

    .albums {
        width: 424px; /** ширина при которой контейнер альбомов вмещает ровно два альбома по ширине */
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
        background-color: rgba(125, 125, 125, 0.1);
        border-radius: 20px;
    }
</style>