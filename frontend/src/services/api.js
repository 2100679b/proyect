import axios from 'axios';

// Configuración robusta con manejo de errores para la URL base
const getApiBaseUrl = () => {
  try {
    // Verifica si la variable de entorno existe
    if (!process.env.VUE_APP_API_URL) {
      console.error('VUE_APP_API_URL is not defined in environment variables');
      throw new Error('Missing API URL configuration');
    }
    return process.env.VUE_APP_API_URL;
  } catch (error) {
    console.error('Error configuring API base URL:', error);
    // URL de respaldo segura (modo desarrollo)
    return window.location.origin.includes('localhost') 
      ? 'http://localhost:3000' 
      : '/api';
  }
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000, // Tiempo de espera de 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor de solicitud mejorado
api.interceptors.request.use(config => {
  try {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No auth token found in localStorage');
    }
    
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
});

// Interceptor de respuesta con manejo de errores
api.interceptors.response.use(
  response => response,
  error => {
    // Manejo centralizado de errores
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        console.error('Unauthorized access - redirecting to login');
        // Redirigir a login si está disponible el router
        if (window.vueRouter) window.vueRouter.push('/login');
      }
      
      console.error(`API Error ${status}:`, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;