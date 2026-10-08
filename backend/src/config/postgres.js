const { Pool } = require('pg');
require('dotenv').config();

// khoi tao connection pool postgres
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'hihihaha_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// hàm thuc thi query tien loi
const query = (text, params) => pool.query(text, params);

// ham test ket noi khi startup
const checkPostgresConnection = async () => {
  try {
    const res = await pool.query('SELECT NOW() AS current_time');
    console.log(` [PostgreSQL] Connected successfully to ${process.env.PG_DATABASE} at ${res.rows[0].current_time}`);
    return true;
  } catch (err) {
    console.error(' [PostgreSQL] Connection failed:', err.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  checkPostgresConnection,
};
