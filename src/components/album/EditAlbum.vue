<template>
    <div class="edit-album">
        <div class="title">
            Изменить альбом
        </div>

        <div class="input-fields-container">

            <div class="select-genre-and-name">
                <div class="select-name">
                    <label for="nameInput" class="input-name-label">Выберите имя</label>
                    <input id="nameInput" :placeholder="oldAlbumName" v-model="newAlbumName" type="text" class="input-name">
                </div>
                <div class="select-genre">
                    <select-genre ref="selectGenreRef" :preSelectedGenreId="album.genreId"></select-genre>
                </div>
            </div>
            
            <div class="select-image-and-publish-time">
                <div class="select-image">
                    <label for="imgInput" class="input-image-label">Выбрать обложку</label>
                    <input id="imgInput" type="file" accept="image/png">
                    <img id="imagePreview" :src="photoSrc" class="image-preview">            
                </div>
                <div v-show="album.publishTime" class="select-publish-time">
                    <label for="createPublishTime">Выберите время публикации альбома: </label>
                    <input
                    v-on:change="publishTimeChangeHandler"
                    type="datetime-local"
                    id="createPublishTime"
                    :value="album.publishTime"
                    :min="album.publishTime" />  
                </div>
            </div>
        </div>
        <div class="buttons-container">
            <div @click.prevent="editAlbum()" class="submit-button">
                Изменить
            </div>
            <div @click.prevent="deleteAlbum()" class="submit-button danger">
                Удалить
            </div>
        </div>
    </div>
    <div class="modal" id="deleteAlbumModal">
        <div class="modal-overlay" id="deleteAlbumModalOverlay"></div>
        <div class="modal-window">
            <delete-album :album="album"></delete-album>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import SelectGenre from '@/components/genre/SelectGenre.vue';
import DeleteAlbum from './DeleteAlbum.vue';

    export default {
        name: 'EditAlbum',

        components: {
            SelectGenre,
            DeleteAlbum
        },

        data() {
            return {
                photoSrc: `http://music.local:9005/photo/${this.album.photoPath}`,
                albumImage: null,
                oldAlbumName: this.album.name,
                newAlbumName: '',
                selectedGenre: null,
                albumPublishTime: null
            }
        },

        props: [
            'album'
        ],

        methods: {
            onMounted() {
                this.imgInputPreview();
                this.$refs.selectGenreRef.onMounted();
            },

            publishTimeChangeHandler() {
                const publishTimeInput = document.getElementById('createPublishTime');
                this.albumPublishTime = publishTimeInput.value;
            },

            imgInputPreview() {
                const fileInput = document.getElementById('imgInput');
                const imagePreview = document.getElementById('imagePreview');

                fileInput.addEventListener('change', (event) => {
                    this.albumImage = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.albumImage);
                });
            },

            editAlbum() {
                this.selectedGenre = this.getSelectedGenreId();

                if (this.albumImage || this.newAlbumName || this.albumPublishTime) {
                    this.editAlbumNameAndGenre()
                        .then(this.editAlbumImage)
                        .then(this.editAlbumPublishTime)
                        .then(this.displayUpdatedAlbum)
                        .then(this.hideModal);
                }    
            },

            editAlbumNameAndGenre() {
                return new Promise(resolve => {
                    if (this.newAlbumName) {
                        const url = `http://music.local/api/albums/${this.album.id}/update-album-name-genre`;
                        const jsonData = {
                            name: this.newAlbumName,
                            genreId: this.selectedGenre
                        };

                        api.post(url, jsonData).then(resolve);
                    }
                    else {
                        resolve()
                    }
                })
            },

            editAlbumImage() {
                return new Promise(resolve => {
                    if (this.albumImage) {
                        const url = `http://music.local/api/albums/${this.album.id}/update-album-photo`;
                        const formData = this.makeImageFormData();
                        api.post(url, formData).then(resolve);
                    }
                    else {
                        resolve();
                    }
                })
            },
            
            editAlbumPublishTime() {
                return new Promise(resolve => {
                    if (this.albumPublishTime) {
                        const url = `http://music.local/api/albums/${this.album.id}/update-album-publish-time`;
                        const jsonData = {
                            publishTime: this.albumPublishTime
                        }

                        api.post(url, jsonData).then(resolve);
                    }
                    else {
                        resolve();
                    }
                })
            },

            displayUpdatedAlbum() {
                return new Promise(resolve => {
                    this.getUpdatedAlbum()
                        .then(response => {
                            const updatedAlbum = response.data;
                            this.$parent.$data.album = updatedAlbum;
                            this.updateAlbumImage(updatedAlbum.photoPath);
                            resolve();
                        });
                });
            },

            updateAlbumImage(photoPath) {
                if (this.albumImage) {
                    const newPhotoSrc = `http://music.local:9005/photo/${photoPath}`;
                    this.$parent.$data.photoSrc = newPhotoSrc;

                    const albumSongsImages = document.querySelectorAll('.song-photo');
                    albumSongsImages.forEach(image => {
                        image.src = newPhotoSrc;
                    });
                }
            },

            getUpdatedAlbum() {
                const url = `http://music.local/api/albums/${this.album.id}`;
                return api.get(url);
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
                const overlayId = "editAlbumModalOverlay";
                
                const hideModalCallback = this.$parent.hideModal(overlayId, modalId);
                hideModalCallback();
            },

            /**
             *  DELETE ALBUM MODAL
             */

            deleteAlbum() {
                const overlayId = "deleteAlbumModalOverlay";
                const modalId = "deleteAlbumModal";
                this.openDeleteAlbumModal(overlayId, modalId);
            },

            openDeleteAlbumModal(overlayId, modalId) {
                const modal = document.querySelector(`#${modalId}`);
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.overlayClickListener(overlayId, modalId);
                }, 500)
            },

            overlayClickListener(overlayId, modalId) {
                const overlay = document.querySelector(`#${overlayId}`);
                overlay.addEventListener('click', this.hideDeleteAlbumModal(overlayId, modalId));
            },

            hideDeleteAlbumModal(overlayId, modalId) {
                return () => {
                    const overlay = document.querySelector(`#${overlayId}`);
                    const modal = document.querySelector(`#${modalId}`);
                    modal.style.visibility = "hidden"
                    modal.style.opacity = "0"
                    overlay.removeEventListener('click', this.hideDeleteAlbumModal(overlayId, modalId))
                }
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

    .input-name {
        padding: 5px;
        border-radius: 10px;
        border: 1px solid gray;
    }

    .input-name:focus{
        /* border: 1px solid gray; */
        outline: 0;
    }

    .select-genre-and-name {
        display: flex;
        flex-direction: column;
        background-color:  rgba(125, 125, 125, 0.2);
        padding: 20px;
        gap: 20px;
        border-radius: 10px;
    }

    .select-image-and-publish-time {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .select-image {
        display: flex;
        flex-direction: column;        
    }

    .select-publish-time {
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