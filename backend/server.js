// server.js - Archivo principal para iniciar la aplicación
const { app } = require('./index');

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor iniciado en http://0.0.0.0:${PORT}`);
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo graceful de señales
process.on('SIGINT', () => {
  console.log('\n📤 Señal SIGINT recibida. Cerrando el servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n📤 Señal SIGTERM recibida. Cerrando el servidor...');
  process.exit(0);
});