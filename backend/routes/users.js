const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');

// Registro de usuario
router.post('/register', async (req, res) => {
  const {
    username,
    nombre,
    segundo_nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    contrasena
  } = req.body;

  try {
    // Verifica si ya existe el usuario o correo
    const check = await db.query(
      `SELECT id FROM seguridad.usuarios WHERE username = $1 OR nombre = $2`,
      [username, `${nombre} ${apellido_paterno} ${apellido_materno}`]
    );

    if (check.rows.length > 0) {
      return res.status(409).json({ mensaje: 'El usuario o nombre ya existe' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar usuario
    await db.query(
      `INSERT INTO seguridad.usuarios (
        username, nombre, password, roles, registro_usuario
      ) VALUES ($1, $2, $3, $4, $5)`,
      [
        username,
        `${nombre} ${apellido_paterno} ${apellido_materno}`,
        hashedPassword,
        [1], // rol por defecto
        0    // registrado por el sistema
      ]
    );

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error del servidor al registrar usuario' });
  }
});

module.exports = router;
