<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="form-title">Crear cuenta</h2>

      <form @submit.prevent="submitForm" class="register-form">
        <div class="input-group">
          <label for="nombre">Nombre</label>
          <input
            v-model="form.nombre"
            type="text"
            id="nombre"
            required
            placeholder="Tu nombre"
          />
        </div>

        <div class="input-group">
          <label for="segundo_nombre">Segundo Nombre</label>
          <input
            v-model="form.segundo_nombre"
            type="text"
            id="segundo_nombre"
            placeholder="Tu segundo nombre (opcional)"
          />
        </div>

        <div class="input-group">
          <label for="apellidos">Apellidos</label>
          <input
            v-model="form.apellidos"
            type="text"
            id="apellidos"
            required
            placeholder="Tus apellidos"
          />
        </div>

        <div class="input-group">
          <label for="usuario">Usuario</label>
          <input
            v-model="form.usuario"
            type="text"
            id="usuario"
            required
            placeholder="Tu nombre de usuario"
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
        nombre: '',
        segundo_nombre: '',
        apellidos: '',
        usuario: '',
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
        this.form.nombre.trim() &&
        this.form.apellidos.trim() &&
        this.form.usuario.trim() &&
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

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

      try {
        const response = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nombre: this.form.nombre,
            segundo_nombre: this.form.segundo_nombre,
            apellidos: this.form.apellidos,
            usuario: this.form.usuario,
            contrasena: this.form.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          this.message = 'Usuario registrado con éxito';
          this.messageType = 'success';
          // Limpiar formulario
          this.form.nombre = '';
          this.form.segundo_nombre = '';
          this.form.apellidos = '';
          this.form.usuario = '';
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
