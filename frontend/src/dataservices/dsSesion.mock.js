// services/sessionService.js

const USE_BACKEND = false; // Cambia a false para usar mock

import dsSesionMock from './dsSesion.mock.js'
import axios from 'axios'

export const verify = async (userName, password) => {
  if (USE_BACKEND) {
    const response = await axios.post('http://localhost:3000/api/login', {
      userName, password
    })
    return response.data
  } else {
    return dsSesionMock.verify(userName, password)
  }
}
