import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/Home.vue'),
      name: 'home',
      
    },
    
    // auth
    {
      path: '/login',
      name: 'auth.login',
      component: () => import('../components/auth/Login.vue')
    },
    {
      path: '/signup',
      name: 'auth.signup',
      component: () => import('../components/auth/Signup.vue')
    },
    {
      path: '/personal',
      name: 'auth.personal',
      component: () => import('../components/auth/Personal.vue')
    },

    // artist
    {
      path: '/artist/all',
      name: 'artist.all',
      component: () => import('../components/artist/AllArtists.vue')
    },
    {
      path: '/artist/:id',
      name: 'artist.single',
      component: () => import('../components/artist/Artist.vue'),
    },

    // album
    {
      path: '/album/:id',
      name: 'album.single',
      component: () => import('../components/album/Album.vue')
    },
  ]
})

export default router
