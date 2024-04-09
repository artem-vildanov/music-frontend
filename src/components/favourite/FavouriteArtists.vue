<template>
    <div class="favourite-artists">
        <div class="title">
            Любимые артисты
        </div>
        <div class="artists">
            <template v-for="artist in favouriteArtists">
                <artist-card :artist="artist"></artist-card>
            </template>
        </div>
    </div>
</template>

<script>
import api from '@/api'
import ArtistCard from '../artist/ArtistCard.vue';
    export default {
        name: "FavouriteArtists",

        components: { ArtistCard },

        data() {
            return {
                favouriteArtists: null,
            }
        },

        mounted() {
            this.getFavouriteArtists()
        },

        methods: {
            getFavouriteArtists() {
                api.get('http://music.local/api/favourite/artists')
                .then( res => {
                    this.favouriteArtists = res.data
                })
            }
        }
    }
</script>

<style scoped>
    .favourite-artists {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .title {
        /* font-weight: 600; */
        font-size: 25px;
        background-color: rgba(125, 125, 125, 0.1);
        width: fit-content;
        padding: 5px 10px;
        border-radius: 10px;
    }   

    .artists {
        width: 424px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
        background-color: rgba(125, 125, 125, 0.1);
        border-radius: 20px;
    }
</style>