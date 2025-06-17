require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// Importa todas las rutas
const usersRoutes = require('./routes/users');
const dispositivosRoutes = require('./routes/dispositivos'); // Nueva ruta para dispositivos

// Configuración de CORS
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Rutas principales
app.use('/api/users', usersRoutes);
app.use('/api/dispositivos', dispositivosRoutes); // Agregada nueva ruta

// Ruta de verificación de estado
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🚀 Backend activo y funcionando',
    version: '1.0.0',
    entorno: process.env.NODE_ENV || 'development'
  });
});

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error('\x1b[31m', '⚠️ Error:', err.stack); // Log en rojo
  res.status(500).json({ 
    error: 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Exportar la app sin iniciar el servidor
module.exports = app;