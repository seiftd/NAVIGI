const express = require('express');
const { adminMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/admin/stats
 * @desc    Get admin dashboard statistics
 * @access  Admin
 */
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    // TODO: Calculate real stats from Firestore
    const stats = {
      users: {
        total: 10847,
        active: 8239,
        newToday: 45,
        newThisWeek: 312
      },
      revenue: {
        totalEarnings: 52490,
        adminShare: 15747,
        userShare: 36743,
        thisMonth: 8500
      },
      ads: {
        totalWatched: 156743,
        todayWatched: 2847,
        revenue: 15674.30
      },
      withdrawals: {
        pending: 15,
        pendingAmount: 850,
        completedThisMonth: 125,
        completedAmount: 6250
      },
      contests: {
        active: 3,
        totalPrizePool: 2500,
        participants: 1247
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination
 * @access  Admin
 */
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';

    // TODO: Get users from Firestore with pagination
    const users = [
      {
        id: 'user1',
        email: 'user1@example.com',
        displayName: 'John Doe',
        sbaroPoints: 150,
        totalEarnings: 15.0,
        adsWatched: 25,
        referralCode: 'SBARO-1234',
        isActive: true,
        createdAt: '2024-01-10'
      },
      {
        id: 'user2',
        email: 'user2@example.com',
        displayName: 'Jane Smith',
        sbaroPoints: 200,
        totalEarnings: 20.0,
        adsWatched: 35,
        referralCode: 'SBARO-5678',
        isActive: true,
        createdAt: '2024-01-12'
      }
    ];

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: 5,
        totalUsers: 100,
        limit
      }
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/admin/withdrawals
 * @desc    Get all withdrawal requests
 * @access  Admin
 */
router.get('/withdrawals', adminMiddleware, async (req, res) => {
  try {
    const status = req.query.status || 'all';

    // TODO: Get withdrawals from Firestore
    const withdrawals = [
      {
        id: 'w1',
        userId: 'user1',
        userName: 'John Doe',
        method: 'BINANCE_PAY',
        amount: 50,
        points: 500,
        status: 'PENDING',
        requestedAt: '2024-01-15T14:30:00Z',
        paymentDetails: { email: 'john@example.com' }
      },
      {
        id: 'w2',
        userId: 'user2',
        userName: 'Jane Smith',
        method: 'BARIDIMOB',
        amount: 35,
        points: 350,
        status: 'APPROVED',
        requestedAt: '2024-01-15T12:15:00Z',
        paymentDetails: { phoneNumber: '+213555123456' }
      }
    ];

    res.json({
      success: true,
      withdrawals
    });

  } catch (error) {
    logger.error('Get withdrawals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/admin/withdrawals/:id/approve
 * @desc    Approve withdrawal request
 * @access  Admin
 */
router.put('/withdrawals/:id/approve', adminMiddleware, async (req, res) => {
  try {
    const withdrawalId = req.params.id;

    // TODO: Update withdrawal status in Firestore
    // TODO: Send notification to user

    logger.info(`Withdrawal approved: ${withdrawalId} by admin: ${req.admin.email}`);

    res.json({
      success: true,
      message: 'Withdrawal approved successfully'
    });

  } catch (error) {
    logger.error('Approve withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/admin/withdrawals/:id/reject
 * @desc    Reject withdrawal request
 * @access  Admin
 */
router.put('/withdrawals/:id/reject', adminMiddleware, async (req, res) => {
  try {
    const withdrawalId = req.params.id;
    const { reason } = req.body;

    // TODO: Update withdrawal status in Firestore
    // TODO: Send notification to user

    logger.info(`Withdrawal rejected: ${withdrawalId} by admin: ${req.admin.email}`, { reason });

    res.json({
      success: true,
      message: 'Withdrawal rejected successfully'
    });

  } catch (error) {
    logger.error('Reject withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/admin/notifications
 * @desc    Send notification to users
 * @access  Admin
 */
router.post('/notifications', adminMiddleware, async (req, res) => {
  try {
    const { title, message, recipients, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    // TODO: Send FCM notification
    
    logger.info(`Notification sent by admin: ${req.admin.email}`, {
      title,
      recipients: recipients || 'all'
    });

    res.json({
      success: true,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    logger.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/admin/vip-approvals
 * @desc    Process VIP upgrade payment approval
 * @access  Admin
 */
router.post('/vip-approvals', adminMiddleware, async (req, res) => {
  try {
    const { userEmail, transactionHash, vipTier, price, approved } = req.body;

    if (!userEmail || !transactionHash || !vipTier) {
      return res.status(400).json({
        success: false,
        error: 'User email, transaction hash, and VIP tier are required'
      });
    }

    // TODO: Update user VIP status in Firestore
    // TODO: Send notification to user
    
    if (approved) {
      // Upgrade user to VIP tier
      logger.info(`VIP upgrade approved for ${userEmail} to ${vipTier}`, {
        transactionHash,
        price,
        adminEmail: req.admin.email
      });

      // TODO: Send success notification to user
    } else {
      logger.info(`VIP upgrade rejected for ${userEmail}`, {
        transactionHash,
        reason: req.body.reason || 'Payment not verified'
      });

      // TODO: Send rejection notification to user
    }

    res.json({
      success: true,
      message: approved ? 'VIP upgrade approved successfully' : 'VIP upgrade rejected'
    });

  } catch (error) {
    logger.error('VIP approval error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/admin/vip-requests
 * @desc    Get pending VIP upgrade requests
 * @access  Admin
 */
router.get('/vip-requests', adminMiddleware, async (req, res) => {
  try {
    // TODO: Get VIP requests from Firestore
    const vipRequests = [
      {
        id: 'vip1',
        userEmail: 'user@example.com',
        transactionHash: '0x1234567890abcdef',
        vipTier: 'EMPEROR TIER',
        price: '$9',
        requestedAt: '2024-01-15T14:30:00Z',
        status: 'PENDING'
      },
      {
        id: 'vip2',
        userEmail: 'user2@example.com',
        transactionHash: '0xabcdef1234567890',
        vipTier: 'KING TIER',
        price: '$2.5',
        requestedAt: '2024-01-15T12:15:00Z',
        status: 'PENDING'
      }
    ];

    res.json({
      success: true,
      vipRequests
    });

  } catch (error) {
    logger.error('Get VIP requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;