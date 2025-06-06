<template>
  <div class="register-container">
    <div class="form-card">
      <h2 class="form-title">Registrarse</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            autocomplete="username"
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
          />
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="spinner"></span>
          Registrarse
        </button>
      </form>

      <p v-if="message" :class="{'app-message': true, 'success': success, 'error': !success}">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      isLoading: false,
      message: '',
      success: false,
    };
  },
  methods: {
    async handleRegister() {
      this.isLoading = true;
      this.message = '';
      try {
        const response = await axios.post('https://sensational-mermaid-833fd9.netlify.app/login', this.form);
        this.message = 'Usuario registrado con éxito';
        this.success = true;
        // Limpiar formulario si quieres
        this.form.username = '';
        this.form.password = '';
      } catch (error) {
        this.message = error.response?.data?.message || 'Error al registrar usuario';
        this.success = false;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style src="./register.css"></style>
