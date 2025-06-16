<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Usuario" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Iniciar Sesión</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      message: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3001/api/users/login', {
          username: this.username,
          password: this.password
        });

        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);

        // Configurar el token en las cabeceras de Axios para futuras solicitudes
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

        // Mostrar mensaje de bienvenida
        this.message = response.data.mensaje;

        // Redirigir al dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        this.message = error.response?.data?.error || 'Error al iniciar sesión';
      }
    }
  }
};
</script>