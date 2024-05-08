<template>
    <div class="confirmation-box">
        <div class="title">
            Вы уверены, что хотите<br>
            удалить аккаунт артиста?
        </div>
        <div class="buttons-container">
            <div @click.prevent="deleteArtist()" class="submit-button danger">
                Удалить
            </div>
            <div @click.prevent="closeDeleteArtistModal()" class="submit-button">
                Отмена
            </div>
        </div>
    </div>
</template>
<script>
import api from "@/api";
export default {
    name: "DeleteArtist",

    props: [
        "artist"
    ],

    methods: {

        deleteArtist() {
            const url = `http://music.local/api/artists/${this.artist.id}/delete-artist`;
            api.delete(url).then( res => {
                this.changeUserAccessToken(res.data.access_token);
                this.redirectToAccount();
            });
        },

        closeDeleteArtistModal() {
            const overlayId = "deleteArtistModalOverlay";
            const modalId = "deleteArtistModal";

            const hideModalCallback = this.$parent.hideDeleteArtistModal(overlayId, modalId);
            hideModalCallback();
        },

        redirectToAccount() {
            const accountRoute = { name: 'account.user'};
            this.$router.push(accountRoute);
        },

        changeUserAccessToken(token) {
            localStorage.removeItem('access_token');
            localStorage.setItem('access_token', token);
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