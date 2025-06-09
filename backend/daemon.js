// daemon.js
const path = require('path');
let app;

try {
  app = require('./index'); // Cambia a './server' si usas otro archivo como entrada

  // Verificar que app sea una aplicación Express válida
  if (!app || typeof app.listen !== 'function') {
    console.error('❌ Error: El archivo index.js no exporta una aplicación Express válida');
    console.log('💡 Asegúrate de que index.js termine con: module.exports = app;');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error al cargar la aplicación:', error.stack || error.message);
  process.exit(1);
}

// Configuración del puerto y host
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Recomendado para servidores remotos (AWS, EC2, etc.)

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('🔥 Excepción no capturada:', err.stack || err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🔥 Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar el servidor
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor iniciado en http://${HOST}:${PORT}`);
  console.log(`📅 Iniciado el: ${new Date().toLocaleString()}`);
  console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Cierre controlado del servidor
const gracefulShutdown = (signal) => {
  console.log(`\n📤 Señal ${signal} recibida. Cerrando el servidor...`);

  server.close((err) => {
    if (err) {
      console.error('❌ Error al cerrar el servidor:', err);
      process.exit(1);
    }

    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });

  // Forzar cierre si tarda más de 30s
  setTimeout(() => {
    console.error('⏰ Cierre forzado por timeout de 30s');
    process.exit(1);
  }, 30000);
};

// Escuchar señales del sistema
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Exportar servidor para pruebas (opcional)
module.exports = server;
