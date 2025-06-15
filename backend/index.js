require('dotenv').config();

const express = require('express');
const app = express();

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

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  ssl: DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Middleware ejemplo (json body parser)
app.use(express.json());

// Aquí tus rutas (ejemplo)
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

// Exporta app y pool para usar en daemon.js u otros módulos
module.exports = { app, pool };

// ============================
// 🚀 Iniciar servidor
// ============================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  const server = app.listen(PORT, HOST, () => {
    const address = server.address();
    console.log(`🚀 Servidor backend ejecutándose en:`);
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Network:  http://${address.address}:${address.port}`);
    console.log(`   Entorno:  ${NODE_ENV}`);
    console.log(`   Base de datos: ${DB_HOST}`);
    console.log(`📡 Escuchando en todas las interfaces de red disponibles`);
  });

  // Manejo graceful de cierre
  process.on('SIGTERM', () => {
    console.log('🛑 Cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      pool.end();
    });
  });
}
