const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Para leer variables desde .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false }, // Necesario para AWS RDS
});

const JWT_SECRET = process.env.JWT_SECRET || 'clave_por_defecto';

// 👉 Ruta: Registro de usuario
app.post('/api/register', async (req, res) => {
  const {
    username,
    nombre,
    segundo_nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    contrasena,
  } = req.body;

  if (!username || !nombre || !apellido_paterno || !apellido_materno || !correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1 OR correo = $2',
      [username, correo]
    );

    if (existingUser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'Nombre de usuario o correo ya están registrados' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.query(
      `INSERT INTO usuarios 
        (username, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contrasena)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [username, nombre, segundo_nombre || null, apellido_paterno, apellido_materno, correo, hashedPassword]
    );

    res.json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('❌ Error al registrar:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// 👉 Ruta: Login de usuario
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const userResult = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Correo no registrado' });
    }

    const user = userResult.rows[0];

    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        correo: user.correo,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        nombre: user.nombre,
        correo: user.correo,
      },
    });
  } catch (error) {
    console.error('❌ Error al hacer login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API DBA2 funcionando correctamente',
    timestamp: new Date().toISOString(),
    endpoints: ['/api/register', '/api/login']
  });
});

// IMPORTANTE: Exportar la aplicación en lugar de ejecutar app.listen
module.exports = app;