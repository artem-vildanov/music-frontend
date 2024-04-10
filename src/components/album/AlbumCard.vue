<template>
    <div class="album-card" :id="`album_${album.id}`">

        <div class="album-photo-container">
            <div class="album-photo-container__photo-overlay select-none">
                <div class="photo-overlay__is-favourite">
                    <img @click.prevent="removeFromFavourites()" v-show="album.isFavourite" class="icon" src="../../icons/liked.svg">
                    <img @click.prevent="addToFavourites()" v-show="!album.isFavourite" class="icon" src="../../icons/not_liked.svg">
                </div>
            </div>
            <img class="album-photo-container__photo select-none" v-show="!imageError" :src="photoSrc" @error="this.imageError = true">
            <img class="album-photo-container__photo select-none" v-show="imageError" :src="altPhotoSrc">
        </div>

        <div class="album-info">
            <router-link :title="album.name" :to="{ name: 'album.single', params: { id: album.id }}" class="album-info__name">
                {{ album.name }}
            </router-link>
            <router-link :to="{ name: 'artist.single', params: { id: album.id }}" class="album-info__artist-name">
                {{ album.artistName }}
            </router-link>
        </div>
    </div>
</template>

<script>
import api from '@/api'
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
            addToFavourites() {
                api.put(`http://music.local/api/favourite/albums/add-to-favourites/${this.album.id}`)
                this.album.isFavourite = true
            },

            removeFromFavourites() {
                api.put(`http://music.local/api/favourite/albums/delete-from-favourites/${this.album.id}`)
                this.album.isFavourite = false

                if (this.$parent.$data.favouriteAlbums) {
                    this.hideAlbumCard()
                }
            },

            hideAlbumCard() {
                const albumCard = document.getElementById(`album_${this.album.id}`)
                albumCard.style.opacity = '0'
                setTimeout(() => {
                    albumCard.remove()
                }, 500)
            },
        }
    }
</script>

<style scoped>
    .album-card {
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

    .album-card:hover {
        background-color: rgba(125, 125, 125, 0.2);
    }

    .album-photo-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .album-photo-container__photo {
        width: 150px;
        height: 150px;
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
        border-radius: 10px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .album-card:hover .album-photo-container__photo-overlay {
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
        max-width: 150px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 15px;
        color: rgb(70, 70, 70);
        
        padding: 2.5px 7px;
        border-radius: 10px;
        outline: 4px solid rgba(124, 124, 124, 0);
        transition: all 0.2s ease-out; 
    }

    .album-info__name:hover {
        background-color: rgba(124, 124, 124, 0.2);
        color: black;      
        text-decoration: none;  
    }

    .album-info__name:active {
        background-color: rgba(124, 124, 124, 0.5);
        /* outline: 4px solid rgb(124, 124, 124, 0.25); */
    }

    .album-info__artist-name {
        max-width: 150px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
        color: rgb(100, 100, 100);
        
        padding: 2.5px 7px;
        border-radius: 10px;
        outline: 4px solid rgba(124, 124, 124, 0);
        transition: all 0.2s ease-out; 
    }

    .album-info__artist-name:hover {
        background-color: rgba(124, 124, 124, 0.2);
        color: black;      
        text-decoration: none;  
    }

    .album-info__artist-name:active {
        background-color: rgba(124, 124, 124, 0.5);
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

    .album-card:hover .photo-overlay__is-favourite {
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