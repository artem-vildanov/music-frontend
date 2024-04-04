<template>
    <div class="album-container" v-if="album">
        <div class="dashboard"><!-- display flex flex-dir: row-->
            <div class="photo-container"><!-- photo styles -->
                <img v-show="!imageError" class="album-photo select-none" :src="photoSrc" @error="setAltImg">
                <img v-show="imageError" class="album-photo select-none" :src="altPhotoSrc">
            </div>
            <div class="info-container"><!-- dis: flex; flex-dir: column; -->
                <div class="info-container__album-name">
                    {{ album.name }}
                </div>
                <div class="info-container__actions-container">
                    <div class="actions-container__is-favourite">
                        <img v-show="album.isFavourite" class="icon select-none" src="../../icons/liked.svg">
                        <img v-show="!album.isFavourite" class="icon select-none" src="../../icons/not_liked.svg">
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
// TODO test whole component
    import api from "../../api";
    import SongCard from "../audio/SongCard.vue";
    

    export default {
        name: "Album",
        components: {SongCard},
        data() {
            return {
                albumId: this.$route.params.id, // TODO test it!
                album: null,
                albumSongs: null,
                altPhotoSrc: "/src/icons/base_img.jpg"
            }
        },

        computed: {
            photoSrc() {
                if (this.artist) {
                    return `http://music.local:9005/photo/${this.album.photoPath}`
                }
            }
        },

        mounted() {
            this.getAlbum()
            this.getAlbumSongs()
        },

        methods: {
            getAlbum() {
                api.get(`http://music.local/api/albums/${this.albumId}`)
                    .then( res => {
                        this.album = res.data
                    })
            },

            getAlbumSongs() {
                api.get(`http://music.local/api/albums/${this.albumId}/songs/album-songs`)
                .then( res => {
                    this.albumSongs = res.data
                    console.log(this.albumSongs)
                })
            }
        }
    }
</script>

<style scoped>
    .icon {
        width: 60px;
        height: 60px;
    }
</style>