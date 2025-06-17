require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users');

// CORS - Agregar tu dominio de Netlify
const corsOptions = {
  origin: [
    process.env.FRONTEND_ORIGIN || '*',
    'https://protipweb.netlify.app',
    'http://localhost:5173' // Para desarrollo local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// ✅ CORREGIR: cambiar de '/api/users' a '/api'
app.use('/api', usersRoutes);

app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🚀 Backend activo y funcionando',
    routes: [
      'POST /api/register',
      'POST /api/login',
      'GET /api/dispositivos',
      'GET /api/perfil'
    ]
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Solo exportar la app, SIN iniciar el servidor (como ya tienes)
module.exports = app;