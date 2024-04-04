<template>
    
    <div class="song-card">

        <div class="photo-container">
            <div class="photo-container__photo-overlay">
                <div class="photo-overlay__play-audio">
                    <img class="centered-icon icon select-none" src="../../icons/play.svg">
                </div>
            </div>
            <img class="photo-container__photo select-none" v-show="!imageError" :src="photoSrc" @error="this.imageError = true">
            <img class="photo-container__photo select-none" v-show="imageError" :src="altPhotoSrc">
        </div>

        <div class="info-container">
            <div class="info-container__name">
                {{ song.name }}
            </div>
            <div class="info-container__artist-name">
                {{ song.artistName }}
            </div>
        </div>

        <div class="actions-container">
            <div class="actions-container__is-favourite">
                <img v-show="song.isFavourite" class="icon" src="../../icons/liked.svg">
                <img v-show="!song.isFavourite" class="icon" src="../../icons/not_liked.svg">
            </div>
            <div class="actions-container__add-to-playlist">
                <img class="centered-icon icon" src="../../icons/playlist.svg">
            </div>
        </div>  
    </div>
</template>

<script>
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
        border: solid 1px gray;
        border-radius: 10px;
        transition: 0.5s ease-out;
    }

    .song-card:hover {
        background-color: rgba(125, 125, 125, 0.1);
    }

    .song-card:hover .photo-container__photo-overlay {
        background-color: rgba(255, 255, 255, 0.7);
    }

    .song-card:hover .photo-overlay__play-audio {
        opacity: 1;
    }

    .song-card:hover .actions-container {
        opacity: 1;
    }

    .photo-container {        
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .photo-container__photo {
        width: 60px;
        height: 60px;
        border-radius: 5px;
    }

    .photo-container__photo-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0); 
        transition: 0.5s ease-out;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .photo-overlay__play-audio {
        padding: 5px;
        opacity: 0;
        transition: all 0.5s ease-out;
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

    

    .info-container {
        display: flex;
        flex-direction: column;
        align-self: center;
        margin-left: 10px;
    }

    .info-container__name {
        font-size: 15px;
    }

    .info-container__artist-name {
        font-size: 10px;
    }

    .actions-container {
        display: flex;
        align-self: center;
        margin-left: auto;
        opacity: 0;
        transition: all 0.5s ease-out;
        background-color: rgba(125, 125, 125, 0);
    }

    .actions-container__is-favourite {
        margin: 0px 2px;
        border-radius: 50%;
        transition: all 0.5s ease-out;
        padding: 5px;
    }

    .actions-container__is-favourite:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .actions-container__is-favourite:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .actions-container__add-to-playlist {
        margin: 0px 2px;
        border-radius: 50%;
        transition: all 0.5s ease-out;
        padding: 2px;
    }

    .actions-container__add-to-playlist:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .actions-container__add-to-playlist:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .icon {
        width: 30px;
        height: 30px;
    }
</style>