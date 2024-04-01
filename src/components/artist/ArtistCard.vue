<template>
    <div class="artist select-none">
        <div class="artist-photo" v-if="!imageError">
            <img class="big-photo" :src="photoSrc" @error="setAltImg">
        </div>
        <div class="artist-photo" v-if="imageError">
            <img class="big-photo" src='../../icons/base_img.png'>
        </div>
        <div class="artist-info">
            <div @click.prevent="openArtist()" class="artist-info__name">
                {{ artist.name }}
            </div>
            <!-- <router-link :to="{ name: 'artist.single', params: { id: artist.id, artist: artist}}" class="artist-info__name">
                {{ artist.name }}
            </router-link> -->
            <div class="artist-info__is-favourite">
                <template v-if="artist.isFavourite">
                    <img class="icon" src="../../icons/liked.svg">
                </template>
                <template v-if="!artist.isFavourite">
                    <img class="icon" src="../../icons/not_liked.svg">
                </template>
            </div>
        </div>
        
        <!-- <div class="artist-info__playlists">
            <img class="icon" src="../../icons/playlist.svg">
        </div> -->
    </div>
</template>

<script>

import router from '@/router'

    export default {
        name: "ArtistCard",

        props: [
            'artist'
        ],

        data() {
            return {
                imageError: false,
                photoSrc: `http://music.local:9005/photo/${this.artist.photoPath}`,
                altPhotoSrc: '../../icons/base_img.png'
            }
        },

        methods: {
            setAltImg() {  
                this.imageError = true
            },

            openArtist() {
                console.log()
                router.push({name: 'artist.single', params: {id: this.artist.id}})
            }   
        }
    }
</script>

<style scoped>
    .artist {
        
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 15px;
        width: fit-content;
        height: fit-content;

        border: solid gray 1px;
        outline: 3px solid rgba(128, 128, 128, 0);
        /* box-shadow: 0 0 0 7px rgba(128, 128, 128, 0);*/

        border-radius: 10px;

        transition: 
            all 0.5s ease-out;
            /* box-shadow 0.1s ease-out; */
            
    }

    /* .artist:hover {
        outline: 3px solid rgba(128, 128, 128, 0.5);
    } */

    /* .artist:active {
        box-shadow: 0 0 0 10px rgba(128, 128, 128, 0.25);
    } */

    .artist-info {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 15px;
    }

    .artist-info__name {
        font-size: 20px;
        font-weight: 500;
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

    .artist-info__name:hover {
        /* background-color: rgb(124, 124, 124, 0.25); */
        color: black;      
        text-decoration: none;  
    }

    .artist-info__name:active {
        background-color: rgb(124, 124, 124, 0.5);
        /* outline: 4px solid rgb(124, 124, 124, 0.25); */
    }

    .artist-info__is-favourite {
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;
        transition: all 0.2s ease-out;
    }

    .artist-info__is-favourite:hover {
        background-color: rgb(128, 128, 128, 0.25);
    }

    .artist-info__is-favourite:active {
        background-color: gray;
    }

    .icon {
        width: 30px;
        height: 30px;
    }


</style>