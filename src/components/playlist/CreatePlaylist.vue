<template>
    <div class="create-playlist">
        <div class="title">
            Создать новый плейлист
        </div>

        <div id="playlistForm" class="input-fields-container">
            <input v-model="playlistName" placeholder="Название плейлиста" type="text" class="input-fields-container__playlist-name">
            <label for="imageInput" class="input-fields-container__file-input-label">Выбрать обложку</label>
            <input id="imageInput" type="file" accept="image/png" class="input-fields-container__file-input">
            <img id="imagePreview" src="" class="input-fields-container__input-image">
        </div>
        
        <div @click.prevent="createPlaylist()" class="submit-button">
            Создать
        </div>
    </div>
</template>

<script>
import api from '@/api';

    export default {
        name: 'CreatePlaylist',

        data() {
            return {
                playlistName: '',
                imageFile: null,
            }
        },

        mounted() {
            this.imageInputPreview()
        },

        methods: {
            imageInputPreview() {
                const fileInput = document.getElementById('imageInput');
                const imagePreview = document.getElementById('imagePreview');
                fileInput.addEventListener('change', (event) => {
                    this.imageFile = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.imageFile)
                });
            },

            createPlaylist() {
                if (this.playlistName) {
                    this.sendCreateAlbumRequest();
                    this.hideModal();                
                }
            },

            sendCreateAlbumRequest() {
                const jsonData = {
                    name: this.playlistName
                };
                const url = 'http://music.local/api/playlists/create-playlist'; 
                const responsePromise = api.post(url, jsonData);
                if (this.imageFile) {
                    responsePromise.then(this.sendSetPlaylistPhotoRequest())
                }
            },

            sendSetPlaylistPhotoRequest() {
                return (responseResult) => {
                    const playlistId = responseResult.data.playlistId;
                    const formData = this.makeImageFormData(); 
                    const url = `http://music.local/api/playlists/${playlistId}/update-playlist-photo`; 
                    api.post(url, formData);
                }
            },

            makeImageFormData() {
                const formData = new FormData();
                formData.append('photo', this.imageFile);
                return formData;
            },

            hideModal() {
                // TODO: ADAPT TO UserPlaylists COMPONENT
                // NOT READY
                this.$parent.hideModal();
            },
        }
    }
</script>

<style scoped>
    .create-playlist {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 1);
        border: solid 1px rgba(125, 125, 125, 0.4);
        padding: 20px;
        border-radius: 20px;

        display: flex;
        flex-direction: column;
        gap: 20px;
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

    .input-fields-container__playlist-name {
        padding: 5px;
        border-radius: 10px;
        border: 1px solid gray;
    }

    .input-fields-container__playlist-name:focus{
        /* border: 1px solid gray; */
        outline: 0;
    }

    .input-fields-container__file-input-label {
        font-size: 15px;
        width: fit-content;

        background-color: rgba(125, 125, 125, 0.2);
        padding: 5px 10px;
        border-radius: 10px;
        
        transition: background-color 0.2s;
    }

    .input-fields-container__file-input-label:hover {
        background-color: rgba(125, 125, 125, 0.4);
    }

    .input-fields-container__file-input {
        
    }

    .input-fields-container__input-image {
        width: 200px;
        height: 200px;
        border-radius: 10px;
        overflow: hidden;
        pointer-events: none;
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
    
    input[type="file"] {
        display: none;
    }
</style>