<template>
    <div class="wrapper">
        <div class="album-photo">
            <img class="photo" :src=`http://music.local:9005/photo/${album.photoPath}`>
        </div>
        <div class="album-info">
            <div class="album-info__album-name">
                {{ album.name }}
            </div>
            <div class="album-info__is-favourite">
                {{ album.isFavourite }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AlbumCard",

        props: [
            'album'
        ],
    }
</script>

<style scoped>

</style>