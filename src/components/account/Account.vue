<template>
    <div class="accounts-container">
        <div class="user-account">
            <div class="title">Мои данные</div>
            <div class="personal-info" v-if="personalInfo">
                <div class="personal-name">
                    <span><strong>Имя:</strong></span> {{ personalInfo.name }}
                </div>
                <div class="personal-email">
                    <span><strong>Почта:</strong></span> {{ personalInfo.email }}
                </div>
            </div>
            <div class="submit-button danger" @click.prevent="logoutUser">
                Выйти
            </div>
        </div>
        <div class="artist-account">
            <div class="title">Аккаунт артиста</div>
            <div v-if="artist">
                <div class="artist-card select-none">
                    <div class="artist-photo-container">
                        <img class="artist-photo" :src="photoSrc">
                    </div>
                    <div class="artist-info">
                        <router-link :to="{ name: 'artist.single', params: { id: artist.id }}" class="artist-info__name">
                            {{ artist.name }}
                        </router-link>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="create-artist-box">
                    <div class="create-artist-title">У вас нет аккаунта артиста</div>
                    <div @click.prevent="openModalCreateArtist()" class="submit-button">
                        Создать<br> 
                        аккаунт артиста
                    </div>
                </div>
                
            </div>
        </div>
        <div class="modal" id="createArtistModal">
            <div class="modal-overlay" id="createArtistModalOverlay"></div>
            <div class="modal-window">
                <create-artist ref="createArtistRef"></create-artist>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import CreateArtist from '../artist/CreateArtist.vue';

export default {
    name: "Account",

    components: {
        CreateArtist
    },

    data() {
        return {
            personalInfo: null,
            artist: null,
            imageError:  null,
            photoSrc: null,
        }
    },


    mounted() {
        this.getPersonalInfo()
            .then(this.getArtistInfo);
    },

    methods: {
        getPersonalInfo() {
            return api.get('http://music.local/api/auth/me')
                .then( res => {
                    this.personalInfo = res.data
                })
        },

        getArtistInfo() {
            if (this.personalInfo.artistId) {
                api.get(`http://music.local/api/artists/${this.personalInfo.artistId}`)
                    .then( res => {
                        this.artist = res.data;
                        this.photoSrc = `http://music.local:9005/photo/${this.artist.photoPath}`;
                    })
            }
        },

        openModalCreateArtist() {
            this.$refs.createArtistRef.onMounted();

            const modalId = "createArtistModal";
            const overlayId = "createArtistModalOverlay";

            this.openModal(overlayId, modalId);
        },

        openModal(overlayId, modalId) {
            const modal = document.querySelector(`#${modalId}`);
            
            modal.style.visibility = "visible"
            modal.style.opacity = "1"
            
            setTimeout(() => {
                this.overlayClickListener(overlayId, modalId);
            }, 500)
        },

        overlayClickListener(overlayId, modalId) {
            const overlay = document.querySelector(`#${overlayId}`);
            overlay.addEventListener('click', this.hideModal(overlayId, modalId));
        },

        hideModal(overlayId, modalId) {
            return () => {
                const overlay = document.querySelector(`#${overlayId}`);
                const modal = document.querySelector(`#${modalId}`);
                modal.style.visibility = "hidden"
                modal.style.opacity = "0"
                overlay.removeEventListener('click', this.hideModal(overlayId, modalId))
            }
        },

        logoutUser() {
            api.post('http://music.local/api/auth/logout')
                .then( res => {
                    localStorage.removeItem('access_token')
                    this.$router.push({name: 'auth.login'})
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

    .create-artist-box {
        padding: 20px;
        display: flex;
        gap: 10px;
        align-items: center;
        flex-direction: column;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
    }

    .create-artist-title {
        padding: 5px;
        font-weight: bold;
    }

    .submit-button {
        padding: 3px 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
        width: fit-content;
        text-align: center;
        /* font-size: 17px; */
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

    .artist-photo-container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    
    .artist-photo {
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

    .modal {
        position: fixed;

        top:0;
        left:0;

        width: 100%;
        height: 100%;
        z-index: 20;

        display: flex;

        visibility: hidden;
        opacity: 0;

        justify-content: center;
        align-items: center;
        backdrop-filter: blur(15px);
        

        transition: opacity 0.5s, visibility 0.5s, backdrop-filter 0.2s; 
    }

    .modal-overlay {
        position: absolute;
        width: inherit;
        height: inherit;
        background-color: rgba(125, 125, 125, 0.2);
    }

    .modal-window {
        position: absolute;
        z-index: 21;
        max-height: 70vh;
        overflow-y: auto;
    }

</style>