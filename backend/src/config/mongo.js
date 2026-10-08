const mongoose = require('mongoose');
require('dotenv').config();

// ket noi den mongodb database
const connectMongo = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hihihaha_db';
    const conn = await mongoose.connect(mongoUri);
    console.log(` [MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(' [MongoDB] Connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectMongo };
