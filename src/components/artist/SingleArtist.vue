<script setup>
import SingleAlbum from '../album/SingleAlbum.vue';
</script>
<template>
    <div class="artist-box">
        <img :src="imageSource">
        <div class="artist-box__artist-info">
            <div>{{ this.artist.name }}</div>
        </div>
        <ul class="artist-box__artist-albums">
            <template v-for="album in artistAlbums">
                <SingleAlbum :album="album"></SingleAlbum>
            </template>
        </ul>
    </div>
</template>

<script>
import api from "../../api";
    export default {
        name: "SingleArtist",

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
            imageSource() {
                return `http://music.local:9006/photo/${this.artist.photo_path}`
            }
        },

        methods: {
            getArtistAlbums() {
                api.get(`http://music.local/api/albums/created-by-artist/${this.artist.id}`)
                    .then( res => {
                        console.log(res.data);
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