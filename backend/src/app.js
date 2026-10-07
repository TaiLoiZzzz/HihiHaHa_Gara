const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const { sendSuccess } = require('./utils/response');
const { errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

// 1. helmet bao mat http headers (cho phap cdn script cho trang test)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// 2. cors cau hinh cho truyen nhan voi frontend next.js (port 3000) & local html files
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. body parser phan giai json payload (cho phap upload anh base64 10mb)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. morgan request logging ket hop winston
app.use(morgan('combined', { stream: logger.stream }));

// 5. healthcheck endpoint
app.get('/health', (req, res) => {
  return sendSuccess(
    res,
    {
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
    'HihiHaha Auto Garage API Server is running healthy'
  );
});

// 6. phuc vu trang client HTML test truc quan
app.get('/test-api', (req, res) => {
  res.sendFile(path.join(__dirname, '../../test_api.html'));
});

// 7. dang ky router chinh cho RESTful API v1
app.use('/api/v1', routes);

// 8. global error handling middleware
app.use(errorHandler);

module.exports = app;
