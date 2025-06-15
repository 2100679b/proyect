<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Crear Cuenta</h2>
      <form @submit.prevent="handleSubmit" class="register-form">

        <!-- Nombre completo -->
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
            maxlength="100"
          />
          <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
        </div>

        <!-- Username -->
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username"
            v-model.trim="form.username"
            :class="{ 'error': errors.username }"
            placeholder="Nombre de usuario"
            :disabled="isSubmitting"
            required
            maxlength="100"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="contrasena">Contraseña</label>
          <input 
            type="password" 
            id="contrasena"
            v-model="form.contrasena"
            :class="{ 'error': errors.contrasena }"
            placeholder="Mínimo 8 caracteres"
            :disabled="isSubmitting"
            required
            maxlength="100"
          />
          <span v-if="errors.contrasena" class="error-message">{{ errors.contrasena }}</span>
        </div>

        <!-- Roles (opcional) -->
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

export default {
  name: 'Register',
  data() {
    return {
      form: {
        nombre: '',
        username: '',
        contrasena: '',
        selectedRoles: []
      },
      errors: {},
      isSubmitting: false,
      generalError: '',
      successMessage: '',
      showRoleSelection: false, // Cambiar a true si quieres mostrar selección de roles
      availableRoles: []
    };
  },
  async mounted() {
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
      this.errors = {};

      // Validar nombre completo
      if (!this.form.nombre || this.form.nombre.length > 100) {
        this.errors.nombre = 'El nombre completo es requerido y debe tener máximo 100 caracteres';
      }

      // Validar username
      if (!this.form.username || this.form.username.length < 3 || this.form.username.length > 100) {
        this.errors.username = 'El nombre de usuario debe tener entre 3 y 100 caracteres';
      }

      // Validar contraseña
      if (!this.form.contrasena || this.form.contrasena.length < 8 || this.form.contrasena.length > 100) {
        this.errors.contrasena = 'La contraseña debe tener entre 8 y 100 caracteres';
      }

      // Validar roles si se muestran
      if (this.showRoleSelection && this.form.selectedRoles.length === 0) {
        this.errors.roles = 'Debe seleccionar al menos un rol';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      this.clearMessages();

      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        const userData = {
          nombre: this.form.nombre.trim(),
          username: this.form.username.trim(),
          password: this.form.contrasena,
          roles: this.form.selectedRoles.length ? this.form.selectedRoles : null
        };

        console.log('Enviando datos:', { ...userData, password: '[HIDDEN]' });

        const response = await axios.post('/api/register', userData);

        if (response.status >= 200 && response.status < 300) {
          this.successMessage = 'Usuario registrado con éxito. ¡Ya puedes iniciar sesión!';

          // Limpiar formulario
          this.form = {
            nombre: '',
            username: '',
            contrasena: '',
            selectedRoles: []
          };

          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        } else {
          this.generalError = response.data.mensaje || 'Error al registrar usuario';
        }

      } catch (error) {
        console.error('Error en registro:', error);

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.mensaje || error.response.data?.error;

          switch (status) {
            case 409:
              this.generalError = 'El nombre de usuario o nombre completo ya existe. Elige otro.';
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
