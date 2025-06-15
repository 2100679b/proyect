// services/sessionService.js

import axios from 'axios'
import dsSesionMock from './dsSesion.mock.js'

// Cambia a false para usar los datos simulados en lugar del backend real
const USE_BACKEND = true

export const verify = async (userName, password) => {
  if (USE_BACKEND) {
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', {
        userName,
        password
      })

      // Puedes validar estructura aquí si esperas ciertos campos
      if (response.data && response.data.usuario) {
        return response.data.usuario
      } else {
        throw new Error('Respuesta inválida del servidor')
      }

    } catch (error) {
      // Si es un error de autenticación (401), personaliza el mensaje
      if (error.response && error.response.status === 401) {
        throw new Error('Usuario o contraseña incorrectos')
      }

      // Otro tipo de errores (conexión, backend caído, etc)
      console.error('Error en la verificación con backend:', error.message)
      throw new Error('No se pudo conectar con el servidor')
    }

  } else {
    // Modo mock
    return dsSesionMock.verify(userName, password)
  }
}
