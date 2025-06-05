// backend/server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en la base de datos' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { nombre, segundo_nombre, apellidos, usuario, contrasena } = req.body;

    // Validar datos básicos
    if (!nombre || !apellidos || !usuario || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

    // Insertar en la tabla usuarios
    const query = `
      INSERT INTO usuarios (nombre, segundo_nombre, apellidos, usuario, contrasena_hash, creado_en)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, usuario
    `;

    const values = [nombre, segundo_nombre || null, apellidos, usuario, contrasena_hash];

    const result = await pool.query(query, values);

    res.status(201).json({ message: 'Usuario registrado', usuario: result.rows[0] });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
