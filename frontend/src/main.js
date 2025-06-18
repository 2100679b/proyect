// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { checkAuth, setAuthToken } from './utils/auth'

// Importa solo los componentes globales necesarios
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Configuración de Axios
axios.defaults.baseURL = process.env.VUE_APP_API_URL || ''

// Verificar autenticación al iniciar
checkAuth()

// Crea la aplicación Vue
const app = createApp(App)

// Usa Vue Router
app.use(router)

// Configuración global de Axios
app.config.globalProperties.$axios = axios

// Monta la aplicación
app.mount('#app')

// Manejo de errores global
app.config.errorHandler = (err, vm, info) => {
  console.error(`Error global: ${err.toString()}\nInfo: ${info}`)
  
  // Manejar errores de autenticación
  if (err.response && err.response.status === 401) {
    // Limpiar token y redirigir a login
    setAuthToken(null)
    router.push('/login')
  }
}

// Configuración para desarrollo
if (process.env.NODE_ENV === 'development') {
  // Hacer el router accesible en la consola para pruebas
  window.$router = router
}