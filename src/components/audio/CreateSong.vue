<template>
    <div class="create-song">
        <div class="title">Создать песню</div>
        <div  class="input-fields-container">
            <div class="change-name">
                <div>Выберите имя</div>
                <input v-model="songName" type="text" class="input-name">
            </div>
            <div class="change-audio">
                <label for="audioInput" class="input-audio-label">Выбрать аудио файл</label>
                <input id="audioInput" type="file" accept="audio/mpeg" class="input-audio">
            </div>
            <div class="audio-preview">
                <audio controls id="audioPlayer"></audio>
            </div>
        </div>
        <input
        type="submit"
        value="Создать"
        :disabled="buttonClickabilityChecker()" 
        @click.prevent="createSong()" 
        class="submit-button"/>
    </div>
</template>

<script>
import api from '@/api';

export default {
    name: "CreateSong",

    data() {
        return {
            songName: '',
            audioFile: null,
            albumId: this.$parent.albumId,
        }
    },

    mounted() {
        this.audioInputPreview();
    },

    methods: {
        buttonClickabilityChecker() {
            return this.songName !== '' && this.audioFile !== null;
        },

        audioInputPreview() {
            const audioPlayer = document.querySelector('#audioPlayer');
            const audioInput = document.querySelector('#audioInput');
            audioInput.addEventListener('change', (event) => {
                this.audioFile = event.target.files[0];           
                audioPlayer.src = URL.createObjectURL(this.audioFile);
            });
        },

        async createSong() {            
            const createdSongId = await this.sendCreateSongRequest();
            await this.displayCreatedSong(createdSongId);
            this.hideModal();
        },

        makeFormData() {
            const formData = new FormData();
            formData.append("name", this.songName);
            formData.append("music", this.audioFile);
            return formData;
        },

        /**
         * @returns {Promise} created song id
         */
        async sendCreateSongRequest() {
            const formData = this.makeFormData();
            const url = `http://music.local/api/albums/${this.albumId}/songs/create-song`;
            const response = await api.post(url, formData);
            return response.data;
        },

        /**
         * @param {number} songId 
         */
        async displayCreatedSong(songId) {
            const url = `http://music.local/api/albums/${this.albumId}/songs/${songId}`;
            const createdSong = await api.get(url);
            this.$parent.$data.albumSongs.push(createdSong);
        },

        hideModal() {
            const overlayId = "createSongModalOverlay";
            const modalId = "createSongModal";
            const hideModalCallback = this.$parent.hideModal(overlayId, modalId);
            hideModalCallback();
        },
    }
}
</script>

<style scoped>
    .create-song {
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

    .input-name {
        padding: 5px;
        border-radius: 10px;
        border: 1px solid gray;
    }

    .input-name:focus{
        /* border: 1px solid gray; */
        outline: 0;
    }

    .input-audio-label {
        font-size: 15px;
        width: fit-content;

        background-color: rgba(125, 125, 125, 0.2);
        padding: 5px 10px;
        border-radius: 10px;
        
        transition: background-color 0.2s;
    }

    .input-audio-label:hover {
        background-color: rgba(125, 125, 125, 0.4);
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