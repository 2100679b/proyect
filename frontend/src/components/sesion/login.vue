<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">
        {{ isRegister ? 'Crea una cuenta nueva' : 'Ingresa a tu cuenta' }}
      </p>

      <form @submit.prevent="isRegister ? register() : login()" class="login-form">
        <div v-if="isRegister" class="form-group">
          <label class="form-label">Email:</label>
          <input 
            v-model="formData.email" 
            type="email" 
            class="form-input"
            placeholder="tu-email@ejemplo.com"
            required 
          />
        </div>

        <div class="form-group">
          <label class="form-label">{{ isRegister ? 'Nombre de usuario:' : 'Usuario o correo:' }}</label>
          <input
            :value="isRegister ? formData.username : formData.identifier"
            @input="updateInput"
            type="text"
            class="form-input"
            :placeholder="isRegister ? 'Tu nombre de usuario' : 'Usuario o email'"
            required
          />
        </div>

        <div class="form-group">
          <label class="form-label">Contraseña:</label>
          <input 
            v-model="formData.password" 
            type="password" 
            class="form-input"
            placeholder="Tu contraseña"
            required 
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="isLoading">
            {{ isLoading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar Sesión') }}
          </button>
        </div>
      </form>

      <div class="links-container">
        <a href="#" class="toggle-login-link" @click.prevent="toggleForm">
          {{ isRegister ? 'Ya tengo cuenta' : 'Crear cuenta nueva' }}
        </a>
      </div>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = '/api/users';

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      formData: {
        email: '',
        username: '',
        password: '',
        identifier: ''
      },
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    updateInput(event) {
      if (this.isRegister) {
        this.formData.username = event.target.value;
      } else {
        this.formData.identifier = event.target.value;
      }
    },
    toggleForm() {
      this.isRegister = !this.isRegister;
      this.clearForm();
    },
    clearForm() {
      this.formData = {
        email: '',
        username: '',
        password: '',
        identifier: ''
      };
      this.errorMessage = '';
      this.successMessage = '';
    },
    async register() {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const res = await axios.post(`${API_URL}/register`, {
          email: this.formData.email,
          username: this.formData.username,
          password: this.formData.password
        });

        this.successMessage = res.data.message || '¡Registro exitoso!';
        this.clearForm();
        setTimeout(() => {
          this.isRegister = false;
        }, 2000);
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Error al registrar usuario';
        console.error('Error en registro:', err);
      } finally {
        this.isLoading = false;
      }
    },
    async login() {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const res = await axios.post(`${API_URL}/login`, {
          identifier: this.formData.identifier,
          password: this.formData.password
        });

        localStorage.setItem('token', res.data.token);
        this.successMessage = res.data.message || '¡Inicio de sesión exitoso!';
        this.clearForm();
        
        setTimeout(() => {
          this.$router.push('/menu');
        }, 1500);
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Error al iniciar sesión';
        console.error('Error en login:', err);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped src="./login.css"></style>