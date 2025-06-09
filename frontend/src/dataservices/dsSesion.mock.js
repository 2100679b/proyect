// services/sessionService.js

import axios from 'axios'
import dsSesionMock from './dsSesion.mock.js'

const USE_BACKEND = true // Cambia a false para usar el mock

export const verify = async (userName, password) => {
  if (USE_BACKEND) {
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        userName,
        password
      })
      return response.data
    } catch (error) {
      console.error('Error en la verificación con backend:', error)
      throw error
    }
  } else {
    return dsSesionMock.verify(userName, password)
  }
}
