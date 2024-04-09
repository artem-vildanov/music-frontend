<template>
    <div class="artist-card select-none" :id="`artist_${this.artist.id}`">
        <div class="artist-photo-container">
            <div class="artist-photo-container__photo-overlay">
                <div class="photo-overlay__is-favourite">
                    <img @click.prevent="removeFromFavourites()" v-show="artist.isFavourite" class="icon" src="../../icons/liked.svg">
                    <img @click.prevent="addToFavourites()" v-show="!artist.isFavourite" class="icon" src="../../icons/not_liked.svg">
                </div>
            </div>
            <img class="artist-photo-container__photo" v-show="!imageError" :src="photoSrc" @error="this.imageError = true">
            <img class="artist-photo-container__photo" v-show="imageError" :src="altPhotoSrc">
        </div>
        <div class="artist-info">
            <router-link :to="{ name: 'artist.single', params: { id: artist.id }}" class="artist-info__name">
                {{ artist.name }}
            </router-link>
        </div>
    </div>
</template>

<script>
import api from '@/api'
    export default {
        name: "ArtistCard",

        props: [
            'artist'
        ],

        data() {
            return {
                imageError: false,
                photoSrc: `http://music.local:9005/photo/${this.artist.photoPath}`,
                altPhotoSrc: "/src/icons/base_img.jpg"
            }
        },

        mounted() {

        },

        methods: {
            addToFavourites() {
                api.put(`http://music.local/api/favourite/artists/add-to-favourites/${this.artist.id}`)
                this.artist.isFavourite = true
            },

            removeFromFavourites() {
                api.put(`http://music.local/api/favourite/artists/delete-from-favourites/${this.artist.id}`)
                this.artist.isFavourite = false

                if (this.$parent.$data.favouriteArtists) {
                    this.hideArtistCard()
                }
            },

            hideArtistCard() {
                const artistCard = document.getElementById(`artist_${this.artist.id}`)
                artistCard.style.opacity = '0'
                setTimeout(() => {
                    artistCard.remove()
                }, 500)
            },
        }
    }
</script>

<style scoped>
    .artist-card {
        display: flex;
        flex-direction: column;
        margin: 10px;
        padding: 15px;

        width: fit-content;
        height: fit-content; 

        border: solid rgba(125, 125, 125, 0.5) 1px;
        border-radius: 10px;
        transition: all 0.5s ease-out;
    }

    .artist-card:hover {
        background-color: rgba(125, 125, 125, 0.2);
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
        border-radius: 50%;
        overflow: hidden;
        pointer-events: none;
    }

    .artist-photo-container__photo-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0); 
        border-radius: 50%;
        transition: 0.5s ease-out;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .artist-card:hover .artist-photo-container__photo-overlay {
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
        background-color: rgb(124, 124, 124, 0.2); 
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

    .artist-card:hover .photo-overlay__is-favourite {
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