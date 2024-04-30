<template>
    <div class="select-genre" v-if="genres">
        <div>Выберите жанр</div>
        <template v-for="genre in genres">
            <input v-if="genre.id === preSelectedGenreId" type="radio" :id="`genre_${genre.id}`" name="genre" :value="genre.id" checked>
            <input v-else type="radio" :id="`genre_${genre.id}`" name="genre" :value="genre.id">
            <label :for="`genre_${genre.id}`">{{ genre.name }}</label><br>        
        </template>
    </div>
</template>
<script>
import api from '@/api';
export default {
    name: 'SelectGenre',

    data() {
        return {
            genres: null,
        }
    },

    props: [
        'preSelectedGenreId'
    ],

    mounted() {
        this.getGenres();
    },

    methods: {
        getGenres() {
            api.get('http://music.local/api/genres/all')
                .then( res => {
                    this.genres = res.data;
                });
        },
    },
}
</script>