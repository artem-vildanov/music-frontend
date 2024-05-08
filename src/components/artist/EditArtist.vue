<template>
    <div class="edit-artist">
        <div class="title">
            Изменить артиста
        </div>
        <div class="input-fields-container">
            <div class="select-name">
                <label for="nameInput" class="input-name-label">Выберите имя</label>
                <input id="nameInput" :placeholder="oldArtistName" v-model="newArtistName" type="text" class="input-name">
            </div>
            <div class="select-image">
                <label for="imageInput" class="input-image-label">Выбрать обложку</label>
                <input id="imageInput" type="file" accept="image/png">
                <img id="imagePreview" :src="photoSrc" class="image-preview">            
            </div>
        </div>
        <div class="buttons-container">
            <div @click.prevent="editArtist()" class="submit-button">
                Изменить
            </div>
            <div @click.prevent="deleteArtist()" class="submit-button danger">
                Удалить
            </div>
        </div>
    </div>
    <div class="modal" id="deleteArtistModal">
        <div class="modal-overlay" id="deleteArtistModalOverlay"></div>
        <div class="modal-window">
            <delete-artist :artist="artist"></delete-artist>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import SelectGenre from '@/components/genre/SelectGenre.vue';
import DeleteArtist from './DeleteArtist.vue';

    export default {
        name: 'EditArtist',

        components: {
            SelectGenre,
            DeleteArtist
        },

        data() {
            return {
                photoSrc: `http://music.local:9005/photo/${this.artist.photoPath}`,
                artistImage: null,
                oldArtistName: this.artist.name,
                newArtistName: '',
            }
        },

        props: [
            'artist'
        ],

        methods: {
            onMounted() {
                this.imgInputPreview();
            },

            imgInputPreview() {
                const editArtist = document.querySelector('.edit-artist');
                const fileInput = editArtist.querySelector('#imageInput');
                const imagePreview = editArtist.querySelector('#imagePreview');

                fileInput.addEventListener('change', (event) => {
                    this.artistImage = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.artistImage);
                });
            },

            editArtist() {
                if (this.artistImage || this.newArtistName) {
                    this.editArtistName()
                        .then(this.editArtistImage)
                        .then(this.displayUpdatedArtist)
                        .then(this.hideModal);
                }    
            },

            editArtistName() {
                return new Promise(resolve => {
                    if (this.newArtistName) {
                        const url = `http://music.local/api/artists/${this.artist.id}/update-artist-name`;
                        const jsonData = {
                            name: this.newArtistName,
                            genreId: this.selectedGenre
                        };

                        api.post(url, jsonData).then(resolve);
                    }
                    else {
                        resolve()
                    }
                })
            },

            editArtistImage() {
                return new Promise(resolve => {
                    if (this.artistImage) {
                        const url = `http://music.local/api/artists/${this.artist.id}/update-artist-photo`;
                        const formData = this.makeImageFormData();
                        api.post(url, formData).then(resolve);
                    }
                    else {
                        resolve();
                    }
                })
            },

            makeImageFormData() {
                const formData = new FormData();
                formData.append('photo', this.artistImage);
                return formData;
            },

            displayUpdatedArtist() {
                return new Promise(resolve => {
                    this.getUpdatedArtist()
                        .then(response => {
                            const updatedArtist = response.data;
                            this.$parent.$data.artist = updatedArtist;
                            this.$parent.$data.photoSrc = `http://music.local:9005/photo/${updatedArtist.photoPath}`;
                            resolve();
                        })
                });
            },

            getUpdatedArtist() {
                const url = `http://music.local/api/artists/${this.artist.id}`;
                return api.get(url);
            },

            hideModal() {
                const modalId = "editArtistModal";
                const overlayId = "editArtistModalOverlay";
                
                const hideModalCallback = this.$parent.hideModal(overlayId, modalId);
                hideModalCallback();
            },

            /**
             *  DELETE ALBUM MODAL
             */

            deleteArtist() {
                const overlayId = "deleteArtistModalOverlay";
                const modalId = "deleteArtistModal";
                this.openDeleteArtistModal(overlayId, modalId);
            },

            openDeleteArtistModal(overlayId, modalId) {
                const modal = document.querySelector(`#${modalId}`);
                
                modal.style.visibility = "visible"
                modal.style.opacity = "1"
                
                setTimeout(() => {
                    this.overlayClickListener(overlayId, modalId);
                }, 500)
            },

            overlayClickListener(overlayId, modalId) {
                const overlay = document.querySelector(`#${overlayId}`);
                overlay.addEventListener('click', this.hideDeleteArtistModal(overlayId, modalId));
            },

            hideDeleteArtistModal(overlayId, modalId) {
                return () => {
                    const overlay = document.querySelector(`#${overlayId}`);
                    const modal = document.querySelector(`#${modalId}`);
                    modal.style.visibility = "hidden"
                    modal.style.opacity = "0"
                    overlay.removeEventListener('click', this.hideDeleteArtistModal(overlayId, modalId))
                }
            },
        }
    }
</script>

<style scoped>
    .edit-artist {
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

    .select-image {
        display: flex;
        flex-direction: column;        
    }

    .select-name {
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