// Importa Vue y componentes principales
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Bootstrap (asegúrate que está instalado)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap'           // importa JS de Bootstrap (que depende de popper)
import '@popperjs/core'      // Popper necesario para Bootstrap

// Font Awesome setup
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faSignOutAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'

library.add(faUser, faSignOutAlt, faSpinner)

// Crea la app
const app = createApp(App)

// Usa Vuex store y Vue Router
app.use(store)
app.use(router)

// Registra componente globalmente
app.component('font-awesome-icon', FontAwesomeIcon)

// Monta la app en el div con id 'app'
app.mount('#app')
