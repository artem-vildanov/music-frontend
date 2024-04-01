<template>
    <div class="artist-container" v-if="artist">
        <div class="dashboard"><!-- display flex flex-dir: row-->
            <div class="photo-container"><!-- photo styles -->
                <div class="artist-photo" v-if="!imageError">
                    <img class="big-photo" :src="photoSrc" @error="setAltImg">
                </div>
                <div class="artist-photo" v-if="imageError">
                    <img class="big-photo" src='../../icons/base_img.png'>
                </div>
            </div>
            <div class="info-container"><!-- dis: flex; flex-dir: column; -->
                <div class="info-container__artist-name">
                    {{ artist.name }}
                </div>
                <div class="info-container__is-favourite">
                    <template v-if="artist.isFavourite">
                        <img class="icon" src="../../icons/liked.svg">
                    </template>
                    <template v-if="!artist.isFavourite">
                        <img class="icon" src="../../icons/not_liked.svg">
                    </template>
            </div>
            </div>
        </div>
        <hr>
        <h2>Альбомы</h2>
        <div class="albums">       
            <template v-for="album in artistAlbums">
                <album-card :album="album"></album-card>
            </template>
        </div>
<!--
        <div class="artist-photo" v-if="!imageError">
            <img class="big-photo" :src="photoSrc" @error="setAltImg">
        </div>
        <div class="artist-photo" v-if="imageError">
            <img class="big-photo" src='../../icons/base_img.png'>
        </div>

        <div class="artist-box__artist-info">
            <div>{{ artist.name }}</div>
        </div>
        <ul class="artist-box__artist-albums">
            <template v-for="album in artistAlbums">
                <album-card :album="album"></album-card>
            </template>
        </ul>
-->
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
                artistId: null,
                artist: null,
                artistAlbums: null,
                imageError: false,
                altPhotoSrc: '../../icons/base_img.png'
            }
        },

        computed: {
            photoSrc() {
                if (this.artist) {
                    return `http://music.local:9005/photo/${this.artist.photoPath}`
                }
            }
        },

        mounted() {
            this.getArtistId()
            this.getArtist()
            this.getArtistAlbums()
        },

        methods: {
            getArtistId() {
                this.artistId = this.$route.params.id
            },

            getArtist() {
                api.get(`http://music.local/api/artists/${this.artistId}`)
                    .then( res => {
                        this.artist = res.data
                    })
            },

            getArtistAlbums() {
                api.get(`http://music.local/api/albums/created-by-artist/${this.artistId}`)
                    .then( res => {
                        this.artistAlbums = res.data
                    })
            },

            setAltImg() {
                this.imageError = true
            },
        }

    }
</script>

<style scoped>
    .artist-container {
        margin: 20px;
    }

    .dashboard {
        display: flex;
        flex-direction: row;
    }

    .albums {
        display: flex;
        flex-wrap: wrap;
    }

    .photo-container {
        margin-right: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .info-container {
        display: flex;
        flex-direction: column;
    }

    .info-container__artist-name {
        font-size: 60px;
    }


    .info-container__is-favourite {
        border-radius: 50%;
        display: flex;
        width: fit-content;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .info-container__is-favourite:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .info-container__is-favourite:active {
        background-color: gray;
    }

    .icon {
        width: 60px;
        height: 60px;
    }

</style>