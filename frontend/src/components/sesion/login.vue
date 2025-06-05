<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Título y subtítulo -->
      <h1 class="login-title">{{ isRegister ? 'Registro' : 'Iniciar Sesión' }}</h1>
      <p class="login-subtitle">
        {{ isRegister ? 'Crea tu cuenta' : 'Accede a tu cuenta' }}
      </p>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Campo de email (solo en registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model.trim="formData.email"
            type="email"
            class="form-input"
            :class="{ loading: isLoading }"
            placeholder="tu@email.com"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Campo de usuario (solo en registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="username" class="form-label">Usuario</label>
          <input
            id="username"
            v-model.trim="formData.username"
            type="text"
            class="form-input"
            :class="{ loading: isLoading }"
            placeholder="Nombre de usuario"
            required
            minlength="3"
            :disabled="isLoading"
          />
        </div>

        <!-- Campo de identificador (solo en login) -->
        <div v-if="!isRegister" class="form-group">
          <label for="identifier" class="form-label">Usuario</label>
          <input
            id="identifier"
            v-model.trim="formData.identifier"
            type="text"
            class="form-input"
            :class="{ loading: isLoading }"
            placeholder="Nombre de usuario"
            required
            minlength="3"
            :disabled="isLoading"
          />
          <small class="form-hint">
            Ingresa tu nombre de usuario
          </small>
        </div>

        <!-- Campo de contraseña -->
        <div class="form-group">
          <label for="password" class="form-label">Contraseña</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            :class="{ loading: isLoading }"
            :placeholder="isRegister ? 'Mínimo 6 caracteres' : 'Tu contraseña'"
            required
            :minlength="isRegister ? 6 : undefined"
            :disabled="isLoading"
          />
        </div>

        <!-- Confirmar contraseña (solo en registro) -->
        <div v-if="isRegister" class="form-group">
          <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            :class="{ 
              loading: isLoading,
              error: formData.confirmPassword && formData.password !== formData.confirmPassword
            }"
            placeholder="Repite tu contraseña"
            required
            :disabled="isLoading"
          />
          <small
            v-if="formData.confirmPassword && formData.password !== formData.confirmPassword"
            class="field-error"
          >
            Las contraseñas no coinciden
          </small>
        </div>

        <!-- Alternar login/registro -->
        <a
          href="#"
          @click.prevent="toggleLoginType"
          class="toggle-login-link"
          v-if="!isLoading"
        >
          {{ isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
        </a>

        <!-- Mensajes de error y éxito -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <!-- Botón de envío -->
        <button
          type="submit"
          class="submit-btn"
          :disabled="isLoading || !isFormValid"
        >
          <span v-if="!isLoading">
            {{ isRegister ? 'Crear Cuenta' : 'Iniciar Sesión' }}
          </span>
          <span v-else>
            {{ isRegister ? 'Creando cuenta...' : 'Iniciando sesión...' }}
          </span>
        </button>
      </form>

      <!-- Enlaces adicionales -->
      <div class="links-container">
        <a href="#" @click.prevent="handleForgotPassword" class="additional-link">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <!-- Información usuario demo -->
      <div v-if="!isRegister" class="demo-info">
        <small>Usuario de prueba: <strong>arodriguezp</strong> / Contraseña: <strong>123456</strong></small>
      </div>
    </div>
  </div>
</template>

<script>
class SessionDS {
  constructor() {
    this.usuarios = [
      {
        id: 1,
        nombre: 'Agustin Rodriguez Ponce',
        userName: 'arodriguezp',
        password: '123456',
        roles: [1, 2, 3]
      }
    ];

    this.response = {
      mensaje: {
        codigo: 40,
        descripcion: 'Ocurrió un error en el servidor'
      },
      usuario: {
        id: 0,
        nombre: '',
        userName: '',
        roles: [0]
      }
    };
  }

  add(usuario) {
    this.usuarios.push(usuario);
  }

  verify(userName, password) {
    return Promise.resolve(this.getUser(userName, password));
  }

  getUser(userName, password) {
    const usuario = this.usuarios.find(
      user => user.userName === userName && user.password === password
    );

    if (!usuario) {
      this.response = {
        mensaje: {
          codigo: 40,
          descripcion: 'Usuario o contraseña incorrectos'
        },
        usuario: {
          id: 0,
          nombre: '',
          userName: '',
          roles: [0]
        }
      };
    } else {
      this.response = {
        mensaje: {
          codigo: 10,
          descripcion: 'Usuario localizado'
        },
        usuario: usuario
      };
    }

    return this.response;
  }
}

const sessionDS = new SessionDS();

export default {
  name: 'Login',
  data() {
    return {
      isRegister: false,
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      formData: {
        email: '',
        username: '',
        identifier: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  computed: {
    isFormValid() {
      const { email, username, identifier, password, confirmPassword } = this.formData;

      if (!password?.trim() || password.length < 6) return false;

      if (this.isRegister) {
        if (!email?.trim() || !username?.trim()) return false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) return false;

        if (username.trim().length < 3) return false;

        if (password !== confirmPassword) return false;
      } else {
        if (!identifier?.trim()) return false;
        if (identifier.trim().length < 3) return false;
      }

      return true;
    }
  },
  methods: {
    toggleLoginType() {
      this.isRegister = !this.isRegister;
      this.clearMessages();
      this.clearForm();
    },

    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },

    clearForm() {
      if (this.isRegister) {
        // Cambiando a registro: limpiar login-only fields
        this.formData.identifier = '';
        this.formData.password = '';
        this.formData.confirmPassword = '';
        // Mantener email y username vacíos
        this.formData.email = '';
        this.formData.username = '';
      } else {
        // Cambiando a login: limpiar registro-only fields
        this.formData.email = '';
        this.formData.username = '';
        this.formData.confirmPassword = '';
        this.formData.password = '';
        this.formData.identifier = '';
      }
    },

    async handleSubmit() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      this.clearMessages();

      try {
        if (this.isRegister) {
          await this.register();
        } else {
          await this.login();
        }
      } catch (error) {
        this.errorMessage = error.message || 'Ha ocurrido un error inesperado';
      } finally {
        this.isLoading = false;
      }
    },

    async login() {
      try {
        const userName = this.formData.identifier.trim();
        const password = this.formData.password;

        const response = await sessionDS.verify(userName, password);

        if (response.mensaje.codigo === 10) {
          this.successMessage = `¡Bienvenido ${response.usuario.nombre}! Redirigiendo...`;

          setTimeout(() => {
            this.$emit('login-success', {
              usuario: response.usuario,
              userName,
              timestamp: new Date().toISOString()
            });
            if (this.$router) this.$router.push('/menu');
          }, 1500);
        } else {
          throw new Error(response.mensaje.descripcion);
        }
      } catch (error) {
        console.error('Error de login:', error);
        throw new Error(error.message || 'Error al iniciar sesión');
      }
    },

    async register() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newUser = {
          id: sessionDS.usuarios.length + 1,
          nombre: this.formData.username.trim(),
          userName: this.formData.username.trim(),
          password: this.formData.password,
          roles: [1]
        };

        const existingUser = sessionDS.usuarios.find(
          user => user.userName === newUser.userName
        );

        if (existingUser) {
          throw new Error('Este nombre de usuario ya está registrado');
        }

        sessionDS.add(newUser);

        this.successMessage = `Usuario ${newUser.userName} creado exitosamente`;

        setTimeout(() => {
          this.toggleLoginType();
        }, 2000);
      } catch (error) {
        console.error('Error en registro:', error);
        throw new Error(error.message || 'Error al registrar usuario');
      }
    },

    handleForgotPassword() {
      alert('Funcionalidad de recuperación de contraseña en desarrollo.');
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f7f9fc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-box {
  background: #fff;
  padding: 2rem 3rem;
  border-radius: 8px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  margin: 0 0 0.5rem;
  font-weight: 700;
  font-size: 1.8rem;
  color: #2e3a59;
  text-align: center;
}

.login-subtitle {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  color: #6b7a99;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.1rem;
}

.form-label {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
  color: #4a4a4a;
  display: block;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.8rem;
  border: 1.8px solid #b0b7ce;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.25s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3366ff;
  box-shadow: 0 0 6px #3366ff44;
}

.form-input.loading {
  background-color: #f0f0f0;
  color: #999;
}

.field-error {
  color: #d93025;
  font-size: 0.85rem;
  margin-top: 0.3rem;
}

.error-message {
  background-color: #ffe6e6;
  color: #d93025;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
}

.success-message {
  background-color: #ddf4e1;
  color: #2d7a2d;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: 600;
  text-align: center;
}

.submit-btn {
  background-color: #3366ff;
  color: #fff;
  font-weight: 700;
  padding: 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.25s ease;
}

.submit-btn:disabled {
  background-color: #aac1ff;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  background-color: #0047d3;
}

.toggle-login-link {
  display: block;
  text-align: center;
  margin: 1.25rem 0 0.8rem;
  font-size: 0.9rem;
  color: #3366ff;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
}

.toggle-login-link:hover {
  text-decoration: underline;
}

.links-container {
  text-align: center;
  margin-top: 0.5rem;
}

.additional-link {
  font-size: 0.9rem;
  color: #3366ff;
  cursor: pointer;
  text-decoration: none;
}

.additional-link:hover {
  text-decoration: underline;
}

.demo-info {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #888;
  text-align: center;
}
</style>
