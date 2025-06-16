// index.js (versión mejorada)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users');
const app = express();

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*', // Especifica el origen en producción
  credentials: true, // Habilita cookies/credenciales si es necesario
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json()); // Parsea solicitudes JSON
app.use(morgan('dev')); // Logs en formato 'dev' (cambia a 'combined' en producción)

// Rutas
app.use('/api/users', usersRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Backend activo y funcionando' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack); // Registra el error en la consola
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ============================
// 🚀 EXPORTA LA APP (NO INICIES EL SERVIDOR)
// ============================
module.exports = app;