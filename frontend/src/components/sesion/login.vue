<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">
        {{ isRegister ? 'Crea una cuenta nueva' : 'Ingresa a tu cuenta' }}
      </p>

      <form @submit.prevent="isRegister ? register() : login()" class="login-form">
        <div v-if="isRegister" class="form-group">
          <label>Email:</label>
          <input v-model="formData.email" type="email" required />
        </div>

        <div class="form-group">
          <label>{{ isRegister ? 'Nombre de usuario:' : 'Usuario o correo:' }}</label>
          <input
            :value="isRegister ? formData.username : formData.identifier"
            @input="updateInput"
            type="text"
            required
          />
        </div>

        <div class="form-group">
          <label>Contraseña:</label>
          <input v-model="formData.password" type="password" required />
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn">
            {{ isRegister ? 'Registrarse' : 'Iniciar Sesión' }}
          </button>
          <button type="button" class="toggle-btn" @click="toggleForm">
            {{ isRegister ? 'Ya tengo cuenta' : 'Crear cuenta' }}
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_URL = 'https://18.119.167.171:3002/api/users';

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
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
      try {
        const res = await axios.post(`${API_URL}/register`, {
          email: this.formData.email,
          username: this.formData.username,
          password: this.formData.password
        });

        this.successMessage = res.data.message;
        this.clearForm();
        setTimeout(() => {
          this.isRegister = false;
        }, 2000);
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Error al registrar';
      }
    },
    async login() {
      try {
        const res = await axios.post(`${API_URL}/login`, {
          identifier: this.formData.identifier,
          password: this.formData.password
        });

        localStorage.setItem('token', res.data.token);
        this.successMessage = res.data.message;
        this.clearForm();
        setTimeout(() => {
          this.$router.push('/dashboard');
        }, 1500);
      } catch (err) {
        this.errorMessage = err.response?.data?.error || 'Error al iniciar sesión';
      }
    }
  }
};
</script>

<style scoped src="./login.css"></style>