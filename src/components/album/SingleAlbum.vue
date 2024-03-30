<template>
    <div class="album-box">
        <img :src="imageSource">
        <div class="album-box__album-info">
            <div>{{ albumInfo.name }}</div>
            <div>{{ albumInfo.artistName }}</div>
        </div>
        <ul class="album-box__album-songs">
            <template v-for="song in albumSongs">
                <SingleSong :song="song"></SingleSong>
            </template>
        </ul>
    </div>

</template>

<script>
    import api from "../../api";
    import SingleSong from "../audio/SingleSong";

    export default {
        name: "SingleAlbum",

        components: [
            SingleSong,
        ],

        data() {
            return {
                albumSongs: null,
            }
        },

        props: [
            'albumInfo'
        ],

        computed: {
            imageSource() {
                return `http://music.local:9006/photo${this.albumInfo.photo_path}`
            },
        },

        mounted() {

        },

        methods: {
            getAlbumSongs() {
                api.get(`http://music.local/api/albums/${this.albumInfo.id}/songs/album-songs`)
                .then( res => {
                    console.log(res.data)
                    this.albumSongs = res.data
                })
            }
        }
    }
</script>

<style scoped>

</style>