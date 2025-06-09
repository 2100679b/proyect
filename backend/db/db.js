// db/db.js
require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(() => console.log('✅ Conectado a PostgreSQL en', process.env.DB_HOST))
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:');
    console.error(err);
    process.exit(1); // Salir si no hay conexión
  });

module.exports = pool;
