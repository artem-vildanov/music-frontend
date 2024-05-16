import api from "@/api";

const userInfo = {
    actions: {
        // fetchUserInfo(state) {
        //     const url = `http://music.local/api/auth/me`;
        //     api.get(url).then( response => {
        //         state.info = response.data;
        //         console.log(state.info);
        //     })
        // }
    },

    mutations: {
        deleteUserInfo(state) {
            state.info = null
        },

        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        }
    },

    state: {
        info: null,
    },

    getters: {
        getUserInfo(state) {
            return state.info;
        },

        getUserArtistId(state) {
            if (state.info) {
                return state.info.artistId;
            }

            return null;
        },
    }
}

export default userInfo;