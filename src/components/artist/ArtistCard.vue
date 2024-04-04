<template>
    <div class="artist-card-container select-none">
        <div class="artist-photo-container">
            <div class="artist-photo-container__photo-overlay">
                <div class="photo-overlay__is-favourite">
                    <img v-show="artist.isFavourite" class="icon" src="../../icons/liked.svg">
                    <img v-show="!artist.isFavourite" class="icon" src="../../icons/not_liked.svg">
                </div>
            </div>
            <img class="artist-photo-container__photo" v-show="!imageError" :src="photoSrc" @error="this.imageError = true">
            <img class="artist-photo-container__photo" v-show="imageError" src='../../icons/base_img.jpg'>
        </div>
        <div class="artist-info">
            <div @click.prevent="openArtist()" class="artist-info__name">
                {{ artist.name }}
            </div>
        </div>
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
            }
        },

        mounted() {
            // this.checkPhotoUrl(this.photoSrc)
            // .then( res => {
            //     if (res) {
            //         this.setArtistPhoto()
            //     }
            // })
            
        },

        methods: {
            // setArtistPhoto() {
            //     const artistPhoto = document.getElementById(`photo_${this.artist.id}`)
            //     artistPhoto.style.backgroundImage = `url(${this.photoSrc})`
            // },

            // async checkPhotoUrl(url) {
            //     const response = await fetch(url, { method: 'HEAD' })
            //     if (response.status === 404) {
            //         console.log('error 404')
            //         return false
            //     }

            //     return true
            // },

            openArtist() {
                router.push({name: 'artist.single', params: {id: this.artist.id}})
            }   
        }
    }
</script>

<style scoped>
    .artist-card-container {
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 15px;

        width: fit-content;
        height: fit-content; 

        border: solid gray 1px;
        outline: 6px solid rgba(128, 128, 128, 0);
        border-radius: 10px;
        transition: all 0.5s ease-out;
    }

    .artist-card-container:hover {
        outline: 6px solid rgba(128, 128, 128, 0.5);
    }

    .artist-photo-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    
    .artist-photo-container__photo {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        overflow: hidden;
        pointer-events: none;
    }

    .artist-photo-container__photo-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0); 
        border-radius: 10px;
        transition: 0.5s ease-out;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .artist-card-container:hover .artist-photo-container__photo-overlay {
        background-color: rgba(255, 255, 255, 0.7); 
    } 

    .artist-info {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin-top: 15px;   
    }

    .artist-info__name {
        max-width: 150px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
        font-weight: 300;
        color: rgb(70, 70, 70);
        
        padding: 5px 10px;
        border-radius: 10px;
        outline: 4px solid rgb(124, 124, 124, 0);
        transition: all 0.2s ease-out; 
    }

    .artist-info__name:hover {
        background-color: rgb(124, 124, 124, 0.1); 
        color: black;      
        text-decoration: none;  
    }

    .artist-info__name:active {
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

    .artist-card-container:hover .photo-overlay__is-favourite {
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