<template>
    <div class="artist-container" v-if="artist">
        <div class="dashboard"><!-- display flex flex-dir: row-->
            <div class="photo-container"><!-- photo styles -->
                <template v-if="!imageError">
                    <img class="artist-photo select-none" :src="photoSrc" @error="setAltImg">
                </template>
                <template v-if="imageError">
                    <img class="artist-photo select-none" src='../../icons/base_img.png'>
                </template>
            </div>
            <div class="info-container"><!-- dis: flex; flex-dir: column; -->
                <div class="info-container__artist-name">
                    {{ artist.name }}
                </div>
                <div class="info-container__actions-container">
                    <div class="actions-container__is-favourite" v-if="artist.isFavourite">
                        <img class="icon select-none" src="../../icons/liked.svg">
                    </div>
                    <div class="actions-container__is-favourite" v-if="!artist.isFavourite">
                        <img class="icon select-none" src="../../icons/not_liked.svg">
                    </div>
                </div>
            </div>
        </div>
        <div class="artist-content">
            <div class="albums">       
                <template v-for="album in artistAlbums">
                    <album-card :album="album"></album-card>
                </template>
            </div>
        </div>
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
        /* margin: 20px; */
        padding: 20px;
        display: flex;
        flex-direction: row;
        gap: 20px;
    }

    .dashboard {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        background-color: white;
        border-radius: 20px;
        padding: 20px;
    }

    .artist-photo {
        width: 200px;
        height: 200px;
        border-radius: 100%;
        pointer-events: none; 
    }

    .artist-content {
        width: 67%;
        /* border: 2px solid black; */

        /* padding: 20px;
        background-color: white;
        border-radius: 20px; */
    }

    .albums {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px;
        background-color: white;
        border-radius: 20px;
        /* justify-content: space-between; */
    }

    .photo-container {
        display: flex;
        align-items: center;
        
    }

    .info-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .info-container__artist-name {
        font-size: 30px;
        margin: 10px;
    }


    .actions-container__is-favourite {
        border-radius: 50%;
        display: flex;
        width: fit-content;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .actions-container__is-favourite:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .actions-container__is-favourite:active {
        background-color: gray;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

</style>