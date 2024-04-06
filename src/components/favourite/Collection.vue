<template>
    <div class="collection">
        
        <div class="collection-item-container">
            <router-link :to="{ name:'favourite.songs' }" class="open-collection-item">Любимые треки</router-link>
            <!-- несколько последних добавленных треков -->
        </div>

        
        <div class="collection-item-container">
            <router-link :to="{ name:'playlist.all' }" class="open-collection-item">Ваши плейлисты</router-link>    
            <!-- несколько последних плейлистов -->
        </div>

        
        <div class="collection-item-container">
            <router-link :to="{ name:'favourite.albums' }" class="open-collection-item">Любимые альбомы</router-link>    
            <!-- несколько последних добавленных альбомов -->    
        </div>

        
        <div class="collection-item-container">
            <router-link :to="{ name:'favourite.artists' }" class="open-collection-item">Любимые артисты</router-link>    
            <!-- несколько последних добавленных артистов -->    
        </div>
    </div>
</template>

<script>
import router from '@/router';
    export default {
        name: "Collection",

        data() {
            return {

            }
        },

        methods: {
            
        }
    }

</script>

<style scoped>
    .collection {
        display: flex;
        flex-direction: column;

        background-color: rgba(125, 125, 125, 0.2);
        padding: 20px;
        border-radius: 20px;
        gap: 20px;
    }

    .open-collection-item {
        width: fit-content;
        padding: 5px 10px;
        color: rgba(1, 1, 1, 1);
        font-size: 20px;
        font-weight: 600;
        transition: all 0.2s ease-out;
        border-radius: 10px;
    }

    .open-collection-item:hover {
        background-color: rgba(125, 125, 125, 0.2);
        text-decoration: none;
    }

    .open-collection-item:active {
        background-color: rgba(125, 125, 125, 0.5);
    }

    .collection-item-container {
        display: flex;
        flex-direction: column;
        background-color: white;    
        border-radius: 10px;   
        padding: 10px; 
    }

    
</style>