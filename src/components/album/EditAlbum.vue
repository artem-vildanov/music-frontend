<template>
    <div class="edit-album">
        <div class="title">
            Изменить альбом
        </div>

        <div class="input-fields-container">

            <div class="input-fields-container__genre-and-name">
                <div>
                    <div>Выберите имя</div>
                    <input id="nameInput" v-model="albumName" type="text" class="input-fields-container__playlist-name">
                </div>
                <select-genre :preSelectedGenreId="album.genreId"></select-genre>
            </div>
            
            <div class="input-fields-container__photo">
                <label for="imgInput" class="input-fields-container__file-input-label">Выбрать обложку</label>
                <input id="imgInput" type="file" accept="image/png" class="input-fields-container__file-input">
                <img id="imagePreview" :src="photoSrc" class="input-fields-container__input-image">            
            </div>
        </div>
        
        <div @click.prevent="editAlbum()" class="submit-button">
            Изменить
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
                photoSrc: `http://music.local:9005/photo/${this.album.photoPath}`,
                albumImage: null,
                albumName: this.album.name,
            }
        },

        props: [
            'album'
        ],

        mounted() {
            this.imgInputPreview();
        },

        methods: {

            imgInputPreview() {
                const fileInput = document.getElementById('imgInput');
                const imagePreview = document.getElementById('imagePreview');

                fileInput.addEventListener('change', (event) => {
                    this.albumImage = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.albumImage);
                });
            },

            editAlbum() {
                this.editAlbumNameAndGenre();
                if (this.albumImage) {
                    this.editAlbumImage();
                }

                this.hideModal();
            },

            editAlbumNameAndGenre() {
                const url = `http://music.local/api/albums/${this.album.id}/update-album-name-genre`;
                const jsonData = {
                    name: this.albumName,
                    genreId: this.getSelectedGenreId()
                };

                api.post(url, jsonData);
            },

            editAlbumImage() {
                const url = `http://music.local/api/albums/${this.album.id}/update-album-photo`;
                const formData = this.makeImageFormData();
                
                api.post(url, formData);
            },            

            makeImageFormData() {
                const formData = new FormData();
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
    .edit-album {
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
        flex-direction: row;
        
        
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

    .input-fields-container__genre-and-name {
        display: flex;
        flex-direction: column;
        background-color:  rgba(125, 125, 125, 0.2);
        padding: 20px;
        gap: 20px;
        border-radius: 10px;
    }

    .input-fields-container__photo {
        display: flex;
        flex-direction: column;
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