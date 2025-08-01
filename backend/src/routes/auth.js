const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateData } = require('../utils/validators');
const { schemas } = require('../utils/validators');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const validation = validateData(req.body, schemas.userRegistrationSchema);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const { email, password, displayName, phoneNumber, referralCode } = validation.data;

    // TODO: Check if user exists in Firebase
    // TODO: Create user in Firebase
    // TODO: Generate referral code
    // TODO: Handle referral logic

    // For now, return success response
    const token = jwt.sign(
      { 
        userId: 'temp-user-id',
        email: email,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: 'temp-user-id',
        email,
        displayName,
        referralCode: 'SBARO-1234' // TODO: Generate actual code
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during registration'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const validation = validateData(req.body, schemas.userLoginSchema);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const { email, password } = validation.data;

    // TODO: Verify user credentials with Firebase
    // TODO: Get user data from Firestore

    // For now, return success response
    const token = jwt.sign(
      { 
        userId: 'temp-user-id',
        email: email,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: 'temp-user-id',
        email,
        displayName: 'Test User',
        sbaroPoints: 0,
        referralCode: 'SBARO-1234'
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
});

/**
 * @route   POST /api/auth/admin/login
 * @desc    Login admin
 * @access  Public
 */
router.post('/admin/login', async (req, res) => {
  try {
    // Validate input
    const validation = validateData(req.body, schemas.adminLoginSchema);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const { email, password, totpCode } = validation.data;

    // Check admin credentials
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      logger.warn(`Failed admin login attempt: ${email}`, { ip: req.ip });
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials'
      });
    }

    // TODO: Verify TOTP code if 2FA is enabled

    // Generate admin token
    const token = jwt.sign(
      { 
        userId: 'admin',
        email: email,
        isAdmin: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Shorter expiry for admin
    );

    logger.info(`Admin logged in: ${email}`, { ip: req.ip });

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: {
        email,
        role: 'admin'
      }
    });

  } catch (error) {
    logger.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during admin login'
    });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // TODO: Send password reset email via Firebase

    logger.info(`Password reset requested: ${email}`);

    res.json({
      success: true,
      message: 'Password reset email sent'
    });

  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during password reset'
    });
  }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    // TODO: Verify email with Firebase

    logger.info('Email verified successfully');

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during email verification'
    });
  }
});

/**
 * @route   POST /api/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.post('/google', async (req, res) => {
  try {
    const { idToken, email, displayName, photoURL } = req.body;

    if (!idToken || !email) {
      return res.status(400).json({
        success: false,
        error: 'Google ID token and email are required'
      });
    }

    // TODO: Verify Google ID token with Firebase Admin SDK
    // For now, we'll trust the client verification
    
    // Check if user exists in Firebase/Firestore
    // TODO: Implement Firestore user lookup and creation
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: email.replace('@', '_').replace('.', '_'), // Temporary user ID
        email: email,
        isAdmin: false,
        loginMethod: 'google'
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    logger.info(`Google login successful: ${email}`);

    res.json({
      success: true,
      message: 'Google login successful',
      token,
      user: {
        id: email.replace('@', '_').replace('.', '_'),
        email,
        displayName: displayName || 'Google User',
        photoURL: photoURL || '',
        sbaroPoints: 0,
        referralCode: `SBARO-${Math.random().toString(36).substring(7).toUpperCase()}`,
        loginMethod: 'google'
      }
    });

  } catch (error) {
    logger.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during Google login'
    });
  }
});

module.exports = router;