<template>
    <div class="playlist" v-if="playlist">
        <div class="playlist-info">
            <div class="photo-container">
                <img class="playlist-photo select-none" :src="photoSrc">
            </div>
            <div class="info-container">
                <div class="playlist-name">
                    {{ playlist.name }}
                </div>
                <div class="playlist-actions-container">
                    <div @click.prevent="openEditPlaylistModal()" class="playlist-action">
                        <img class="icon select-none" src="/src/icons/edit.svg">
                    </div>
                </div>
            </div>
        </div>
   
        <div class="playlist-songs">
            <template v-for="song in songsCollection">
                <song-card :songProps="song"></song-card>
            </template>
        </div>

        <div class="modal" id="editPlaylistModal">
            <div class="modal__overlay" id="editPlaylistModalOverlay"></div>
            <div class="modal__window">
                <edit-playlist ref="editPlaylistRef" :playlist="playlist"></edit-playlist>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api";
import SongCard from "../audio/SongCard.vue";
import EditPlaylist from "../playlist/EditPlaylist.vue";

export default {
    name: "Playlist",
    components: {
        EditPlaylist,
        SongCard
    },

    data() {
        return {
            playlistId: null, 
            playlist: null,
            songsCollection: null,
            photoSrc: null,
        }
    },

    mounted() {
        this.playlistId = this.$route.params.id;
        this.getPlaylist();
        this.getPlaylistSongs();
    },

    methods: {
        /**
         * GET REQUESTS
         */

        getPlaylist() {
            const url = `http://music.local/api/playlists/${this.playlistId}`;
            api.get(url)
                .then( res => {
                    this.playlist = res.data;
                    this.photoSrc = `http://music.local:9005/photo/${this.playlist.photoPath}`;
                });
        },

        getPlaylistSongs() {
            const url = `http://music.local/api/playlists/${this.playlistId}/playlist-songs`;
            api.get(url)
            .then( res => {
                this.songsCollection = res.data
            })
        },

        /**
         *  MODAL
         */

        openEditPlaylistModal() {
            this.$refs.editPlaylistRef.onMounted();

            const modalId = "editPlaylistModal";
            const overlayId = "editPlaylistModalOverlay";
            this.openModal(overlayId, modalId);
        },

        openModal(overlayId, modalId) {
            const modal = document.querySelector(`#${modalId}`);
            
            modal.style.visibility = "visible";
            modal.style.opacity = "1";
            
            setTimeout(() => {
                this.overlayClickListener(overlayId, modalId);
            }, 500);
        },

        overlayClickListener(overlayId, modalId) {
            const overlay = document.querySelector(`#${overlayId}`);
            overlay.addEventListener('click', this.hideModal(overlayId, modalId));
        },

        hideModal(overlayId, modalId) {
            return () => {
                const modal = document.querySelector(`#${modalId}`);
                const overlay = document.querySelector(`#${overlayId}`);
                modal.style.visibility = "hidden";
                modal.style.opacity = "0";
                overlay.removeEventListener('click', this.hideModal(overlayId, modalId));
            };
        },
    }
}
</script>

<style scoped>
    .playlist {
        /* margin: 20px; */
        padding: 20px;
        display: flex;
        flex-direction: row;
        gap: 20px;

        width: fit-content;
    }

    .playlist-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        background-color: white;
        border-radius: 20px;
        padding: 20px;
        width: 300px;
    }

    .playlist-photo {
        width: 200px;
        height: 200px;
        border: 1px solid rgb(175, 175, 175);
        border-radius: 20px;
        pointer-events: none;
    }

    .playlist-songs {
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        padding: 15px 20px;
        background-color:rgba(125, 125, 125, 0.1);
        border-radius: 20px;

        width: 400px;
    }

    .photo-container {
        display: flex;
        align-items: center;
        
    }

    .info-container {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .playlist-name {
        font-size: 20px;
    }

    .playlist-actions-container {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .playlist-action {
        border-radius: 50%;
        display: flex;
        width: fit-content;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .playlist-action:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .playlist-action:active {
        background-color: gray;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

    /** MODAL */

    .modal {
        position: absolute;
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
    }
</style>