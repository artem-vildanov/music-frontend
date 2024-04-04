<template>
    <div class="album-card-container select-none">

        <div class="album-photo-container">
            <div class="album-photo-container__photo-overlay">
                <div class="photo-overlay__is-favourite">
                    <img v-show="album.isFavourite" class="icon" src="../../icons/liked.svg">
                    <img v-show="!album.isFavourite" class="icon" src="../../icons/not_liked.svg">
                </div>
            </div>
            <img class="album-photo-container__photo" v-show="!imageError" :src="photoSrc" @error="this.imageError = true">
            <img class="album-photo-container__photo" v-show="imageError" :src="altPhotoSrc">
        </div>

        <div class="album-info">
            <div @click.prevent="openAlbum()" class="album-info__name">
                {{ album.name }}
            </div>
        </div>
    </div>
</template>

<script>
import router from '@/router';
    export default {
        name: "AlbumCard",

        data() {
            return {
                imageError: null,
                photoSrc: `http://music.local:9005/photo/${this.album.photoPath}`,
                altPhotoSrc: "/src/icons/base_img.jpg"
            }
        },

        props: [
            'album'
        ],

        methods: {
            openAlbum() {
                router.push({name: 'album.single', params: {id: this.album.id}})
            }
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

        /* width: 28%; */

        border: solid gray 1px;
        outline: 6px solid rgba(128, 128, 128, 0);
        border-radius: 10px;
        transition: all 0.5s ease-out;
    }

    .album-card-container:hover {
        outline: 6px solid rgba(128, 128, 128, 0.5);
    }

    .album-photo-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .album-photo-container__photo {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        overflow: hidden;
        pointer-events: none;
    }

    .album-photo-container__photo-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0); 
        transition: 0.5s ease-out;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .album-card-container:hover .album-photo-container__photo-overlay {
        background-color: rgba(255, 255, 255, 0.7); 
    } 

    .album-info {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 15px;   
    }

    .album-info__name {
        max-width: 100px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 10px;
        font-weight: 200;
        color: rgb(70, 70, 70);
        
        padding: 5px 10px;
        border-radius: 10px;
        outline: 4px solid rgb(124, 124, 124, 0);
        transition: all 0.2s ease-out; 
    }

    .album-info__name:hover {
        background-color: rgb(124, 124, 124, 0.1); 
        color: black;      
        text-decoration: none;  
    }

    .album-info__name:active {
        background-color: rgb(124, 124, 124, 0.5);
        /* outline: 4px solid rgb(124, 124, 124, 0.25); */
    }

    .photo-overlay__is-favourite {
        position: absolute;
        z-index: 2;
        opacity: 0;

        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .album-card-container:hover .photo-overlay__is-favourite {
        opacity: 1;
    } 

    .photo-overlay__is-favourite:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .photo-overlay__is-favourite:active {
        background-color: gray;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

</style>