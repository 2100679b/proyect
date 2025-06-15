// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users'); // Rutas de usuarios
// Puedes importar más rutas aquí...

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/users', usersRoutes); // Ruta base: /api/users/register, etc.

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Backend activo y funcionando' });
});

module.exports = app; // ¡IMPORTANTE! Para que daemon.js lo use


// ============================
// 🚀 Iniciar servidor
// ============================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '0.0.0.0'; // Escucha en todas las IPs

  app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor backend ejecutándose en http://${HOST}:${PORT}`);
  });
}