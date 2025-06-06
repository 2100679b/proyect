<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="form-title">Crear cuenta</h2>

      <form @submit.prevent="submitForm" class="register-form">
        <div class="input-group">
          <label for="username">Usuario</label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            required
            placeholder="Tu nombre de usuario"
          />
        </div>

        <div class="input-group">
          <label for="email">Correo</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            required
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div class="input-group">
          <label for="password">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            required
            placeholder="••••••••"
          />
        </div>

        <div class="input-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirmPassword"
            required
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="submit-btn"
          :class="{ 'is-loading': isLoading }"
        >
          <span v-if="isLoading" class="spinner"></span>
          <span class="btn-text">
            {{ isLoading ? 'Registrando...' : 'Registrarse' }}
          </span>
        </button>
      </form>

      <p class="form-footer">
        ¿Ya tienes cuenta?
        <a href="#" @click.prevent="goToLogin">Inicia sesión</a>
      </p>

      <transition name="fade">
        <div v-if="message" :class="['form-message', messageType]">
          {{ message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      isLoading: false,
      message: '',
      messageType: '' // 'success' o 'error'
    };
  },
  computed: {
    isFormValid() {
      return (
        this.form.username.trim() &&
        this.form.email.trim() &&
        this.form.password &&
        this.form.password === this.form.confirmPassword
      );
    }
  },
  methods: {
    async submitForm() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      this.message = '';
      this.messageType = '';

      // Reemplaza esto con tu variable de entorno o url real
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      try {
        const response = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: this.form.username,
            email: this.form.email,
            contrasena: this.form.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          this.message = 'Usuario registrado con éxito';
          this.messageType = 'success';
          // Limpiar formulario
          this.form.username = '';
          this.form.email = '';
          this.form.password = '';
          this.form.confirmPassword = '';
        } else {
          this.message = data.error || 'Error al registrar usuario';
          this.messageType = 'error';
        }
      } catch (error) {
        this.message = 'Error de conexión con el servidor';
        this.messageType = 'error';
      } finally {
        this.isLoading = false;
      }
    },

    goToLogin() {
      this.$emit('switch-view', 'login');
    }
  }
};
</script>

<style src="./register.css" scoped></style>
