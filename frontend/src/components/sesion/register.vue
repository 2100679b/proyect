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

        <!-- Primer Nombre -->
        <div class="form-group">
          <label for="nombre">Nombre</label>
          <input 
            type="text" 
            id="nombre"
            v-model.trim="form.nombre"
            :class="{ 'error': errors.nombre }"
            placeholder="Tu primer nombre"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.nombre" class="error-message">{{ errors.nombre }}</span>
        </div>

        <!-- Segundo Nombre -->
        <div class="form-group">
          <label for="segundoNombre">Segundo Nombre <span class="optional">(opcional)</span></label>
          <input 
            type="text" 
            id="segundoNombre"
            v-model.trim="form.segundoNombre"
            :class="{ 'error': errors.segundoNombre }"
            placeholder="Tu segundo nombre"
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
            v-model.trim="form.apellidoPaterno"
            :class="{ 'error': errors.apellidoPaterno }"
            placeholder="Tu apellido paterno"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.apellidoPaterno" class="error-message">{{ errors.apellidoPaterno }}</span>
        </div>

        <!-- Apellido Materno -->
        <div class="form-group">
          <label for="apellidoMaterno">Apellido Materno</label>
          <input 
            type="text" 
            id="apellidoMaterno"
            v-model.trim="form.apellidoMaterno"
            :class="{ 'error': errors.apellidoMaterno }"
            placeholder="Tu apellido materno"
            :disabled="isSubmitting"
            required
          />
          <span v-if="errors.apellidoMaterno" class="error-message">{{ errors.apellidoMaterno }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input 
            type="email" 
            id="email"
            v-model.trim="form.email"
            :class="{ 'error': errors.email }"
            placeholder="ejemplo@correo.com"
            :disabled="isSubmitting"
            required
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
      const letras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      this.errors = {};

      // Validaciones básicas
      if (!this.form.username || this.form.username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(this.form.username)) {
        this.errors.username = 'El nombre debe tener al menos 3 caracteres y solo contener letras, números y guiones bajos';
      }

      if (!this.form.nombre || !letras.test(this.form.nombre)) {
        this.errors.nombre = 'El nombre es requerido y solo puede contener letras';
      }

      if (this.form.segundoNombre && !letras.test(this.form.segundoNombre)) {
        this.errors.segundoNombre = 'Solo letras permitidas';
      }

      if (!this.form.apellidoPaterno || !letras.test(this.form.apellidoPaterno)) {
        this.errors.apellidoPaterno = 'El apellido paterno es requerido y solo puede contener letras';
      }

      if (!this.form.apellidoMaterno || !letras.test(this.form.apellidoMaterno)) {
        this.errors.apellidoMaterno = 'El apellido materno es requerido y solo puede contener letras';
      }

      if (!this.form.email || !emailRegex.test(this.form.email)) {
        this.errors.email = 'Correo requerido y debe tener formato válido';
      }

      if (!this.form.password || this.form.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.form.password)) {
        this.errors.password = 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula, minúscula y número';
      }

      if (!this.form.confirmPassword || this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden';
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
          segundo_nombre: this.form.segundoNombre?.trim() || null,
          apellido_paterno: this.form.apellidoPaterno.trim(),
          apellido_materno: this.form.apellidoMaterno.trim(),
          correo: this.form.email.trim().toLowerCase(),
          contrasena: this.form.password
        };

        const res = await axios.post('/api/register', userData);

        if (res.status >= 200 && res.status < 300 && res.data.message?.includes('éxito')) {
          this.successMessage = 'Usuario registrado con éxito. ¡Ya puedes iniciar sesión!';
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
          setTimeout(() => this.$router.push('/login'), 2000);
        } else {
          this.generalError = res.data.message || 'Ocurrió un error al registrar.';
        }
      } catch (err) {
        console.error('Error en registro:', err);
        if (err.response) {
          const status = err.response.status;
          this.generalError =
            status === 409 ? 'El usuario o correo ya existe.' :
            status === 400 ? 'Datos inválidos. Verifica la información.' :
            err.response.data?.message || 'Error del servidor.';
        } else if (err.request) {
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