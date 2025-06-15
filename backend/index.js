// ============================
// 🚀 Iniciar servidor
// ============================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || '0.0.0.0';
  
  const server = app.listen(PORT, HOST, () => {
    const address = server.address();
    console.log(`🚀 Servidor backend ejecutándose en:`);
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Network:  http://${address.address}:${address.port}`);
    console.log(`   Entorno:  ${NODE_ENV}`);
    console.log(`   Base de datos: ${DB_HOST}`);
    console.log(`📡 Escuchando en todas las interfaces de red disponibles`);
  });

  // Manejo graceful de cierre
  process.on('SIGTERM', () => {
    console.log('🛑 Cerrando servidor...');
    server.close(() => {
      console.log('✅ Servidor cerrado correctamente');
      pool.end();
    });
  });
}