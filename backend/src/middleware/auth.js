const jwt = require('jsonwebtoken');
const { getAuth } = require('../config/firebase');
const logger = require('../utils/logger');

/**
 * Middleware to verify JWT token
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided, access denied'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    logger.info(`User authenticated: ${decoded.userId}`, {
      userId: decoded.userId,
      method: req.method,
      url: req.url
    });
    
    next();
  } catch (error) {
    logger.error('Authentication failed', {
      error: error.message,
      method: req.method,
      url: req.url,
      ip: req.ip
    });
    
    res.status(401).json({
      success: false,
      error: 'Invalid token, access denied'
    });
  }
};

/**
 * Middleware to verify Firebase ID token
 */
const firebaseAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No Firebase token provided'
      });
    }

    // Verify Firebase ID token
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    logger.info(`Firebase user authenticated: ${decodedToken.uid}`, {
      userId: decodedToken.uid,
      email: decodedToken.email,
      method: req.method,
      url: req.url
    });
    
    next();
  } catch (error) {
    logger.error('Firebase authentication failed', {
      error: error.message,
      method: req.method,
      url: req.url,
      ip: req.ip
    });
    
    res.status(401).json({
      success: false,
      error: 'Invalid Firebase token'
    });
  }
};

/**
 * Middleware to verify admin access
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No admin token provided'
      });
    }

    // Verify admin JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin
    if (!decoded.isAdmin || decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    
    req.admin = decoded;
    
    logger.info(`Admin authenticated: ${decoded.email}`, {
      adminEmail: decoded.email,
      method: req.method,
      url: req.url
    });
    
    next();
  } catch (error) {
    logger.error('Admin authentication failed', {
      error: error.message,
      method: req.method,
      url: req.url,
      ip: req.ip
    });
    
    res.status(401).json({
      success: false,
      error: 'Invalid admin token'
    });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};

module.exports = {
  authMiddleware,
  firebaseAuthMiddleware,
  adminMiddleware,
  optionalAuthMiddleware
};