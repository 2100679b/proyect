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
            v-model.trim="form.nombre"
            required
            :class="{ 'error': errors.nombre }"
            placeholder="Tu primer nombre"
            :disabled="isSubmitting"
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
            v-model.trim="form.apellidoPaterno"
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
            v-model.trim="form.apellidoMaterno"
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
            v-model.trim="form.email"
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

        <!-- Confirm Password -->
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
      this.errors = {};
      const letras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

      if (!this.form.username) {
        this.errors.username = 'El nombre de usuario es requerido';
      } else if (this.form.username.length < 3) {
        this.errors.username = 'Debe tener al menos 3 caracteres';
      } else if (!/^[a-zA-Z0-9_]+$/.test(this.form.username)) {
        this.errors.username = 'Solo letras, números y guiones bajos';
      }

      if (!this.form.nombre) {
        this.errors.nombre = 'El nombre es requerido';
      } else if (!letras.test(this.form.nombre)) {
        this.errors.nombre = 'Solo letras permitidas';
      }

      if (this.form.segundoNombre && !letras.test(this.form.segundoNombre)) {
        this.errors.segundoNombre = 'Solo letras permitidas';
      }

      if (!this.form.apellidoPaterno) {
        this.errors.apellidoPaterno = 'El apellido paterno es requerido';
      } else if (!letras.test(this.form.apellidoPaterno)) {
        this.errors.apellidoPaterno = 'Solo letras permitidas';
      }

      if (!this.form.apellidoMaterno) {
        this.errors.apellidoMaterno = 'El apellido materno es requerido';
      } else if (!letras.test(this.form.apellidoMaterno)) {
        this.errors.apellidoMaterno = 'Solo letras permitidas';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.form.email) {
        this.errors.email = 'Correo requerido';
      } else if (!emailRegex.test(this.form.email)) {
        this.errors.email = 'Formato de correo inválido';
      }

      if (!this.form.password) {
        this.errors.password = 'Contraseña requerida';
      } else if (this.form.password.length < 8) {
        this.errors.password = 'Mínimo 8 caracteres';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(this.form.password)) {
        this.errors.password = 'Debe incluir mayúscula, minúscula y número';
      }

      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Confirmación requerida';
      } else if (this.form.password !== this.form.confirmPassword) {
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
          username: this.form.username,
          nombre: this.form.nombre,
          segundo_nombre: this.form.segundoNombre || null,
          apellido_paterno: this.form.apellidoPaterno,
          apellido_materno: this.form.apellidoMaterno,
          correo: this.form.email.toLowerCase(),
          contrasena: this.form.password
        };

        const res = await axios.post('http://18.119.167.171:3000/api/register', userData);

        // Verificar si la respuesta fue exitosa (status 200-299)
        if (res.status >= 200 && res.status < 300) {
          // Verificar si el mensaje indica éxito
          if (res.data.message && res.data.message.includes('éxito')) {
            this.successMessage = 'Usuario registrado con éxito. ¡Ya puedes iniciar sesión!';
            // Limpiar el formulario
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
            
            // Opcional: Redirigir al login después de 2 segundos
            setTimeout(() => {
              this.$router.push('/login');
            }, 2000);
          } else {
            this.generalError = res.data.message || 'Ocurrió un error al registrar.';
          }
        } else {
          this.generalError = res.data.message || 'Error en el servidor.';
        }
      } catch (err) {
        console.error('Error en registro:', err);
        
        if (err.response) {
          // Error del servidor con respuesta
          if (err.response.status === 409) {
            this.generalError = 'El usuario o correo ya existe.';
          } else if (err.response.status === 400) {
            this.generalError = 'Datos inválidos. Verifica la información.';
          } else {
            this.generalError = err.response.data?.message || 'Error del servidor.';
          }
        } else if (err.request) {
          // Error de conexión
          this.generalError = 'Error de conexión. Verifica tu internet.';
        } else {
          // Otro tipo de error
          this.generalError = 'Ocurrió un error inesperado.';
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped src="./register.css"></style>