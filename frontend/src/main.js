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
  faSpinner, // Para el spinner de carga
  faBars,    // Para el icono del menú de hamburguesa
  faTimes    // Para el icono de cerrar el menú
} from '@fortawesome/free-solid-svg-icons'

// 2. Si quieres usar la versión 'regular' (far) de la campana u otros iconos, impórtalos también:
// import { faBell as farFaBell } from '@fortawesome/free-regular-svg-icons' 

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
  // Si importaste farFaBell, añádelo aquí también:
  // farFaBell
)

const app = createApp(App)
app.use(store)
app.use(router)
// Esta línea es CRUCIAL para que el componente <font-awesome-icon> funcione
app.component('font-awesome-icon', FontAwesomeIcon) 
app.mount('#app')