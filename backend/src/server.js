const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import configurations and utilities
const { initializeFirebase } = require('./config/firebase');
const logger = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adRoutes = require('./routes/ads');
const contestRoutes = require('./routes/contests');
const withdrawalRoutes = require('./routes/withdrawals');
const surveyRoutes = require('./routes/surveys');
const referralRoutes = require('./routes/referrals');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

// Import services
const { initializeCronJobs } = require('./services/cronService');
const { initializeSocketService } = require('./services/socketService');

// Initialize Express app
const app = express();
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true'
  }
});

// Initialize services
initializeFirebase();
initializeSocketService(io);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => {
        logger.info(message.trim());
      }
    }
  }));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/ads', authMiddleware, adRoutes);
app.use('/api/contests', authMiddleware, contestRoutes);
app.use('/api/withdrawals', authMiddleware, withdrawalRoutes);
app.use('/api/surveys', authMiddleware, surveyRoutes);
app.use('/api/referrals', authMiddleware, referralRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// Static files (for uploaded images, etc.)
app.use('/uploads', express.static('uploads'));

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'NAVIGI (SBARO) API',
    version: '1.0.0',
    description: 'Backend API for ads rewards app with referral system',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      ads: '/api/ads',
      contests: '/api/contests',
      withdrawals: '/api/withdrawals',
      referrals: '/api/referrals',
      admin: '/api/admin',
      notifications: '/api/notifications'
    },
    documentation: 'https://api-docs.navigi.com'
  });
});

// 404 handler for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in production, just log the error
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  logger.info(`🚀 NAVIGI Backend Server is running on http://${HOST}:${PORT}`);
  logger.info(`📚 API Documentation: http://${HOST}:${PORT}/api`);
  logger.info(`🏥 Health Check: http://${HOST}:${PORT}/health`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
  
  // Initialize cron jobs after server starts
  initializeCronJobs();
  
  logger.info('✅ Server initialization complete');
});

// Make io available to other modules
app.set('io', io);

module.exports = { app, server, io };