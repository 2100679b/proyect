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

        <!-- Nombre -->
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input 
            type="text" 
            id="nombre"
            v-model.trim="form.nombre"
            :class="{ 'error': errors.nombre }"
            placeholder="Tu nombre"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
        </div>

        <!-- Segundo Nombre (opcional) -->
        <div class="form-group">
          <label for="segundo_nombre">Segundo Nombre (opcional)</label>
          <input 
            type="text" 
            id="segundo_nombre"
            v-model.trim="form.segundo_nombre"
            :class="{ 'error': errors.segundo_nombre }"
            placeholder="Tu segundo nombre"
            :disabled="isSubmitting"
          />
          <span v-if="errors.segundo_nombre" class="error-message">{{ errors.segundo_nombre }}</span>
        </div>

        <!-- Apellido Paterno -->
        <div class="form-group">
          <label for="apellido_paterno">Apellido Paterno</label>
          <input 
            type="text" 
            id="apellido_paterno"
            v-model.trim="form.apellido_paterno"
            :class="{ 'error': errors.apellido_paterno }"
            placeholder="Tu apellido paterno"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.apellido_paterno" class="error-message">{{ errors.apellido_paterno }}</span>
        </div>

        <!-- Apellido Materno -->
        <div class="form-group">
          <label for="apellido_materno">Apellido Materno</label>
          <input 
            type="text" 
            id="apellido_materno"
            v-model.trim="form.apellido_materno"
            :class="{ 'error': errors.apellido_materno }"
            placeholder="Tu apellido materno"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.apellido_materno" class="error-message">{{ errors.apellido_materno }}</span>
        </div>

        <!-- Correo (opcional, para futuro uso) -->
        <div class="form-group">
          <label for="correo">Correo Electrónico (opcional)</label>
          <input 
            type="email" 
            id="correo"
            v-model.trim="form.correo"
            :class="{ 'error': errors.correo }"
            placeholder="tu@email.com"
            :disabled="isSubmitting"
          />
          <span v-if="errors.correo" class="error-message">{{ errors.correo }}</span>
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
          />
          <span v-if="errors.contrasena" class="error-message">{{ errors.contrasena }}</span>
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
// NO uses bcrypt en el frontend - es responsabilidad del backend

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        nombre: '',
        segundo_nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        correo: '',
        contrasena: '',
        confirmPassword: '',
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors = {};

      // Validar username
      if (!this.form.username || this.form.username.length < 3 || this.form.username.length > 100) {
        this.errors.username = 'El nombre de usuario debe tener entre 3 y 100 caracteres';
      }

      // Validar nombre
      if (!this.form.nombre || !letrasYEspacios.test(this.form.nombre) || this.form.nombre.length > 50) {
        this.errors.nombre = 'El nombre es requerido, solo puede contener letras y espacios (máximo 50 caracteres)';
      }

      // Validar segundo nombre (opcional)
      if (this.form.segundo_nombre && (!letrasYEspacios.test(this.form.segundo_nombre) || this.form.segundo_nombre.length > 50)) {
        this.errors.segundo_nombre = 'Solo puede contener letras y espacios (máximo 50 caracteres)';
      }

      // Validar apellido paterno
      if (!this.form.apellido_paterno || !letrasYEspacios.test(this.form.apellido_paterno) || this.form.apellido_paterno.length > 50) {
        this.errors.apellido_paterno = 'El apellido paterno es requerido, solo puede contener letras y espacios (máximo 50 caracteres)';
      }

      // Validar apellido materno
      if (!this.form.apellido_materno || !letrasYEspacios.test(this.form.apellido_materno) || this.form.apellido_materno.length > 50) {
        this.errors.apellido_materno = 'El apellido materno es requerido, solo puede contener letras y espacios (máximo 50 caracteres)';
      }

      // Validar correo (opcional)
      if (this.form.correo && !emailRegex.test(this.form.correo)) {
        this.errors.correo = 'El formato del correo electrónico no es válido';
      }

      // Validar contraseña
      if (!this.form.contrasena || this.form.contrasena.length < 8) {
        this.errors.contrasena = 'La contraseña debe tener al menos 8 caracteres';
      }

      // Confirmar contraseña
      if (!this.form.confirmPassword || this.form.contrasena !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden';
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
        // Estructura de datos que coincide exactamente con tu backend
        const userData = {
          username: this.form.username.trim(),
          nombre: this.form.nombre.trim(),
          segundo_nombre: this.form.segundo_nombre.trim() || null,
          apellido_paterno: this.form.apellido_paterno.trim(),
          apellido_materno: this.form.apellido_materno.trim(),
          correo: this.form.correo.trim() || null,
          contrasena: this.form.contrasena // El backend se encarga del hash
        };

        console.log('Enviando datos:', { ...userData, contrasena: '[HIDDEN]' });

        const response = await axios.post('/api/register', userData);

        if (response.status >= 200 && response.status < 300) {
          this.successMessage = 'Usuario registrado con éxito. ¡Ya puedes iniciar sesión!';
          
          // Limpiar formulario
          this.form = {
            username: '',
            nombre: '',
            segundo_nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            correo: '',
            contrasena: '',
            confirmPassword: '',
            selectedRoles: []
          };

          // Redirigir después de 2 segundos
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