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
                <img @click.prevent="openModalWindow(`song_${song.id}`)" class="centered-icon icon" src="../../icons/playlist.svg">
            </div>
        </div>

        <!-- вынести в отдельный компонент SelectPlaylist -->

        <div class="modal">
            <div class="modal__overlay"></div>
            <div class="modal__window">
                <div class="playlist-selection">
                    <div class="title">
                        Выберите плейлисты
                    </div>
                    <div class="playlists" v-show="userPlaylists">
                        <template v-for="playlist in userPlaylists">
                            <div class="playlist-card" :id="`playlist_${playlist.id}`">

                                <div v-if="checkIfSongInPlaylist(playlist.id)" class="unavailable-playlist">
                                    Плейлист<br>
                                    уже содержит
                                    этот трек
                                </div>

                                <template v-if="!checkIfSongInPlaylist(playlist.id)">
                                    <div class="selection-overlay"></div>
                                    <div @click.prevent="selectPlaylist(playlist.id)" class="selection-mark"></div>
                                </template>

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
                    <div @click.prevent="addSongToPlaylists()" class="submit-button">
                        Добавить
                    </div>
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
                userPlaylists: null,
                selectedPlaylists: []
            }
        },

        mounted() {
            console.log(this.song)
        },

        methods: {

            // TODO вынести в отдельный компонент для выбора плейлиста

            getUserPlaylists() {
                api.get('http://music.local/api/playlists')
                .then( res => {
                    this.userPlaylists = res.data
                })
            },

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

            selectPlaylist(selectedPlaylistId) {
                const songCard = document.getElementById(`song_${this.song.id}`)
                const playlist = songCard.querySelector(`#playlist_${selectedPlaylistId}`);

                const selectionOverlay = playlist.querySelector('.selection-overlay');
                const selectionMark = playlist.querySelector('.selection-mark');

                if (selectionOverlay.classList.contains("selected") && selectionMark.classList.contains("selected")) {
                    selectionOverlay.classList.remove("selected");
                    selectionMark.classList.remove("selected");
                    removeFromSelected.bind(this)(selectedPlaylistId)
                } else {
                    selectionOverlay.classList.add("selected");
                    selectionMark.classList.add("selected");
                    this.selectedPlaylists.push(selectedPlaylistId);
                }

                function removeFromSelected(elementToRemove) {
                    let index = this.selectedPlaylists.indexOf(elementToRemove);

                    if (index !== -1) {
                        this.selectedPlaylists.splice(index, 1);
                    }
                }
            },

            addSongToPlaylists() {
                this.selectedPlaylists.forEach( playlistId => {
                    api.put(`http://music.local/api/playlists/${playlistId}/add-song/${this.song.id}`)
                        .then( res=> {
                            this.hideModal();
                            this.song.containedInPlaylists.push({ id: playlistId })
                        })
                })

            },

            checkIfSongInPlaylist(playlistId) {
                const playlistsWithSong = []
                this.song.containedInPlaylists.forEach((element) => {
                    playlistsWithSong.push(element.id)
                })

                return playlistsWithSong.includes(playlistId);
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
        cursor: pointer;
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
        cursor: pointer;
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
    }

    /** playlists group */

    .playlists {
        width: 424px; /** ширина при которой контейнер альбомов вмещает ровно два альбома по ширине */
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 20px;
    }


    /** selection */

    .playlist-selection {
        background-color: white;
        border-radius: 20px;
        padding: 20px;
        width: fit-content;

        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .title {
        width: fit-content;
        background-color: rgba(125, 125, 125, 0.2);
        padding: 5px 10px;
        border-radius: 10px;
        font-size: 20px;
    }

    .submit-button {
        background-color: rgba(125, 125, 125, 0.2);
        padding: 5px 10px;
        border-radius: 10px;
        width: fit-content;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .submit-button:hover {
        background-color: rgba(125, 125, 125, 0.4);
    }

    .submit-button:active {
        background-color: rgba(125, 125, 125, 0.8);
    }

    .selection-overlay {
        position:absolute;
        z-index:22;

        background-color: rgba(124, 124, 124, 0.2);
        border-radius: 10px;
        width: 182px;
        height: 224px;

        transition: opacity 0.5s;
        opacity: 0;
    }

    .selection-mark {
        position:absolute;
        opacity: 0;
        transition: opacity 0.5s, background-color 0.2s;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
        border: 5px solid white;

        z-index:23;
    }

    .selection-mark:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }

    .selection-mark:active {
        background-color: rgba(255, 255, 255, 0.6);
    }

    .playlist-card:hover .selection-mark {
        opacity: 1;
    }

    .playlist-card:hover .selection-overlay {
        opacity: 1;
    }

    .selected {
        opacity: 1;
    }

    .selection-mark.selected {
        background-color: white;
    }

    .unavailable-playlist {
        position:absolute;
        z-index:22;

        background-color: rgba(124, 124, 124, 0.4);
        border-radius: 10px;
        width: 182px;
        height: 224px;

        display: flex;
        justify-content: center;
        align-items: center;
        padding: 25px;
        font-size: 15px;
        text-align: center;
        font-weight: bold;
        color: white;
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

    /*.pointer-events-none {*/
    /*    pointer-events: none;*/
    /*}*/
</style>