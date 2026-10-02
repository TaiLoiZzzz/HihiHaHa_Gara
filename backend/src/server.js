const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { checkAllDatabaseConnections } = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'HihiHaha Auto Garage API Server is running',
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`🚀 [HIHIHAHA_AUTO] Backend Server listening on http://localhost:${PORT}`);
    // kiem tra ket noi den ca 4 CSDL polyglot khi khoi dong
    await checkAllDatabaseConnections();
  });
}

module.exports = app;
