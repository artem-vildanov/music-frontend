<!--<script setup>-->
<!--import SingleAlbum from '../album/Album.vue';-->
<!--</script>-->
<template>
    <div class="artist-box">
        <img :src=`http://music.local:9005/photo/${artist.photoPath}`>
        <div class="artist-box__artist-info">
            <div>{{ artist.name }}</div>
        </div>
        <ul class="artist-box__artist-albums">
            <template v-for="album in artistAlbums">
                <album-card :album="album"></album-card>
            </template>
        </ul>
    </div>
</template>

<script>
import api from "../../api";
import AlbumCard from "../album/AlbumCard.vue";
    export default {
        name: "Artist",
        components: {AlbumCard},
        data() {
            return {
                artistAlbums: null,
            }
        },

        props: [
            'artist'
        ],

        mounted() {
            this.getArtistAlbums()
        },

        computed: {
            photoSrc(object) {
                return `http://music.local:9005/photo/${object.photoPath}`
            }
        },

        methods: {
            getArtistAlbums() {
                api.get(`http://music.local/api/albums/created-by-artist/${this.artist.id}`)
                    .then( res => {
                        this.artistAlbums = res.data
                    })
            }
        }

    }
</script>

<style scoped>
    .artist-box {
        padding: 10px;
        margin: 10px;
        border: solid 1px gray;
        border-radius: 10px;
    }
</style>