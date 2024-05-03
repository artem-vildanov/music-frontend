<template>
    <div class="album" v-if="album">
        <div class="album-info">
            <div class="photo-container">
                <img v-show="!imageError" class="album-photo select-none" :src="photoSrc" @error="imageError = true">
                <img v-show="imageError" class="album-photo select-none" :src="altPhotoSrc">
            </div>
            <div class="info-container">
                <div class="album-name">
                    {{ album.name }}
                </div>
                <router-link :to="{ name: 'artist.single', params: { id: album.artistId }}" class="artist-name">
                    {{ album.artistName }}
                </router-link>
                <div class="album-actions-container">
                    <div class="album-action">
                        <img v-show="album.isFavourite" class="icon select-none" src="../../icons/liked.svg">
                        <img v-show="!album.isFavourite" class="icon select-none" src="../../icons/not_liked.svg">
                    </div>
                    <div @click.prevent="openEditAlbumModal()" v-show="userInfo && album.artistId === userInfo.artistId" class="album-action">
                        <img class="icon select-none" src="/src/icons/edit.svg">
                    </div>
                    <div @click.prevent="openCreateSongModal()" v-show="userInfo && album.artistId === userInfo.artistId" class="album-action">
                        <img class="icon select-none" src="/src/icons/create.svg">
                    </div>
                </div>
            </div>
        </div>
   
        <div class="album-songs">
            <template v-for="song in albumSongs">
                <song-card :song="song"></song-card>
            </template>
        </div>

        <div class="modal" id="editAlbumModal">
            <div class="modal__overlay" id="editAlbumOverlay"></div>
            <div class="modal__window">
                <edit-album :album="album"></edit-album>
            </div>
        </div>
        <div class="modal" id="createSongModal">
            <div class="modal__overlay" id="createSongOverlay"></div>
            <div class="modal__window">
                <create-song></create-song>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../../api";
    import SongCard from "../audio/SongCard.vue";
    import EditAlbum from "../album/EditAlbum.vue";
    import CreateSong from "../audio/CreateSong.vue";
    import router from '@/router';
    
    export default {
        name: "Album",
        components: {
            SongCard, 
            EditAlbum,
            CreateSong
        },

        data() {
            return {
                imageError: false,
                albumId: this.$route.params.id, 
                album: null,
                albumSongs: null,
                photoSrc: null,
                altPhotoSrc: "/src/icons/base_img.jpg",
                userInfo: null
            }
        },

        mounted() {
            this.getAlbum();
            this.getAlbumSongs();
            this.getUserInfo();
        },

        methods: {
            getAlbum() {
                const url = `http://music.local/api/albums/${this.albumId}`;
                api.get(url)
                    .then( res => {
                        this.album = res.data;
                        this.photoSrc = `http://music.local:9005/photo/${this.album.photoPath}`;
                    });
            },

            getAlbumSongs() {
                const url = `http://music.local/api/albums/${this.albumId}/songs/album-songs`;
                api.get(url)
                .then( res => {
                    this.albumSongs = res.data
                })
            },

            getUserInfo() {
                const url = `http://music.local/api/auth/me`;
                api.get(url)
                    .then( res => {
                        this.userInfo = res.data
                    })
            },

            openCreateSongModal() {
                const modalId = "createSongModal";
                const overlayId = "createSongOverlay";
                this.openModal(overlayId, modalId);
            },

            openEditAlbumModal() {
                const modalId = "editAlbumModal";
                const overlayId = "editAlbumOverlay";
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
    .album {
        /* margin: 20px; */
        padding: 20px;
        display: flex;
        flex-direction: row;
        gap: 20px;

        width: fit-content;
    }

    .album-info {
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
        border: 1px solid rgb(175, 175, 175);
        border-radius: 20px;
        pointer-events: none;
    }

    .album-songs {
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
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .album-name {
        font-size: 20px;
        margin-top: 10px;
    }

    .artist-name {
        font-size: 15px;
        padding: 2.5px 7px;
        margin-bottom: 5px;
        border-radius: 10px;
        color: rgb(70, 70, 70);
        transition: all 0.2s ease-out;
    }

    .artist-name:hover {
        text-decoration: none;
        background-color: rgba(125, 125, 125, 0.4);
        color: black;
    }

    .artist-name:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .album-actions-container {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .album-action {
        border-radius: 50%;
        display: flex;
        width: fit-content;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .album-action:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .album-action:active {
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