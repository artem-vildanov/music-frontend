<template>
    <div class="album-card-container select-none">

        <div class="album-photo" v-if="!imageError">
            <img class="big-photo" :src="photoSrc" @error="setAltImg">
        </div>
        <div class="album-photo" v-if="imageError">
            <img class="big-photo" src='../../icons/base_img.png'>
        </div>

        <div class="album-info">
            <div @click.prevent="openAlbum()" class="album-info__name">
                {{ album.name }}
            </div>
            <div class="album-info__is-favourite">
                <template v-if="album.isFavourite">
                    <img class="icon" src="../../icons/liked.svg">
                </template>
                <template v-if="!album.isFavourite">
                    <img class="icon" src="../../icons/not_liked.svg">
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AlbumCard",

        data() {
            return {
                imageError: null,
                photoSrc: `http://music.local:9005/photo/${this.album.photoPath}`,
                altPhotoSrc: '../../icons/base_img.png'
            }
        },

        props: [
            'album'
        ],

        methods: {
            setAltImg() {  
                this.imageError = true
            },

            openAlbum() {

            },
        }
    }
</script>

<style scoped>
    .album-card-container {
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 15px;
        width: fit-content;
        height: fit-content;

        border: solid gray 1px;
        outline: 3px solid rgba(128, 128, 128, 0);
        border-radius: 10px;
        transition: all 0.5s ease-out;
    }

    .album-info {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 15px;
    }

    .album-info__name {
        font-size: 15px;
        font-weight: 300;
        color: rgb(70, 70, 70);

        padding: 5px 10px;
        border-radius: 10px;
        outline: 4px solid rgb(124, 124, 124, 0);
        transition:
            all 0.2s ease-out; 
            /* background-color 0.5s ease-out,
            color 0.1s ease-out,
            outline 0.1s ease-out; */
    }

    .album-info__name:hover {
        /* background-color: rgb(124, 124, 124, 0.25); */
        color: black;      
        text-decoration: none;  
    }

    .album-info__name:active {
        background-color: rgb(124, 124, 124, 0.5);
        /* outline: 4px solid rgb(124, 124, 124, 0.25); */
    }

    .album-info__is-favourite {
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .album-info__is-favourite:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .album-info__is-favourite:active {
        background-color: gray;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

</style>