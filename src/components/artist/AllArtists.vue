<script setup>
import SingleArtist from './SingleArtist.vue';
</script>
<template>
    <div>
        All artist for test
        <template v-for="artist in artistsGroup">
            <SingleArtist :artist="artist"></SingleArtist>
        </template>
    </div>
</template>

<script>
import api from '../../api';
    export default {
        name: "AllArtists",

        data() {
            return {
                artistsGroup: null,
            }
        },

        mounted() {
            this.getAllArtists()
        },

        methods: {
            getAllArtists() {
                api.get('http://music.local/api/artists/all')
                .then( res => {
                    console.log(res.data)
                    this.artistsGroup = res.data
                })
            }
        }
    }
</script>

<style scoped>

</style>