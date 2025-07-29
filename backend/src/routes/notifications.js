const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { sendNotificationToDevice, sendNotificationToTopic } = require('../config/firebase');
const logger = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get user's notification history
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // TODO: Get user notifications from Firestore
    const notifications = [
      {
        id: 'notif1',
        type: 'CONTEST_WINNER',
        title: 'Congratulations! 🎉',
        message: 'You won the Daily Contest! 1000 points have been added to your account.',
        data: {
          contestId: 'daily_001',
          points: 1000,
          prize: 'Daily Contest Winner'
        },
        read: false,
        createdAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 'notif2',
        type: 'WITHDRAWAL_APPROVED',
        title: 'Withdrawal Approved ✅',
        message: 'Your Binance Pay withdrawal of $5.00 has been approved and processed.',
        data: {
          withdrawalId: 'w123',
          amount: 50,
          method: 'BINANCE_PAY'
        },
        read: true,
        createdAt: '2024-01-14T16:45:00Z'
      },
      {
        id: 'notif3',
        type: 'REFERRAL_EARNING',
        title: 'Referral Bonus! 💰',
        message: 'Your referral John Doe earned $2.50. You received $0.125 commission!',
        data: {
          referralUserId: 'user123',
          referralName: 'John Doe',
          earnings: 2.50,
          commission: 0.125
        },
        read: true,
        createdAt: '2024-01-13T12:20:00Z'
      },
      {
        id: 'notif4',
        type: 'AD_BONUS',
        title: 'Streak Bonus! 🔥',
        message: 'You watched 7 days in a row! Bonus 50 points added.',
        data: {
          streakDays: 7,
          bonusPoints: 50
        },
        read: true,
        createdAt: '2024-01-12T18:15:00Z'
      }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      notifications,
      pagination: {
        currentPage: page,
        totalPages: 3,
        totalNotifications: 50,
        limit
      },
      unreadCount
    });

  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notificationId = req.params.id;

    // TODO: Update notification as read in Firestore

    logger.info(`Notification marked as read: ${notificationId} by user: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    logger.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/read-all', authMiddleware, async (req, res) => {
  try {
    // TODO: Mark all user notifications as read in Firestore

    logger.info(`All notifications marked as read by user: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    logger.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notificationId = req.params.id;

    // TODO: Delete notification from Firestore

    logger.info(`Notification deleted: ${notificationId} by user: ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Notification deleted'
    });

  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get unread notifications count
 * @access  Private
 */
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    // TODO: Get unread count from Firestore
    const unreadCount = 2;

    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   POST /api/notifications/test
 * @desc    Send test notification to user
 * @access  Private
 */
router.post('/test', authMiddleware, async (req, res) => {
  try {
    // TODO: Get user FCM token from Firestore
    const userFcmToken = 'user-fcm-token'; // Placeholder

    if (!userFcmToken) {
      return res.status(400).json({
        success: false,
        error: 'User FCM token not found'
      });
    }

    const notification = {
      title: 'Test Notification 🔔',
      body: 'This is a test notification from NAVIGI app!',
      data: {
        type: 'GENERAL',
        timestamp: new Date().toISOString()
      }
    };

    // Send FCM notification
    try {
      await sendNotificationToDevice(userFcmToken, notification.title, notification.body, notification.data);
      
      logger.info(`Test notification sent to user: ${req.user.userId}`);

      res.json({
        success: true,
        message: 'Test notification sent successfully'
      });
    } catch (fcmError) {
      logger.error('FCM test notification error:', fcmError);
      res.status(500).json({
        success: false,
        error: 'Failed to send test notification'
      });
    }

  } catch (error) {
    logger.error('Send test notification error:', error);
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
 * @route   POST /api/notifications/admin/send
 * @desc    Send notification to specific user or all users
 * @access  Admin
 */
router.post('/admin/send', adminMiddleware, async (req, res) => {
  try {
    const { title, message, recipients, type, data } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    const notificationData = {
      type: type || 'GENERAL',
      timestamp: new Date().toISOString(),
      adminSent: true,
      ...data
    };

    let recipientCount = 0;

    try {
      if (recipients === 'all' || !recipients) {
        // Send to all users via topic
        await sendNotificationToTopic('general', title, message, notificationData);
        recipientCount = 'all'; // TODO: Get actual user count
        
        logger.info(`Broadcast notification sent by admin: ${req.admin.email}`, {
          title,
          recipients: 'all'
        });
      } else if (Array.isArray(recipients)) {
        // Send to specific users
        for (const userId of recipients) {
          // TODO: Get user FCM token and send individual notification
          const userToken = 'user-token'; // TODO: Get from Firestore
          if (userToken) {
            await sendNotificationToDevice(userToken, title, message, notificationData);
            recipientCount++;
          }
        }
        
        logger.info(`Targeted notification sent by admin: ${req.admin.email}`, {
          title,
          recipients: recipients.length
        });
      } else {
        // Send to single user
        // TODO: Get user FCM token and send notification
        const userToken = 'user-token'; // TODO: Get from Firestore
        if (userToken) {
          await sendNotificationToDevice(userToken, title, message, notificationData);
          recipientCount = 1;
        }
        
        logger.info(`Individual notification sent by admin: ${req.admin.email}`, {
          title,
          recipient: recipients
        });
      }

      res.json({
        success: true,
        message: 'Notification sent successfully',
        recipientCount
      });

    } catch (fcmError) {
      logger.error('FCM admin notification error:', fcmError);
      res.status(500).json({
        success: false,
        error: 'Failed to send notification via FCM'
      });
    }

  } catch (error) {
    logger.error('Send admin notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/notifications/admin/templates
 * @desc    Get notification templates
 * @access  Admin
 */
router.get('/admin/templates', adminMiddleware, async (req, res) => {
  try {
    const templates = [
      {
        id: 'welcome',
        name: 'Welcome Message',
        title: 'Welcome to NAVIGI! 🎉',
        message: 'Start watching ads and earning SBARO points today!',
        type: 'GENERAL',
        category: 'onboarding'
      },
      {
        id: 'contest_reminder',
        name: 'Contest Reminder',
        title: 'Contest Ending Soon! ⏰',
        message: 'Only a few hours left to participate in the daily contest. Watch ads now!',
        type: 'NEW_CONTEST',
        category: 'contests'
      },
      {
        id: 'withdrawal_processed',
        name: 'Withdrawal Processed',
        title: 'Withdrawal Successful ✅',
        message: 'Your withdrawal request has been processed and payment sent.',
        type: 'WITHDRAWAL_APPROVED',
        category: 'withdrawals'
      },
      {
        id: 'maintenance',
        name: 'Maintenance Notice',
        title: 'Scheduled Maintenance 🔧',
        message: 'The app will be under maintenance from {start_time} to {end_time}.',
        type: 'SYSTEM_MAINTENANCE',
        category: 'system'
      },
      {
        id: 'bonus_offer',
        name: 'Bonus Offer',
        title: 'Limited Time Bonus! 💰',
        message: 'Double points on all ads today only! Don\'t miss out!',
        type: 'AD_BONUS',
        category: 'promotions'
      }
    ];

    res.json({
      success: true,
      templates
    });

  } catch (error) {
    logger.error('Get notification templates error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/notifications/admin/history
 * @desc    Get notification sending history
 * @access  Admin
 */
router.get('/admin/history', adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // TODO: Get notification history from Firestore
    const history = [
      {
        id: 'send1',
        title: 'Daily Contest Winner',
        message: 'Congratulations on winning today\'s contest!',
        type: 'CONTEST_WINNER',
        recipients: 1,
        sentAt: '2024-01-15T14:30:00Z',
        sentBy: req.admin.email,
        deliveryStatus: 'delivered'
      },
      {
        id: 'send2',
        title: 'App Update Available',
        message: 'New features and improvements are available.',
        type: 'GENERAL',
        recipients: 'all',
        sentAt: '2024-01-14T10:00:00Z',
        sentBy: req.admin.email,
        deliveryStatus: 'delivered'
      }
    ];

    res.json({
      success: true,
      history,
      pagination: {
        currentPage: page,
        totalPages: 5,
        totalNotifications: 85,
        limit
      }
    });

  } catch (error) {
    logger.error('Get notification history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

/**
 * @route   GET /api/notifications/stats
 * @desc    Get notification statistics
 * @access  Admin
 */
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    // TODO: Calculate real stats from Firestore
    const stats = {
      totalSent: 25847,
      totalDelivered: 24520,
      totalRead: 18940,
      deliveryRate: 94.9,
      readRate: 77.2,
      avgResponseTime: '2.3 minutes',
      notificationsByType: {
        GENERAL: 8520,
        CONTEST_WINNER: 1250,
        WITHDRAWAL_APPROVED: 980,
        REFERRAL_EARNING: 2150,
        AD_BONUS: 1890,
        SYSTEM_MAINTENANCE: 45
      },
      monthlyStats: {
        thisMonth: 2850,
        lastMonth: 3120,
        growth: '-8.7%'
      },
      topPerformingNotification: {
        title: 'Double Points Weekend!',
        sentCount: 8500,
        readRate: 89.5
      }
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    logger.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

module.exports = router;