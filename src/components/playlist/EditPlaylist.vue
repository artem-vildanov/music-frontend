<template>
    <div class="edit-playlist">
        <div class="title">
            Изменить плейлист
        </div>
        <div class="input-fields-container">

            <div class="select-name">
                <label for="playlistNameInput" class="input-name-label">Введите имя плейлиста</label>
                <input id="playlistNameInput" :placeholder="oldPlaylistName" v-model="newPlaylistName" type="text" class="input-name">                
            </div>
            
            <div class="select-image">
                <label for="imgInput" class="input-image-label">Выбрать обложку</label>
                <input id="imgInput" type="file" accept="image/png">
                <img id="imagePreview" :src="photoSrc" class="image-preview">            
            </div>
        </div>
        <div class="buttons-container">
            <input type="submit" :disabled="!buttonClickabilityChecker()" @click.prevent="editPlaylist()" class="submit-button" value="Изменить">
                
            <div @click.prevent="deletePlaylist()" class="submit-button danger">
                Удалить
            </div>
        </div>
    </div>
    <div class="modal" id="deletePlaylistModal">
        <div class="modal-overlay" id="deletePlaylistModalOverlay"></div>
        <div class="modal-window">
            <delete-playlist :playlist="playlist"></delete-playlist>
        </div>
    </div>
</template>
<script>
import api from '@/api';
import DeletePlaylist from './DeletePlaylist.vue';

    export default {
        name: 'EditPlaylist',

        components: {
            DeletePlaylist
        },

        data() {
            return {
                photoSrc: `http://music.local:9005/photo/${this.playlist.photoPath}`,
                playlistImage: null,
                oldPlaylistName: this.playlist.name,
                newPlaylistName: '',
                selectedGenre: null,
            }
        },

        props: [
            'playlist'
        ],

        methods: {
            onMounted() {
                this.imgInputPreview();
            },

            imgInputPreview() {
                const fileInput = document.getElementById('imgInput');
                const imagePreview = document.getElementById('imagePreview');

                fileInput.addEventListener('change', (event) => {
                    this.playlistImage = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.playlistImage);
                });
            },

            buttonClickabilityChecker() {
                return this.playlistImage !== null || this.newPlaylistName !== '';
            },

            async editPlaylist() {
                await this.editPlaylistName();
                await this.editPlaylistImage();
                await this.displayUpdatedPlaylist();
                this.hideModal();
            },

            async editPlaylistName() {
                if (this.newPlaylistName) {
                    const url = `http://music.local/api/playlists/${this.playlist.id}/update-playlist-name`;
                    const jsonData = {
                        name: this.newPlaylistName,
                    };

                    await api.post(url, jsonData);
                }
            },

            async editPlaylistImage() {
                if (this.playlistImage) {
                    const url = `http://music.local/api/playlists/${this.playlist.id}/update-playlist-photo`;
                    const formData = this.makeImageFormData();
                    await api.post(url, formData);
                }
            },

            makeImageFormData() {
                const formData = new FormData();
                formData.append('photo', this.playlistImage);
                return formData;
            },

            async displayUpdatedPlaylist() {
                const response = await this.getUpdatedPlaylist();
                const updatedPlaylist = response.data;
                this.$parent.$data.playlist = updatedPlaylist;
                this.$parent.$data.photoSrc = `http://music.local:9005/photo/${updatedPlaylist.photoPath}`;
            },

            getUpdatedPlaylist() {
                const url = `http://music.local/api/playlists/${this.playlist.id}`;
                return api.get(url);
            },

            hideModal() {
                const modalId = "editPlaylistModal";
                const overlayId = "editPlaylistModalOverlay";
                
                const hideModalCallback = this.$parent.hideModal(overlayId, modalId);
                hideModalCallback();
            },

            /**
             *  DELETE ALBUM MODAL
             */

            deletePlaylist() {
                const overlayId = "deletePlaylistModalOverlay";
                const modalId = "deletePlaylistModal";
                this.openDeletePlaylistModal(overlayId, modalId);
            },

            openDeletePlaylistModal(overlayId, modalId) {
                const modal = document.querySelector(`#${modalId}`);
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.overlayClickListener(overlayId, modalId);
                }, 500)
            },

            overlayClickListener(overlayId, modalId) {
                const overlay = document.querySelector(`#${overlayId}`);
                overlay.addEventListener('click', this.hideDeletePlaylistModal(overlayId, modalId));
            },

            hideDeletePlaylistModal(overlayId, modalId) {
                return () => {
                    const overlay = document.querySelector(`#${overlayId}`);
                    const modal = document.querySelector(`#${modalId}`);
                    modal.style.visibility = "hidden"
                    modal.style.opacity = "0"
                    overlay.removeEventListener('click', this.hideDeletePlaylistModal(overlayId, modalId))
                }
            },
        }
    }
</script>
<style scoped>
    .edit-playlist {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 1);
        border: solid 1px rgba(125, 125, 125, 0.4);
        padding: 20px;
        border-radius: 20px;

        display: flex;
        flex-direction: column;
        gap: 20px;

        /* overflow-y:scroll; */
    }

    .title {
        font-size: 20px;
        width: fit-content;
        padding: 2.5px 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
    }

    .input-fields-container {
        display: flex;
        flex-direction: column;
        
        
        gap: 20px;
        padding: 20px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 20px;
    }

    .input-name {
        padding: 5px;
        border-radius: 10px;
        border: 1px solid gray;
    }

    .input-name:focus{
        /* border: 1px solid gray; */
        outline: 0;
    }

    .select-name {
        display: flex;
        flex-direction: column;
        /* background-color:  rgba(125, 125, 125, 0.2); 
        padding: 20px;
        border-radius: 10px; */
    }

    .select-image {
        display: flex;
        flex-direction: column;
    }

    .select-image {
        display: flex;
        flex-direction: column;        
    }

    .input-image-label {
        font-size: 15px;
        width: fit-content;

        background-color: rgba(125, 125, 125, 0.2);
        padding: 5px 10px;
        border-radius: 10px;
        
        transition: background-color 0.2s;
    }

    .input-image-label:hover {
        background-color: rgba(125, 125, 125, 0.4);
    }

    .image-preview {
        width: 200px;
        height: 200px;
        border: 1px solid rgb(175, 175, 175);
        border-radius: 20px;
        overflow: hidden;
        pointer-events: none;
    }

    .buttons-container {
        display: flex;
        flex-direction: row;
        gap: 20px;
    }

    .submit-button {
        padding: 3px 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
        width: fit-content;
        font-size: 20px;
        transition: 0.2s background-color;
        cursor: pointer;
    }

    .submit-button:hover {
        background-color: rgba(125, 125, 125, 0.4);
    }

    .submit-button:active {
        background-color: rgba(125, 125, 125, 0.8);
    }

    .danger {
        outline: 1px solid red;
        color: red;
    }
    
    input[type="file"] {
        display: none;
    }

    .modal {
        position: fixed;

        top:0;
        left:0;

        width: 100%;
        height: 100%;
        z-index: 50;

        display: flex;

        visibility: hidden;
        opacity: 0;

        justify-content: center;
        align-items: center;
        backdrop-filter: blur(15px);
        

        transition: opacity 0.5s, visibility 0.5s, backdrop-filter 0.2s; 
    }

    .modal-overlay {
        z-index: 51;
        position: absolute;
        width: inherit;
        height: inherit;
        background-color: rgba(125, 125, 125, 0.2);
    }

    .modal-window {
        position: absolute;
        z-index: 52;
        max-height: 70vh;
        overflow-y: auto;
    }

</style>