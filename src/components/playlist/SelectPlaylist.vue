<template>
    <div class="playlist-selection">
        <div class="title">
            Выберите плейлисты
        </div>
        <div class="playlists" v-show="userPlaylists">
            <template v-for="playlist in userPlaylists">
                <div class="playlist-card" :id="`playlist_${playlist.id}`">

                    <div v-if="checkIfSongInPlaylist(playlist.id)" class="unavailable-playlist">
                        Плейлист<br>
                        уже содержит
                        этот трек
                    </div>

                    <template v-if="!checkIfSongInPlaylist(playlist.id)">
                        <div class="selection-overlay"></div>
                        <div @click.prevent="selectPlaylist(playlist.id)" class="selection-mark"></div>
                    </template>

                    <div class="playlist-photo-container">
                        <img class="playlist-photo-container__photo select-none" v-show="!imageError" :src="`http://music.local:9005/photo/${playlist.photoPath}`" @error="this.imageError = true">
                        <img class="playlist-photo-container__photo select-none" v-show="imageError" :src="altPhotoSrc">
                    </div>

                    <div class="playlist-info">
                        <div class="playlist-info__name">
                            {{ playlist.name }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div @click.prevent="addSongToPlaylists()" class="submit-button">
            Добавить
        </div>
    </div>
</template>
<script>
import api from "@/api";
export default {
    name: 'SelectPlaylist',

    data() {
        return {
            imageError: false,
            altPhotoSrc: "/src/icons/base_img.jpg",
            selectedPlaylists: [],
        }
    },

    props: [
        'song',
    ],

    computed: {
        userPlaylists() {
            return this.$parent.userPlaylists;
        }
    },

    methods: {
        selectPlaylist(selectedPlaylistId) {
            const songCard = document.getElementById(`song_${this.song.id}`)
            const playlist = songCard.querySelector(`#playlist_${selectedPlaylistId}`);

            const selectionOverlay = playlist.querySelector('.selection-overlay');
            const selectionMark = playlist.querySelector('.selection-mark');

            if (selectionOverlay.classList.contains("selected") && selectionMark.classList.contains("selected")) {
                selectionOverlay.classList.remove("selected");
                selectionMark.classList.remove("selected");
                removeFromSelected.bind(this)(selectedPlaylistId)
            } else {
                selectionOverlay.classList.add("selected");
                selectionMark.classList.add("selected");
                this.selectedPlaylists.push(selectedPlaylistId);
            }

            function removeFromSelected(elementToRemove) {
                let index = this.selectedPlaylists.indexOf(elementToRemove);

                if (index !== -1) {
                    this.selectedPlaylists.splice(index, 1);
                }
            }
        },

        addSongToPlaylists() {
            this.selectedPlaylists.forEach( playlistId => {
                api.put(`http://music.local/api/playlists/${playlistId}/add-song/${this.song.id}`)
                    .then( res => {
                        this.$parent.hideModal();
                        this.song.containedInPlaylists.push({ id: playlistId })
                    })
            })

        },

        checkIfSongInPlaylist(playlistId) {
            const playlistsWithSong = []
            this.song.containedInPlaylists.forEach((element) => {
                playlistsWithSong.push(element.id)
            })

            return playlistsWithSong.includes(playlistId);
        },

    }
}
</script>
<style scoped>
/** playlists group */

.playlists {
        width: 430px; /** ширина при которой контейнер альбомов вмещает ровно два альбома по ширине */
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 20px;
    }


    /** selection */

    .playlist-selection {
        background-color: white;
        border-radius: 20px;
        padding: 20px;
        width: fit-content;

        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .title {
        width: fit-content;
        background-color: rgba(125, 125, 125, 0.2);
        padding: 5px 10px;
        border-radius: 10px;
        font-size: 20px;
    }

    .submit-button {
        background-color: rgba(125, 125, 125, 0.2);
        padding: 5px 10px;
        border-radius: 10px;
        width: fit-content;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .submit-button:hover {
        background-color: rgba(125, 125, 125, 0.4);
    }

    .submit-button:active {
        background-color: rgba(125, 125, 125, 0.8);
    }

    .selection-overlay {
        position:absolute;
        z-index:22;

        background-color: rgba(124, 124, 124, 0.2);
        border-radius: 10px;
        width: 182px;
        height: 224px;

        transition: opacity 0.5s;
        opacity: 0;
    }

    .selection-mark {
        position:absolute;
        opacity: 0;
        transition: opacity 0.5s, background-color 0.2s;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        cursor: pointer;
        border: 5px solid white;

        z-index:23;
    }

    .selection-mark:hover {
        background-color: rgba(255, 255, 255, 0.3);
    }

    .selection-mark:active {
        background-color: rgba(255, 255, 255, 0.6);
    }

    .playlist-card:hover .selection-mark {
        opacity: 1;
    }

    .playlist-card:hover .selection-overlay {
        opacity: 1;
    }

    .selected {
        opacity: 1;
    }

    .selection-mark.selected {
        background-color: white;
    }

    .unavailable-playlist {
        position:absolute;
        z-index:22;

        background-color: rgba(124, 124, 124, 0.4);
        border-radius: 10px;
        width: 182px;
        height: 224px;

        display: flex;
        justify-content: center;
        align-items: center;
        padding: 25px;
        font-size: 15px;
        text-align: center;
        font-weight: bold;
        color: white;
    }

    /** playlist card */

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

        justify-content: center;
        align-items: center;
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
        transition: all 0.2s ease-out; 
    }
</style>