// index.js (versión corregida)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users');
const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/users', usersRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Backend activo y funcionando' });
});

// ============================
// 🚀 EXPORTA LA APP (NO INICIES EL SERVIDOR)
// ============================
module.exports = app;