import api from "@/api";

const userInfo = {
    actions: {
        async fetchUserInfo(state) {
            const url = `http://music.local/api/auth/me`;
            const response = await api.get(url);
            state.userInfo = response.data;
        }
    },

    mutations: {
        deleteUserInfo(state) {
            state.userInfo = null
        }
    },

    state: {
        userInfo: null,
    },

    getters: {
        getUserInfo(state) {
            return state.userInfo;
        },

        getUserArtistId(state) {
            return state.userInfo.artistId;
        },
    }
}

export default userInfo;