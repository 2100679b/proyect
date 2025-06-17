<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Crear Cuenta</h2>
      <form @submit.prevent="handleSubmit" class="register-form">

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
            maxlength="100"
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <!-- Username -->
        <div class="form-group">
          <label for="username">Nombre de Usuario</label>
          <input 
            type="text" 
            id="username"
            v-model.trim="form.username"
            :class="{ 'error': errors.username }"
            placeholder="Nombre de usuario (mínimo 3 caracteres)"
            :disabled="isSubmitting"
            required
            minlength="3"
            maxlength="100"
          />
          <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="password-input-container">
            <input 
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              :class="{ 'error': errors.password }"
              placeholder="Mínimo 6 caracteres"
              :disabled="isSubmitting"
              required
              minlength="6"
              maxlength="100"
            />
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
              :disabled="isSubmitting"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          <div class="password-strength" v-if="form.password">
            <div class="strength-bar" :class="passwordStrength.class"></div>
            <span class="strength-text">{{ passwordStrength.text }}</span>
          </div>
        </div>

        <!-- Confirmar Password -->
        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input 
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            v-model="form.confirmPassword"
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Confirma tu contraseña"
            :disabled="isSubmitting"
            required
            maxlength="100"
          />
          <button 
            type="button" 
            class="toggle-password"
            @click="showConfirmPassword = !showConfirmPassword"
            :disabled="isSubmitting"
          >
            {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
          </button>
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Términos y condiciones -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input 
              type="checkbox"
              v-model="form.acceptTerms"
              :disabled="isSubmitting"
              required
            />
            <span class="checkmark"></span>
            Acepto los <a href="#" @click.prevent="showTerms = true">términos y condiciones</a>
          </label>
          <span v-if="errors.acceptTerms" class="error-message">{{ errors.acceptTerms }}</span>
        </div>

        <!-- Mensajes -->
        <div v-if="generalError" class="general-error">
          <span>⚠️ {{ generalError }}</span>
        </div>
        <div v-if="successMessage" class="success-message">
          <span>✅ {{ successMessage }}</span>
        </div>

        <!-- Botón -->
        <button 
          type="submit" 
          class="register-btn" 
          :disabled="isSubmitting || !isFormValid"
          :class="{ 'loading': isSubmitting }"
        >
          <span v-if="isSubmitting">
            <span class="spinner"></span>
            Registrando...
          </span>
          <span v-else>Crear Cuenta</span>
        </button>

        <!-- Link a login -->
        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia Sesión</router-link></p>
        </div>

      </form>
    </div>

    <!-- Modal de términos -->
    <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
      <div class="modal-content" @click.stop>
        <h3>Términos y Condiciones</h3>
        <div class="terms-content">
          <p>Al registrarte en nuestra plataforma, aceptas:</p>
          <ul>
            <li>Proporcionar información veraz y actualizada</li>
            <li>Mantener la confidencialidad de tu cuenta</li>
            <li>Usar el servicio de manera responsable</li>
            <li>Cumplir con las políticas de uso</li>
          </ul>
        </div>
        <div class="modal-actions">
          <button @click="showTerms = false" class="btn-close">Cerrar</button>
        </div>
      </div>
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
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      errors: {},
      isSubmitting: false,
      generalError: '',
      successMessage: '',
      showPassword: false,
      showConfirmPassword: false,
      showTerms: false
    };
  },
  computed: {
    isFormValid() {
      return this.form.email && 
             this.form.username && 
             this.form.password && 
             this.form.confirmPassword &&
             this.form.acceptTerms &&
             this.form.password === this.form.confirmPassword &&
             this.form.password.length >= 6 &&
             this.form.username.length >= 3 &&
             this.validateEmail(this.form.email);
    },
    passwordStrength() {
      if (!this.form.password) return { class: '', text: '' };
      
      const password = this.form.password;
      let score = 0;
      
      // Longitud
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      
      // Complejidad
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/[0-9]/.test(password)) score++;
      if (/[^A-Za-z0-9]/.test(password)) score++;
      
      if (score < 3) return { class: 'weak', text: 'Débil' };
      if (score < 5) return { class: 'medium', text: 'Media' };
      return { class: 'strong', text: 'Fuerte' };
    }
  },
  methods: {
    clearMessages() {
      this.generalError = '';
      this.successMessage = '';
      this.errors = {};
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    validateForm() {
      this.errors = {};

      // Email
      if (!this.form.email) {
        this.errors.email = 'El correo electrónico es requerido';
      } else if (!this.validateEmail(this.form.email)) {
        this.errors.email = 'El formato del correo electrónico es inválido';
      }

      // Username
      if (!this.form.username) {
        this.errors.username = 'El nombre de usuario es requerido';
      } else if (this.form.username.length < 3) {
        this.errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
      } else if (this.form.username.length > 100) {
        this.errors.username = 'El nombre de usuario no puede exceder 100 caracteres';
      }

      // Password
      if (!this.form.password) {
        this.errors.password = 'La contraseña es requerida';
      } else if (this.form.password.length < 6) {
        this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
      } else if (this.form.password.length > 100) {
        this.errors.password = 'La contraseña no puede exceder 100 caracteres';
      }

      // Confirm Password
      if (!this.form.confirmPassword) {
        this.errors.confirmPassword = 'Debes confirmar tu contraseña';
      } else if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Las contraseñas no coinciden';
      }

      // Terms
      if (!this.form.acceptTerms) {
        this.errors.acceptTerms = 'Debes aceptar los términos y condiciones';
      }

      return Object.keys(this.errors).length === 0;
    },

    async handleSubmit() {
      this.clearMessages();

      if (!this.validateForm()) {
        this.generalError = 'Por favor corrige los errores en el formulario';
        return;
      }

      this.isSubmitting = true;

      try {
        // Datos que espera la API
        const userData = {
          email: this.form.email.toLowerCase().trim(),
          username: this.form.username.trim(),
          password: this.form.password
        };

        console.log('Enviando datos de registro:', { 
          ...userData, 
          password: '[HIDDEN]' 
        });

        const response = await axios.post('/api/register', userData);

        if (response.status === 201) {
          this.successMessage = 'Cuenta creada exitosamente. Serás redirigido al login...';
          
          // Limpiar formulario
          this.form = {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
          };

          // Redirigir después de 2 segundos
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Error en registro:', error);
        this.handleRegistrationError(error);
      } finally {
        this.isSubmitting = false;
      }
    },

    handleRegistrationError(error) {
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        const message = errorData?.error || errorData?.message;

        switch (status) {
          case 400:
            this.generalError = message || 'Datos de registro inválidos';
            break;
          case 409:
            if (message && message.includes('correo')) {
              this.errors.email = 'Este correo electrónico ya está registrado';
            } else if (message && message.includes('usuario')) {
              this.errors.username = 'Este nombre de usuario ya está en uso';
            } else {
              this.generalError = 'El correo o nombre de usuario ya están registrados';
            }
            break;
          case 500:
            this.generalError = 'Error interno del servidor. Intenta nuevamente';
            break;
          default:
            this.generalError = message || 'Error desconocido en el registro';
        }
      } else if (error.request) {
        this.generalError = 'Error de conexión. Verifica tu conexión a internet';
      } else {
        this.generalError = 'Error inesperado. Intenta nuevamente';
      }
    }
  }
};
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 450px;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #333;
}

.toggle-password:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.strength-bar.weak {
  width: 33%;
  background-color: #e74c3c;
}

.strength-bar.medium {
  width: 66%;
  background-color: #f39c12;
}

.strength-bar.strong {
  width: 100%;
  background-color: #27ae60;
}

.strength-text {
  font-size: 12px;
  color: #666;
}

.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.5;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  display: block;
  margin-top: 6px;
}

.general-error {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #e74c3c;
}

.success-message {
  background-color: #e8f5e8;
  color: #2e7d32;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #27ae60;
}

.register-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.register-btn.loading {
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.login-link {
  text-align: center;
  margin-top: 24px;
}

.login-link p {
  color: #666;
  margin: 0;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.terms-content {
  margin-bottom: 24px;
  color: #555;
  line-height: 1.6;
}

.terms-content ul {
  padding-left: 20px;
}

.terms-content li {
  margin-bottom: 8px;
}

.modal-actions {
  text-align: right;
}

.btn-close {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.btn-close:hover {
  background: #5a6fd8;
}

/* Responsive */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 24px;
  }
  
  .modal-content {
    padding: 24px;
  }
}
</style>