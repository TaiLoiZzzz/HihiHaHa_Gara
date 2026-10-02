const logger = require('../utils/logger');

// lop custom exception
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// middleware xu ly loi tap trung
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Lỗi nội bộ hệ thống';
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';
  let details = err.details || null;

  // xu ly mongoose cast error (invalid id)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Dữ liệu không hợp lệ cho trường ${err.path}`;
    errorCode = 'BAD_REQUEST';
  }

  // xu ly mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    errorCode = 'VALIDATION_ERROR';
  }

  // xu ly jwt errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Mã xác thực JWT không hợp lệ';
    errorCode = 'INVALID_TOKEN';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Mã xác thực JWT đã hết hạn';
    errorCode = 'TOKEN_EXPIRED';
  }

  // log error ngoai le
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${statusCode} ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errorCode,
    details,
  });
};

module.exports = {
  AppError,
  errorHandler,
};
