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
      path: '/artists/all',
      name: 'artist.all',
      component: () => import('../components/artist/AllArtists.vue')
    },
    {
      path: '/artists/:id',
      name: 'artist.single',
      component: () => import('../components/artist/Artist.vue'),
    },

    // album
    {
      path: '/albums/:id',
      name: 'album.single',
      component: () => import('../components/album/Album.vue')
    },

// TODO make components!
/**
    // user
    {
      path: '/profile',
      name: 'user.profile',
      component: () => import('')
    },

    // favourites
    {
      path: '/favourites/songs',
      name: 'favourites.songs',
      component: () => import('')
    },

    {
      path: '/favourites/albums',
      name: 'favourites.albums',
      component: () => import('')
    },

    {
      path: '/favourites/artists',
      name: 'favourites.artists',
      component: () => import('')
    },

    // playlist
    {
      path: '/playlists/:id',
      name: 'playlist'
    }
 */    
    
    
  ]
})

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token')

  if (
    to.name !== 'auth.login' && 
    to.name !== 'auth.signup' &&
    !accessToken
  ){    
    return next({
        name: 'auth.login'
    })
  }

  if ((to.name === 'auth.login' || to.name === 'auth.signup') && accessToken) {
      return next({
          name: 'auth.personal'
      })
  }

  next()
})


export default router
