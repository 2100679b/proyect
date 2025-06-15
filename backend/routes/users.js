const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.post('/register', async (req, res) => {
  const { username, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contrasena } = req.body;

  try {
    await db.query(
      `INSERT INTO usuarios (username, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contrasena)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [username, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contrasena]
    );
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
