<template>
    <div id="audioPlayer" class="audio-player-container">
        <div class="song-card" :id="`song_${getCurrentSong.id}`">
            <div class="song-photo-container">
                <div class="song-photo-overlay">
                    <div class="actions-container">
                        <div @click.prevent="playPreviousSong()" class="action">
                            <img class="icon select-none" src="../../icons/play_previous.svg">
                        </div>
                        <div v-if="!getPlayerState" @click.prevent="play()" class="action">
                            <img class="icon select-none" src="../../icons/play.svg">
                        </div>
                        <div v-else @click.prevent="stop()" class="action">
                            <img class="icon select-none" src="../../icons/pause.svg">
                        </div>
                        <div @click.prevent="playNextSong()" class="action">
                            <img class="icon select-none" src="../../icons/play_next.svg">
                        </div>
                    </div>
                </div>
                <img class="song-photo select-none" :src="`http://music.local:9005/photo/${getCurrentSong.photoPath}`">
            </div>

            <div class="song-info-container">
                <div :title="getCurrentSong.name" class="song-name">
                    {{ getCurrentSong.name }}
                </div>
                <router-link :to="{ name: 'artist.single', params: { id: getCurrentSong.artistId }}" class="artist-name">
                    {{ getCurrentSong.artistName }}
                </router-link>
                <div class="song-player-container">
                    <audio id="player" class="audio-player" autoplay :src="`http://music.local:9005/audio/${getCurrentSong.musicPath}`">
                    </audio>
                    <div id="currentSongTime" class="song-time">0:00</div>
                    <input type="range" id="seekBar" value="0">
                    <div id="songDuration" class="song-time">0:00</div>
                </div>
            </div>

            <div class="song-actions-container">
                <div class="song-action">
                    <img @click.prevent="removeFromFavourites()" v-show="getCurrentSong.isFavourite" class="icon" src="../../icons/liked.svg">
                    <img @click.prevent="addToFavourites()" v-show="!getCurrentSong.isFavourite" class="icon" src="../../icons/not_liked.svg">
                </div>
                <div tabindex="0" class="song-action open-hidden-actions">
                    <img class="icon" src="/src/icons/more.svg">

                    <div class="hidden-actions-container">
                        <div class="song-action hidden-action">
                            <img @click.prevent="openModalAddToPlaylist()" class="centered-icon icon" src="../../icons/add_to_playlist.svg">
                        </div>
                        <div class="song-action hidden-action">
                            <img @click.prevent="openModalDeleteFromPlaylists()" class="centered-icon icon" src="../../icons/delete_from_playlist.svg">
                        </div>
                        <div v-show="userInfo && getCurrentSong.artistId === userInfo.artistId" class="song-action hidden-action">
                            <img @click.prevent="openModalEditSong()" class="centered-icon icon" src="../../icons/edit.svg">
                        </div>
                    </div>

                </div>
            </div>

            <div class="modal" id="addToPlaylistModal">
                <div class="modal__overlay" id="addToPlaylistModalOverlay"></div>
                <div class="modal__window">
                    <add-to-playlist ref="addToPlaylistRef" :song="getCurrentSong"></add-to-playlist>
                </div>
            </div>
            <div class="modal" id="deleteFromPlaylistModal">
                <div class="modal__overlay" id="deleteFromPlaylistModalOverlay"></div>
                <div class="modal__window">
                    <delete-from-playlist ref="deleteFromPlaylistRef" :song="getCurrentSong"></delete-from-playlist>
                </div>
            </div>
            <div class="modal" id="editSongModal">
                <div class="modal__overlay" id="editSongModalOverlay"></div>
                <div class="modal__window">
                    <edit-song :song="getCurrentSong"></edit-song>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import AddToPlaylist from '../playlist/AddToPlaylist.vue';
import DeleteFromPlaylist from '../playlist/DeleteFromPlaylist.vue';
import EditSong from './EditSong.vue';
export default {
    name: "AudioPlayer",

    components: {
        AddToPlaylist,
        DeleteFromPlaylist,
        EditSong
    },

    data() {
        return {
            playerState: false,
        }
    },

    computed: {
        ...mapGetters(['getQueue', 'getCurrentSong', 'getPlayerState']),
    },

    mounted() {
        this.autoSkip();
        this.initializeSongProgressBar();
    },

    watch: {
        getCurrentSong(newValue, oldValue) {
            const player = document.getElementById('player');
            player.src = `http://music.local:9005/audio/${newValue.musicPath}`;
            const playPromise = player.play();
            playPromise.catch(error => {
                // console.log('error')
            })
        }
    },

    methods: {
        ...mapMutations([
            'setPausePlayerState', 
            'setPlayPlayerState', 
            'setNextSongPointer',
            'setPreviousSongPointer',
        ]),

        ...mapActions([
            'playNextSong',
            'playPreviousSong'
        ]),

        initializeSongProgressBar() {
            const audio = document.getElementById('player');
            const seekBar = document.getElementById('seekBar');
            const currentTime = document.getElementById('currentSongTime');
            const duration = document.getElementById('songDuration');

            audio.addEventListener('timeupdate', function() {
                let currentMinutes = Math.floor(audio.currentTime / 60);
                let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
                let durationMinutes = Math.floor(audio.duration / 60);
                let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

                if (currentSeconds < 10) {
                currentSeconds = '0' + currentSeconds;
                }
                if (durationSeconds < 10) {
                durationSeconds = '0' + durationSeconds;
                }

                currentTime.textContent = currentMinutes + ':' + currentSeconds;
                duration.textContent = durationMinutes + ':' + durationSeconds;

                seekBar.value = (audio.currentTime / audio.duration) * 100;
            });

            seekBar.addEventListener('change', function() {
                let seekTo = audio.duration * (seekBar.value / 100);
                audio.currentTime = seekTo;
            });
        },

        play() {
            const player = document.getElementById('player');
            player.play()
                .catch(error => {
                    
                })
            this.setPlayPlayerState();
        },

        stop() {
            const player = document.getElementById('player');
            player.pause();
            this.setPausePlayerState();
        },

        autoSkip() {
            const player = document.getElementById('player');
            player.addEventListener('ended', () => {
                this.playNextSong();
            });
        },
        

        openModalEditSong() {
            const overlayId = "editSongModalOverlay";
            const modalId = "editSongModal";

            this.openModal(overlayId, modalId);
        },

        openModalAddToPlaylist() {
            const overlayId = "addToPlaylistModalOverlay";
            const modalId = "addToPlaylistModal";

            this.$refs.addToPlaylistRef.getUserPlaylists();
            this.openModal(overlayId, modalId);
        },

        openModalDeleteFromPlaylists() {
            const overlayId = "deleteFromPlaylistModalOverlay";
            const modalId = "deleteFromPlaylistModal";

            this.$refs.deleteFromPlaylistRef.getUserPlaylists();
            this.openModal(overlayId, modalId);
        },

        openModal(overlayId, modalId) {
            const audioPlayer = document.getElementById("audioPlayer");
            const modal = audioPlayer.querySelector(`#${modalId}`);
            
            modal.style.visibility = "visible"
            modal.style.opacity = "1"
            
            setTimeout(() => {
                this.overlayClickListener(overlayId, modalId);
            }, 500)
        },

        overlayClickListener(overlayId, modalId) {
            const audioPlayer = document.getElementById("audioPlayer");
            const overlay = audioPlayer.querySelector(`#${overlayId}`);
            overlay.addEventListener('click', this.hideModal(overlayId, modalId));
        },

        hideModal(overlayId, modalId) {
            return () => {
                const audioPlayer = document.getElementById("audioPlayer");
                const overlay = audioPlayer.querySelector(`#${overlayId}`);
                const modal = audioPlayer.querySelector(`#${modalId}`);
                modal.style.visibility = "hidden"
                modal.style.opacity = "0"
                overlay.removeEventListener('click', this.hideModal(overlayId, modalId))
            }
        },

        addToFavourites() {
            api.put(`http://music.local/api/favourite/songs/add-to-favourites/${this.getCurrentSong.id}`)
            this.getCurrentSong.isFavourite = true
        },

        removeFromFavourites() {
            api.put(`http://music.local/api/favourite/songs/delete-from-favourites/${this.getCurrentSong.id}`)
            this.getCurrentSong.isFavourite = false
        },
    },
}

</script>

<style scoped>

    .song-player-container{
        width: 300px;
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-left: 5px;
    }

    #seekBar {
        width: 100%;

    }

    .song-time {
        font-weight: lighter;
        color: rgb(51, 51, 51);
        font-size: 10px;
    }

    .song-card {
        display: flex;
        flex-direction: row;
        width: 100%;
        margin: 5px 0px;
        padding: 10px;
        border: solid 1px rgba(125, 125, 125, 0.5);
        border-radius: 10px;
        transition: 0.5s ease-out;
        backdrop-filter: blur(10px);
        background-color: rgba(125, 125, 125, 0.1);
        z-index: 70;
    }

    /* .song-card:hover {
        background-color: rgba(125, 125, 125, 0.2);
    } */

    .song-card:hover .song-photo-overlay {
        background-color: rgba(255, 255, 255, 0.7);
    }

    .song-card:hover .action {
        opacity: 1;
    }

    .song-card:hover .song-actions-container {
        opacity: 1;
    }

    .song-photo-container {        
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .song-photo {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        border: 0.5px solid rgb(175, 175, 175);
    }

    .song-photo-overlay {
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

    .actions-container {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .action {
        padding: 5px;
        opacity: 0;
        transition: all 0.2s ease-out;
        background-color: rgba(125, 125, 125, 0);
        border-radius: 50%;
    }

    .action:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .action:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .song-info-container {
        display: flex;
        flex-direction: column;
        gap: 5px;
        align-self: center;
        margin-left: 10px;
    }

    .song-name {
        font-size: 15px;
        margin-left: 5px;
        color: black;
        /* max-width: 150px; */
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .artist-name {
        font-size: 12px;
        padding: 2.5px 5px;
        width: fit-content;
        border-radius: 5px;
        color: rgb(70, 70, 70);
        transition: all 0.2s ease-out;
    }

    .artist-name:hover {
        text-decoration: none;
        background-color: rgba(125, 125, 125, 0.5);
        color: black;
    }

    .artist-name:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .song-actions-container {
        display: flex;
        align-self: center;
        margin-left: auto;
        opacity: 0;
        transition: all 0.5s ease-out;
        background-color: rgba(125, 125, 125, 0);
    }

    .song-action {
        margin: 0px 2px;
        border-radius: 50%;
        transition: all 0.2s ease-out;
        padding: 5px;
        cursor: pointer;
    }

    .song-action:hover {
        background-color: rgba(125, 125, 125, 0.3);
    }

    .song-action:active {
        background-color: rgba(125, 125, 125, 1);
    }

    .hidden-actions-container {
        position: absolute;
        z-index: 5;
        top: -20px;
        left: 63px;

        background-color: rgb(215, 215, 215);
        border: solid 1px rgba(125, 125, 125, 0.5);
        border-radius: 10px;
        padding: 10px;
        height: 81px;

        visibility: hidden;
        opacity: 0;
        transition: opacity 0.5s, visibility 0.5s;

        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .open-hidden-actions {
        position: relative;
    }

    .open-hidden-actions:focus {
        background-color: rgba(125, 125, 125, 0.7);
    }

    .open-hidden-actions:focus .hidden-actions-container {
        visibility: visible;
        opacity: 1;
    }

    .icon {
        width: 30px;
        height: 30px;
    }

    /** modal window */

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

    .modal__overlay {
        position: absolute;
        width: inherit;
        height: inherit;
        background-color: rgba(125, 125, 125, 0.2);
    }

    .modal__window {
        position: absolute;
        z-index: 21;
        max-height: 70vh;
        overflow-y: auto;
        
    }

    

    /*.pointer-events-none {*/
    /*    pointer-events: none;*/
    /*}*/
</style>