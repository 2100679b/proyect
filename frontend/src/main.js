// src/main.js
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'

// 🔽 Importamos el router
import router from './router'

const app = createApp(App)

// 🔽 Usamos el router
app.use(router)

app.mount('#app')
