<template>
    <div class="confirmation-box">
        <div class="title">
            Вы уверены, что хотите<br>
            удалить этот трек?
        </div>
        <div class="buttons-container">
            <div @click.prevent="deleteSong()" class="submit-button danger">
                Удалить
            </div>
            <div @click.prevent="closeDeleteConfirmationModal()" class="submit-button">
                Отмена
            </div>
        </div>
    </div>
</template>
<script>
import api from "@/api";
export default {
    name: "DeleteSong",

    props: [
        "song"
    ],

    methods: {

        deleteSong() {
            const url = `http://music.local/api/albums/${this.song.albumId}/songs/${this.song.id}/delete-song`;
            api.delete(url).then(this.refreshPage);
            this.$parent.hideEditSongModal();
        },

        closeDeleteConfirmationModal() {
            const overlayId = "deleteConfirmationOverlay";
            const modalId = "deleteConfirmationModal";

            const hideModalCallback = this.$parent.hideDeleteConfirmationModal(overlayId, modalId);
            hideModalCallback();
        },

        refreshPage() {
            this.$router.go(0);
        },
    }
}
</script>
<style scoped>
    .confirmation-box {
        display: flex;
        flex-direction: column;
        gap: 20px;
        background-color: white;
        padding: 20px;
        border-radius: 20px;
    }

    .title {
        font-size: 20px;
        width: fit-content;
        padding: 2.5px 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
        text-align: center;
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
    
</style>