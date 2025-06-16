const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Conexión a PostgreSQL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await db.query(`
      INSERT INTO seguridad.usuarios (nombre, username, password, roles)
      VALUES ($1, $2, $3, ARRAY[1])
      RETURNING id, nombre, username
    `, [email, username, hashed]);

    res.status(201).json({ message: 'Usuario registrado con éxito', user: result.rows[0] });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const field = identifier.includes('@') ? 'nombre' : 'username';
    const result = await db.query(
      `SELECT * FROM seguridad.usuarios WHERE ${field} = $1`,
      [identifier]
    );

    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login exitoso', token, user: { id: user.id, nombre: user.nombre, username: user.username } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en inicio de sesión' });
  }
});

module.exports = router;
