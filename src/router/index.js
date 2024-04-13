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

    // account
    {
      path: '/account',
      name: 'account.user',
      component: () => import('../components/account/Account.vue')
    },
    // {
    //   path: '/account/artist-account',
    //   name: 'account.artist',
    //   component: () => import('../components/account/ArtistAccount.vue'),
    // },

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


    // favourite
    {
      path: '/favourite',
      name: 'favourite.collection',
      component: () => import('../components/favourite/Collection.vue')
    },

    {
      path: '/favourite/songs',
      name: 'favourite.songs',
      component: () => import('../components/favourite/FavouriteSongs.vue')
    },

    {
      path: '/favourite/albums',
      name: 'favourite.albums',
      component: () => import('../components/favourite/FavouriteAlbums.vue')
    },

    {
      path: '/favourite/artists',
      name: 'favourite.artists',
      component: () => import('../components/favourite/FavouriteArtists.vue')
    },

    // playlist
    {
      path: '/playlists',
      name: 'playlist.all',
      component: () => import('../components/playlist/UserPlaylists.vue')
    },
    {
      path: '/playlists/:id',
      name: 'playlist.single',
      component: () => import('../components/playlist/Playlist.vue')
    },
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
          name: 'account.user'
      })
  }

  next()
})


export default router
