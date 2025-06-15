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

// Rutas
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

// Test de conexión a BD (opcional)
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      database: 'Connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      database: 'Disconnected',
      error: error.message 
    });
  }
});

// Iniciar el servidor solo si este archivo se ejecuta directamente
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor iniciado en http://0.0.0.0:${PORT}`);
    console.log(`📅 ${new Date().toLocaleString()}`);
    console.log(`🌱 Entorno: ${NODE_ENV || 'development'}`);
  });

  // Manejo graceful de señales
  process.on('SIGINT', () => {
    console.log('\n📤 Señal SIGINT recibida. Cerrando el servidor...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n📤 Señal SIGTERM recibida. Cerrando el servidor...');
    process.exit(0);
  });
}

// Exportar app y pool
module.exports = { app, pool };