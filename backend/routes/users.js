const express = require('express');
const router = express.Router();
const db = require('../db/db');
const bcrypt = require('bcrypt');

// =====================
// REGISTRO
// =====================
router.post('/register', async (req, res) => {
  const { nombre, username, password, roles = [1], registro_usuario = 0 } = req.body;

  try {
    // Verificar si ya existe el username o el nombre
    const existe = await db.query(
      `SELECT * FROM seguridad.usuarios WHERE username = $1 OR nombre = $2`,
      [username, nombre]
    );

    if (existe.rowCount > 0) {
      return res.status(409).json({ error: 'El nombre o el usuario ya existen.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
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

// =====================
// LOGIN
// =====================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM seguridad.usuarios WHERE username = $1',
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    res.json({
      mensaje: `Bienvenido, ${user.nombre}`,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        username: user.username,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
});

// =====================
// LISTADO DE USUARIOS
// =====================
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, nombre, username, roles FROM seguridad.usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
