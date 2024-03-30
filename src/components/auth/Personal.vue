<template>
    <div>
        <h1>Personal info</h1>
        <div>{{ this.personalInfo }}</div>
    </div>
</template>

<script>
import api from 'src/api.js';

export default {
    name: "personal",

    data() {
        return {
            personalInfo: null,
        }
    },


    mounted() {
        this.getPersonalInfo()
    },

    methods: {
        getPersonalInfo() {
            api.post('http://music.local/api/auth/me')
                .then( res => {
                    console.log(res.data)
                    this.personalInfo = res.data
                })
        }
    }
}
</script>