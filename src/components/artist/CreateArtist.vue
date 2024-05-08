<template>
    <div class="create-artist">
        <div class="title">
            Создать артиста
        </div>
        <div class="input-fields-container">
            <div class="select-name">
                <label for="nameInput" class="input-name-label">Выберите имя</label>
                <input id="nameInput" v-model="artistName" type="text" class="input-name">
            </div>
            <div class="select-image">
                <label for="imageInput" class="input-image-label">Выбрать обложку</label>
                <input id="imageInput" type="file" accept="image/png">
                <img id="imagePreview" class="image-preview">     
            </div>
        </div>
        <div @click.prevent="createArtist()" class="submit-button">
            Создать
        </div>
    </div>
</template>
<script>
import api from '@/api';
import SelectGenre from '@/components/genre/SelectGenre.vue'

    export default {
        name: 'CreateArtist',

        components: {
            SelectGenre
        },

        data() {
            return {
                artistImage: null,
                artistName: '',
            }
        },

        computed: {
            currentTime() {
                const currentTime = new Date();
                return currentTime.toISOString().slice(0, 16);
            }
        },

        methods: {
            onMounted() {
                this.imgInputPreview();
            },

            imgInputPreview() {
                const fileInput = document.getElementById('imageInput');
                const imagePreview = document.getElementById('imagePreview');

                fileInput.addEventListener('change', (event) => {
                    this.artistImage = event.target.files[0];
                    imagePreview.src = URL.createObjectURL(this.artistImage);
                });
            },

            createArtist() {
                if (this.artistImage && this.artistName) {
                    this.sendCreateArtistRequest()
                        .then(this.displayCreatedArtist)
                        .then(response => {
                            this.changeUserAccessToken(response.data.access_token);
                            this.hideModal();
                        });
                }
            },

            sendCreateArtistRequest() {
                const formData = this.makeFormData();
                const url = `http://music.local/api/artists/create-artist`;
                return api.post(url, formData);
            },
         

            makeFormData() {
                const formData = new FormData();
                formData.append('name', this.artistName);
                formData.append('photo', this.artistImage);
                return formData;
            },

            hideModal() {
                const modalId = "createArtistModal";
                const overlayId = "createArtistModalOverlay";
                const hideModalCallback = this.$parent.hideModal(overlayId, modalId);
                hideModalCallback();
            },

            displayCreatedArtist(response) {
                const artistId = response.data.artistId;
                return new Promise(resolve => {
                    const url = `http://music.local/api/artists/${artistId}`;
                    api.get(url).then(res => {
                        const createdArtist = res.data;
                        this.$parent.$data.artist = createdArtist;
                        this.$parent.$data.photoSrc =  `http://music.local:9005/photo/${createdArtist.photoPath}`;
                        resolve(response);
                    });
                });
            },

            changeUserAccessToken(accessToken) {
                // const accessToken = response.data.access_token;
                localStorage.removeItem('access_token');
                localStorage.setItem('access_token', accessToken);
            },
        }
    }
</script>
<style scoped>
    .create-artist {
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
        flex-direction: column;
        
        
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