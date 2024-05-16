<template>
    <div class="login-wrapper">
        <div class="login-form">
            <h1>Login</h1>
            <input v-model="email" type="email" class="form-control mb-3 mt-3" placeholder="email">
            <input v-model="password" type="password" class="form-control mb-3" placeholder="password">
            <input @click.prevent="login" type="submit" value="Submit" class="btn btn-outline-primary mb-3">
        </div>        
    </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex';

export default {
    name: "login",

    data() {
        return {
            email: null,
            password: null,
        }
    },

    methods: {
        ...mapActions([
            'fetchUserInfo',
        ]),

        async login() {
            const url = "http://music.local/api/auth/login";
            const jsonData = {
                email: this.email,
                password: this.password,
            };

            const response = await axios.post(url, jsonData);
            localStorage.setItem('access_token', response.data.access_token);
            this.$router.push({name: 'account.user'});
        },
    }
}
</script>

<style scoped>
.login-wrapper {
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.login-form {

}
</style>