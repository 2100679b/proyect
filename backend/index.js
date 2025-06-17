require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users');

// CORS
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/users', usersRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: '🚀 Backend activo y funcionando' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ❌ QUITAR ESTAS LÍNEAS - El daemon.js se encarga de esto
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 Backend escuchando en puerto ${PORT}`);
// });

// ✅ Solo exportar la app, SIN iniciar el servidor
module.exports = app;