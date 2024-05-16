<template>
    <div class="create-album">
        <div class="title">
            Создать альбом
        </div>

        <div class="input-fields-container">

            <div class="select-genre-and-name">
                <div class="select-name">
                    <label for="nameInput" class="input-name-label">Выберите имя</label>
                    <input id="nameInput" v-model="albumName" type="text" class="input-name">
                </div>
                <div class="select-genre">
                    <select-genre ref="selectGenreRef" :preSelectedGenreId="null"></select-genre>
                </div>
            </div>
            
            <div class="select-image-and-publish-time">
                <div class="select-image">
                    <label for="albumImageInput" class="input-image-label">Выбрать обложку</label>
                    <input id="albumImageInput" type="file" accept="image/png">
                    <img id="imagePreview" src="" class="image-preview">     
                </div>
                <div class="select-publish-time">
                    <label for="createPublishTime">Выберите время публикации альбома: </label>
                    <input
                    v-on:change="publishTimeChangeHandler"
                    type="datetime-local"
                    id="createPublishTime"
                    :value="currentTime"
                    :min="currentTime" />        
                </div>
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
        name: 'CreateAlbum',

        components: {
            SelectGenre
        },

        data() {
            return {
                albumImage: null,
                albumName: '',
                albumPublishTime: null
            }
        },

        computed: {
            currentTime() {
                const currentTime = new Date();
                return currentTime.toISOString().slice(0, 16);
            }
        },

        watch: {
            
        },

        methods: {
            onMounted() {
                this.imgInputPreview();
                this.$refs.selectGenreRef.getGenres();
            },

            publishTimeChangeHandler() {
                const publishTimeInput = document.getElementById('createPublishTime');
                this.albumPublishTime = publishTimeInput.value;
            },

            imgInputPreview() {
                const createAlbum = document.querySelector('.create-album');
                const fileInput = createAlbum.querySelector('#albumImageInput');
                const imagePreview = createAlbum.querySelector('#imagePreview');
                console.log(fileInput);
                fileInput.addEventListener('change', (event) => {
                    this.albumImage = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.albumImage);
                });
            },

            createAlbum() {
                if (this.albumImage && this.albumName) {
                    this.sendCreateAlbumRequest()
                        .then(this.displayCreatedAlbum)
                        .then(this.hideModal);
                }
            },

            displayCreatedAlbum(response) {
                const albumId = response.data;
                return new Promise(resolve => {
                    const url = `http://music.local/api/albums/${albumId}`;
                    api.get(url).then(res => {
                        const createdAlbum = res.data;
                        this.$parent.$data.artistAlbums.push(createdAlbum);
                        resolve();
                    });
                });
            },

            sendCreateAlbumRequest() {
                const formData = this.makeFormData();
                const url = `http://music.local/api/albums/create-album`;
                return api.post(url, formData);
            },
         

            makeFormData() {
                const formData = new FormData();
                formData.append('name', this.albumName);
                formData.append('genreId', this.getSelectedGenreId());
                formData.append('photo', this.albumImage);
                formData.append('publishTime', this.albumPublishTime);
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
                const modalId = "createAlbumModal";
                const overlayId = "createAlbumOverlay";
                
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

    .select-name {
        display: flex;
        flex-direction: column;
    }

    .select-genre {

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