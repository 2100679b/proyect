<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">{{ isRegister ? 'Crea tu cuenta' : 'Accede a tu cuenta' }}</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Email (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="tu@email.com"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Usuario (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="username" class="form-label">Usuario</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            class="form-input"
            placeholder="Nombre de usuario"
            required
            :disabled="isLoading"
            minlength="3"
          />
        </div>

        <!-- Identificador (login) -->
        <div v-if="!isRegister" class="form-group">
          <label for="identifier" class="form-label">
            {{ loginByEmail ? 'Correo electrónico' : 'Usuario' }}
          </label>
          <input
            id="identifier"
            v-model="formData.identifier"
            :type="loginByEmail ? 'email' : 'text'"
            class="form-input"
            :placeholder="loginByEmail ? 'tu@email.com' : 'Nombre de usuario'"
            required
            :disabled="isLoading"
          />
          <small class="form-hint">
            Ingresa tu {{ loginByEmail ? 'correo electrónico' : 'nombre de usuario' }}
          </small>
          <a href="#" class="toggle-login-link" @click.prevent="toggleLoginMethod">
            Usar {{ loginByEmail ? 'usuario' : 'correo electrónico' }} en su lugar
          </a>
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            :placeholder="isRegister ? 'Mínimo 6 caracteres' : 'Tu contraseña'"
            required
            :disabled="isLoading"
            :minlength="isRegister ? 6 : undefined"
          />
        </div>

        <!-- Confirmar contraseña (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :class="{ error: formData.confirmPassword && formData.password !== formData.confirmPassword }"
            placeholder="Repite tu contraseña"
            required
            :disabled="isLoading"
          />
          <small v-if="formData.confirmPassword && formData.password !== formData.confirmPassword" class="field-error">
            Las contraseñas no coinciden
          </small>
        </div>

        <!-- Enlaces de alternancia -->
        <div class="toggle-links" v-if="!isLoading">
          <router-link v-if="!isRegister" to="/register" class="toggle-login-link">¿No tienes cuenta? Regístrate</router-link>
          <router-link v-else to="/login" class="toggle-login-link">¿Ya tienes cuenta? Inicia sesión</router-link>
        </div>

        <!-- Mensajes -->
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <!-- Botón -->
        <button type="submit" class="submit-btn" :disabled="isLoading || !isFormValid">
          <span v-if="!isLoading">{{ isRegister ? 'Crear Cuenta' : 'Iniciar Sesión' }}</span>
          <span v-else>{{ isRegister ? 'Creando cuenta...' : 'Iniciando sesión...' }}</span>
        </button>
      </form>

      <!-- Enlace adicional -->
      <div class="links-container">
        <a href="#" @click.prevent="handleForgotPassword" class="additional-link">¿Olvidaste tu contraseña?</a>
      </div>

      <!-- Datos de prueba -->
      <div v-if="!isRegister" class="demo-info">
        <small>Usuario de prueba: <strong>arodriguezp</strong> / Contraseña: <strong>123456</strong></small>
      </div>
    </div>
  </div>
</template>

<script>
class SessionDS {
  constructor() {
    this.usuarios = [
      { id: 1, nombre: 'Agustin Rodriguez Ponce', userName: 'arodriguezp', email: 'arodriguezp@email.com', password: '123456', roles: [1, 2, 3] }
    ]
    this.response = {
      mensaje: { codigo: 40, descripcion: 'Ocurrió un error' },
      usuario: { id: 0, nombre: '', userName: '', roles: [0] }
    }
  }

  add(usuario) {
    this.usuarios.push(usuario)
  }

  verify(identifier, password, byEmail = false) {
    return Promise.resolve(this.getUser(identifier, password, byEmail))
  }

  getUser(identifier, password, byEmail) {
    const usuario = byEmail
      ? this.usuarios.find(u => u.email === identifier && u.password === password)
      : this.usuarios.find(u => u.userName === identifier && u.password === password)

    if (!usuario) {
      this.response = {
        mensaje: { codigo: 40, descripcion: 'Usuario o contraseña incorrectos' },
        usuario: { id: 0, nombre: '', userName: '', roles: [0] }
      }
    } else {
      this.response = {
        mensaje: { codigo: 10, descripcion: 'Usuario localizado' },
        usuario
      }
    }
    return this.response
  }
}

const sessionDS = new SessionDS()

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      loginByEmail: false, // Nuevo estado para elegir login por email o usuario
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
      if (!password || password.length < 6) return false

      if (this.isRegister) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email) && username.length >= 3 && password === confirmPassword
      } else {
        if (this.loginByEmail) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return emailRegex.test(identifier) && password.length >= 6
        } else {
          return identifier.trim().length >= 3 && password.length >= 6
        }
      }
    }
  },
  created() {
    this.isRegister = this.$route.path === '/register'
  },
  watch: {
    '$route'(to) {
      this.isRegister = to.path === '/register'
      this.clearMessages()
      this.clearForm()
    }
  },
  methods: {
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
    toggleLoginMethod() {
      this.loginByEmail = !this.loginByEmail
      this.formData.identifier = ''
      this.clearMessages()
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
        this.errorMessage = error.message || 'Ocurrió un error inesperado'
      } finally {
        this.isLoading = false
      }
    },
    async login() {
      const identifier = this.formData.identifier.trim()
      const password = this.formData.password
      const response = await sessionDS.verify(identifier, password, this.loginByEmail)

      if (response.mensaje.codigo === 10) {
        this.successMessage = `¡Bienvenido ${response.usuario.nombre}! Redirigiendo...`
        setTimeout(() => {
          this.$emit('login-success', {
            usuario: response.usuario,
            identifier,
            timestamp: new Date().toISOString()
          })
          this.$router.push('/dashboard') // Redirigir
        }, 1500)
      } else {
        this.errorMessage = response.mensaje.descripcion
      }
    },
    async register() {
      const { email, username, password } = this.formData

      const usuarioNuevo = {
        id: Date.now(),
        nombre: username,
        userName: username,
        email,
        password,
        roles: [2] // ejemplo
      }

      sessionDS.add(usuarioNuevo)
      this.successMessage = 'Cuenta creada con éxito. ¡Ahora puedes iniciar sesión!'
      setTimeout(() => {
        this.$router.push('/login')
      }, 1500)
    },
    handleForgotPassword() {
      this.errorMessage = 'Recuperación de contraseña no implementada aún.'
    }
  }
}
</script>

<style scoped src="./login.css"></style>
