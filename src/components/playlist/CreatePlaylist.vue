<template>
    <div class="create-playlist">
        <div class="title">
            Создать новый плейлист
        </div>

        <div id="playlistForm" class="input-fields-container">
            <input id="nameInput" placeholder="Название плейлиста" type="text" class="input-fields-container__playlist-name">
            <label for="imgInput" class="input-fields-container__file-input-label">Выбрать обложку</label>
            <input id="imgInput" type="file" accept="image/png" class="input-fields-container__file-input">
            <img id="imagePreview" src="/src/icons/base_img.jpg" class="input-fields-container__input-image">
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

            }
        },

        mounted() {
            this.imgInputPreview()
        },

        methods: {
            imgInputPreview() {
                const fileInput = document.getElementById('imgInput');
                const imagePreview = document.getElementById('imagePreview');

                fileInput.addEventListener('change', function(event) {
                    const file = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(file)
                });
            },

            createPlaylist() {
                
                const formData = this.makeFormData()

                
                api.post('http://music.local/api/playlists/create-playlist', formData)
                    .then( res => {
                        console.log(res)
                    })
            },

            makeFormData() {
                const formData = new FormData();

                const imageInput = document.getElementById('imgInput');
                let image = imageInput.files[0];
                if (image !== undefined) {
                    formData.append('photo', image);
                }

                const nameInput = document.getElementById('nameInput');
                formData.append('name', nameInput.value);
                

                for (let key of formData.keys()) {
                    console.log(`${key}: ${formData.get(key)}`);
                }

                return formData;
            }
        }
    }
</script>

<style scoped>
    .create-playlist {
        width: 100%;
        height: 100%;
        background-color: white;
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
    }

    .submit-button:hover {
        background-color: rgba(125, 125, 125, 0.4);
    }
    
    input[type="file"] {
        display: none;
    }
</style>