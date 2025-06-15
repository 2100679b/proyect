<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Título y subtítulo -->
      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">
        {{ isRegister ? 'Crea tu cuenta' : 'Accede a tu cuenta' }}
      </p>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Campo de email (solo en registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            :class="{ loading: isLoading }"
            placeholder="tu@email.com"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Campo de usuario (solo en registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="username" class="form-label">Usuario</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            class="form-input"
            :class="{ loading: isLoading }"
            placeholder="Nombre de usuario"
            required
            :disabled="isLoading"
            minlength="3"
          />
        </div>

        <!-- Campo de identificador (email o usuario para login) -->
        <div v-if="!isRegister" class="form-group">
          <label for="identifier" class="form-label">Usuario</label>
          <input
            id="identifier"
            v-model="formData.identifier"
            type="text"
            class="form-input"
            :class="{ loading: isLoading }"
            placeholder="Nombre de usuario"
            required
            :disabled="isLoading"
          />
          <small class="form-hint">
            Ingresa tu nombre de usuario
          </small>
        </div>

        <!-- Campo de contraseña -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            :class="{ loading: isLoading }"
            :placeholder="isRegister ? 'Mínimo 6 caracteres' : 'Tu contraseña'"
            required
            :disabled="isLoading"
            :minlength="isRegister ? 6 : undefined"
          />
        </div>

        <!-- Campo de confirmar contraseña (solo en registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :class="{ 
              loading: isLoading,
              'error': isRegister && formData.confirmPassword && formData.password !== formData.confirmPassword
            }"
            placeholder="Repite tu contraseña"
            required
            :disabled="isLoading"
          />
          <small 
            v-if="isRegister && formData.confirmPassword && formData.password !== formData.confirmPassword" 
            class="field-error"
          >
            Las contraseñas no coinciden
          </small>
        </div>

        <!-- Enlace para alternar entre login y registro -->
        <router-link
          v-if="!isLoading"
          :to="isRegister ? '/login' : '/register'"
          class="toggle-login-link"
        >
          {{ isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
        </router-link>

        <!-- Mensajes de error y éxito -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- Botón de envío -->
        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="!isLoading">
            {{ isRegister ? 'Crear Cuenta' : 'Iniciar Sesión' }}
          </span>
          <span v-else>
            {{ isRegister ? 'Creando cuenta...' : 'Iniciando sesión...' }}
          </span>
        </button>
      </form>

      <!-- Enlaces adicionales -->
      <div class="links-container">
        <a href="#" @click.prevent="handleForgotPassword" class="additional-link">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <!-- Información de usuario de prueba -->
      <div v-if="!isRegister" class="demo-info">
        <small>Usuario de prueba: <strong>arodriguezp</strong> / Contraseña: <strong>123456</strong></small>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      // Configuración de la API
      apiBaseUrl: process.env.VUE_APP_API_URL || 'https://tu-api-aws.execute-api.region.amazonaws.com/prod',
      formData: {
        email: '',
        username: '',
        identifier: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    isFormValid() {
      const { email, username, identifier, password, confirmPassword } = this.formData

      if (!password?.trim() || password.length < 6) return false

      if (this.isRegister) {
        if (!email?.trim() || !username?.trim()) return false
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) return false
        if (username.trim().length < 3) return false
        if (password !== confirmPassword) return false
      } else {
        if (!identifier?.trim()) return false
        if (identifier.trim().length < 3) return false
      }

      return true
    }
  },
  methods: {
    toggleLoginType() {
      this.isRegister = !this.isRegister
      this.clearMessages()
      this.clearForm()
    },
    clearMessages() {
      this.errorMessage = ''
      this.successMessage = ''
    },
    clearForm() {
      this.formData = {
        email: '',
        username: '',
        identifier: '',
        password: '',
        confirmPassword: ''
      }
    },
    async handleSubmit() {
      if (!this.isFormValid) return
      this.isLoading = true
      this.clearMessages()

      try {
        if (this.isRegister) {
          await this.register()
        } else {
          await this.login()
        }
      } catch (error) {
        console.error('Error en handleSubmit:', error)
        this.errorMessage = error.response?.data?.error || error.message || 'Error inesperado'
      } finally {
        this.isLoading = false
      }
    },
    async login() {
      const { identifier, password } = this.formData
      try {
        const response = await axios.post(`${this.apiBaseUrl}/api/users/login`, {
          username: identifier.trim(),
          password
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000 // 10 segundos de timeout
        })

        if (response.data && response.data.usuario) {
          this.successMessage = `¡Bienvenido ${response.data.usuario.nombre}! Redirigiendo...`

          setTimeout(() => {
            this.$emit('login-success', {
              usuario: response.data.usuario,
              timestamp: new Date().toISOString()
            })
            this.$router.push('/menu')
          }, 1500)
        } else {
          throw new Error('Respuesta del servidor incompleta')
        }
      } catch (error) {
        console.error('Error en login:', error)
        if (error.code === 'ECONNABORTED') {
          throw new Error('Tiempo de espera agotado. Verifica tu conexión.')
        }
        throw new Error(error.response?.data?.error || 'Usuario o contraseña incorrectos')
      }
    },
    async register() {
      const { email, username, password } = this.formData
      try {
        const response = await axios.post(`${this.apiBaseUrl}/api/users/register`, {
          email: email.trim(),
          nombre: username.trim(),
          username: username.trim(),
          password
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 10000
        })

        this.successMessage = '¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...'

        setTimeout(() => {
          this.isRegister = false
          this.formData.identifier = username
          this.clearForm()
        }, 2000)
      } catch (error) {
        console.error('Error en register:', error)
        if (error.code === 'ECONNABORTED') {
          throw new Error('Tiempo de espera agotado. Verifica tu conexión.')
        }
        throw new Error(error.response?.data?.error || 'Error al crear la cuenta')
      }
    },
    handleForgotPassword() {
      this.$emit('forgot-password-requested')
      alert('Funcionalidad de recuperación de contraseña - Por implementar')
    }
  },
  mounted() {
    // Verificar configuración de API
    console.log('API Base URL:', this.apiBaseUrl)
    if (this.apiBaseUrl.includes('undefined')) {
      console.warn('⚠️ Variable de entorno VUE_APP_API_URL no está configurada correctamente')
    }
  },
  beforeUnmount() {
    this.clearMessages()
  },
  beforeRouteLeave() {
    this.clearMessages()
  }
}
</script>

<style scoped src="./login.css"></style>