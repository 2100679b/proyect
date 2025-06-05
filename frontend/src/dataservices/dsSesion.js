/*
Clase para representar los servicios de datos para manejo de la sesión
*/
class SessionDS {
  constructor () {
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

  // Método para agregar un nuevo usuario
  add(usuario) {
    this.usuarios.push(usuario);
  }

  // Método para verificar usuario y contraseña
  verify(userName, password) {
    return Promise.resolve(this.getUser(userName, password));
  }

  // Método interno que busca un usuario en la lista
  getUser(userName, password) {
    const usuario = this.usuarios.find(
      item => item.userName === userName && item.password === password
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

export default new SessionDS();
