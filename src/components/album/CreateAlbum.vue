<template>
    <div class="create-album">
        <div class="title">
            Создать альбом
        </div>

        <div class="input-fields-container">

            <div class="select-genre-and-name">
                
                <label for="nameInput" class="input-name-label">Выберите имя</label>
                <input id="nameInput" v-model="albumName" type="text" class="input-name">
                
                <select-genre :preSelectedGenreId="null"></select-genre>
            </div>
            
            <div class="select-image">
                <label for="imageInput" class="input-image-label">Выбрать обложку</label>
                <input id="imageInput" type="file" accept="image/png">
                <img id="imagePreview" class="image-preview">            
            </div>
        </div>
        
        <div @click.prevent="createAlbum()" class="submit-button">
            Создать
        </div>
    </div>
</template>
<script>
import api from '@/api';
import SelectGenre from '@/components/genre/SelectGenre.vue'

    export default {
        name: 'EditAlbum',

        components: {
            SelectGenre
        },

        data() {
            return {
                albumImage: null,
                albumName: '',
            }
        },

        mounted() {
            this.imgInputPreview();
        },

        methods: {

            imgInputPreview() {
                const fileInput = document.getElementById('imageInput');
                const imagePreview = document.getElementById('imagePreview');

                fileInput.addEventListener('change', (event) => {
                    this.albumImage = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.albumImage);
                });
            },

            createAlbum() {
                if (this.albumImage && this.albumName) {
                    const formData = this.makeFormData();
                    this.sendPostRequest(formData);
                    this.hideModal();
                }
            },

            sendPostRequest(formData) {
                const url = `http://music.local/api/albums/create-album`;
                api.post(url, formData).then(this.$parent.updatePage);
            },
         

            makeFormData() {
                const formData = new FormData();
                formData.append('name', this.albumName);
                formData.append('genreId', this.getSelectedGenreId());
                formData.append('photo', this.albumImage);
                return formData;
            },

            getSelectedGenreId() {
                const options = document.getElementsByName('genre');
                let selectedOption;
                for (var i = 0; i < options.length; i++) {
                    if (options[i].checked) {
                        selectedOption = options[i].value;
                        break;
                    }
                }

                if (!selectedOption) {
                    throw Error('genre is not selected');
                }

                return selectedOption;
            },

            hideModal() {
                const modalId = "editAlbumModal";
                const overlayId = "editAlbumOverlay";
                
                const hideModalCallback = this.$parent.hideModal(overlayId, modalId);
                hideModalCallback();
            },
        }
    }
</script>
<style scoped>
    .create-album {
        width: 100%;
        height: fit-content;
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
        flex-direction: row;
        
        
        gap: 20px;
        padding: 20px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 20px;
    }

    .select-genre-and-name {
        display: flex;
        flex-direction: column;
        background-color:  rgba(125, 125, 125, 0.2);
        padding: 20px;
        gap: 20px;
        border-radius: 10px;
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