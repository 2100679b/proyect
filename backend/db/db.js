// backend/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.c56mgcmugada.us-west-1.rds.amazonaws.com',
  database: 'login_db',
  password: 'postgres',
  port: 5432, // o el puerto que uses
});

module.exports = pool;
