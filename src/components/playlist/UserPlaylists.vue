<template>
    <div class="user-playlists">
        <div class="header">
            <div class="header__title">
                Ваши плейлисты
            </div>
            <div @click.prevent="openModalWindow()" title="Создать новый плейлист" class="header__create-new">
                <img src="@/icons/create.svg" class="icon">
            </div>
        </div>
        
        <div class="playlists">
            <template v-for="playlist in userPlaylists">
                <playlist-card :playlist="playlist"></playlist-card>
            </template>
        </div>
        
        <div class="modal" id="modal">
            <div class="modal__overlay" id="overlay"></div>
            <div class="modal__window">
                <create-playlist></create-playlist>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api'
import PlaylistCard from '../playlist/PlaylistCard.vue'
import CreatePlaylist from '../playlist/CreatePlaylist.vue'
    export default {
        name: "UserPlaylists",

        components: {
            PlaylistCard,
            CreatePlaylist
        },

        data() {
            return {
                userPlaylists: null,
            }
        },

        mounted() {
            this.getUserPlaylists()
        },

        methods: {
            getUserPlaylists() {
                api.get('http://music.local/api/playlists')
                .then( res => {
                    this.userPlaylists = res.data
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
            }
        }
    }
</script>

<style scoped>
    .user-playlists {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .header__title {
        /* font-weight: 600; */
        font-size: 25px;
        background-color: rgba(125, 125, 125, 0.1);
        width: fit-content;
        padding: 5px 10px;
        border-radius: 10px;
    }   

    .header__create-new {
        padding: 5px;
        border-radius: 50%;
        transition: background-color 0.2s ease-out;
    }

    .header__create-new:hover {
        background-color: rgba(125, 125, 125, 0.2);
    }

    .header__create-new:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .playlists {
        width: 424px; /** ширина при которой контейнер альбомов вмещает ровно два альбома по ширине */
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
        background-color: rgba(125, 125, 125, 0.1);
        border-radius: 20px;
    }

    .icon {
        width: 40px;
        height: 40px;
    }

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