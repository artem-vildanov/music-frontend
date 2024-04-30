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
            <div class="song-actions-container__action">
                <img @click.prevent="removeFromFavourites()" v-show="song.isFavourite" class="icon" src="../../icons/liked.svg">
                <img @click.prevent="addToFavourites()" v-show="!song.isFavourite" class="icon" src="../../icons/not_liked.svg">
            </div>
            <div tabindex="0" class="song-actions-container__action open-hidden-actions">
                <img class="icon" src="/src/icons/more.svg">

                <div class="hidden-actions-container">
                    <div class="song-actions-container__action hidden-action">
                        <img @click.prevent="openModalWindow(`song_${song.id}`)" class="centered-icon icon" src="../../icons/playlist.svg">
                    </div>
                    <div v-show="song.artistId === userInfo.artistId" class="song-actions-container__action hidden-action">
                        <img class="centered-icon icon" src="../../icons/edit.svg">
                    </div>
                </div>

            </div>

        </div>

        <!-- вынести в отдельный компонент SelectPlaylist -->

        <div class="modal">
            <div class="modal__overlay"></div>
            <div class="modal__window">
                <select-playlist :song="song"></select-playlist>
            </div>
        </div>
    </div>
</template>

<script>
import PlaylistCard from "../playlist/PlaylistCard.vue";
import SelectPlaylist from "../playlist/SelectPlaylist.vue"
import api from "@/api"
    export default {
        name: "SongCard",

        components: {
            PlaylistCard,
            SelectPlaylist,
        },

        props: [
            'song'
        ],

        data() {
            return {
                imageError: null,
                photoSrc: `http://music.local:9005/photo/${this.song.photoPath}`,
                altPhotoSrc: "/src/icons/base_img.jpg",
                userInfo: this.$parent.userInfo,
                userPlaylists: null
            }
        },

        methods: {

            openModalWindow() {
                this.getUserPlaylists();

                const songCard = document.getElementById(`song_${this.song.id}`);
                const modal = songCard.querySelector('.modal')
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.overlayClickListener()
                }, 500)
            },

            getUserPlaylists() {
                api.get('http://music.local/api/playlists')
                .then( res => {
                    this.userPlaylists = res.data
                })
            },

            overlayClickListener() {
                const songCard = document.getElementById(`song_${this.song.id}`);

                const overlay = songCard.querySelector('.modal__overlay')
                overlay.addEventListener('click', this.hideModal);
            },

            hideModal() {
                const songCard = document.getElementById(`song_${this.song.id}`);
                const overlay = songCard.querySelector('.modal__overlay')
                const modal = songCard.querySelector('.modal')
                modal.style.visibility = "hidden"
                modal.style.opacity = "0"
                overlay.removeEventListener('click', this.hideModal)
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

    /*.centered-icon { !* иконка проигрывания музыки не была центирована; делаем ее центрированной *!*/
    /*    margin-left: 5px;*/
    /*    margin-top: 2.5px;*/
    /*    margin-bottom: 2.5px;*/
    /*}*/

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

    .song-actions-container__action {
        margin: 0px 2px;
        border-radius: 50%;
        transition: all 0.2s ease-out;
        padding: 5px;
        cursor: pointer;
    }

    .song-actions-container__action:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .song-actions-container__action:active {
        background-color: rgba(125, 125, 125, 1);
    }

    /*.hidden-action {*/
    /*    display: none;*/
    /*    visibility: hidden;*/
    /*    opacity: 0;*/
    /*    transition: opacity 0.2s, visibility 0.2s;*/
    /*}*/

    .hidden-actions-container {
        position: absolute;
        z-index: 5;
        top: -20px;
        left: 63px;

        background-color: rgb(215, 215, 215);
        border: solid 1px rgba(125, 125, 125, 0.5);
        border-radius: 10px;
        padding: 10px;
        height: 81px;

        visibility: hidden;
        opacity: 0;
        transition: opacity 0.5s, visibility 0.5s;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .open-hidden-actions {
        position: relative;
    }

    .open-hidden-actions:focus {
        background-color: rgba(125, 125, 125, 0.7);
    }

    .open-hidden-actions:focus .hidden-actions-container {
        visibility: visible;
        opacity: 1;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

    /** modal window */

    .modal {
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

    .modal__overlay {
        position: absolute;
        width: inherit;
        height: inherit;
        background-color: rgba(125, 125, 125, 0.2);
    }

    .modal__window {
        position: absolute;
        z-index: 21;
        height: 70vh;
        overflow-y: auto;
    }

    

    /*.pointer-events-none {*/
    /*    pointer-events: none;*/
    /*}*/
</style>