// daemon.js
require('dotenv').config(); // Asegura que .env esté cargado incluso si se llama directamente
const path = require('path');
let app;

try {
  app = require('./index'); // Asegúrate que index.js haga: module.exports = app;

  if (!app || typeof app.listen !== 'function') {
    console.error('❌ Error: index.js no exporta una instancia válida de Express.');
    console.log('💡 Verifica que termine con: module.exports = app;');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error al importar la aplicación:', error.stack || error.message);
  process.exit(1);
}

// Configuración del servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor backend escuchando en http://${HOST}:${PORT}`);
  console.log(`📅 Inicio: ${new Date().toLocaleString()}`);
  console.log(`🌎 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de errores globales
process.on('uncaughtException', (err) => {
  console.error('🔥 uncaughtException:', err.stack || err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 unhandledRejection:', reason);
  process.exit(1);
});

// Cierre controlado
const gracefulShutdown = (signal) => {
  console.log(`\n📤 Señal ${signal} recibida. Cerrando servidor...`);

  server.close((err) => {
    if (err) {
      console.error('❌ Error al cerrar:', err);
      process.exit(1);
    }
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('⏰ Cierre forzado tras 30s');
    process.exit(1);
  }, 30000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = server;
