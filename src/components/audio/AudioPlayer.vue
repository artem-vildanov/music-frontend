<template>
    <div>
        <audio controls>
            <source :src="{ this. }" type="audio/mpeg" />
        </audio>
    </div>
</template>

<script>
    export default {
        name: "AudioPlayer"
    }

</script>

<style scoped>

</style>