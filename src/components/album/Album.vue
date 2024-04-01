<!--<script setup>-->
<!--import SingleSong from "@/components/audio/Song.vue";-->
<!--</script>-->
<template>
    <div class="album-container">
        <img :src="imageSource">
        <div class="album-box__album-info">
            <div>{{ album.name }}</div>
            <div>{{ album.artistName }}</div>
        </div>
        <ul class="album-box__album-songs">
            <template v-for="song in albumSongs">
                <song :song="song"></song>
            </template>
        </ul>
    </div>
</template>

<script>
    import api from "../../api";
    import Song from "../audio/Song.vue";
    

    export default {
        name: "SingleAlbum",
        components: {Song},
        data() {
            return {
                albumSongs: null,
            }
        },

        props: [
            'album'
        ],

        computed: {
            imageSource() {
                return `http://music.local:9005/photo/${this.album.photoPath}`
            },
        },

        mounted() {
            this.getAlbumSongs()
        },

        methods: {
            getAlbumSongs() {
                api.get(`http://music.local/api/albums/${this.album.id}/songs/album-songs`)
                .then( res => {
                    this.albumSongs = res.data
                })
            }
        }
    }
</script>

<style scoped>

</style>