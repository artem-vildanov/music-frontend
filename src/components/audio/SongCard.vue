<template>
    
    <div class="song-card" :id="`song_${song.id}`">

        <div class="song-photo-container">
            <div class="song-photo-container__photo-overlay">
                <div class="photo-overlay__play-audio">
                    <img class="centered-icon icon select-none" src="../../icons/play.svg">
                </div>
            </div>
            <img class="song-photo-container__photo select-none" v-show="!imageError" :src="photoSrc" @error="this.imageError = true">
            <img class="song-photo-container__photo select-none" v-show="imageError" :src="altPhotoSrc">
        </div>

        <div class="song-info-container">
            <div :title="song.name" class="song-info-container__name">
                {{ song.name }}
            </div>
            <router-link :to="{ name: 'artist.single', params: { id: song.artistId }}" class="song-info-container__artist-name">
                {{ song.artistName }}
            </router-link>
        </div>

        <div class="song-actions-container">
            <div class="song-actions-container__is-favourite">
                <img @click.prevent="removeFromFavourites()" v-show="song.isFavourite" class="icon" src="../../icons/liked.svg">
                <img @click.prevent="addToFavourites()" v-show="!song.isFavourite" class="icon" src="../../icons/not_liked.svg">
            </div>
            <div class="song-actions-container__add-to-playlist">
                <img class="centered-icon icon" src="../../icons/playlist.svg">
            </div>
        </div>  
    </div>
</template>

<script>
import api from "@/api"
    export default {
        name: "SongCard",

        props: [
            'song'
        ],

        data() {
            return {
                imageError: null,
                photoSrc: `http://music.local:9005/photo/${this.song.photoPath}`,
                altPhotoSrc: "/src/icons/base_img.jpg"
            }
        },

        computed: {
            imageSource() {
                return `http://music.local:9005/photo/${this.song.photoPath}`
            }
        },

        methods: {
            addToFavourites() {
                api.put(`http://music.local/api/favourite/songs/add-to-favourites/${this.song.id}`)
                this.song.isFavourite = true
            },

            removeFromFavourites() {
                api.put(`http://music.local/api/favourite/songs/delete-from-favourites/${this.song.id}`)
                this.song.isFavourite = false

                if (this.$parent.$data.favouriteSongs) {
                    this.hideSongCard()
                }
            },

            hideSongCard() {
                const songCard = document.getElementById(`song_${this.song.id}`)
                songCard.style.opacity = '0'
                setTimeout(() => {
                    songCard.remove()
                }, 500)
            },
        }

    }
</script>

<style scoped>
    .song-card {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 5px 0px;
        padding: 10px;
        border: solid 1px rgba(125, 125, 125, 0.5);
        border-radius: 10px;
        transition: 0.5s ease-out;
    }

    .song-card:hover {
        background-color: rgba(125, 125, 125, 0.2);
    }

    .song-card:hover .song-photo-container__photo-overlay {
        background-color: rgba(255, 255, 255, 0.7);
    }

    .song-card:hover .photo-overlay__play-audio {
        opacity: 1;
    }

    .song-card:hover .song-actions-container {
        opacity: 1;
    }

    .song-photo-container {        
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .song-photo-container__photo {
        width: 60px;
        height: 60px;
        border-radius: 5px;
    }

    .song-photo-container__photo-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0); 
        transition: 0.5s ease-out;
        border-radius: 5px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .photo-overlay__play-audio {
        padding: 5px;
        opacity: 0;
        transition: all 0.2s ease-out;
        background-color: rgba(125, 125, 125, 0);
        border-radius: 50%;
    }

    .photo-overlay__play-audio:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .photo-overlay__play-audio:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .centered-icon { /* иконка проигрывания музыки не была центирована; делаем ее центрированной */
        margin-left: 5px;
        margin-top: 2.5px;
        margin-bottom: 2.5px;
    }

    

    .song-info-container {
        display: flex;
        flex-direction: column;
        align-self: center;
        margin-left: 10px;
    }

    .song-info-container__name {
        font-size: 15px;
        margin-left: 5px; /* компнесировать отступ от паддинга artist-name, чтобы выровнять */
        
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .song-info-container__artist-name {
        font-size: 12px;
        padding: 2.5px 5px;
        width: fit-content;
        border-radius: 5px;
        color: rgb(70, 70, 70);
        transition: all 0.2s ease-out;
    }

    .song-info-container__artist-name:hover {
        text-decoration: none;
        background-color: rgba(125, 125, 125, 0.5);
        color: black;
    }

    .song-info-container__artist-name:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .song-actions-container {
        display: flex;
        align-self: center;
        margin-left: auto;
        opacity: 0;
        transition: all 0.5s ease-out;
        background-color: rgba(125, 125, 125, 0);
    }

    .song-actions-container__is-favourite {
        margin: 0px 2px;
        border-radius: 50%;
        transition: all 0.2s ease-out;
        padding: 5px;
    }

    .song-actions-container__is-favourite:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .song-actions-container__is-favourite:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .song-actions-container__add-to-playlist {
        margin: 0px 2px;
        border-radius: 50%;
        transition: all 0.2s ease-out;
        padding: 2px;
    }

    .song-actions-container__add-to-playlist:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .song-actions-container__add-to-playlist:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .icon {
        width: 30px;
        height: 30px;
    }
</style>