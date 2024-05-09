const songsQueue = {
    actions: {
        getNextSong({ commit, state, getters }) {
            if (state.songsQueue.length > 0) {
                commit('setNextSongPointer');
                return getters('getCurrentSong');
            }
        },

        getPreviousSong({ commit, state, getters }) {
            if (state.queuePointer > 0) {
                commit('setPreviousSongPointer');
                return getters('getCurrentSong');
            }
        },

        playSong({ commit }, { songId, songsCollection }) {
            console.log(songId);
            console.log(songsCollection);
            commit('setQueue', songsCollection);
            const index = songsCollection.findIndex(collectionItem => collectionItem.id === songId);
            commit('setQueuePointer', index);
            commit('setPlayPlayerState');
        }
    },

    mutations: {
        enqueueSong(state, song) {
            state.songsQueue.push(song);
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