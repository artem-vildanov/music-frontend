import Vuex from "vuex";
import songsQueue from './modules/songsQueue';
import userInfo from "./modules/userInfo";

const vuex = new Vuex.Store({
    modules: {
        info: userInfo,
        queue: songsQueue,
    }
});

export default vuex;