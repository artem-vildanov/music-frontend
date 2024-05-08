<template>
    <div id="deleteFromPlaylist" class="playlist-selection">
        <div class="title">
            Выберите плейлисты,<br>
            из которых хотите <strong>удалить</strong><br> 
            этот трек
        </div>
        <div class="playlists" v-if="userPlaylists">
            <template v-for="playlist in userPlaylists">
                <div class="playlist-card" :id="`playlist_${playlist.id}`">

                    <div v-if="!checkIfSongInPlaylist(playlist.id)" class="unavailable-playlist">
                        Плейлист<br>
                        не содержит
                        этот трек
                    </div>

                    <template v-if="checkIfSongInPlaylist(playlist.id)">
                        <div class="selection-overlay"></div>
                        <div @click.prevent="selectPlaylist(playlist.id)" class="selection-mark"></div>
                    </template>

                    <div class="playlist-photo-container">
                        <img class="playlist-photo select-none" :src="`http://music.local:9005/photo/${playlist.photoPath}`">
                    </div>

                    <div class="playlist-info">
                        <div class="playlist-name">
                            {{ playlist.name }}
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <input 
            type="submit" 
            :disabled="!buttonClickabilityChecker()" 
            @click.prevent="deleteSongFromPlaylists()" 
            class="submit-button" 
            value="Удалить"
        /> 
    </div>
</template>
<script>
import api from "@/api";
export default {
    name: 'AddToPlaylist',

    data() {
        return {
            imageError: false,
            altPhotoSrc: "/src/icons/base_img.jpg",
            selectedPlaylists: [],
            userPlaylists: []
        }
    },

    props: [
        'song',
    ],

    methods: {
        buttonClickabilityChecker() {
            return this.selectedPlaylists.length > 0;
        },

        getUserPlaylists() {
            api.get('http://music.local/api/playlists')
            .then( res => {
                this.userPlaylists = res.data
            })
        },

        checkIfSongInPlaylist(playlistId) {
            const playlistsWithSong = []
            this.song.containedInPlaylists.forEach((element) => {
                playlistsWithSong.push(element.id)
            })

            return playlistsWithSong.includes(playlistId);
        },

        selectPlaylist(selectedPlaylistId) {
            const songCard = document.getElementById(`song_${this.song.id}`);
            const playlistsSelection = songCard.querySelector(`#deleteFromPlaylist`);
            const playlist = playlistsSelection.querySelector(`#playlist_${selectedPlaylistId}`);

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

        async deleteSongFromPlaylists() { 
            await this.sendPutRequests();
            this.hideModal();
            this.deleteSongFromPlaylistInComponent();
        },

        async sendPutRequests() {
            const requests = this.selectedPlaylists.map(playlistId => {
                const url = `http://music.local/api/playlists/${playlistId}/delete-song/${this.song.id}`
                return api.put(url);
            });

            for (const request of requests) {
                await request;
            }
        },

        deleteSongFromPlaylistInComponent() {
            const song = this.$parent.song;
            const containedInPlaylists = song.containedInPlaylists;
            const selectedPlaylists = this.selectedPlaylists;

            const remainingPlaylists = containedInPlaylists.filter(playlist => !selectedPlaylists.includes(playlist.id));

            song.containedInPlaylists = remainingPlaylists;
            this.selectedPlaylists = [];
        },

        hideModal() {
            const overlayId = "deleteFromPlaylistModalOverlay";
            const modalId = "deleteFromPlaylistModal";

            this.$parent.hideModal(overlayId, modalId);
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
        align-items: center;
        gap: 20px;
    }

    .title {
        width: fit-content;
        background-color: rgba(125, 125, 125, 0.2);
        padding: 20px;
        border-radius: 10px;
        font-size: 20px;
        text-align: center;
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
    
    .playlist-photo {
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

    .playlist-name {
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

    input {
        border: none;
    }
</style>