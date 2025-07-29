const logger = require('../utils/logger');

let io = null;
const connectedUsers = new Map(); // userId -> socketId
const connectedAdmins = new Map(); // adminEmail -> socketId

/**
 * Initialize Socket.IO with the server instance
 */
function initializeSocketService(socketIOInstance) {
  io = socketIOInstance;
  
  io.on('connection', (socket) => {
    logger.info(`🔌 New socket connection: ${socket.id}`);

    // Handle user authentication
    socket.on('authenticate', (data) => {
      handleAuthentication(socket, data);
    });

    // Handle admin authentication
    socket.on('admin-authenticate', (data) => {
      handleAdminAuthentication(socket, data);
    });

    // Handle user joining rooms
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      logger.info(`Socket ${socket.id} joined room: ${roomId}`);
    });

    // Handle real-time ad watching updates
    socket.on('ad-watch-start', (data) => {
      handleAdWatchStart(socket, data);
    });

    socket.on('ad-watch-complete', (data) => {
      handleAdWatchComplete(socket, data);
    });

    // Handle contest updates
    socket.on('contest-progress', (data) => {
      handleContestProgress(socket, data);
    });

    // Handle withdrawal status updates
    socket.on('withdrawal-status-update', (data) => {
      handleWithdrawalStatusUpdate(socket, data);
    });

    // Handle real-time messaging
    socket.on('send-message', (data) => {
      handleMessage(socket, data);
    });

    // Handle typing indicators
    socket.on('typing-start', (data) => {
      handleTypingStart(socket, data);
    });

    socket.on('typing-stop', (data) => {
      handleTypingStop(socket, data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      handleDisconnect(socket);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to NAVIGI server',
      socketId: socket.id,
      timestamp: new Date().toISOString()
    });
  });

  logger.info('✅ Socket.IO service initialized successfully');
}

/**
 * Handle user authentication
 */
function handleAuthentication(socket, data) {
  try {
    const { userId, token } = data;
    
    // TODO: Verify JWT token
    if (userId && token) {
      connectedUsers.set(userId, socket.id);
      socket.userId = userId;
      socket.join(`user_${userId}`);
      
      socket.emit('authenticated', {
        success: true,
        userId,
        message: 'User authenticated successfully'
      });
      
      logger.info(`👤 User authenticated: ${userId} (${socket.id})`);
      
      // Notify admin of user connection
      notifyAdmins('user-connected', {
        userId,
        timestamp: new Date().toISOString()
      });
    } else {
      socket.emit('authentication-error', {
        success: false,
        error: 'Invalid authentication data'
      });
    }
  } catch (error) {
    logger.error('Socket authentication error:', error);
    socket.emit('authentication-error', {
      success: false,
      error: 'Authentication failed'
    });
  }
}

/**
 * Handle admin authentication
 */
function handleAdminAuthentication(socket, data) {
  try {
    const { adminEmail, token } = data;
    
    // TODO: Verify admin JWT token
    if (adminEmail && token) {
      connectedAdmins.set(adminEmail, socket.id);
      socket.adminEmail = adminEmail;
      socket.join('admin');
      
      socket.emit('admin-authenticated', {
        success: true,
        adminEmail,
        message: 'Admin authenticated successfully',
        connectedUsers: connectedUsers.size
      });
      
      logger.info(`👨‍💼 Admin authenticated: ${adminEmail} (${socket.id})`);
    } else {
      socket.emit('admin-authentication-error', {
        success: false,
        error: 'Invalid admin authentication data'
      });
    }
  } catch (error) {
    logger.error('Admin socket authentication error:', error);
    socket.emit('admin-authentication-error', {
      success: false,
      error: 'Admin authentication failed'
    });
  }
}

/**
 * Handle ad watch start
 */
function handleAdWatchStart(socket, data) {
  try {
    const { adId, adType } = data;
    
    if (socket.userId) {
      logger.info(`📺 User ${socket.userId} started watching ad: ${adId}`);
      
      // Notify admin of ad watch start
      notifyAdmins('ad-watch-started', {
        userId: socket.userId,
        adId,
        adType,
        timestamp: new Date().toISOString()
      });
      
      // Update real-time statistics
      updateRealTimeStats('ad_watch_start', { adId, adType });
    }
  } catch (error) {
    logger.error('Ad watch start error:', error);
  }
}

/**
 * Handle ad watch completion
 */
function handleAdWatchComplete(socket, data) {
  try {
    const { adId, adType, pointsEarned, duration } = data;
    
    if (socket.userId) {
      logger.info(`✅ User ${socket.userId} completed ad: ${adId}, earned ${pointsEarned} points`);
      
      // Notify user of completion
      socket.emit('ad-completion-confirmed', {
        adId,
        pointsEarned,
        message: `You earned ${pointsEarned} SBARO points!`
      });
      
      // Notify admin of ad completion
      notifyAdmins('ad-watch-completed', {
        userId: socket.userId,
        adId,
        adType,
        pointsEarned,
        duration,
        timestamp: new Date().toISOString()
      });
      
      // Update real-time statistics
      updateRealTimeStats('ad_watch_complete', { adId, adType, pointsEarned });
      
      // Check for contest progress updates
      updateContestProgress(socket.userId, adId);
    }
  } catch (error) {
    logger.error('Ad watch complete error:', error);
  }
}

/**
 * Handle contest progress updates
 */
function handleContestProgress(socket, data) {
  try {
    const { contestId, progress, isComplete } = data;
    
    if (socket.userId) {
      // Broadcast progress to user
      socket.emit('contest-progress-update', {
        contestId,
        progress,
        isComplete,
        timestamp: new Date().toISOString()
      });
      
      if (isComplete) {
        socket.emit('contest-completed', {
          contestId,
          message: 'Congratulations! You completed the contest requirements!',
          timestamp: new Date().toISOString()
        });
      }
      
      // Notify admin of contest progress
      notifyAdmins('contest-progress-update', {
        userId: socket.userId,
        contestId,
        progress,
        isComplete,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Contest progress error:', error);
  }
}

/**
 * Handle withdrawal status updates
 */
function handleWithdrawalStatusUpdate(socket, data) {
  try {
    const { withdrawalId, status, adminNote } = data;
    
    // This is typically called by admin
    if (socket.adminEmail) {
      // TODO: Get withdrawal user ID from database
      const userId = 'withdrawal-user-id'; // TODO: Get from Firestore
      
      // Notify user of withdrawal status change
      notifyUser(userId, 'withdrawal-status-update', {
        withdrawalId,
        status,
        adminNote,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`💸 Withdrawal ${withdrawalId} status updated to ${status} by admin ${socket.adminEmail}`);
    }
  } catch (error) {
    logger.error('Withdrawal status update error:', error);
  }
}

/**
 * Handle real-time messaging
 */
function handleMessage(socket, data) {
  try {
    const { recipientId, message, type } = data;
    
    if (socket.userId) {
      // User to admin message
      notifyAdmins('user-message', {
        userId: socket.userId,
        message,
        type: type || 'support',
        timestamp: new Date().toISOString()
      });
    } else if (socket.adminEmail) {
      // Admin to user message
      notifyUser(recipientId, 'admin-message', {
        adminEmail: socket.adminEmail,
        message,
        type: type || 'support',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    logger.error('Message handling error:', error);
  }
}

/**
 * Handle typing indicators
 */
function handleTypingStart(socket, data) {
  try {
    const { recipientId } = data;
    
    if (socket.userId) {
      notifyAdmins('user-typing-start', { userId: socket.userId });
    } else if (socket.adminEmail && recipientId) {
      notifyUser(recipientId, 'admin-typing-start', { adminEmail: socket.adminEmail });
    }
  } catch (error) {
    logger.error('Typing start error:', error);
  }
}

/**
 * Handle typing stop
 */
function handleTypingStop(socket, data) {
  try {
    const { recipientId } = data;
    
    if (socket.userId) {
      notifyAdmins('user-typing-stop', { userId: socket.userId });
    } else if (socket.adminEmail && recipientId) {
      notifyUser(recipientId, 'admin-typing-stop', { adminEmail: socket.adminEmail });
    }
  } catch (error) {
    logger.error('Typing stop error:', error);
  }
}

/**
 * Handle client disconnection
 */
function handleDisconnect(socket) {
  try {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      logger.info(`👤 User disconnected: ${socket.userId} (${socket.id})`);
      
      // Notify admin of user disconnection
      notifyAdmins('user-disconnected', {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });
    } else if (socket.adminEmail) {
      connectedAdmins.delete(socket.adminEmail);
      logger.info(`👨‍💼 Admin disconnected: ${socket.adminEmail} (${socket.id})`);
    } else {
      logger.info(`🔌 Socket disconnected: ${socket.id}`);
    }
  } catch (error) {
    logger.error('Disconnect handling error:', error);
  }
}

/**
 * Notify specific user
 */
function notifyUser(userId, event, data) {
  try {
    if (io && connectedUsers.has(userId)) {
      const socketId = connectedUsers.get(userId);
      io.to(socketId).emit(event, data);
      logger.info(`📤 Sent ${event} to user ${userId}`);
    }
  } catch (error) {
    logger.error('Notify user error:', error);
  }
}

/**
 * Notify all connected admins
 */
function notifyAdmins(event, data) {
  try {
    if (io) {
      io.to('admin').emit(event, data);
      logger.info(`📤 Sent ${event} to all admins`);
    }
  } catch (error) {
    logger.error('Notify admins error:', error);
  }
}

/**
 * Broadcast to all connected users
 */
function broadcastToAllUsers(event, data) {
  try {
    if (io) {
      connectedUsers.forEach((socketId, userId) => {
        io.to(socketId).emit(event, data);
      });
      logger.info(`📤 Broadcasted ${event} to ${connectedUsers.size} users`);
    }
  } catch (error) {
    logger.error('Broadcast error:', error);
  }
}

/**
 * Update real-time statistics
 */
function updateRealTimeStats(action, data) {
  try {
    // Broadcast updated stats to admin dashboard
    notifyAdmins('real-time-stats', {
      action,
      data,
      connectedUsers: connectedUsers.size,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Update real-time stats error:', error);
  }
}

/**
 * Update contest progress for user
 */
function updateContestProgress(userId, adId) {
  try {
    // TODO: Get user's contest progress from Firestore
    // TODO: Update progress based on ad completion
    // TODO: Check if any contest requirements are met
    
    const contestUpdates = [
      {
        contestId: 'daily_001',
        progress: 7,
        requirement: 10,
        isComplete: false
      }
    ];
    
    // Notify user of progress updates
    notifyUser(userId, 'contest-progress-bulk-update', {
      contests: contestUpdates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Update contest progress error:', error);
  }
}

/**
 * Get service statistics
 */
function getSocketStats() {
  return {
    connectedUsers: connectedUsers.size,
    connectedAdmins: connectedAdmins.size,
    totalConnections: connectedUsers.size + connectedAdmins.size,
    userConnections: Array.from(connectedUsers.keys()),
    adminConnections: Array.from(connectedAdmins.keys()),
    uptime: process.uptime(),
    lastUpdate: new Date().toISOString()
  };
}

/**
 * Send notification to specific user via socket
 */
function sendNotificationToUser(userId, notification) {
  try {
    notifyUser(userId, 'new-notification', notification);
  } catch (error) {
    logger.error('Send notification to user error:', error);
  }
}

/**
 * Handle contest winner announcement
 */
function announceContestWinner(contestId, winnerId, prize) {
  try {
    // Notify the winner
    notifyUser(winnerId, 'contest-winner', {
      contestId,
      prize,
      message: `Congratulations! You won the contest!`,
      timestamp: new Date().toISOString()
    });
    
    // Notify all admins
    notifyAdmins('contest-winner-announced', {
      contestId,
      winnerId,
      prize,
      timestamp: new Date().toISOString()
    });
    
    // Broadcast to all users (optional)
    broadcastToAllUsers('contest-announcement', {
      contestId,
      message: 'Contest winner has been announced!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Announce contest winner error:', error);
  }
}

module.exports = {
  initializeSocketService,
  notifyUser,
  notifyAdmins,
  broadcastToAllUsers,
  getSocketStats,
  sendNotificationToUser,
  announceContestWinner,
  updateRealTimeStats
};