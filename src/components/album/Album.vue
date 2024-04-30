<template>
    <div class="album-container" v-if="album">
        <div class="dashboard">
            <div class="photo-container">
                <img v-show="!imageError" class="album-photo select-none" :src="photoSrc" @error="imageError = true">
                <img v-show="imageError" class="album-photo select-none" :src="altPhotoSrc">
            </div>
            <div class="info-container">
                <div class="info-container__album-name">
                    {{ album.name }}
                </div>
                <router-link :to="{ name: 'artist.single', params: { id: album.artistId }}" class="info-container__artist-name">
                    {{ album.artistName }}
                </router-link>
                <div class="info-container__actions-container">
                    <div class="actions-container__action">
                        <img v-show="album.isFavourite" class="icon select-none" src="../../icons/liked.svg">
                        <img v-show="!album.isFavourite" class="icon select-none" src="../../icons/not_liked.svg">
                    </div>
                    <div @click.prevent="openModalWindow()" v-show="album.artistId === userInfo.artistId" class="actions-container__action">
                        <img class="icon select-none" src="/src/icons/edit.svg">
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
        <div class="modal" id="modal">
            <div class="modal__overlay" id="overlay"></div>
            <div class="modal__window">
                <edit-album :album="album"></edit-album>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "../../api";
    import SongCard from "../audio/SongCard.vue";
    import CreateAlbum from "../album/CreateAlbum.vue";
    import EditAlbum from "../album/EditAlbum.vue";
    import router from '@/router';
    
    export default {
        name: "Album",
        components: {SongCard, EditAlbum},
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

        // computed: {
        //     photoSrc() {
        //         if (this.album) {
        //             return `http://music.local:9005/photo/${this.album.photoPath}`
        //         }
        //     }
        // },

        mounted() {
            this.getAlbum();
            this.getAlbumSongs();
            this.getUserInfo();
        },

        methods: {
            getAlbum() {
                api.get(`http://music.local/api/albums/${this.albumId}`)
                    .then( res => {
                        this.album = res.data;
                        this.photoSrc = `http://music.local:9005/photo/${this.album.photoPath}`;
                    });
            },

            getAlbumSongs() {
                api.get(`http://music.local/api/albums/${this.albumId}/songs/album-songs`)
                .then( res => {
                    this.albumSongs = res.data
                    console.log(this.albumSongs)
                })
            },

            getUserInfo() {
                api.get(`http://music.local/api/auth/me`)
                    .then( res => {
                        this.userInfo = res.data
                    })
            },

            openModalWindow() {
                const modal = document.getElementById("modal")
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.overlayClickListener()
                }, 500)
            },

            overlayClickListener() {
                const overlay = document.getElementById('overlay')
                overlay.addEventListener('click', this.hideModal)
            },

            hideModal() {
                const modal = document.getElementById("modal")
                const overlay = document.getElementById('overlay')
                modal.style.visibility = "hidden"
                modal.style.opacity = "0"
                overlay.removeEventListener('click', this.hideModal)
            },

            updatePage() {
                router.push({ name: 'album.single', params: {id: this.album.id}});
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

    .info-container__album-name {
        font-size: 20px;
        margin-top: 10px;
    }

    .info-container__artist-name {
        font-size: 15px;
        padding: 2.5px 7px;
        margin-bottom: 5px;
        border-radius: 10px;
        color: rgb(70, 70, 70);
        transition: all 0.2s ease-out;
    }

    .info-container__artist-name:hover {
        text-decoration: none;
        background-color: rgba(125, 125, 125, 0.4);
        color: black;
    }

    .info-container__artist-name:active {
        background-color: rgba(125, 125, 125, 1);
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
    }
</style>