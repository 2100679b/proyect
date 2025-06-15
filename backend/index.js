// index.js
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg');

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  DB_SSL,
  NODE_ENV
} = process.env;

// Crear la aplicación Express
const app = express();

// Configurar pool de base de datos
const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  ssl: DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(express.json());

// --- Rutas ---
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

// Test de conexión a BD
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    // ⚠️ Importante: Loggear el error para depuración
    console.error('❌ Error de conexión a la base de datos en /health:', error.message);
    res.status(500).json({
      status: 'ERROR',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// --- RUTA DE REGISTRO (EJEMPLO - DEBES AÑADIR TU LÓGICA COMPLETA) ---
// Aquí es donde probablemente tenías el error 500 original
app.post('/api/register', async (req, res, next) => {
    console.log('📤 Recibiendo solicitud de registro. Datos:', req.body);
    try {
        const { email, password, username } = req.body; // Asumiendo estos campos
        
        // --- VALIDACIÓN Y LÓGICA DE NEGOCIO ---
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'Todos los campos (email, password, username) son requeridos.' });
        }

        // Aquí iría tu lógica real para interactuar con la base de datos (por ejemplo, con `pool.query`)
        // EJEMPLO: Insertar un nuevo usuario (ADAPTA ESTO A TU ESQUEMA Y LÓGICA REAL)
        // const queryText = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
        // const values = [username, email, password]; // Asegúrate de hashear la contraseña en producción
        // const newUserResult = await pool.query(queryText, values);
        // const newUser = newUserResult.rows[0];

        // ** Simulando un error en la base de datos para ver el log **
        // Descomenta la siguiente línea para simular un error 500 y ver cómo se registra
        // throw new Error('Error simulado al guardar en la base de datos.');

        console.log(`✅ Usuario ${username} registrado exitosamente.`);
        res.status(201).json({ message: 'Usuario registrado exitosamente.' /*, user: newUser */ });

    } catch (error) {
        // Pasa el error al middleware de manejo de errores de Express para loggear y responder
        console.error('❌ Error capturado en /api/register:', error);
        next(error); 
    }
});
// --- FIN RUTA DE REGISTRO ---


// --- MIDDLEWARE DE MANEJO DE ERRORES GLOBAL DE EXPRESS ---
// ESTE DEBE SER EL ÚLTIMO app.use() DESPUÉS DE TODAS TUS RUTAS
app.use((err, req, res, next) => {
    // ¡ESTA ES LA LÍNEA CRÍTICA PARA LA DEPURACIÓN!
    console.error('🔥 Error interno del servidor (capturado por middleware):', err.stack || err);

    if (res.headersSent) {
        return next(err);
    }

    const errorMessage = process.env.NODE_ENV === 'production'
        ? 'Ocurrió un error interno del servidor.'
        : err.message;

    res.status(500).json({
        message: errorMessage,
        // Solo envía el stack trace en desarrollo
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});
// --- FIN MIDDLEWARE DE MANEJO DE ERRORES ---


// Ya no iniciamos el servidor aquí, lo hace daemon.js
// El bloque `if (require.main === module)` no es necesario para PM2/daemon
// porque `daemon.js` es quien realmente "inicia" el proceso de Node.js
// cargando este archivo.

// ⚠️ IMPORTANTE: Exporta SÓLO la instancia de Express `app`
module.exports = app;

// Si necesitas el pool en otros módulos, puedes exportarlo separadamente
// o pasar el pool a tus rutas como una dependencia.
// Ejemplo: module.exports.pool = pool; y luego importarlo con require('./index').pool;