<template>
    <div class="song-box">
        <img class="photo" :src="imageSource">
        <div class="song-box__song-info">
            <div>{{ song.name }}</div>
            <div>{{ song.artistName }}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Song",

        props: [
            'song'
        ],

        computed: {
            imageSource() {
                return `http://music.local:9005/photo/${this.song.photoPath}`
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

</style>