import { createStore } from 'vuex'

export default createStore({
  state: {
    usuario: {
      id: 0,
      nombre: '',
      userName: '',
      roles: []
    },
    dispositivos: [],
    usuarios: []
  },

  mutations: {
    // Guardar usuario autenticado
    setUsuario(state, usuario) {
      state.usuario = usuario
    },

    // Cerrar sesión
    clearUsuario(state) {
      state.usuario = {
        id: 0,
        nombre: '',
        userName: '',
        roles: []
      }
    },

    // Actualizar lista de dispositivos
    setDispositivos(state, dispositivos) {
      state.dispositivos = dispositivos
    },

    // Agregar nuevo dispositivo
    addDispositivo(state, dispositivo) {
      state.dispositivos.push(dispositivo)
    },

    // Actualizar lista de usuarios
    setUsuarios(state, usuarios) {
      state.usuarios = usuarios
    },

    // Agregar nuevo usuario
    addUsuario(state, usuario) {
      state.usuarios.push(usuario)
    }
  },

  actions: {
    // Podrías agregar aquí acciones asincrónicas como fetchUsuarios, fetchDispositivos, etc.
  },

  getters: {
    isAuthenticated: state => state.usuario.id !== 0,
    getUserName: state => state.usuario.userName,
    getRoles: state => state.usuario.roles,
    getDispositivos: state => state.dispositivos
  }
})
