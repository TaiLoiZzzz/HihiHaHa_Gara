const mongoose = require('mongoose');
const { Pool } = require('pg');
const Redis = require('ioredis');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hihihaha_db');
  console.log('MongoDB: SUCCESS');

  const pool = new Pool({ host: '127.0.0.1', port: 54321, user: 'postgres', password: 'postgres', database: 'hihihaha_db' });
  const res = await pool.query('SELECT current_database(), now()');
  console.log('Postgres: SUCCESS ->', res.rows[0].current_database);
  await pool.end();

  const redis = new Redis({ host: '127.0.0.1', port: 6379 });
  const pong = await redis.ping();
  console.log('Redis: SUCCESS ->', pong);
  await redis.quit();
  process.exit(0);
}
check().catch(e => { console.error('ERR:', e); process.exit(1); });
