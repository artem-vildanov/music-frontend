<template>
    <div class="wrapper">
        <div class="artist-photo">
            <img class="photo" :src=`http://music.local:9005/photo/${album.photoPath}`>
        </div>
        <div class="artist-info">
            <div class="artist-info__artist-name">
                {{ artist.name }}
            </div>
            <div class="artist-info__is-favourite">
                {{ artist.isFavourite }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ArtistCard",

        props: [
            'artist'
        ],
    }
</script>

<style scoped>

</style>