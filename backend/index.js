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

// Exportar app y pool
module.exports = { app, pool };