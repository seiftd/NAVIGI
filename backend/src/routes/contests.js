const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/contests
 * @desc    Get active contests
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    // TODO: Get contests from Firestore
    const contests = [
      {
        id: 'daily_001',
        type: 'DAILY',
        title: 'Daily Ad Challenge',
        description: 'Watch 10 ads today to enter',
        requirement: 10,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        totalPrizePool: 1000,
        participants: 125,
        winners: [],
        status: 'ACTIVE',
        userProgress: 5, // TODO: Get from user data
        isEligible: true,
        timeRemaining: '6 hours'
      },
      {
        id: 'weekly_001',
        type: 'WEEKLY',
        title: 'Weekly Champion',
        description: 'Watch 30 ads this week to compete',
        requirement: 30,
        startDate: '2024-01-15',
        endDate: '2024-01-21',
        totalPrizePool: 5000,
        participants: 450,
        winners: [],
        status: 'ACTIVE',
        userProgress: 20,
        isEligible: true,
        timeRemaining: '3 days'
      },
      {
        id: 'monthly_001',
        type: 'MONTHLY',
        title: 'Monthly Master',
        description: 'Watch 100 ads this month for huge prizes',
        requirement: 100,
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        totalPrizePool: 20000,
        participants: 1250,
        winners: [],
        status: 'ACTIVE',
        userProgress: 75,
        isEligible: true,
        timeRemaining: '2 weeks'
      }
    ];

    res.json({
      success: true,
      contests
    });

  } catch (error) {
    logger.error('Get contests error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/contests/:id/join
 * @desc    Join a contest
 * @access  Private
 */
router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const contestId = req.params.id;

    // TODO: Check if user meets requirements
    // TODO: Add user to contest participants
    // TODO: Update user contest data

    logger.info(`User joined contest: ${contestId}`, {
      userId: req.user.userId,
      contestId
    });

    res.json({
      success: true,
      message: 'Successfully joined contest'
    });

  } catch (error) {
    logger.error('Join contest error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/contests/:id/leaderboard
 * @desc    Get contest leaderboard
 * @access  Private
 */
router.get('/:id/leaderboard', authMiddleware, async (req, res) => {
  try {
    const contestId = req.params.id;

    // TODO: Get leaderboard from Firestore
    const leaderboard = [
      {
        rank: 1,
        userId: 'user1',
        displayName: 'John Doe',
        progress: 10,
        completed: true
      },
      {
        rank: 2,
        userId: 'user2',
        displayName: 'Jane Smith',
        progress: 10,
        completed: true
      },
      {
        rank: 3,
        userId: req.user.userId,
        displayName: 'You',
        progress: 8,
        completed: false
      }
    ];

    res.json({
      success: true,
      leaderboard,
      userRank: 3,
      totalParticipants: 125
    });

  } catch (error) {
    logger.error('Get leaderboard error:', error);
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
 * @route   GET /api/contests/admin
 * @desc    Get all contests for admin
 * @access  Admin
 */
router.get('/admin', adminMiddleware, async (req, res) => {
  try {
    // TODO: Get all contests from Firestore
    const contests = [
      {
        id: 'daily_001',
        type: 'DAILY',
        title: 'Daily Ad Challenge',
        description: 'Watch 10 ads today to enter',
        requirement: 10,
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        totalPrizePool: 1000,
        participants: 125,
        winners: [],
        status: 'ACTIVE',
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: 'weekly_001',
        type: 'WEEKLY',
        title: 'Weekly Champion',
        description: 'Watch 30 ads this week to compete',
        requirement: 30,
        startDate: '2024-01-15',
        endDate: '2024-01-21',
        totalPrizePool: 5000,
        participants: 450,
        winners: [],
        status: 'ACTIVE',
        createdAt: '2024-01-15T00:00:00Z'
      }
    ];

    res.json({
      success: true,
      contests
    });

  } catch (error) {
    logger.error('Get admin contests error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/contests/admin
 * @desc    Create new contest
 * @access  Admin
 */
router.post('/admin', adminMiddleware, async (req, res) => {
  try {
    const { type, title, description, requirement, startDate, endDate, prizePool } = req.body;

    if (!type || !title || !requirement || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Type, title, requirement, start date, and end date are required'
      });
    }

    // TODO: Create contest in Firestore
    const newContest = {
      id: `${type.toLowerCase()}_${Date.now()}`,
      type,
      title,
      description: description || '',
      requirement,
      startDate,
      endDate,
      totalPrizePool: prizePool || 1000,
      participants: 0,
      winners: [],
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      createdBy: req.admin.email
    };

    logger.info(`New contest created by admin: ${req.admin.email}`, {
      contestId: newContest.id,
      type,
      title
    });

    res.status(201).json({
      success: true,
      message: 'Contest created successfully',
      contest: newContest
    });

  } catch (error) {
    logger.error('Create contest error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/contests/admin/:id/end
 * @desc    End contest and select winners
 * @access  Admin
 */
router.put('/admin/:id/end', adminMiddleware, async (req, res) => {
  try {
    const contestId = req.params.id;

    // TODO: End contest in Firestore
    // TODO: Select winners automatically
    // TODO: Distribute prizes
    // TODO: Send notifications

    logger.info(`Contest ended by admin: ${req.admin.email}`, {
      contestId
    });

    res.json({
      success: true,
      message: 'Contest ended and winners selected'
    });

  } catch (error) {
    logger.error('End contest error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/contests/stats
 * @desc    Get contest statistics
 * @access  Admin
 */
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    // TODO: Calculate real stats from Firestore
    const stats = {
      totalContests: 45,
      activeContests: 3,
      completedContests: 42,
      totalParticipants: 12450,
      totalPrizesAwarded: 85000,
      avgParticipation: 276,
      topContest: {
        id: 'monthly_001',
        title: 'Monthly Master',
        participants: 1250,
        prizePool: 20000
      },
      participationByType: {
        daily: 5200,
        weekly: 4150,
        monthly: 3100
      },
      prizesDistributed: {
        thisMonth: 15000,
        thisWeek: 3500,
        today: 800
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Get contest stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;