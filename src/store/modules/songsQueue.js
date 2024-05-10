const songsQueue = {
    actions: {
        playNextSong({commit, state}) {
            if (state.songsQueue.length > (state.queuePointer + 1)) {
                commit('setNextSongPointer');
                commit('setPlayPlayerState');
            }
        },

        playPreviousSong({commit, state}) {
            if (state.queuePointer > 0) {
                commit('setPreviousSongPointer');
                commit('setPlayPlayerState');
            }
        },

        playSong({ commit }, { songId, songsCollection }) {
            commit('setQueue', songsCollection);
            const index = songsCollection.findIndex(collectionItem => collectionItem.id === songId);
            commit('setQueuePointer', index);
            commit('setPlayPlayerState');
        }
    },

    mutations: {
        enqueueSong(state, song) {
            state.songsQueue.splice((state.queuePointer + 1), 0, song);
        },
        dequeueSong(state, songId) {
            state.songsQueue = state.songsQueue.filter(song => song.id !== songId);
        },
        setQueue(state, songsCollection) {
            state.songsQueue = songsCollection;
        },
        setQueuePointer(state, index) {
            state.queuePointer = index;
        },
        setNextSongPointer(state) {
            state.queuePointer++;
        },
        setPreviousSongPointer(state) {
            state.queuePointer--;
        },
        setPausePlayerState(state) {
            state.playerState = false;
        },
        setPlayPlayerState(state) {
            state.playerState = true;
        },
    },

    state: {
        songsQueue: [],

        /**
         * @type {number} index of current song in queue
         */
        queuePointer: -1,

        /**
         * @type {boolean} true if playing, false if not
         */
        playerState: false,
    },

    getters: {
        getQueue(state) {
            return state.songsQueue;
        },

        getCurrentSong(state) {
            return state.songsQueue[state.queuePointer];
        },

        getPlayerState(state) {
            return state.playerState;
        }
    }
}

export default songsQueue;