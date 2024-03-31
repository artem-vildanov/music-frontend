<template>
    <div class="song-box">
        <img :src="imageSource">
        <div class="song-box__song-info">
            <div>{{ song.name }}</div>
            <div>{{ song.artistName }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SingleSong",

        props: [
            'song'
        ],

        computed: {
            imageSource() {
                return `http://music.local:9006/photo/${this.song.photo_path}`
            }
        }

    }
</script>

<style scoped>
    .song-box {
        margin: 10px;
        padding: 10px;
        display: flex;
        flex-direction: row;
        background-color: #121428;
    }

    .song-box__song-info {
        display: flex;
        flex-direction: column;
        color: #f4f8fd;
    }

    .song-box__song-photo {

    }
</style>