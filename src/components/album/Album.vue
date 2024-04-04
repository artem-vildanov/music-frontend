<template>
    <div class="album-container" v-if="album">
        <div class="dashboard"><!-- display flex flex-dir: row-->
            <div class="photo-container"><!-- photo styles -->
                <img v-show="!imageError" class="album-photo select-none" :src="photoSrc" @error="imageError = true">
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
                imageError: false,
                albumId: this.$route.params.id, // TODO test it!
                album: null,
                albumSongs: null,
                altPhotoSrc: "/src/icons/base_img.jpg"
            }
        },

        computed: {
            photoSrc() {
                if (this.album) {
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
    .album-container {
        /* margin: 20px; */
        padding: 20px;
        display: flex;
        flex-direction: row;
        gap: 20px;

        width: fit-content;
    }

    .dashboard {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        background-color: white;
        border-radius: 20px;
        padding: 20px;
        width: 300px;
    }

    .album-photo {
        width: 200px;
        height: 200px;
        border-radius: 20px;
        pointer-events: none; 
    }

    .album-content {
        width: 400px;
        /* border: 2px solid black; */

        /* padding: 20px;
        background-color: white;
        border-radius: 20px; */
    }

    .songs {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 15px 20px;
        background-color: white;
        border-radius: 20px;

        width: 400px;
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

    .info-container__album-name {
        font-size: 20px;
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