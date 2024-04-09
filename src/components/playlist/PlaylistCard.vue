<template>
    <div class="playlist-card" :id="`playlist_${playlist.id}`">

        <div class="playlist-photo-container">
            <div class="playlist-photo-container__photo-overlay select-none">
                
            </div>
            <img class="playlist-photo-container__photo select-none" v-show="!imageError" :src="photoSrc" @error="this.imageError = true"> 
            <img class="playlist-photo-container__photo select-none" v-show="imageError" :src="altPhotoSrc">
        </div>

        <div class="playlist-info">
            <router-link :title="playlist.name" :to="{ name: 'playlist.single', params: { id: playlist.id }}" class="playlist-info__name">
                {{ playlist.name }}
            </router-link>
        </div>
    </div>
</template>

<script>
import api from '@/api'
    export default {
        name: "PlaylistCard",

        data() {
            return {
                imageError: false,
                photoSrc: `http://music.local:9005/photo/${this.playlist.photoPath}`,
                altPhotoSrc: "/src/icons/base_img.jpg"
            }
        },

        props: [
            'playlist'
        ],

        methods: {
            
        }
    }
</script>

<style scoped>
    .playlist-card {
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 15px;
        width: fit-content;
        height: fit-content; 

        /* width: 28%; */

        border: solid rgba(125, 125, 125, 0.5) 1px;
        border-radius: 10px;
        transition: all 0.5s ease-out;
    }

    .playlist-card:hover {
        background-color: rgba(125, 125, 125, 0.2);
    }

    .playlist-photo-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .playlist-photo-container__photo {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        overflow: hidden;
        pointer-events: none;
    }

    .playlist-photo-container__photo-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0); 
        transition: 0.5s ease-out;
        border-radius: 10px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .playlist-card:hover .playlist-photo-container__photo-overlay {
        background-color: rgba(255, 255, 255, 0.7); 
    } 

    .playlist-info {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 15px;   
    }

    .playlist-info__name {
        max-width: 150px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
        font-weight: 200;
        color: rgb(70, 70, 70);
        
        padding: 2.5px 7px;
        border-radius: 10px;
        outline: 4px solid rgb(124, 124, 124, 0);
        transition: all 0.2s ease-out; 
    }

    .playlist-info__name:hover {
        background-color: rgb(124, 124, 124, 0.2); 
        color: black;      
        text-decoration: none;  
    }

    .playlist-info__name:active {
        background-color: rgb(124, 124, 124, 0.5);
        /* outline: 4px solid rgb(124, 124, 124, 0.25); */
    }

    .icon {
        width: 30px;
        height: 30px;
    }

</style>