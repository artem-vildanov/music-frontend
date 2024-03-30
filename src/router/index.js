import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../components/Home.vue'),
      name: 'home',
      
    },
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
  ]
})

export default router