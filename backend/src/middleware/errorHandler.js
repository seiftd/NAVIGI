const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Catches all errors and sends appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.message}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    stack: err.stack
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      statusCode: 404,
      message
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = {
      statusCode: 400,
      message
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = {
      statusCode: 400,
      message
    };
  }

  // Firebase errors
  if (err.code && err.code.includes('auth/')) {
    const firebaseErrors = {
      'auth/user-not-found': 'User not found',
      'auth/wrong-password': 'Invalid credentials',
      'auth/email-already-in-use': 'Email already registered',
      'auth/weak-password': 'Password is too weak',
      'auth/invalid-email': 'Invalid email address'
    };
    
    error = {
      statusCode: 400,
      message: firebaseErrors[err.code] || 'Authentication error'
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = {
      statusCode: 401,
      message
    };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = {
      statusCode: 401,
      message
    };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const message = `Route ${req.originalUrl} not found`;
  logger.warn(message, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  
  res.status(404).json({
    success: false,
    error: message
  });
};

module.exports = {
  errorHandler,
  notFoundHandler
};