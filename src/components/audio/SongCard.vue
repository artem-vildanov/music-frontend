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
                <img @click.prevent="openModalWindow()" class="centered-icon icon" src="../../icons/playlist.svg">
            </div>
        </div>  

        <div id="modal" class="add-to-playlist-modal">
            <div id="overlay" class="add-to-playlist-modal__overlay">

            </div>
            <div class="add-to-playlist-modal__window" v-if="userPlaylists">
                <div class="playlists" >
                    <template v-for="playlist in userPlaylists">
                        <div class="playlist-card" :id="`playlist_${playlist.id}`">
                            <div class="selection-overlay"></div>
                            <div class="selection-unactive"></div>

                            <div class="playlist-photo-container">
                                <img class="playlist-photo-container__photo select-none" v-show="!imageError" :src="photoSrc" @error="this.imageError = true"> 
                                <img class="playlist-photo-container__photo select-none" v-show="imageError" :src="altPhotoSrc">
                            </div>

                            <div class="playlist-info">
                                <div class="playlist-info__name">
                                    {{ playlist.name }}
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import PlaylistCard from "../playlist/PlaylistCard.vue"
import api from "@/api"
    export default {
        name: "SongCard",

        components: {
            PlaylistCard
        },

        props: [
            'song'
        ],

        data() {
            return {
                imageError: null,
                photoSrc: `http://music.local:9005/photo/${this.song.photoPath}`,
                altPhotoSrc: "/src/icons/base_img.jpg",
                userPlaylists: null
            }
        },

        computed: {
            imageSource() {
                return `http://music.local:9005/photo/${this.song.photoPath}`
            }
        },

        methods: {
            getUserPlaylists() {
                api.get('http://music.local/api/playlists')
                .then( res => {
                    this.userPlaylists = res.data
                })
            },

            openModalWindow() {
                this.getUserPlaylists();

                const modal = document.getElementById("modal")
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.closeModalWindow(modal)
                }, 500)
            },

            closeModalWindow(modal) {
                const overlay = document.getElementById('overlay')
                overlay.addEventListener('click', hideModal)

                function hideModal() {
                    modal.style.visibility = "hidden"
                    modal.style.opacity = "0"
                    overlay.removeEventListener('click', hideModal)
                }
            },

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

    /** modal window */

    .add-to-playlist-modal {
        position: fixed;

        top:0;
        left:0;

        width: 100%;
        height: 100%;
        z-index: 20;

        display: flex;

        visibility: hidden;
        opacity: 0;

        justify-content: center;
        align-items: center;
        backdrop-filter: blur(15px);
        

        transition: opacity 0.5s, visibility 0.5s, backdrop-filter 0.2s; 
    }

    .add-to-playlist-modal__overlay {
        position: absolute;
        width: inherit;
        height: inherit;
        background-color: rgba(125, 125, 125, 0.2);
    }

    .add-to-playlist-modal__window {
        position: absolute;
        z-index: 21;
    }

    /** playlists group */

    .playlists {
        width: 424px; /** ширина при которой контейнер альбомов вмещает ровно два альбома по ширине */
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
        background-color: rgb(255, 255, 255);
        border-radius: 20px;
    }

    

    /** playlist card */

    .playlist-card {
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 15px;
        width: fit-content;
        height: fit-content; 

        /* width: 28%; */

        border: solid rgba(125, 125, 125, 0.5) 1px;
        border-radius: 10px;
        transition: all 0.5s ease-out;

        justify-content: center;
        align-items: center;
    }

    .playlist-selection-active {
        position:absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: gray;
        border: 5px solid gray;
        z-index:22;
    }

    .selection-overlay {
        position:absolute;
 
        transition: background-color 0.5s;
        width: 182px;
        height: 224px;
        

        z-index:22;
    }

    .selection-unactive {
        position:absolute;
        opacity: 0;
        transition: opacity 0.5s;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        
        border: 5px solid rgb(255, 255, 255);

        z-index:23;
    }

    .playlist-card:hover .selection-unactive {
        opacity: 1;
    }

    .playlist-card:hover .selection-overlay {
        background-color: rgba(124, 124, 124, 0.2);
    }

    .playlist-photo-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .playlist-photo-container__photo {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        overflow: hidden;
        pointer-events: none;
    }

    .playlist-info {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 15px;   
    }

    .playlist-info__name {
        max-width: 150px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
        font-weight: 200;
        color: rgb(70, 70, 70);
        
        padding: 2.5px 7px;
        border-radius: 10px;
        transition: all 0.2s ease-out; 
    }

    .pointer-events-none {
        pointer-events: none;
    }
</style>