<template>
    <div class="artist-box">
        <img :src="imageSource">
        <div class="artist-box__artist-info">
            <div>{{ album.name }}</div>
            <div>{{ album.artistName }}</div>
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
    export default {
        name: "SingleArtist",

        components: [
            SingleAlbum,
        ],

        data() {
            return {
                artistAlbums,
                artist
            }
        },

        props: [
            'artistId'
        ]

    }
</script>

<style scoped>

</style>