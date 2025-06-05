<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// -- Estados Reactivos --
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const message = ref(null) // Usamos 'message' y 'type' para mensajes de usuario
const messageType = ref('')
const isLoading = ref(false) // 'cargando' -> 'isLoading' para un nombre más estándar
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// -- Validaciones --
// Centralizamos los mensajes de error para cada campo
const validationErrors = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const validateUsername = () => {
    const value = username.value.trim();
    if (value.length < 4 || value.length > 20) {
        validationErrors.value.username = 'El nombre de usuario debe tener entre 4 y 20 caracteres.';
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        validationErrors.value.username = 'Solo letras, números y guiones bajos.';
    } else {
        validationErrors.value.username = '';
    }
    return !validationErrors.value.username;
}

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        validationErrors.value.email = 'Ingresa un email válido.';
    } else {
        validationErrors.value.email = '';
    }
    return !validationErrors.value.email;
}

const validatePassword = () => {
    const pwd = password.value;
    if (pwd.length < 6 || pwd.length > 50) {
        validationErrors.value.password = 'La contraseña debe tener entre 6 y 50 caracteres.';
    } else {
        validationErrors.value.password = '';
    }
    return !validationErrors.value.password;
}

const validateConfirmPassword = () => {
    if (confirmPassword.value.length === 0) {
        validationErrors.value.confirmPassword = 'Confirma tu contraseña.';
    } else if (password.value !== confirmPassword.value) {
        validationErrors.value.confirmPassword = 'Las contraseñas no coinciden.';
    } else {
        validationErrors.value.confirmPassword = '';
    }
    return !validationErrors.value.confirmPassword;
}

// Computadas para saber si el campo es "válido" o "inválido" para las clases CSS
const isUsernameValid = computed(() => username.value.length > 0 && validationErrors.value.username === '');
const isEmailValid = computed(() => email.value.length > 0 && validationErrors.value.email === '');
const isPasswordValid = computed(() => password.value.length > 0 && validationErrors.value.password === '');
const isConfirmPasswordValid = computed(() => confirmPassword.value.length > 0 && validationErrors.value.confirmPassword === '');


const isFormValid = computed(() => {
    return isUsernameValid.value &&
           isEmailValid.value &&
           isPasswordValid.value &&
           isConfirmPasswordValid.value;
})

// -- Funciones --
const clearMessage = () => {
    message.value = null;
    messageType.value = '';
}

const register = async () => {
    // Validar todos los campos al intentar registrar
    const allFieldsValid = validateUsername() && validateEmail() && validatePassword() && validateConfirmPassword();

    if (!allFieldsValid) {
        message.value = 'Por favor, corrige los errores en el formulario.';
        messageType.value = 'error';
        return;
    }

    isLoading.value = true;
    clearMessage(); // Limpiar mensajes anteriores

    try {
        const userData = {
            username: username.value.trim(),
            email: email.value.trim().toLowerCase(),
            password: password.value
        };

        const res = await axios.post('http://localhost:3000/api/auth/register', userData, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        message.value = '¡Registro exitoso! Redirigiendo al login...';
        messageType.value = 'success'; // Cambié 'exito' a 'success' para consistencia con CSS

        setTimeout(() => {
            username.value = '';
            email.value = '';
            password.value = '';
            confirmPassword.value = '';

            router.push({
                path: '/',
                query: { registered: 'true', email: userData.email }
            });
        }, 2000);

    } catch (err) {
        console.error('Error en registro:', err);

        if (axios.isCancel(err)) {
            message.value = 'La solicitud fue cancelada.';
        } else if (err.code === 'ECONNABORTED') {
            message.value = 'Tiempo de espera agotado. Verifica tu conexión.';
        } else if (err.response) {
            const status = err.response.status;
            const errorMsg = err.response.data?.error || err.response.data?.message;

            switch (status) {
                case 400:
                    message.value = errorMsg || 'Datos inválidos. Revisa la información.';
                    break;
                case 409:
                    message.value = 'El usuario o email ya está registrado.';
                    break;
                case 500:
                    message.value = 'Error interno del servidor. Intenta más tarde.';
                    break;
                default:
                    message.value = errorMsg || `Error del servidor (${status}).`;
            }
        } else if (err.request) {
            message.value = 'No se pudo conectar al servidor. Verifica tu conexión.';
        } else {
            message.value = 'Error inesperado. Intenta nuevamente.';
        }

        messageType.value = 'error';
    } finally {
        isLoading.value = false;
    }
}

const togglePasswordVisibility = (field) => { // Renombré la función para mayor claridad
    if (field === 'password') {
        showPassword.value = !showPassword.value;
    } else if (field === 'confirm') {
        showConfirmPassword.value = !showConfirmPassword.value;
    }
}

const goToLogin = () => { // Renombré la función
    router.push('/');
}

// Manejo de eventos de teclado (Enter)
const handleEnter = (event) => { // Renombré la función
    if (event.key === 'Enter' && isFormValid.value && !isLoading.value) {
        register();
    }
}

// -- Lifecycle Hooks --
onMounted(() => {
    // Limpiar query parameters si existen para una URL limpia
    if (router.currentRoute.value.query.registered) {
        router.replace({ path: '/register' });
    }

    // Poner el foco en el primer campo de usuario
    document.getElementById('username')?.focus();
});

onBeforeUnmount(() => {
    clearMessage(); // Limpiar mensajes antes de desmontar
});
</script>

<template>
    <div class="register-container">
        <div class="form-card">
            <h2 class="form-title">Crear cuenta</h2>
            <p class="form-subtitle">Únete a nuestra comunidad</p>

            <form @submit.prevent="register" @keydown.enter="handleEnter">
                <div class="input-group">
                    <label for="username">Nombre de usuario</label>
                    <input
                        id="username"
                        v-model="username"
                        type="text"
                        placeholder="Ej: usuario123"
                        autocomplete="username"
                        :class="{
                            'is-error': username.length > 0 && validationErrors.username,
                            'is-success': username.length > 0 && !validationErrors.username
                        }"
                        :disabled="isLoading"
                        @input="validateUsername"
                        maxlength="20"
                    />
                    <Transition name="fade">
                        <p v-if="username.length > 0 && validationErrors.username" class="validation-message error-message">
                            {{ validationErrors.username }}
                        </p>
                        <p v-else-if="username.length > 0 && !validationErrors.username" class="validation-message success-message">
                            ✓ Nombre de usuario válido
                        </p>
                    </Transition>
                </div>

                <div class="input-group">
                    <label for="email">Correo electrónico</label>
                    <input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        autocomplete="email"
                        :class="{
                            'is-error': email.length > 0 && validationErrors.email,
                            'is-success': email.length > 0 && !validationErrors.email
                        }"
                        :disabled="isLoading"
                        @input="validateEmail"
                    />
                    <Transition name="fade">
                        <p v-if="email.length > 0 && validationErrors.email" class="validation-message error-message">
                            {{ validationErrors.email }}
                        </p>
                        <p v-else-if="email.length > 0 && !validationErrors.email" class="validation-message success-message">
                            ✓ Email válido
                        </p>
                    </Transition>
                </div>

                <div class="input-group">
                    <label for="password">Contraseña</label>
                    <div class="password-input-wrapper">
                        <input
                            id="password"
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Mínimo 6 caracteres"
                            autocomplete="new-password"
                            :class="{
                                'is-error': password.length > 0 && validationErrors.password,
                                'is-success': password.length > 0 && !validationErrors.password
                            }"
                            :disabled="isLoading"
                            @input="validatePassword"
                            maxlength="50"
                        />
                        <button
                            type="button"
                            class="toggle-password-visibility"
                            @click="togglePasswordVisibility('password')"
                            :disabled="isLoading"
                            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                        >
                            <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                        </button>
                    </div>
                    <Transition name="fade">
                        <p v-if="password.length > 0 && validationErrors.password" class="validation-message error-message">
                            {{ validationErrors.password }}
                        </p>
                        <p v-else-if="password.length > 0 && !validationErrors.password" class="validation-message success-message">
                            ✓ Contraseña válida
                        </p>
                    </Transition>
                </div>

                <div class="input-group">
                    <label for="confirmPassword">Confirmar contraseña</label>
                    <div class="password-input-wrapper">
                        <input
                            id="confirmPassword"
                            v-model="confirmPassword"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            placeholder="Repite tu contraseña"
                            autocomplete="new-password"
                            :class="{
                                'is-error': confirmPassword.length > 0 && validationErrors.confirmPassword,
                                'is-success': confirmPassword.length > 0 && !validationErrors.confirmPassword
                            }"
                            :disabled="isLoading"
                            @input="validateConfirmPassword"
                            maxlength="50"
                        />
                        <button
                            type="button"
                            class="toggle-password-visibility"
                            @click="togglePasswordVisibility('confirm')"
                            :disabled="isLoading"
                            :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                        >
                            <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                        </button>
                    </div>
                    <Transition name="fade">
                        <p v-if="confirmPassword.length > 0 && validationErrors.confirmPassword" class="validation-message error-message">
                            {{ validationErrors.confirmPassword }}
                        </p>
                        <p v-else-if="confirmPassword.length > 0 && !validationErrors.confirmPassword" class="validation-message success-message">
                            ✓ Las contraseñas coinciden
                        </p>
                    </Transition>
                </div>

                <button
                    type="submit"
                    :disabled="isLoading || !isFormValid"
                    class="submit-btn"
                    :class="{ 'is-loading': isLoading }"
                >
                    <span v-if="isLoading" class="spinner"></span>
                    <span class="btn-text">
                        {{ isLoading ? 'Registrando...' : 'Crear cuenta' }}
                    </span>
                </button>

                <Transition name="fade">
                    <div v-if="message" class="app-message" :class="messageType">
                        <span v-if="messageType === 'success'">✅</span>
                        <span v-if="messageType === 'error'">❌</span>
                        {{ message }}
                    </div>
                </Transition>

                <div class="login-prompt">
                    ¿Ya tienes cuenta?
                    <a @click.prevent="goToLogin" href="#">Inicia sesión</a>
                </div>
            </form>
        </div>
    </div>
</template>

<style src="./register.css" scoped></style>