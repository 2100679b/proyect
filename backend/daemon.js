const { app, pool } = require('./index');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor iniciado en http://${HOST}:${PORT}`);
});

const gracefulShutdown = (signal) => {
  console.log(`\n📤 Señal ${signal} recibida. Cerrando el servidor...`);

  server.close((err) => {
    if (err) {
      console.error('❌ Error al cerrar el servidor:', err);
      process.exit(1);
    }

    pool.end(() => {
      console.log('✅ Conexión a BD cerrada');
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.error('⏰ Cierre forzado tras timeout de 30s');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
