import { createRouter, createWebHistory } from 'vue-router'

// Componentes de sesión
import ViewLogin from '@/components/sesion/login.vue'
import ViewRegister from '@/components/sesion/register.vue'

const routes = [
  {
    path: '/',
    redirect: '/login' // Redirección desde raíz a login
  },
  {
    path: '/login',
    name: 'Login',
    component: ViewLogin
  },
  {
    path: '/register',
    name: 'Register',
    component: ViewRegister
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
