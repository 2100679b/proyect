class SessionDS {
  constructor() {
    this.response = {
      mensaje: {
        codigo: 40,
        descripcion: 'Ocurrió un error en el servidor',
      },
      usuario: {
        id: 0,
        nombre: '',
        userName: '',
        roles: [0],
      },
    };
  }

  // Método para login real que llama al backend
  async verify(userName, password) {
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: userName, contrasena: password }),
      });

      if (!res.ok) {
        // Error HTTP, por ejemplo 401 o 500
        this.response.mensaje.descripcion = 'Usuario o contraseña incorrectos';
        return this.response;
      }

      const data = await res.json();

      // Aquí asumes que el backend devuelve el usuario en data.usuario
      if (data.usuario) {
        this.response = {
          mensaje: {
            codigo: 10,
            descripcion: 'Usuario localizado',
          },
          usuario: data.usuario,
        };
      } else {
        this.response.mensaje.descripcion = 'Usuario o contraseña incorrectos';
      }

      return this.response;
    } catch (error) {
      this.response.mensaje.descripcion = 'Error de conexión al servidor';
      return this.response;
    }
  }

  // Método para registrar usuario
  async register(usuarioData) {
    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        this.response.mensaje.descripcion = errorData.message || 'Error al registrar usuario';
        return this.response;
      }

      const data = await res.json();

      this.response = {
        mensaje: {
          codigo: 10,
          descripcion: 'Usuario registrado con éxito',
        },
        usuario: data.usuario || {},
      };

      return this.response;
    } catch (error) {
      this.response.mensaje.descripcion = 'Error de conexión al servidor';
      return this.response;
    }
  }
}

export default new SessionDS();
