<template>
    <div class="edit-song">
        <div class="title">Изменить песню</div>
        <div  class="input-fields-container">
            <div class="change-name">
                <div>Выберите имя</div>
                <input v-model="newSongName" :placeholder="oldSongName" type="text" class="input-name">
            </div>
            <div class="change-audio">
                <label :for="`song_${this.song.id}_audioInput`" class="input-audio-label">Выбрать аудио файл</label>
                <input :id="`song_${this.song.id}_audioInput`" type="file" accept="audio/mpeg" class="input-audio">
            </div>
            <div class="audio-preview">
                <audio controls :id="`song_${this.song.id}_audioPlayer`"></audio>
            </div>
        </div>
        <div class="buttons-container">
            <div @click.prevent="editSong()" class="submit-button">
                Изменить
            </div>
            <div @click.prevent="deleteSongModal()" class="submit-button danger">
                Удалить трек
            </div>
        </div>
    </div>

    <div class="modal" id="deleteConfirmationModal">
        <div class="modal-overlay" id="deleteConfirmationOverlay"></div>
        <div class="modal-window">
            <delete-song :song="song"></delete-song>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import DeleteSong from './DeleteSong.vue';

export default {
    name: "EditSong",

    components: {
        DeleteSong
    },

    data() {
        return {
            oldSongName: this.song.name,
            newSongName: '',
            audioFile: null,
        }
    },

    props: [
        'song'
    ],

    mounted() {
        this.audioInputPreview();
    },

    methods: {
        audioInputPreview() {
            const audioPlayer = document.querySelector(`#song_${this.song.id}_audioPlayer`);
            const audioInput = document.querySelector(`#song_${this.song.id}_audioInput`);
            audioInput.addEventListener('change', (event) => {
                this.audioFile = event.target.files[0];           
                audioPlayer.src = URL.createObjectURL(this.audioFile);
            });
        },

        editSong() {
            if (this.audioFile || this.newSongName) {
                if (this.audioFile) {
                    this.editSongAudio();
                }

                if (this.newSongName) {
                    this.editSongName();
                }

                this.hideEditSongModal();
            }
        },

        editSongName() {
            const url = `http://music.local/api/albums/${this.song.albumId}/songs/${this.song.id}/update-song-name`;
            api.post(url, { name: this.newSongName }).then(this.refreshPage);
        },

        editSongAudio() {
            const formData = this.makeAudioFormData();
            const url = `http://music.local/api/albums/${this.song.albumId}/songs/${this.song.id}/update-song-audio`;
            api.post(url, formData).then(this.refreshPage);
        },

        makeAudioFormData() {
            const formData = new FormData();
            formData.append("audio", this.audioFile);
            return formData;
        },

        hideEditSongModal() {
            const overlayId = "editSongModalOverlay";
            const modalId = "editSongModal";
            const hideModalCallback = this.$parent.hideModal(overlayId, modalId);
            hideModalCallback();
        },

        refreshPage() {
            this.$router.go(0);
        },

        deleteSongModal() {
            const overlayId = "deleteConfirmationOverlay";
            const modalId = "deleteConfirmationModal";
            this.openDeleteConfirmationModal(overlayId, modalId);
        },

        openDeleteConfirmationModal(overlayId, modalId) {
            const songCard = document.getElementById(`song_${this.song.id}`);
            const modal = songCard.querySelector(`#${modalId}`);

            console.log(modal);
            
            modal.style.visibility = "visible"
            modal.style.opacity = "1"
            
            setTimeout(() => {
                this.overlayClickListener(overlayId, modalId);
            }, 500)
        },

        overlayClickListener(overlayId, modalId) {
            const songCard = document.getElementById(`song_${this.song.id}`);
            const overlay = songCard.querySelector(`#${overlayId}`);
            overlay.addEventListener('click', this.hideDeleteConfirmationModal(overlayId, modalId));
        },

        hideDeleteConfirmationModal(overlayId, modalId) {
            return () => {
                const songCard = document.getElementById(`song_${this.song.id}`);
                const overlay = songCard.querySelector(`#${overlayId}`);
                const modal = songCard.querySelector(`#${modalId}`);
                modal.style.visibility = "hidden"
                modal.style.opacity = "0"
                overlay.removeEventListener('click', this.hideDeleteConfirmationModal(overlayId, modalId))
            }
        },

    }
}
</script>

<style scoped>
    .edit-song {
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