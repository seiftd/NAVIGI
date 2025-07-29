const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/withdrawals
 * @desc    Get user's withdrawal history
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // TODO: Get user withdrawals from Firestore
    const withdrawals = [
      {
        id: 'w1',
        method: 'BINANCE_PAY',
        amount: 50,
        points: 500,
        status: 'APPROVED',
        requestedAt: '2024-01-10T14:30:00Z',
        processedAt: '2024-01-10T20:15:00Z',
        paymentDetails: { email: 'user@example.com' }
      },
      {
        id: 'w2',
        method: 'BARIDIMOB',
        amount: 35,
        points: 350,
        status: 'PENDING',
        requestedAt: '2024-01-15T12:15:00Z',
        paymentDetails: { phoneNumber: '+213555123456', daAmount: 630 }
      }
    ];

    res.json({
      success: true,
      withdrawals,
      totalWithdrawals: withdrawals.length
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
 * @route   POST /api/withdrawals
 * @desc    Create new withdrawal request
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { method, amount, paymentDetails } = req.body;

    if (!method || !amount || !paymentDetails) {
      return res.status(400).json({
        success: false,
        error: 'Method, amount, and payment details are required'
      });
    }

    // Validate minimum amounts
    const minimumAmounts = {
      BINANCE_PAY: 20, // $2 = 20 points
      BARIDIMOB: 55,   // $5.5 = 55 points
      GOOGLE_PLAY: 10, // $1 = 10 points
      FLEXY: 10        // $1 = 10 points
    };

    if (amount < minimumAmounts[method]) {
      return res.status(400).json({
        success: false,
        error: `Minimum withdrawal for ${method} is ${minimumAmounts[method]} points`
      });
    }

    // TODO: Check user balance
    // TODO: Create withdrawal request in Firestore
    // TODO: Send notification to admin

    const newWithdrawal = {
      id: `w_${Date.now()}`,
      userId: req.user.userId,
      method,
      amount,
      points: amount,
      dollarAmount: amount / 10, // 10 points = $1
      status: 'PENDING',
      paymentDetails,
      requestedAt: new Date().toISOString()
    };

    logger.info(`New withdrawal request: ${newWithdrawal.id}`, {
      userId: req.user.userId,
      method,
      amount
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      withdrawal: newWithdrawal
    });

  } catch (error) {
    logger.error('Create withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/withdrawals/methods
 * @desc    Get available withdrawal methods with limits
 * @access  Private
 */
router.get('/methods', authMiddleware, async (req, res) => {
  try {
    const methods = [
      {
        id: 'BINANCE_PAY',
        name: 'Binance Pay',
        description: 'Instant crypto payment',
        minimumPoints: 20,
        minimumDollar: 2,
        processingTime: '8 hours',
        icon: 'binance',
        fields: [
          { name: 'email', label: 'Binance Email', type: 'email', required: true }
        ]
      },
      {
        id: 'BARIDIMOB',
        name: 'BaridiMob',
        description: 'Algeria mobile payment',
        minimumPoints: 55,
        minimumDollar: 5.5,
        processingTime: '8 hours',
        icon: 'baridimob',
        conversionNote: 'DA = (points / 10) * 18',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, placeholder: '+213XXXXXXXXX' }
        ]
      },
      {
        id: 'GOOGLE_PLAY',
        name: 'Google Play Gift Card',
        description: 'Gift cards for Google Play Store',
        minimumPoints: 10,
        minimumDollar: 1,
        processingTime: '8 hours',
        icon: 'google_play',
        note: 'Code sent via notification',
        fields: [
          { name: 'cardValue', label: 'Card Value', type: 'select', required: true, options: [
            { value: 10, label: '$1 (10 points)' },
            { value: 50, label: '$5 (50 points)' },
            { value: 100, label: '$10 (100 points)' },
            { value: 250, label: '$25 (250 points)' },
            { value: 500, label: '$50 (500 points)' }
          ]}
        ]
      },
      {
        id: 'FLEXY',
        name: 'Flexy (Mobilis/Ooredoo)',
        description: 'Algeria mobile credit',
        minimumPoints: 10,
        minimumDollar: 1,
        processingTime: '8 hours',
        icon: 'flexy',
        conversionNote: 'DA = (points / 10) * 18',
        fields: [
          { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, placeholder: '+213XXXXXXXXX' },
          { name: 'carrier', label: 'Carrier', type: 'select', required: true, options: [
            { value: 'MOBILIS', label: 'Mobilis' },
            { value: 'OOREDOO', label: 'Ooredoo' }
          ]}
        ]
      }
    ];

    res.json({
      success: true,
      methods
    });

  } catch (error) {
    logger.error('Get withdrawal methods error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/withdrawals/:id
 * @desc    Get specific withdrawal details
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const withdrawalId = req.params.id;

    // TODO: Get withdrawal from Firestore and verify ownership

    const withdrawal = {
      id: withdrawalId,
      method: 'BINANCE_PAY',
      amount: 50,
      points: 500,
      dollarAmount: 5.0,
      status: 'PENDING',
      requestedAt: '2024-01-15T14:30:00Z',
      paymentDetails: { email: 'user@example.com' },
      adminNotes: ''
    };

    res.json({
      success: true,
      withdrawal
    });

  } catch (error) {
    logger.error('Get withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   DELETE /api/withdrawals/:id
 * @desc    Cancel pending withdrawal
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const withdrawalId = req.params.id;

    // TODO: Check if withdrawal is pending and belongs to user
    // TODO: Cancel withdrawal in Firestore
    // TODO: Refund points to user

    logger.info(`Withdrawal cancelled: ${withdrawalId}`, {
      userId: req.user.userId
    });

    res.json({
      success: true,
      message: 'Withdrawal cancelled successfully'
    });

  } catch (error) {
    logger.error('Cancel withdrawal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * ADMIN ROUTES
 */

/**
 * @route   GET /api/withdrawals/admin
 * @desc    Get all withdrawal requests for admin
 * @access  Admin
 */
router.get('/admin', adminMiddleware, async (req, res) => {
  try {
    const status = req.query.status || 'all';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // TODO: Get withdrawals from Firestore with pagination
    const withdrawals = [
      {
        id: 'w1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        method: 'BINANCE_PAY',
        amount: 50,
        points: 500,
        dollarAmount: 5.0,
        status: 'PENDING',
        requestedAt: '2024-01-15T14:30:00Z',
        paymentDetails: { email: 'john@binance.com' }
      },
      {
        id: 'w2',
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        method: 'BARIDIMOB',
        amount: 110,
        points: 1100,
        dollarAmount: 11.0,
        status: 'APPROVED',
        requestedAt: '2024-01-15T12:15:00Z',
        processedAt: '2024-01-15T18:30:00Z',
        paymentDetails: { phoneNumber: '+213555123456', daAmount: 198 }
      }
    ];

    res.json({
      success: true,
      withdrawals,
      pagination: {
        currentPage: page,
        totalPages: 5,
        totalWithdrawals: 100,
        limit
      }
    });

  } catch (error) {
    logger.error('Get admin withdrawals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/withdrawals/stats
 * @desc    Get withdrawal statistics
 * @access  Admin
 */
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    // TODO: Calculate real stats from Firestore
    const stats = {
      totalWithdrawals: 1250,
      pendingWithdrawals: 15,
      approvedWithdrawals: 1180,
      rejectedWithdrawals: 55,
      totalAmount: 125000,
      pendingAmount: 850,
      avgProcessingTime: '4.2 hours',
      withdrawalsByMethod: {
        BINANCE_PAY: 450,
        BARIDIMOB: 380,
        GOOGLE_PLAY: 250,
        FLEXY: 170
      },
      revenueByMethod: {
        BINANCE_PAY: 45000,
        BARIDIMOB: 38000,
        GOOGLE_PLAY: 25000,
        FLEXY: 17000
      },
      monthlyStats: {
        thisMonth: 85,
        lastMonth: 92,
        growth: '-7.6%'
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Get withdrawal stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;