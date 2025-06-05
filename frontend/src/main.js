import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import '@popperjs/core'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import Cookies from 'js-cookie'  // <-- Importa js-cookie aquí

// 1. Importa explícitamente todos los iconos 'solid' (fas) que uses en tu aplicación
import { 
  faBell, 
  faDesktop, 
  faMicrochip, 
  faPlusCircle, 
  faChartBar, 
  faBolt, 
  faTachometerAlt, 
  faHistory, 
  faCog, 
  faUsers, 
  faServer, 
  faCheckDouble, 
  faUser, 
  faSignOutAlt,
  faSpinner,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons'

// 3. Añade todos los iconos importados a la librería de Font Awesome
library.add(
  faBell, 
  faDesktop, 
  faMicrochip, 
  faPlusCircle, 
  faChartBar, 
  faBolt, 
  faTachometerAlt, 
  faHistory, 
  faCog, 
  faUsers, 
  faServer, 
  faCheckDouble, 
  faUser, 
  faSignOutAlt,
  faSpinner,
  faBars,
  faTimes
)

// Crea el plugin para cookies
const CookiesPlugin = {
  install: (app) => {
    app.config.globalProperties.$cookies = Cookies
  }
}

const app = createApp(App)

app.use(store)
app.use(router)
app.use(CookiesPlugin) // <-- Usa el plugin de cookies aquí

app.component('font-awesome-icon', FontAwesomeIcon) 
app.mount('#app')
