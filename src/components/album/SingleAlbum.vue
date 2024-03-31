<script setup>
import SingleSong from "@/components/audio/SingleSong.vue";
</script>
<template>
    <div class="album-box">
        <img :src="imageSource">
        <div class="album-box__album-info">
            <div>{{ album.name }}</div>
            <div>{{ album.artistName }}</div>
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
    

    export default {
        name: "SingleAlbum",

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