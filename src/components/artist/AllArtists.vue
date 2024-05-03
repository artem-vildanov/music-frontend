<template>

    <div class="all-artists">
        <template v-for="artist in artistsGroup">
            <artist-card :artist="artist"></artist-card>
        </template>
    </div>
    
</template>

<script>
import api from '../../api';
import ArtistCard from '@/components/artist/ArtistCard.vue'
    export default {
        name: "AllArtists",

        components: {ArtistCard},

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
                    this.artistsGroup = res.data
                })
            }
        }
    }
</script>

<style scoped>
.all-artists {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    justify-content: center;
    max-width: 100%;
    height: 100%;
}


</style>