const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/referrals
 * @desc    Get user's referral information
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // TODO: Get user referral data from Firestore
    const referralData = {
      myReferralCode: 'SBARO-1234',
      referredByCode: '',
      referredByUser: null,
      directReferrals: [
        {
          id: 'user1',
          displayName: 'John Doe',
          email: 'john@example.com',
          joinedAt: '2024-01-10T14:30:00Z',
          totalEarnings: 50.0,
          adsWatched: 75,
          commissionEarned: 2.5, // 5% of their earnings
          status: 'active'
        },
        {
          id: 'user2',
          displayName: 'Jane Smith',
          email: 'jane@example.com',
          joinedAt: '2024-01-12T16:45:00Z',
          totalEarnings: 30.0,
          adsWatched: 45,
          commissionEarned: 1.5,
          status: 'active'
        }
      ],
      indirectReferrals: [
        {
          id: 'user3',
          displayName: 'Bob Wilson',
          email: 'bob@example.com',
          joinedAt: '2024-01-15T10:20:00Z',
          totalEarnings: 20.0,
          adsWatched: 30,
          commissionEarned: 0.6, // 3% of their earnings
          referredBy: 'user1', // Referred by John Doe
          status: 'active'
        }
      ],
      statistics: {
        totalDirectReferrals: 2,
        totalIndirectReferrals: 1,
        totalCommissionEarned: 4.6,
        totalCommissionPoints: 46, // Commission converted to points
        thisMonthCommission: 2.1,
        lifetimeCommission: 4.6
      }
    };

    res.json({
      success: true,
      referralData
    });

  } catch (error) {
    logger.error('Get referrals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/referrals/validate
 * @desc    Validate referral code during registration
 * @access  Public
 */
router.post('/validate', async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({
        success: false,
        error: 'Referral code is required'
      });
    }

    // Validate referral code format
    const referralCodeRegex = /^SBARO-[A-Z0-9]{4}$/;
    if (!referralCodeRegex.test(referralCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid referral code format'
      });
    }

    // TODO: Check if referral code exists in Firestore
    // For now, simulate validation
    const isValid = referralCode !== 'SBARO-XXXX'; // Simulate invalid code

    if (!isValid) {
      return res.status(404).json({
        success: false,
        error: 'Referral code not found'
      });
    }

    // TODO: Get referrer user info from Firestore
    const referrerInfo = {
      id: 'referrer123',
      displayName: 'John Doe',
      email: 'john@example.com',
      totalReferrals: 5
    };

    logger.info(`Referral code validated: ${referralCode}`);

    res.json({
      success: true,
      message: 'Valid referral code',
      referrerInfo
    });

  } catch (error) {
    logger.error('Validate referral error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/referrals/claim
 * @desc    Claim referral bonus (for new user)
 * @access  Private
 */
router.post('/claim', authMiddleware, async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res.status(400).json({
        success: false,
        error: 'Referral code is required'
      });
    }

    // TODO: Process referral claim in Firestore
    // TODO: Award bonus points to both referrer and referee
    // TODO: Update referral relationships

    const bonusPoints = 50; // Welcome bonus for new user

    logger.info(`Referral claimed: ${referralCode} by user: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Referral bonus claimed successfully',
      bonusPoints,
      referralCode
    });

  } catch (error) {
    logger.error('Claim referral error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/referrals/tree
 * @desc    Get referral tree visualization data
 * @access  Private
 */
router.get('/tree', authMiddleware, async (req, res) => {
  try {
    // TODO: Build referral tree from Firestore
    const referralTree = {
      root: {
        id: req.user.userId,
        displayName: 'You',
        code: 'SBARO-1234',
        level: 0,
        totalEarnings: 0,
        commission: 0
      },
      children: [
        {
          id: 'user1',
          displayName: 'John D.',
          code: 'SBARO-5678',
          level: 1,
          totalEarnings: 50.0,
          commission: 2.5,
          joinedAt: '2024-01-10',
          children: [
            {
              id: 'user3',
              displayName: 'Bob W.',
              code: 'SBARO-9012',
              level: 2,
              totalEarnings: 20.0,
              commission: 0.6,
              joinedAt: '2024-01-15',
              children: []
            }
          ]
        },
        {
          id: 'user2',
          displayName: 'Jane S.',
          code: 'SBARO-3456',
          level: 1,
          totalEarnings: 30.0,
          commission: 1.5,
          joinedAt: '2024-01-12',
          children: []
        }
      ]
    };

    res.json({
      success: true,
      referralTree
    });

  } catch (error) {
    logger.error('Get referral tree error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/referrals/leaderboard
 * @desc    Get referral leaderboard
 * @access  Private
 */
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    // TODO: Get top referrers from Firestore
    const leaderboard = [
      {
        rank: 1,
        userId: 'top1',
        displayName: 'Ahmed M.',
        totalReferrals: 45,
        totalCommission: 125.50,
        badge: 'platinum'
      },
      {
        rank: 2,
        userId: 'top2',
        displayName: 'Sarah K.',
        totalReferrals: 32,
        totalCommission: 89.25,
        badge: 'gold'
      },
      {
        rank: 3,
        userId: 'top3',
        displayName: 'Mohamed L.',
        totalReferrals: 28,
        totalCommission: 76.80,
        badge: 'gold'
      },
      {
        rank: 15,
        userId: req.user.userId,
        displayName: 'You',
        totalReferrals: 3,
        totalCommission: 4.6,
        badge: 'bronze'
      }
    ];

    res.json({
      success: true,
      leaderboard,
      userRank: 15,
      totalParticipants: 1250
    });

  } catch (error) {
    logger.error('Get referral leaderboard error:', error);
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
 * @route   GET /api/referrals/admin
 * @desc    Get all referral data for admin
 * @access  Admin
 */
router.get('/admin', adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // TODO: Get referral data from Firestore with pagination
    const referrals = [
      {
        id: 'user1',
        displayName: 'John Doe',
        email: 'john@example.com',
        referralCode: 'SBARO-1234',
        directReferrals: 5,
        indirectReferrals: 12,
        totalCommission: 15.75,
        lifetimeCommission: 45.50,
        joinedAt: '2024-01-05T10:00:00Z',
        lastActive: '2024-01-15T14:30:00Z'
      },
      {
        id: 'user2',
        displayName: 'Jane Smith',
        email: 'jane@example.com',
        referralCode: 'SBARO-5678',
        directReferrals: 3,
        indirectReferrals: 7,
        totalCommission: 8.25,
        lifetimeCommission: 23.80,
        joinedAt: '2024-01-08T16:20:00Z',
        lastActive: '2024-01-15T12:15:00Z'
      }
    ];

    res.json({
      success: true,
      referrals,
      pagination: {
        currentPage: page,
        totalPages: 25,
        totalUsers: 500,
        limit
      }
    });

  } catch (error) {
    logger.error('Get admin referrals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/referrals/stats
 * @desc    Get referral system statistics
 * @access  Admin
 */
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    // TODO: Calculate real stats from Firestore
    const stats = {
      totalUsers: 10847,
      usersWithReferrals: 2450,
      totalReferralRelationships: 3890,
      totalCommissionPaid: 15750.80,
      avgReferralsPerUser: 1.6,
      conversionRate: 22.6, // % of users who refer others
      topReferrer: {
        id: 'top1',
        displayName: 'Ahmed M.',
        totalReferrals: 45,
        commission: 125.50
      },
      commissionsPerLevel: {
        level1: 12890.50, // 5% commissions
        level2: 2860.30   // 3% commissions
      },
      referralsByMonth: {
        thisMonth: 125,
        lastMonth: 145,
        growth: '-13.8%'
      },
      commissionsByMonth: {
        thisMonth: 850.25,
        lastMonth: 920.50,
        growth: '-7.6%'
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Get referral stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/referrals/admin/:userId/bonus
 * @desc    Award bonus commission to user
 * @access  Admin
 */
router.put('/admin/:userId/bonus', adminMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid bonus amount is required'
      });
    }

    // TODO: Award bonus commission in Firestore
    // TODO: Send notification to user

    logger.info(`Bonus commission awarded by admin: ${req.admin.email}`, {
      userId,
      amount,
      reason
    });

    res.json({
      success: true,
      message: 'Bonus commission awarded successfully'
    });

  } catch (error) {
    logger.error('Award bonus commission error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;