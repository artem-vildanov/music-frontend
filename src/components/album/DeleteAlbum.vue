<template>
    <div class="confirmation-box">
        <div class="title">
            Вы уверены, что хотите<br>
            удалить этот альбом?
        </div>
        <div class="buttons-container">
            <div @click.prevent="deleteAlbum()" class="submit-button danger">
                Удалить
            </div>
            <div @click.prevent="closeDeleteAlbumModal()" class="submit-button">
                Отмена
            </div>
        </div>
    </div>
</template>
<script>
import api from "@/api";
export default {
    name: "DeleteAlbum",

    props: [
        "album"
    ],

    methods: {

        deleteAlbum() {
            const url = `http://music.local/api/albums/${this.album.id}/delete-album`;
            api.delete(url).then(this.redirectToArtist);
        },

        closeDeleteAlbumModal() {
            const overlayId = "deleteAlbumModalOverlay";
            const modalId = "deleteAlbumModal";

            const hideModalCallback = this.$parent.hideDeleteAlbumModal(overlayId, modalId);
            hideModalCallback();
        },

        redirectToArtist() {
            const artistRoute = { name: 'artist.single', params: { id: this.album.artistId }};
            this.$router.push(artistRoute);
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