<template>
    <div class="artist-container" v-if="artist">
        <div class="dashboard"><!-- display flex flex-dir: row-->
            <div class="photo-container"><!-- photo styles -->
                <img class="artist-photo select-none" :src="photoSrc">
            </div>
            <div class="info-container"><!-- dis: flex; flex-dir: column; -->
                <div class="info-container__artist-name">
                    {{ artist.name }}
                </div>
                <div class="info-container__actions-container">
                    <div class="actions-container__action">
                        <img @click.prevent="removeFromFavourites()" v-show="artist.isFavourite" class="icon select-none" src="../../icons/liked.svg">
                        <img @click.prevent="addToFavourites()" v-show="!artist.isFavourite" class="icon select-none" src="../../icons/not_liked.svg">
                    </div>
                    <div @click.prevent="openModalEditArtist()" v-show="userInfo && artist.id === userInfo.artistId" class="actions-container__action">
                        <img class="icon select-none" src="/src/icons/edit.svg">
                    </div>
                    <div @click.prevent="openModalCreateAlbum()" v-show="userInfo && artist.id === userInfo.artistId" class="actions-container__action">
                        <img class="icon select-none" src="/src/icons/create.svg">
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
        <div class="modal" id="editArtistModal">
            <div class="modal-overlay" id="editArtistModalOverlay"></div>
            <div class="modal-window">
                <edit-artist ref="editArtistRef" :artist="artist"></edit-artist>
            </div>
        </div>
        <div class="modal" id="createAlbumModal">
            <div class="modal-overlay" id="createAlbumOverlay"></div>
            <div class="modal-window">
                <create-album ref="createAlbumRef"></create-album>
            </div>
        </div>
    </div>
</template>

<script>
import api from "../../api";
import AlbumCard from "../album/AlbumCard.vue";
import CreateAlbum from "../album/CreateAlbum.vue";
import EditArtist from "../artist/EditArtist.vue";
    export default {
        name: "Artist",
        components: {
            AlbumCard,
            CreateAlbum,
            EditArtist
        },
        data() {
            return {
                artistId: this.$route.params.id,
                artist: null,
                artistAlbums: null,
                photoSrc: null,
                userInfo: null
            }
        },

        mounted() {
            this.getArtist();
            this.getArtistAlbums();
            this.getUserInfo();
        },

        methods: {

            /** GET REQUESTS */

            getArtist() {
                api.get(`http://music.local/api/artists/${this.artistId}`)
                    .then( res => {
                        this.artist = res.data;
                        this.photoSrc = `http://music.local:9005/photo/${this.artist.photoPath}`;
                    })
            },

            getArtistAlbums() {
                api.get(`http://music.local/api/albums/created-by-artist/${this.artistId}`)
                    .then( res => {
                        this.artistAlbums = res.data
                    })
            },

            getUserInfo() {
                api.get(`http://music.local/api/auth/me`)
                    .then( res => {
                        this.userInfo = res.data
                    })
            },

            /** MODAL */

            openModalEditArtist() {
                this.$refs.editArtistRef.onMounted();

                const overlayId = "editArtistModalOverlay";
                const modalId = "editArtistModal";

                this.openModal(overlayId, modalId);
            },

            openModalCreateAlbum() {
                this.$refs.createAlbumRef.onMounted();

                const overlayId = "createAlbumOverlay";
                const modalId = "createAlbumModal";

                this.openModal(overlayId, modalId);
            },

            openModal(overlayId, modalId) {
                const modal = document.querySelector(`#${modalId}`);
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.overlayClickListener(overlayId, modalId);
                }, 500)
            },

            overlayClickListener(overlayId, modalId) {
                const overlay = document.querySelector(`#${overlayId}`);
                overlay.addEventListener('click', this.hideModal(overlayId, modalId));
            },

            hideModal(overlayId, modalId) {
                return () => {
                    const overlay = document.querySelector(`#${overlayId}`);
                    const modal = document.querySelector(`#${modalId}`);
                    modal.style.visibility = "hidden"
                    modal.style.opacity = "0"
                    overlay.removeEventListener('click', this.hideModal(overlayId, modalId))
                }
            },

            addToFavourites() {
                api.put(`http://music.local/api/favourite/artists/add-to-favourites/${this.artist.id}`)
                this.artist.isFavourite = true
            },

            removeFromFavourites() {
                api.put(`http://music.local/api/favourite/artists/delete-from-favourites/${this.artist.id}`)
                this.artist.isFavourite = false
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
        width: fit-content;
    }

    .dashboard {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 300px;
        height: fit-content;
        background-color: rgba(125, 125, 125, 0.1);
        border-radius: 20px;
        padding: 20px;
    }

    .artist-photo {
        width: 200px;
        height: 200px;
        border-radius: 100%;
        pointer-events: none; 
        border: 1px solid rgb(175, 175, 175);
    }

    .artist-content {
        width: 450px;
        /* border: 2px solid black; */

        /* padding: 20px;
        background-color: white;
        border-radius: 20px; */
    }

    .albums {
        width: inherit;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 20px;
        background-color: rgba(125, 125, 125, 0.1);
        border-radius: 20px;
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

    .info-container__actions-container {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .actions-container__action {
        border-radius: 50%;
        display: flex;
        width: fit-content;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .actions-container__action:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .actions-container__action:active {
        background-color: gray;
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

    .modal-overlay {
        position: absolute;
        width: inherit;
        height: inherit;
        background-color: rgba(125, 125, 125, 0.2);
    }

    .modal-window {
        position: absolute;
        z-index: 21;
        max-height: 70vh;
        overflow-y: auto;
    }

</style>