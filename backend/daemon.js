// daemon.js
const app = require('./index'); // o './server' si tu backend empieza ahí

// Configuración del puerto con fallback
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Importante para AWS/Docker

// Manejo de errores de la aplicación
process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promesa rechazada no manejada en:', promise, 'razón:', reason);
  process.exit(1);
});

// Iniciar el servidor
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor corriendo en http://${HOST}:${PORT}`);
  console.log(`📅 Iniciado: ${new Date().toISOString()}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo graceful de cierre del servidor
const gracefulShutdown = (signal) => {
  console.log(`\n📤 Recibida señal ${signal}. Cerrando servidor...`);
  
  server.close((err) => {
    if (err) {
      console.error('❌ Error al cerrar servidor:', err);
      process.exit(1);
    }
    
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
  
  // Forzar cierre después de 30 segundos
  setTimeout(() => {
    console.error('⏰ Forzando cierre del servidor por timeout');
    process.exit(1);
  }, 30000);
};

// Escuchar señales de cierre
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Exportar servidor para testing
module.exports = server;