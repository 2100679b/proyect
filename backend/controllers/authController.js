const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Ajusta según tu configuración de DB

const registerUser = async (req, res) => {
  const { nombre, segundo_nombre, apellidos, usuario, contrasena } = req.body;

  if (!nombre || !apellidos || !usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    // Revisar si usuario ya existe
    const userExist = await pool.query('SELECT id FROM usuarios WHERE usuario = $1', [usuario]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario
    await pool.query(
      `INSERT INTO usuarios (nombre, segundo_nombre, apellidos, usuario, contrasena_hash, creado_en)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [nombre, segundo_nombre || null, apellidos, usuario, hashedPassword]
    );

    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

module.exports = { registerUser };
