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
/*
Clase para representar los servicios de datos para manejo de la sesión
*/
class SessionDS {
  constructor () {
    this.usuarios = [
      {
        id: 1,
        nombre: 'Agustin Rodriguez Ponce',
        userName: 'arodriguezp',
        password: '123456',
        roles: [1, 2, 3]
      }
    ];

    this.response = {
      mensaje: {
        codigo: 40,
        descripcion: 'Ocurrió un error en el servidor'
      },
      usuario: {
        id: 0,
        nombre: '',
        userName: '',
        roles: [0]
      }
    };
  }

  // Método para agregar un nuevo usuario
  add(usuario) {
    this.usuarios.push(usuario);
  }

  // Método para verificar usuario y contraseña
  verify(userName, password) {
    return Promise.resolve(this.getUser(userName, password));
  }

  // Método interno que busca un usuario en la lista
  getUser(userName, password) {
    const usuario = this.usuarios.find(
      item => item.userName === userName && item.password === password
    );

    if (!usuario) {
      this.response = {
        mensaje: {
          codigo: 40,
          descripcion: 'Usuario o contraseña incorrectos'
        },
        usuario: {
          id: 0,
          nombre: '',
          userName: '',
          roles: [0]
        }
      };
    } else {
      this.response = {
        mensaje: {
          codigo: 10,
          descripcion: 'Usuario localizado'
        },
        usuario: usuario
      };
    }

    return this.response;
  }
}

// Crear instancia singleton del servicio de sesión
const sessionDS = new SessionDS();

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      formData: {
        email: '',
        username: '',
        identifier: '', // Para login (nombre de usuario)
        password: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    isFormValid() {
      const { email, username, identifier, password, confirmPassword } = this.formData
      
      // Validar contraseña
      if (!password?.trim() || password.length < 6) return false
      
      if (this.isRegister) {
        // Validaciones para registro
        if (!email?.trim() || !username?.trim()) return false
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email.trim())) return false
        
        // Validar longitud mínima de usuario
        if (username.trim().length < 3) return false
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) return false
      } else {
        // Validaciones para login
        if (!identifier?.trim()) return false
        
        // El identificador debe tener al menos 3 caracteres
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
      if (this.isRegister) {
        // Al cambiar a registro, limpiar identifier
        this.formData.identifier = ''
      } else {
        // Al cambiar a login, limpiar email, username y confirmPassword
        this.formData.email = ''
        this.formData.username = ''
        this.formData.confirmPassword = ''
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
        this.errorMessage = error.message || 'Ha ocurrido un error inesperado'
      } finally {
        this.isLoading = false
      }
    },

    async login() {
      try {
        const userName = this.formData.identifier.trim()
        const password = this.formData.password

        // Usar el servicio de sesión
        const response = await sessionDS.verify(userName, password)
        
        if (response.mensaje.codigo === 10) {
          // Usuario válido
          this.successMessage = `¡Bienvenido ${response.usuario.nombre}! Redirigiendo...`
          
          setTimeout(() => {
            this.$emit('login-success', {
              usuario: response.usuario,
              userName: userName,
              timestamp: new Date().toISOString()
            })
            // Redirigir al dashboard si tienes Vue Router
            this.$router.push('/menu')
          }, 1500)
        } else {
          // Credenciales incorrectas
          throw new Error(response.mensaje.descripcion)
        }
      } catch (error) {
        console.error('Error de login:', error)
        throw new Error(error.message || 'Error al iniciar sesión')
      }
    },

    async register() {
      try {
        // Simular tiempo de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const newUser = {
          id: sessionDS.usuarios.length + 1,
          nombre: this.formData.username, // O podrías agregar un campo nombre completo
          userName: this.formData.username.trim(),
          password: this.formData.password,
          roles: [1] // Rol básico por defecto
        }

        // Verificar si el usuario ya existe
        const existingUser = sessionDS.usuarios.find(
          user => user.userName === newUser.userName
        )

        if (existingUser) {
          throw new Error('Este nombre de usuario ya está en uso')
        }

        // Agregar el nuevo usuario
        sessionDS.add(newUser)
        
        this.successMessage = '¡Cuenta creada exitosamente! Cambiando a inicio de sesión...'
        
        // Cambiar a modo login después del registro exitoso
        setTimeout(() => {
          this.isRegister = false
          this.formData.email = ''
          this.formData.username = ''
          this.formData.password = ''
          this.formData.confirmPassword = ''
          this.formData.identifier = newUser.userName // Pre-llenar el usuario recién creado
          this.successMessage = 'Ahora puedes iniciar sesión con tu usuario'
        }, 2000)
      } catch (error) {
        throw new Error(error.message || 'Error al crear la cuenta')
      }
    },

    handleForgotPassword() {
      // Aquí iría la lógica para recuperar contraseña
      this.$emit('forgot-password-requested')
      alert('Funcionalidad de recuperación de contraseña - Por implementar')
    }
  },

  // Limpiar mensajes cuando el componente se desmonta
  beforeUnmount() {
    this.clearMessages()
  },

  // Limpiar mensajes cuando se cambia de ruta (si se usa Vue Router)
  beforeRouteLeave() {
    this.clearMessages()
  }
}
</script>

<style scoped src="./login.css"></style>
