<template>
    <div class="accounts-container">
        <div class="user-account">
            <div class="title">Мои данные</div>
            <div class="personal-info" v-if="personalInfo">
                <div class="personal-info__name">
                    <span><strong>Имя:</strong></span> {{ personalInfo.name }}
                </div>
                <div class="personal-info__email">
                    <span><strong>Почта:</strong></span> {{ personalInfo.email }}
                </div>
            </div>
        </div>
        <div class="artist-account">
            <div class="title">Аккаунт артиста</div>
            <div v-if="artist">
                <div class="artist-card select-none">
                    <div class="artist-photo-container">
                        <img class="artist-photo-container__photo" v-show="!imageError" :src="photoSrc" @error="this.imageError = true">
                        <img class="artist-photo-container__photo" v-show="imageError" :src="altPhotoSrc">
                    </div>
                    <div class="artist-info">
                        <router-link :to="{ name: 'artist.single', params: { id: artist.id }}" class="artist-info__name">
                            {{ artist.name }}
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-else>

            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    name: "Account",

    data() {
        return {
            personalInfo: null,
            artist: null,
            imageError:  null,
            photoSrc: null,
            altPhotoSrc: "/src/icons/base_img.jpg"
        }
    },


    mounted() {
        this.getPersonalInfo()
            .then(() => {
                if (this.personalInfo.artistId) {
                    this.getArtistInfo()
                        .then(() => {
                            this.photoSrc = `http://music.local:9005/photo/${this.artist.photoPath}`;
                        })
                }
            })

        
    },

    methods: {
        getPersonalInfo() {
            return api.get('http://music.local/api/auth/me')
                .then( res => {
                    this.personalInfo = res.data
                })
        },

        getArtistInfo() {
            return api.get(`http://music.local/api/artists/${this.personalInfo.artistId}`)
                .then( res => {
                    this.artist = res.data
                })
        },
    }
}
</script>

<style scoped>
    .accounts-container {
        display: flex;
        flex-direction: row;
        padding: 20px;
        gap: 20px;
    }

    .user-account {
        background-color: rgba(125, 125, 125, 0.1);
        padding: 20px;
        display:flex;
        flex-direction: column;
        gap: 20px;
        border-radius: 20px;
    }

    .title {
        padding: 3px 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
        width: fit-content;
        font-size: 20px;
    }

    .personal-info {
        padding: 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
    }

    .artist-account {
        background-color: rgba(125, 125, 125, 0.1);
        padding: 20px;
        display:flex;
        flex-direction: column;
        gap: 20px;
        border-radius: 20px;
    }

    .artist-card {
        display: flex;
        flex-direction: column;
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
</style>