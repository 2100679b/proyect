const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
  const { nombre, username, password, roles = [1], registro_usuario = 0 } = req.body;

  try {
    await db.query(
      `INSERT INTO seguridad.usuarios (nombre, username, password, roles, registro_usuario)
       VALUES ($1, $2, $3, $4, $5)`,
      [nombre, username, password, roles, registro_usuario]
    );

    res.status(201).json({ mensaje: '✅ Usuario registrado correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Obtener todos los usuarios (opcional)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM seguridad.usuarios');
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
