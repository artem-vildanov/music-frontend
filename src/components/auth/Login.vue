<template>
    <div class="login-wrapper">
        <div class="login-form">
            <h1>Login</h1>
            <input v-model="email" type="email" class="form-control mb-3 mt-3" placeholder="email">
            <input v-model="password" type="password" class="form-control mb-3" placeholder="password">
            <input @click.prevent="login" type="submit" class="btn btn-outline-primary mb-3">
        </div>        
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "login",

    data() {
        return {
            email: null,
            password: null,
        }
    },

    methods: {
        login() {
            axios.post('http://music.local/api/auth/login', {email: this.email, password: this.password})
                .then( res => {
                    localStorage.setItem('access_token', res.data.access_token)
                    this.$router.push({name: 'auth.personal'})
                })
        },
    }
}
</script>

<style scoped>
.login-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.login-form {

}
</style>