const db = require('../config/db');

class User {
  static async create(nombre, segundo_nombre, apellidos, usuario, contrasena_hash) {
    const query = `
      INSERT INTO usuarios 
        (nombre, segundo_nombre, apellidos, usuario, contraseña_hash) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, usuario, nombre, apellidos, creado_en
    `;
    const values = [nombre, segundo_nombre, apellidos, usuario, contrasena_hash];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async findByUsername(usuario) {
    const query = 'SELECT * FROM usuarios WHERE usuario = $1';
    const { rows } = await db.query(query, [usuario]);
    return rows[0];
  }
}

module.exports = User;
