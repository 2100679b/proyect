// backend/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// ============================
// 🔧 Cargar configuración
// ============================
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_SSL,
  FRONTEND_ORIGIN,
  JWT_SECRET = 'clave_por_defecto',
  NODE_ENV = 'development'
} = process.env;

const isProduction = NODE_ENV === 'production';
const sslOption = DB_SSL === 'true' ? { rejectUnauthorized: false } : false;

// ============================
// 🗄️ Crear conexión a PostgreSQL
// ============================
const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT || 5432,
  ssl: sslOption
});

// Conexión de prueba
pool.connect()
  .then(client => {
    console.log('✅ Conectado correctamente a PostgreSQL');
    console.log('🌐 Host:', DB_HOST);
    client.release();
  })
  .catch(err => {
    console.error('❌ Error al conectar con PostgreSQL:');
    console.error(err);
    process.exit(1); // Detener ejecución si falla conexión
  });

// ============================
// 🧩 Middlewares
// ============================
app.use(cors({
  origin: FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ============================
// 📦 Rutas: Registro
// ============================
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
    const { rows } = await pool.query(
      'SELECT 1 FROM usuarios WHERE username = $1 OR correo = $2',
      [username, correo]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: 'Nombre de usuario o correo ya registrados' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.query(
      `INSERT INTO usuarios 
        (username, nombre, segundo_nombre, apellido_paterno, apellido_materno, correo, contrasena)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [username, nombre, segundo_nombre || null, apellido_paterno, apellido_materno, correo, hashedPassword]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ============================
// 🔐 Ruta login
// ============================
app.post('/api/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Correo no registrado' });
    }

    const user = rows[0];
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

// ============================
// 🧪 Ruta de prueba
// ============================
app.get('/', (req, res) => {
  res.json({
    message: '✅ API DBA2 funcionando correctamente',
    entorno: NODE_ENV,
    conectadoA: DB_HOST,
    timestamp: new Date().toISOString(),
    endpoints: ['/api/register', '/api/login'],
  });
});

// ============================
// 🚀 Iniciar servidor
// ============================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor backend en http://localhost:${PORT}`);
  });
}

module.exports = app;
