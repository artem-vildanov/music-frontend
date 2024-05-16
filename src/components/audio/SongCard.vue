<template>
    <div :class="`song-card ${songCardSelection}`" :id="`song_${song.id}`">

        <div class="song-photo-container">
            <div class="song-photo-overlay">
                <div @click.prevent="playSong()" class="play-audio-action">
                    <img class="icon select-none" src="../../icons/play.svg">
                </div>
            </div>
            <img class="song-photo select-none" :src="photoSrc">
        </div>

        <div class="song-info-container">
            <div :title="song.name" class="song-name">
                {{ song.name }}
            </div>
            <router-link :to="{ name: 'artist.single', params: { id: song.artistId }}" class="artist-name">
                {{ song.artistName }}
            </router-link>
        </div>

        <div class="song-actions-container">
            <div class="song-action">
                <img @click.prevent="removeFromFavourites()" v-show="song.isFavourite" class="icon" src="../../icons/liked.svg">
                <img @click.prevent="addToFavourites()" v-show="!song.isFavourite" class="icon" src="../../icons/not_liked.svg">
            </div>
            <div tabindex="0" class="song-action open-hidden-actions">
                <img class="icon" src="/src/icons/more.svg">

                <div class="hidden-actions-container">
                    <div class="song-action hidden-action">
                        <img @click.prevent="enqueueSong(song)" class="centered-icon icon" src="../../icons/add_to_queue.svg">
                    </div>
                    <div class="song-action hidden-action">
                        <img @click.prevent="openModalAddToPlaylist()" class="centered-icon icon" src="../../icons/add_to_playlist.svg">
                    </div>
                    <div class="song-action hidden-action">
                        <img @click.prevent="openModalDeleteFromPlaylists()" class="centered-icon icon" src="../../icons/delete_from_playlist.svg">
                    </div>
                    <div v-show="userInfo && song.artistId === userInfo.artistId" class="song-action hidden-action">
                        <img @click.prevent="openModalEditSong()" class="centered-icon icon" src="../../icons/edit.svg">
                    </div>
                </div>

            </div>

        </div>

        <div class="modal" id="addToPlaylistModal">
            <div class="modal__overlay" id="addToPlaylistModalOverlay"></div>
            <div class="modal__window">
                <add-to-playlist ref="addToPlaylistRef" :song="song"></add-to-playlist>
            </div>
        </div>
        <div class="modal" id="deleteFromPlaylistModal">
            <div class="modal__overlay" id="deleteFromPlaylistModalOverlay"></div>
            <div class="modal__window">
                <delete-from-playlist ref="deleteFromPlaylistRef" :song="song"></delete-from-playlist>
            </div>
        </div>
        <div class="modal" id="editSongModal">
            <div class="modal__overlay" id="editSongModalOverlay"></div>
            <div class="modal__window">
                <edit-song :song="song"></edit-song>
            </div>
        </div>
    </div>
</template>

<script>
import PlaylistCard from "../playlist/PlaylistCard.vue";
import AddToPlaylist from "../playlist/AddToPlaylist.vue";
import DeleteFromPlaylist from "../playlist/DeleteFromPlaylist.vue";
import api from "@/api"
import EditSong from "./EditSong.vue";
import { mapActions, mapGetters, mapMutations } from 'vuex';

    export default {
        name: "SongCard",

        components: {
            PlaylistCard,
            AddToPlaylist,
            DeleteFromPlaylist,
            EditSong
        },

        props: [
            'songProps'
        ],

        data() {
            return {
                song: this.songProps,
                imageError: null,
                photoSrc: `http://music.local:9005/photo/${this.songProps.photoPath}`,
                userInfo: this.$parent.userInfo,
            }
        },

        computed: {
            ...mapGetters([
                'getCurrentSong',
            ]),

            songCardSelection() {
                if (this.getCurrentSong && this.getCurrentSong.id === this.song.id) {
                    return 'selected-song';
                }
            }
        },

        methods: {
            ...mapMutations([
                'enqueueSong',
            ]),

            ...mapActions({
                playSongMakeQueue: 'playSong',
            }),

            playSong() {
                const songId = this.song.id;
                const songsQueue = this.$parent.$data.songsCollection;
                const playPromise = this.playSongMakeQueue({ songId: songId, songsCollection: songsQueue});
                playPromise.catch(error => console.log(error.message));
            },

            openModalEditSong() {
                const overlayId = "editSongModalOverlay";
                const modalId = "editSongModal";

                this.openModal(overlayId, modalId);
            },

            openModalAddToPlaylist() {
                const overlayId = "addToPlaylistModalOverlay";
                const modalId = "addToPlaylistModal";

                this.$refs.addToPlaylistRef.getUserPlaylists();
                this.openModal(overlayId, modalId);
            },

            openModalDeleteFromPlaylists() {
                const overlayId = "deleteFromPlaylistModalOverlay";
                const modalId = "deleteFromPlaylistModal";

                this.$refs.deleteFromPlaylistRef.getUserPlaylists();
                this.openModal(overlayId, modalId);
            },

            openModal(overlayId, modalId) {
                const songCard = document.getElementById(`song_${this.song.id}`);
                const modal = songCard.querySelector(`#${modalId}`);
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.overlayClickListener(overlayId, modalId);
                }, 500)
            },

            overlayClickListener(overlayId, modalId) {
                const songCard = document.getElementById(`song_${this.song.id}`);
                const overlay = songCard.querySelector(`#${overlayId}`);
                overlay.addEventListener('click', this.hideModal(overlayId, modalId));
            },

            hideModal(overlayId, modalId) {
                return () => {
                    const songCard = document.getElementById(`song_${this.song.id}`);
                    const overlay = songCard.querySelector(`#${overlayId}`);
                    const modal = songCard.querySelector(`#${modalId}`);
                    modal.style.visibility = "hidden"
                    modal.style.opacity = "0"
                    overlay.removeEventListener('click', this.hideModal(overlayId, modalId))
                }
            },

            addToFavourites() {
                api.put(`http://music.local/api/favourite/songs/add-to-favourites/${this.song.id}`)
                this.song.isFavourite = true
            },

            removeFromFavourites() {
                api.put(`http://music.local/api/favourite/songs/delete-from-favourites/${this.song.id}`)
                this.song.isFavourite = false
            },
        }
    }
</script>

<style scoped>
    .selected-song {
        outline: solid 5px rgb(206, 206, 206)    
    }

    .song-card {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 5px 0px;
        padding: 10px;
        border: solid 1px rgba(125, 125, 125, 0.5);
        border-radius: 10px;
        transition: background-color 0.5s ease-out;
    }

    .song-card:hover {
        background-color: rgba(125, 125, 125, 0.2);
    }

    .song-card:hover .song-photo-overlay {
        background-color: rgba(255, 255, 255, 0.7);
    }

    .song-card:hover .play-audio-action {
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

    .song-photo {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        border: 0.5px solid rgb(175, 175, 175);
    }

    .song-photo-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0); 
        transition: 0.5s ease-out;
        border-radius: 10px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .play-audio-action {
        padding: 5px;
        opacity: 0;
        transition: all 0.2s ease-out;
        background-color: rgba(125, 125, 125, 0);
        border-radius: 50%;
    }

    .play-audio-action:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .play-audio-action:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .song-info-container {
        display: flex;
        flex-direction: column;
        align-self: center;
        margin-left: 10px;
    }

    .song-name {
        font-size: 15px;
        margin-left: 5px; /* компнесировать отступ от паддинга artist-name, чтобы выровнять */
        
        max-width: 150px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .artist-name {
        font-size: 12px;
        padding: 2.5px 5px;
        width: fit-content;
        border-radius: 5px;
        color: rgb(70, 70, 70);
        transition: all 0.2s ease-out;
    }

    .artist-name:hover {
        text-decoration: none;
        background-color: rgba(125, 125, 125, 0.5);
        color: black;
    }

    .artist-name:active {
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

    .song-action {
        margin: 0px 2px;
        border-radius: 50%;
        transition: all 0.2s ease-out;
        padding: 5px;
        cursor: pointer;
    }

    .song-action:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .song-action:active {
        background-color: rgba(125, 125, 125, 1);
    }

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
        max-height: 70vh;
        overflow-y: auto;
        
    }

    

    /*.pointer-events-none {*/
    /*    pointer-events: none;*/
    /*}*/
</style>