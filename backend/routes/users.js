const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { nombre, username, password, roles = [1], registro_usuario = 0 } = req.body;

  try {
    // Validar si 'nombre' o 'username' ya existen (evitar error por UNIQUE)
    const nombreExist = await db.query(
      'SELECT 1 FROM seguridad.usuarios WHERE nombre = $1',
      [nombre]
    );
    if (nombreExist.rowCount > 0) {
      return res.status(409).json({ error: 'El nombre ya está registrado' });
    }

    const usernameExist = await db.query(
      'SELECT 1 FROM seguridad.usuarios WHERE username = $1',
      [username]
    );
    if (usernameExist.rowCount > 0) {
      return res.status(409).json({ error: 'El username ya está en uso' });
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO seguridad.usuarios (nombre, username, password, roles, registro_usuario)
       VALUES ($1, $2, $3, $4, $5)`,
      [nombre, username, hashedPassword, roles, registro_usuario]
    );

    res.status(201).json({ mensaje: '✅ Usuario registrado correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;
