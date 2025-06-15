require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente!');
});

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor iniciado en http://${HOST}:${PORT}`);
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  console.log('📤 Señal SIGTERM recibida. Cerrando...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📤 Señal SIGINT recibida. Cerrando...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});