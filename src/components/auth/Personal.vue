<template>
    <div class="personal-info">
        <h1 class="title">Мои данные</h1>
        <div>{{ this.personalInfo }}</div>
    </div>
</template>

<script>
import api from '@/api';

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

<style scoped>
    .personal-info {
        padding: 20px;
    }

    .title {
        padding: 3px 10px;
        background-color: rgba(125, 125, 125, 0.2);
        border-radius: 10px;
        width: fit-content;
    }
</style>