// Cargar variables de entorno
require('dotenv').config();

console.log('🔧 Cargando aplicación...');

let app, pool;

try {
  const modules = require('./index');
  app = modules.app;
  pool = modules.pool;
  console.log('✅ Módulos cargados correctamente');
} catch (error) {
  console.error('❌ Error al cargar módulos:', error.message);
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

console.log(`🔧 Configuración:`);
console.log(`   Puerto: ${PORT}`);
console.log(`   Host: ${HOST}`);
console.log(`   Entorno: ${process.env.NODE_ENV || 'development'}`);

let server;

try {
  server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Servidor iniciado en http://${HOST}:${PORT}`);
    console.log(`📅 Iniciado el: ${new Date().toLocaleString()}`);
    console.log(`🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log('');
  });
} catch (error) {
  console.error('❌ Error al iniciar servidor:', error.message);
  process.exit(1);
}

const gracefulShutdown = (signal) => {
  console.log(`\n📤 Señal ${signal} recibida. Cerrando el servidor...`);

  if (!server) {
    console.log('⚠️ No hay servidor para cerrar');
    process.exit(0);
  }

  server.close((err) => {
    if (err) {
      console.error('❌ Error al cerrar el servidor:', err);
      process.exit(1);
    }

    console.log('🔌 Cerrando conexión a la base de datos...');
    
    if (pool) {
      pool.end((poolErr) => {
        if (poolErr) {
          console.error('❌ Error al cerrar la conexión a BD:', poolErr);
        } else {
          console.log('✅ Conexión a BD cerrada');
        }
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    } else {
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    }
  });

  // Timeout de seguridad
  setTimeout(() => {
    console.error('⏰ Cierre forzado tras timeout de 30s');
    process.exit(1);
  }, 30000);
};

// Manejo de señales
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Error no capturado:', err);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});