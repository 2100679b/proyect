<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">{{ isRegister ? 'Crea tu cuenta' : 'Accede a tu cuenta' }}</p>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Nombre completo (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="nombre" class="form-label">Nombre completo</label>
          <input
            id="nombre"
            v-model.trim="formData.nombre"
            type="text"
            class="form-input"
            :class="{ 'error': errors.nombre }"
            placeholder="Tu nombre completo"
            required
            :disabled="isLoading"
          />
          <span v-if="errors.nombre" class="field-error">{{ errors.nombre }}</span>
        </div>

        <!-- Usuario (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="username" class="form-label">Usuario</label>
          <input
            id="username"
            v-model.trim="formData.username"
            type="text"
            class="form-input"
            :class="{ 'error': errors.username }"
            placeholder="Nombre de usuario"
            required
            minlength="3"
            :disabled="isLoading"
          />
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <!-- Identificador (login) -->
        <div v-if="!isRegister" class="form-group">
          <label for="identifier" class="form-label">Usuario</label>
          <input
            id="identifier"
            v-model.trim="formData.identifier"
            type="text"
            class="form-input"
            :class="{ 'error': errors.identifier }"
            placeholder="Nombre de usuario"
            required
            :disabled="isLoading"
          />
          <span v-if="errors.identifier" class="field-error">{{ errors.identifier }}</span>
        </div>

        <!-- Contraseña -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            :class="{ 'error': errors.password }"
            :placeholder="isRegister ? 'Mínimo 8 caracteres' : 'Tu contraseña'"
            required
            :disabled="isLoading"
            :minlength="isRegister ? 8 : undefined"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <!-- Confirmar contraseña (registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Repite tu contraseña"
            required
            :disabled="isLoading"
          />
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
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
          <span v-if="!isLoading">{{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}</span>
          <span v-else>{{ isRegister ? 'Creando cuenta...' : 'Iniciando sesión...' }}</span>
        </button>
      </form>

      <!-- Enlace adicional -->
      <div class="links-container">
        <a href="#" @click.prevent="handleForgotPassword" class="additional-link">¿Olvidaste tu contraseña?</a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      loginByEmail: false,
      errors: {},
      formData: {
        nombre: '',
        username: '',
        identifier: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  computed: {
    isFormValid() {
      if (this.isRegister) {
        return (
          this.formData.nombre.trim().length >= 3 &&
          this.formData.username.trim().length >= 3 &&
          this.formData.password.length >= 8 &&
          this.formData.password === this.formData.confirmPassword
        );
      } else {
        return (
          this.formData.identifier.trim().length >= 3 &&
          this.formData.password.length > 0
        );
      }
    }
  },
  created() {
    this.isRegister = this.$route.path === '/register';
  },
  watch: {
    '$route'(to) {
      this.isRegister = to.path === '/register';
      this.clearMessages();
      this.clearForm();
    }
  },
  methods: {
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
      this.errors = {};
    },
    clearForm() {
      for (const key in this.formData) {
        this.formData[key] = '';
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (this.isRegister) {
        if (!this.formData.nombre.trim()) {
          this.errors.nombre = 'El nombre completo es obligatorio';
          isValid = false;
        } else if (this.formData.nombre.trim().length < 3) {
          this.errors.nombre = 'Debe tener al menos 3 caracteres';
          isValid = false;
        }

        if (!this.formData.username.trim()) {
          this.errors.username = 'El nombre de usuario es obligatorio';
          isValid = false;
        } else if (this.formData.username.trim().length < 3) {
          this.errors.username = 'Debe tener al menos 3 caracteres';
          isValid = false;
        }

        if (!this.formData.password) {
          this.errors.password = 'La contraseña es obligatoria';
          isValid = false;
        } else if (this.formData.password.length < 8) {
          this.errors.password = 'Debe tener al menos 8 caracteres';
          isValid = false;
        }

        if (!this.formData.confirmPassword) {
          this.errors.confirmPassword = 'Confirma la contraseña';
          isValid = false;
        } else if (this.formData.password !== this.formData.confirmPassword) {
          this.errors.confirmPassword = 'Las contraseñas no coinciden';
          isValid = false;
        }
      } else {
        if (!this.formData.identifier.trim()) {
          this.errors.identifier = 'El usuario es obligatorio';
          isValid = false;
        }

        if (!this.formData.password) {
          this.errors.password = 'La contraseña es obligatoria';
          isValid = false;
        }
      }

      return isValid;
    },
    async handleSubmit() {
      this.clearMessages();

      if (!this.validateForm()) return;

      this.isLoading = true;

      try {
        if (this.isRegister) {
          await this.register();
        } else {
          await this.login();
        }
      } catch (err) {
        this.handleApiError(err);
      } finally {
        this.isLoading = false;
      }
    },
    
    async register() {
      const payload = {
        nombre: this.formData.nombre,
        username: this.formData.username,
        password: this.formData.password
      };
      
      const response = await axios.post('/api/users/register', payload);
      
      if (response.data.mensaje) {
        this.successMessage = '✅ ' + response.data.mensaje;
        this.clearForm();
        
        // Cambia automáticamente a modo login después de 2 segundos
        setTimeout(() => {
          this.isRegister = false;
          this.$router.push('/login');
        }, 2000);
      } else {
        this.errorMessage = 'Error en el registro. Inténtalo de nuevo.';
      }
    },
    
    async login() {
      const payload = {
        username: this.formData.identifier,
        password: this.formData.password
      };
      
      const response = await axios.post('/api/users/login', payload);
      
      if (response.data.usuario) {
        // Guardar token y datos de usuario
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
        
        // Configurar axios para futuras peticiones
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        this.successMessage = '✅ ' + response.data.mensaje;
        this.clearForm();
        
        // Redirigir al dashboard después de 1.5 segundos
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1500);
      } else {
        this.errorMessage = 'Error en el inicio de sesión. Verifica tus credenciales.';
      }
    },
    
    handleApiError(error) {
      if (error.response) {
        // Error de respuesta del servidor
        if (error.response.data && error.response.data.error) {
          this.errorMessage = error.response.data.error;
        } else {
          this.errorMessage = `Error del servidor (${error.response.status})`;
        }
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.';
      } else {
        // Error al configurar la solicitud
        this.errorMessage = `Error de configuración: ${error.message}`;
      }
    },
    
    handleForgotPassword() {
      this.errorMessage = 'Funcionalidad en desarrollo. Contacta al administrador.';
    }
  },
  mounted() {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (localStorage.getItem('token')) {
      this.$router.push('/dashboard');
    }
  }
};
</script>



<style scoped src="./login.css"></style>