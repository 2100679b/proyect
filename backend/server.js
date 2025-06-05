const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db/db'); // tu conexión a la DB

const app = express();

app.use(cors());
app.use(express.json());

// Tu endpoint de registro:
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, segundo_nombre, apellidos, usuario, contrasena } = req.body;

    if (!nombre || !apellidos || !usuario || !contrasena) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    const saltRounds = 10;
    const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

    const query = `
      INSERT INTO usuarios (nombre, segundo_nombre, apellidos, usuario, contrasena_hash)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, usuario
    `;

    const values = [nombre, segundo_nombre || null, apellidos, usuario, contrasena_hash];
    const result = await pool.query(query, values);

    res.status(201).json({ mensaje: 'Usuario registrado', usuario: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') { // usuario duplicado
      res.status(409).json({ error: 'El usuario ya existe' });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
