<template>
    <div class="album-container" v-if="album">
        <div class="dashboard"><!-- display flex flex-dir: row-->
            <div class="photo-container"><!-- photo styles -->
                <template v-if="!imageError">
                    <img class="album-photo select-none" :src="photoSrc" @error="setAltImg">
                </template>
                <template v-if="imageError">
                    <img class="album-photo select-none" src='../../icons/base_img.png'>
                </template>
            </div>
            <div class="info-container"><!-- dis: flex; flex-dir: column; -->
                <div class="info-container__album-name">
                    {{ album.name }}
                </div>
                <div class="info-container__actions-container">
                    <div class="actions-container__is-favourite" v-if="album.isFavourite">
                        <img class="icon select-none" src="../../icons/liked.svg">
                    </div>
                    <div class="actions-container__is-favourite" v-if="!album.isFavourite">
                        <img class="icon select-none" src="../../icons/not_liked.svg">
                    </div>
                </div>
            </div>
        </div>
        <div class="album-content">
            <div class="songs">       
                <template v-for="song in albumSongs">
                    <song-card :song="song"></song-card>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../../api";
    import SongCard from "../audio/SongCard.vue";
    

    export default {
        name: "Album",
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