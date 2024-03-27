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
      name: 'login',
      component: () => import('../components/auth/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../components/auth/Signup.vue')
    },
  ]
})

export default router
