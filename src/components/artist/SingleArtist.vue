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
import SingleAlbum from '../album/SingleAlbum.vue';
import api from "../../api";
    export default {
        name: "SingleArtist",

        components: [
            SingleAlbum,
        ],

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
                return `http://music.local:9006/photo${this.artist.photo_path}`
            }
        },

        methods: {
            getArtistAlbums() {
                api.get(`http://music.local/albums/created-by-artist/${this.artist.id}`)
                    .then( res => {
                        console.log(res.data);
                        this.artist = res.data
                    })
            }
        }

    }
</script>

<style scoped>

</style>