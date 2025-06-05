import { createRouter, createWebHistory } from 'vue-router'

import ViewLogin from '@/components/sesion/login.vue'
import ViewRegister from '@/components/sesion/register.vue'


const routes = [
  {
    path: '/',
    redirect: '/login' // Redirige a /login desde la raíz
  },
  {
    path: '/login',
    name: 'login',
    component: ViewLogin
  },
  {
    path: '/register',
    name: 'register',
    component: ViewRegister
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
