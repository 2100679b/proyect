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
            v-model="form.username"
            required
            :class="{ 'error': errors.username }"
            placeholder="Ingresa tu nombre de usuario"
            :disabled="isSubmitting"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <!-- Primer Nombre -->
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input 
            type="text" 
            id="nombre"
            v-model="form.nombre"
            required
            :class="{ 'error': errors.nombre }"
            placeholder="Tu primer nombre"
            :disabled="isSubmitting"
          />
          <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
        </div>

        <!-- Segundo Nombre (Opcional) -->
        <div class="form-group">
          <label for="segundoNombre">Segundo Nombre <span class="optional">(opcional)</span></label>
          <input 
            type="text" 
            id="segundoNombre"
            v-model="form.segundoNombre"
            placeholder="Tu segundo nombre"
            :class="{ 'error': errors.segundoNombre }"
            :disabled="isSubmitting"
          />
          <span v-if="errors.segundoNombre" class="error-message">{{ errors.segundoNombre }}</span>
        </div>

        <!-- Apellido Paterno -->
        <div class="form-group">
          <label for="apellidoPaterno">Apellido Paterno</label>
          <input 
            type="text" 
            id="apellidoPaterno"
            v-model="form.apellidoPaterno"
            required
            :class="{ 'error': errors.apellidoPaterno }"
            placeholder="Tu apellido paterno"
            :disabled="isSubmitting"
          />
          <span v-if="errors.apellidoPaterno" class="error-message">{{ errors.apellidoPaterno }}</span>
        </div>

        <!-- Apellido Materno -->
        <div class="form-group">
          <label for="apellidoMaterno">Apellido Materno</label>
          <input 
            type="text" 
            id="apellidoMaterno"
            v-model="form.apellidoMaterno"
            required
            :class="{ 'error': errors.apellidoMaterno }"
            placeholder="Tu apellido materno"
            :disabled="isSubmitting"
          />
          <span v-if="errors.apellidoMaterno" class="error-message">{{ errors.apellidoMaterno }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email"
            v-model="form.email"
            required
            :class="{ 'error': errors.email }"
            placeholder="ejemplo@correo.com"
            :disabled="isSubmitting"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password"
            v-model="form.password"
            required
            :class="{ 'error': errors.password }"
            placeholder="Mínimo 8 caracteres"
            :disabled="isSubmitting"
          />
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <!-- Confirmar Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword"
            v-model="form.confirmPassword"
            required
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Repite tu contraseña"
            :disabled="isSubmitting"
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Mensaje de Error General -->
        <div v-if="generalError" class="general-error">
          {{ generalError }}
        </div>

        <!-- Mensaje de Éxito -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- Botón de Registro -->
        <button type="submit" class="register-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Registrando...' : 'Crear Cuenta' }}
        </button>

        <!-- Link a Login -->
        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        nombre: '',
        segundoNombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {},
      isSubmitting: false,
      generalError: '',
      successMessage: ''
    };
  },
  methods: {
    clearMessages() {
      this.generalError = '';
      this.successMessage = '';
      this.errors = {};
    },

    validateForm() {
      this.errors = {};

      if (!this.form.username.trim()) {
        this.errors.username = 'El nombre de usuario es requerido';
      } else if (this.form.username.length < 3) {
        this.errors.username = 'Debe tener al menos 3 caracteres';
      } else if (!/^[a-zA-Z0-9_]+$/.test(this.form.username)) {
        this.errors.username = 'Solo letras, números y guiones bajos';
      }

      if (!this.form.nombre.trim()) {
        this.errors.nombre = 'El nombre es requerido';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.form.nombre)) {
        this.errors.nombre = 'Solo letras permitidas';
      }

      if (this.form.segundoNombre.trim() && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.form.segundoNombre)) {
        this.errors.segundoNombre = 'Solo letras permitidas';
      }

      if (!this.form.apellidoPaterno.trim()) {
        this.errors.apellidoPaterno = 'Requerido';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.form.apellidoPaterno)) {
        this.errors.apellidoPaterno = 'Solo letras permitidas';
      }

      if (!this.form.apellidoMaterno.trim()) {
        this.errors.apellidoMaterno = 'Requerido';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.form.apellidoMaterno)) {
        this.errors.apellidoMaterno = 'Solo letras permitidas';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email.trim()) {
        this.errors.email = 'Correo requerido';
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Formato inválido';
      }

      if (!this.form.password.trim()) {
        this.errors.password = 'Requerida';
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Mínimo 8 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.form.password)) {
        this.errors.password = 'Debe tener mayúscula, minúscula y número';
      }

      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Requerido';
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'No coinciden';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      this.clearMessages();

      if (!this.validateForm()) return;

      this.isSubmitting = true;

      try {
        const userData = {
          username: this.form.username.trim(),
          nombre: this.form.nombre.trim(),
          segundoNombre: this.form.segundoNombre.trim() || null,
          apellidoPaterno: this.form.apellidoPaterno.trim(),
          apellidoMaterno: this.form.apellidoMaterno.trim(),
          email: this.form.email.trim().toLowerCase(),
          password: this.form.password
        };

        // Aquí iría tu lógica de llamada al backend...
        // await axios.post('/api/register', userData)

        this.successMessage = 'Registro exitoso';
        this.form = {
          username: '',
          nombre: '',
          segundoNombre: '',
          apellidoPaterno: '',
          apellidoMaterno: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
      } catch (error) {
        this.generalError = 'Error al registrar usuario';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped src="./register.css"></style>