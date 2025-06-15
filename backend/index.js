require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*', // Configuración segura de CORS
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
// 🚀 Iniciar servidor (CORRECCIÓN CLAVE)
// ============================
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Eliminamos la condición y siempre iniciamos el servidor aquí
const server = app.listen(PORT, HOST, () => {
  console.log(`✅ Servidor backend ejecutándose en http://${HOST}:${PORT}`);
  console.log(`Prueba con: curl http://127.0.0.1:${PORT}`);
});

// Manejo de errores de inicio
server.on('error', (error) => {
  console.error('❌ ERROR al iniciar servidor:', error);
  
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} está en uso. Intenta con otro puerto.`);
  }
});