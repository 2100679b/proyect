<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Crear Cuenta</h2>
      <form @submit.prevent="handleSubmit" class="register-form">

        <!-- Username -->
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username"
            v-model.trim="form.username"
            :class="{ 'error': errors.username }"
            placeholder="Ingresa tu nombre de usuario"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <!-- Nombre Completo -->
        <div class="form-group">
          <label for="nombre">Nombre Completo</label>
          <input 
            type="text" 
            id="nombre"
            v-model.trim="form.nombre"
            :class="{ 'error': errors.nombre }"
            placeholder="Tu nombre completo"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password"
            v-model="form.password"
            :class="{ 'error': errors.password }"
            placeholder="Mínimo 8 caracteres"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword"
            v-model="form.confirmPassword"
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Repite tu contraseña"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Roles (opcional - para administradores) -->
        <div class="form-group" v-if="showRoleSelection">
          <label for="roles">Roles</label>
          <select 
            id="roles"
            v-model="form.selectedRoles"
            :class="{ 'error': errors.roles }"
            :disabled="isSubmitting"
            multiple
          >
            <option v-for="role in availableRoles" :key="role.id" :value="role.id">
              {{ role.role }}
            </option>
          </select>
          <span v-if="errors.roles" class="error-message">{{ errors.roles }}</span>
        </div>

        <!-- Mensajes -->
        <div v-if="generalError" class="general-error">{{ generalError }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

        <!-- Botón -->
        <button type="submit" class="register-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Registrando...' : 'Crear Cuenta' }}
        </button>

        <!-- Link a login -->
        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import bcrypt from 'bcryptjs'; // Instalar: npm install bcryptjs

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        nombre: '',
        password: '',
        confirmPassword: '',
        selectedRoles: [] // Array de IDs de roles seleccionados
      },
      errors: {},
      isSubmitting: false,
      generalError: '',
      successMessage: '',
      showRoleSelection: false, // Cambiar a true si quieres mostrar selección de roles
      availableRoles: [] // Se llenará desde la API
    };
  },
  async mounted() {
    // Cargar roles disponibles si es necesario
    if (this.showRoleSelection) {
      await this.loadAvailableRoles();
    }
  },
  methods: {
    async loadAvailableRoles() {
      try {
        const response = await axios.get('/api/roles');
        this.availableRoles = response.data;
      } catch (error) {
        console.error('Error cargando roles:', error);
      }
    },

    clearMessages() {
      this.generalError = '';
      this.successMessage = '';
      this.errors = {};
    },

    validateForm() {
      const letrasYEspacios = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      this.errors = {};

      // Validar username - debe coincidir con la estructura de tu BD
      if (!this.form.username || this.form.username.length < 3 || this.form.username.length > 100) {
        this.errors.username = 'El nombre de usuario debe tener entre 3 y 100 caracteres';
      }

      // Validar nombre completo - debe coincidir con campo 'nombre' en BD
      if (!this.form.nombre || !letrasYEspacios.test(this.form.nombre) || this.form.nombre.length > 100) {
        this.errors.nombre = 'El nombre es requerido, solo puede contener letras y espacios (máximo 100 caracteres)';
      }

      // Validar contraseña - debe ser lo suficientemente fuerte para hash
      if (!this.form.password || this.form.password.length < 8) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      // Confirmar contraseña
      if (!this.form.confirmPassword || this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden';
      }

      // Validar roles si se muestran
      if (this.showRoleSelection && this.form.selectedRoles.length === 0) {
        this.errors.roles = 'Debe seleccionar al menos un rol';
      }

      return Object.keys(this.errors).length === 0;
    },

    async hashPassword(password) {
      try {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
      } catch (error) {
        console.error('Error hasheando contraseña:', error);
        throw error;
      }
    },

    async handleSubmit() {
      this.clearMessages();

      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        // Hashear la contraseña antes de enviar
        const hashedPassword = await this.hashPassword(this.form.password);

        // Estructura de datos que coincide con tu esquema de BD
        const userData = {
          username: this.form.username.trim(),
          nombre: this.form.nombre.trim(),
          password: hashedPassword, // Contraseña hasheada
          roles: this.showRoleSelection ? this.form.selectedRoles : [1], // Array de IDs de roles
          registro_usuario: 0 // Usuario sistema por defecto
        };

        console.log('Enviando datos:', { ...userData, password: '[HIDDEN]' });

        const response = await axios.post('/api/register', userData);

        if (response.status >= 200 && response.status < 300) {
          this.successMessage = 'Usuario registrado con éxito. ¡Ya puedes iniciar sesión!';
          
          // Limpiar formulario
          this.form = {
            username: '',
            nombre: '',
            password: '',
            confirmPassword: '',
            selectedRoles: []
          };

          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.generalError = response.data.message || 'Error al registrar usuario';
        }

      } catch (error) {
        console.error('Error en registro:', error);
        
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.response.data?.error;
          
          switch (status) {
            case 409:
              this.generalError = 'El nombre de usuario ya existe. Elige otro.';
              break;
            case 400:
              this.generalError = message || 'Datos inválidos. Verifica la información.';
              break;
            case 500:
              this.generalError = 'Error interno del servidor. Intenta más tarde.';
              break;
            default:
              this.generalError = message || 'Error del servidor.';
          }
        } else if (error.request) {
          this.generalError = 'Error de conexión. Verifica tu internet.';
        } else {
          this.generalError = 'Error desconocido. Intenta nuevamente.';
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped src="./register.css"></style>