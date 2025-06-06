require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configurar CORS para permitir peticiones desde el frontend
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:8080', 'https://sensational-mermaid-833fd9.netlify.app'];

app.use(cors({
  origin: function(origin, callback) {
    // permitir solicitudes sin origin (como Postman o curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = `El CORS policy no permite acceso desde el origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta prueba
app.get('/api/status', (req, res) => {
  res.json({
    status: 'OK',
    database: process.env.DB_NAME,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
