const express = require('express');
const router = express.Router();
const db = require('../db/db'); // Conexión a PostgreSQL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  const client = await db.connect(); // Para transacción
  try {
    await client.query('BEGIN');

    const hashed = await bcrypt.hash(password, 10);

    // 1. Crear usuario
    const userResult = await client.query(`
      INSERT INTO seguridad.usuarios (nombre, username, password, roles, registro_usuario)
      VALUES ($1, $2, $3, ARRAY[1], 0)
      RETURNING id, nombre, username
    `, [email, username, hashed]);

    const newUser = userResult.rows[0];

    // 2. Crear dispositivo asociado al usuario
    await client.query(`
      INSERT INTO sistemas.dispositivos (nombre, ubicacion, coordenadas, estado, registro_usuario)
      VALUES ($1, $2, $3, 1, $4)
    `, [
      `Dispositivo de ${newUser.nombre}`,
      'Ubicación no especificada',
      '0,0',
      newUser.id
    ]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Usuario y dispositivo creados con éxito',
      user: newUser
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en registro:', error);

    if (error.code === '23505') {
      res.status(409).json({ error: 'El correo ya está registrado' });
    } else {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  } finally {
    client.release();
  }
});

// Login (sin cambios)
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const field = identifier.includes('@') ? 'nombre' : 'username';
    const result = await db.query(
      `SELECT * FROM seguridad.usuarios WHERE ${field} = $1 LIMIT 1`,
      [identifier]
    );

    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, username: user.username, roles: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en inicio de sesión' });
  }
});

module.exports = router;
