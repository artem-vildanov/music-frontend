import Vuex from "vuex";
import songsQueue from './modules/songsQueue';

const vuex = new Vuex.Store({
    modules: {
        songsQueue
    }
});

export default vuex;