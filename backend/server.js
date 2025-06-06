require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:8080', // URL frontend Vue
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas
app.use('/api', authRoutes);

// Ruta de prueba
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK',
    database: process.env.DB_NAME,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
