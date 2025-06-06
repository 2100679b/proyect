const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.c56mgcmugada.us-west-1.rds.amazonaws.com',
  database: 'login_db',
  password: 'postgres',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('✅ Conectado a PostgreSQL. Hora actual:', res.rows[0].now);
    console.log(`📊 Base de datos: ${pool.options.database}`);
  }
});

module.exports = pool;
