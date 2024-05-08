<template>
    <div class="confirmation-box">
        <div class="title">
            Вы уверены, что хотите<br>
            удалить этот плейлист?
        </div>
        <div class="buttons-container">
            <div @click.prevent="deletePlaylist()" class="submit-button danger">
                Удалить
            </div>
            <div @click.prevent="closeDeletePlaylistModal()" class="submit-button">
                Отмена
            </div>
        </div>
    </div>
</template>
<script>
import api from "@/api";
export default {
    name: "DeletePlaylist",

    props: [
        "playlist"
    ],

    methods: {

        deletePlaylist() {
            const url = `http://music.local/api/playlists/${this.playlist.id}/delete-playlist`;
            api.delete(url).then(this.redirectToAllPlaylists);
        },

        closeDeletePlaylistModal() {
            const overlayId = "deletePlaylistModalOverlay";
            const modalId = "deletePlaylistModal";

            const hideModalCallback = this.$parent.hideDeletePlaylistModal(overlayId, modalId);
            hideModalCallback();
        },

        redirectToAllPlaylists() {
            const playlistsRoute = { name: 'playlist.all'};
            this.$router.push(playlistsRoute);
        }
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
        padding: 20px;
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