// backend/db/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),  // Asegurarse que el puerto sea número
});

// Intentar conectar y manejar error con async/await para claridad
(async () => {
  try {
    await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa');
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err);
  }
})();

module.exports = pool;
