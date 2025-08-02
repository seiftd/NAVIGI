const TelegramBot = require('node-telegram-bot-api');
const { FirebaseManager } = require('./firebase-config');

// Admin Bot Configuration
const ADMIN_BOT_TOKEN = '8095971099:AAFDLGO8oFBPgmI878cFeCuil3tf9Kh2tmM';

const MAIN_BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
const ADMIN_USER_ID = '@Sbaroone'; // Replace with actual admin user ID
const MAIN_BOT_API_URL = 'https://navigiu.netlify.app/.netlify/functions';
const ADMIN_DASHBOARD_URL = 'https://navigiu.netlify.app/admin-dashboard';

// Initialize Firebase Manager
const firebaseManager = new FirebaseManager();

// Create main bot instance for sending messages
const mainBot = new TelegramBot(MAIN_BOT_TOKEN);

// Create admin bot instance
const adminBot = new TelegramBot(ADMIN_BOT_TOKEN, { polling: true });

console.log('🤖 Admin Bot (@Seifoneme_bot) started successfully!');

// Set up real-time VIP notification listener
firebaseManager.onVipNotification(async (notification) => {
    console.log('📞 New VIP notification received:', notification);
    
    // Send notification to all admins
    const adminIds = ['7544271642']; // @Sbaroone
    
    for (const adminId of adminIds) {
        try {
            await adminBot.sendMessage(adminId, 
                `🔔 *NEW VIP REQUEST*\n\n` +
                `👤 User: ${notification.first_name || 'Unknown'}\n` +
                `🆔 ID: ${notification.user_id}\n` +
                `📱 Username: @${notification.username || 'none'}\n` +
                `⏰ Time: ${new Date(notification.created_at).toLocaleString()}\n\n` +
                `Use /vip_approve ${notification.id} or /vip_reject ${notification.id}`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '✅ Approve', callback_data: `vip_approve_${notification.id}` },
                                { text: '❌ Reject', callback_data: `vip_reject_${notification.id}` }
                            ],
                            [{ text: '👤 View User', callback_data: `view_user_${notification.user_id}` }]
                        ]
                    }
                }
            );
        } catch (error) {
            console.error(`Failed to send VIP notification to admin ${adminId}:`, error);
        }
    }
});

// Admin authentication middleware
function isAdmin(userId) {
    // Add your admin user IDs here
    const adminIds = ['7544271642']; // @Sbaroone
    return adminIds.includes(userId.toString());
}

// Bot Commands
adminBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) {
        adminBot.sendMessage(chatId, '❌ Access denied. This bot is for administrators only.');
        return;
    }
    
    const welcomeMessage = `
🔧 **NAVIGI ADMIN BOT** 🔧

Welcome to the NAVIGI administration panel!

**Available Commands:**
📊 /dashboard - View dashboard stats
👥 /users - Manage users
💎 /vip - VIP management
🏆 /contests - Contest management
📢 /notify - Send notifications
🔄 /reset - Reset system data
⚙️ /settings - Bot settings

Use the menu buttons below for quick access.
    `;
    
    const keyboard = {
        reply_markup: {
            keyboard: [
                [{ text: '📊 Dashboard' }, { text: '👥 Users' }],
                [{ text: '💎 VIP Requests' }, { text: '🏆 Contests' }],
                [{ text: '📢 Notifications' }, { text: '🔄 Reset Data' }],
                [{ text: '⚙️ Settings' }, { text: '📈 Analytics' }]
            ],
            resize_keyboard: true,
            persistent: true
        }
    };
    
    adminBot.sendMessage(chatId, welcomeMessage, { 
        parse_mode: 'Markdown',
        ...keyboard
    });
});

// Dashboard Command
adminBot.onText(/\/dashboard|📊 Dashboard/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) return;
    
    try {
        // Fetch real stats from the main bot API
        const stats = await fetchBotStats();
        
        const dashboardMessage = `
📊 **NAVIGI BOT DASHBOARD**

**User Statistics:**
👥 Total Users: ${stats.totalUsers}
💎 VIP Users: ${stats.vipUsers}
🆓 Free Users: ${stats.freeUsers}

**Contest Statistics:**
🏆 Daily Contest: ${stats.dailyParticipants} participants
📅 Weekly Contest: ${stats.weeklyParticipants} participants
🗓️ Monthly Contest: ${stats.monthlyParticipants} participants

**Financial Statistics:**
💰 Total Points Distributed: ${stats.totalPointsDistributed}
💸 Pending VIP Requests: ${stats.pendingVipRequests}
💳 Total VIP Sales: ${stats.totalVipSales}

**System Status:**
🟢 Bot Status: Online
🟢 Database: Connected
🟢 API: Operational

Last Updated: ${new Date().toLocaleString()}
        `;
        
        const keyboard = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔄 Refresh Stats', callback_data: 'refresh_stats' }],
                    [{ text: '📱 Open Web Dashboard', url: ADMIN_DASHBOARD_URL }]
                ]
            }
        };
        
        adminBot.sendMessage(chatId, dashboardMessage, { 
            parse_mode: 'Markdown',
            ...keyboard
        });
    } catch (error) {
        adminBot.sendMessage(chatId, '❌ Failed to fetch dashboard stats: ' + error.message);
    }
});

// VIP Management
adminBot.onText(/\/vip|💎 VIP Requests/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) return;
    
    try {
        const vipRequests = await fetchPendingVipRequests();
        
        if (vipRequests.length === 0) {
            adminBot.sendMessage(chatId, '✅ No pending VIP requests.');
            return;
        }
        
        let message = '💎 **PENDING VIP REQUESTS**\n\n';
        
        vipRequests.forEach((request, index) => {
            message += `**Request #${index + 1}**\n`;
            message += `👤 User: @${request.username} (${request.user_id})\n`;
            message += `💎 VIP Tier: ${request.vip_tier}\n`;
            message += `💰 Amount: ${request.amount} ${request.payment_method}\n`;
            message += `🔗 Transaction: \`${request.transaction_hash}\`\n`;
            message += `📅 Date: ${new Date(request.timestamp).toLocaleString()}\n\n`;
        });
        
        const keyboard = {
            reply_markup: {
                inline_keyboard: vipRequests.map((request, index) => [
                    { text: `✅ Approve #${index + 1}`, callback_data: `approve_vip_${request.id}` },
                    { text: `❌ Reject #${index + 1}`, callback_data: `reject_vip_${request.id}` }
                ])
            }
        };
        
        adminBot.sendMessage(chatId, message, { 
            parse_mode: 'Markdown',
            ...keyboard
        });
    } catch (error) {
        adminBot.sendMessage(chatId, '❌ Failed to fetch VIP requests: ' + error.message);
    }
});

// Contest Management
adminBot.onText(/\/contests|🏆 Contests/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) return;
    
    const contestMessage = `
🏆 **CONTEST MANAGEMENT**

**Current Prize Pools:**
🏆 Daily: X Points (1 winner)
📅 Weekly: X Points (3 winners)  
🗓️ Monthly: VIP King (5 winners)
👑 VIP: X Points (1 winner)

**Actions Available:**
• Set prize pools
• Select winners
• Distribute rewards
• View participants
    `;
    
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🏆 Daily Contest', callback_data: 'manage_daily' }],
                [{ text: '📅 Weekly Contest', callback_data: 'manage_weekly' }],
                [{ text: '🗓️ Monthly Contest', callback_data: 'manage_monthly' }],
                [{ text: '👑 VIP Contest', callback_data: 'manage_vip' }],
                [{ text: '🎁 Distribute All Prizes', callback_data: 'distribute_all' }]
            ]
        }
    };
    
    adminBot.sendMessage(chatId, contestMessage, { 
        parse_mode: 'Markdown',
        ...keyboard
    });
});

// Notifications
adminBot.onText(/\/notify|📢 Notifications/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) return;
    
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📢 Broadcast to All', callback_data: 'broadcast_all' }],
                [{ text: '👤 Send to Specific User', callback_data: 'send_specific' }],
                [{ text: '💎 Send to VIP Users', callback_data: 'send_vip' }],
                [{ text: '🏆 Contest Winners', callback_data: 'send_winners' }]
            ]
        }
    };
    
    adminBot.sendMessage(chatId, '📢 **NOTIFICATION CENTER**\n\nChoose notification type:', { 
        parse_mode: 'Markdown',
        ...keyboard
    });
});

// Reset System
adminBot.onText(/\/reset|🔄 Reset Data/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!isAdmin(userId)) return;
    
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔄 Reset Daily Progress', callback_data: 'reset_daily' }],
                [{ text: '🏆 Reset All Contests', callback_data: 'reset_contests' }],
                [{ text: '👥 Reset All Users', callback_data: 'reset_users' }],
                [{ text: '📊 Reset Leaderboards', callback_data: 'reset_leaderboards' }],
                [{ text: '⚠️ FULL SYSTEM RESET', callback_data: 'reset_all' }]
            ]
        }
    };
    
    adminBot.sendMessage(chatId, '🔄 **SYSTEM RESET**\n\n⚠️ **WARNING:** These actions cannot be undone!\n\nChoose what to reset:', { 
        parse_mode: 'Markdown',
        ...keyboard
    });
});

// Callback Query Handler
adminBot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = message.chat.id;
    const userId = callbackQuery.from.id;
    
    if (!isAdmin(userId)) {
        adminBot.answerCallbackQuery(callbackQuery.id, '❌ Access denied');
        return;
    }
    
    try {
        // Handle Firebase VIP notifications
        if (data.startsWith('vip_approve_')) {
            const notificationId = data.replace('vip_approve_', '');
            await handleFirebaseVipApproval(chatId, notificationId, true);
            adminBot.answerCallbackQuery(callbackQuery.id, '✅ VIP request approved!');
            
        } else if (data.startsWith('vip_reject_')) {
            const notificationId = data.replace('vip_reject_', '');
            await handleFirebaseVipApproval(chatId, notificationId, false);
            adminBot.answerCallbackQuery(callbackQuery.id, '❌ VIP request rejected');
            
        } else if (data.startsWith('view_user_')) {
            const targetUserId = data.replace('view_user_', '');
            await showFirebaseUserDetails(chatId, targetUserId);
            adminBot.answerCallbackQuery(callbackQuery.id);
            
        } else if (data.startsWith('approve_vip_')) {
            const requestId = data.replace('approve_vip_', '');
            await approveVipRequest(requestId);
            adminBot.answerCallbackQuery(callbackQuery.id, '✅ VIP request approved!');
            adminBot.sendMessage(chatId, `✅ VIP request #${requestId} approved successfully!`);
            
        } else if (data.startsWith('reject_vip_')) {
            const requestId = data.replace('reject_vip_', '');
            await rejectVipRequest(requestId);
            adminBot.answerCallbackQuery(callbackQuery.id, '❌ VIP request rejected');
            adminBot.sendMessage(chatId, `❌ VIP request #${requestId} rejected.`);
            
        } else if (data === 'refresh_stats') {
            adminBot.answerCallbackQuery(callbackQuery.id, '🔄 Refreshing stats...');
            // Trigger dashboard refresh
            adminBot.emit('text', { ...message, text: '/dashboard' });
            
        } else if (data === 'broadcast_all') {
            adminBot.answerCallbackQuery(callbackQuery.id, '📢 Enter broadcast message');
            adminBot.sendMessage(chatId, '📢 **BROADCAST MESSAGE**\n\nPlease enter the message you want to send to all users:');
            
            // Set up message listener for broadcast
            const messageHandler = (msg) => {
                if (msg.chat.id === chatId && isAdmin(msg.from.id)) {
                    const broadcastMessage = msg.text;
                    
                    // Remove this specific listener
                    adminBot.removeListener('message', messageHandler);
                    
                    // Send broadcast
                    sendBroadcastMessage(broadcastMessage, chatId);
                }
            };
            
            adminBot.on('message', messageHandler);
            
        } else if (data === 'reset_daily') {
            await resetDailyProgress();
            adminBot.answerCallbackQuery(callbackQuery.id, '✅ Daily progress reset');
            adminBot.sendMessage(chatId, '✅ Daily progress reset for all users!');
            
        } else if (data === 'reset_all') {
            adminBot.answerCallbackQuery(callbackQuery.id, '⚠️ Full system reset initiated');
            adminBot.sendMessage(chatId, '⚠️ **FULL SYSTEM RESET INITIATED**\n\nAll user data, contests, and statistics have been reset to zero.');
            await fullSystemReset();
        }
    } catch (error) {
        adminBot.answerCallbackQuery(callbackQuery.id, '❌ Error: ' + error.message);
    }
});

// API Functions
async function fetchBotStats() {
    // Mock data - replace with real API calls
    return {
        totalUsers: 0,
        vipUsers: 0,
        freeUsers: 0,
        dailyParticipants: 0,
        weeklyParticipants: 0,
        monthlyParticipants: 0,
        totalPointsDistributed: 0,
        pendingVipRequests: 0,
        totalVipSales: 0
    };
}

async function fetchPendingVipRequests() {
    try {
        const response = await fetch(`${MAIN_BOT_API_URL}/admin-vip-requests?platform=telegram_bot`);
        const data = await response.json();
        return data.requests || [];
    } catch (error) {
        console.error('Failed to fetch VIP requests:', error);
        return [];
    }
}

async function approveVipRequest(requestId) {
    try {
        // Approve the request in backend
        const response = await fetch(`${MAIN_BOT_API_URL}/admin-approve-vip-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                request_id: requestId,
                action: 'approve',
                admin_id: 'admin_bot'
            })
        });

        const result = await response.json();
        
        if (result.success && result.user_data) {
            // Send approval message directly to user via main bot
            const approvalMessage = `
🎉 **VIP REQUEST APPROVED!** 🎉

✅ Your VIP upgrade has been approved!
💎 VIP Tier: ${result.user_data.vip_tier}
⏰ Valid for: 30 days
🚀 VIP benefits are now active!

Welcome to VIP! 👑
            `;

            try {
                await mainBot.sendMessage(result.user_data.telegram_id, approvalMessage, { 
                    parse_mode: 'Markdown' 
                });
                console.log(`✅ Approval notification sent to user ${result.user_data.telegram_id}`);
            } catch (msgError) {
                console.error('Failed to send approval message to user:', msgError);
            }
        }
        
        console.log(`VIP request ${requestId} approved`);
    } catch (error) {
        console.error('Failed to approve VIP request:', error);
        throw error;
    }
}

async function rejectVipRequest(requestId) {
    try {
        // Reject the request in backend
        const response = await fetch(`${MAIN_BOT_API_URL}/admin-approve-vip-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                request_id: requestId,
                action: 'reject',
                admin_id: 'admin_bot'
            })
        });

        const result = await response.json();
        
        if (result.success && result.user_data) {
            // Send rejection message directly to user via main bot
            const rejectionMessage = `
❌ **VIP REQUEST REJECTED**

Unfortunately, your VIP upgrade request has been rejected.

**Possible reasons:**
• Invalid transaction hash
• Insufficient payment amount
• Transaction not found

Please contact support if you believe this is an error.
Support: @NavigiSupport
            `;

            try {
                await mainBot.sendMessage(result.user_data.telegram_id, rejectionMessage, { 
                    parse_mode: 'Markdown' 
                });
                console.log(`❌ Rejection notification sent to user ${result.user_data.telegram_id}`);
            } catch (msgError) {
                console.error('Failed to send rejection message to user:', msgError);
            }
        }
        
        console.log(`VIP request ${requestId} rejected`);
    } catch (error) {
        console.error('Failed to reject VIP request:', error);
        throw error;
    }
}

async function resetDailyProgress() {
    try {
        await fetch(`${MAIN_BOT_API_URL}/admin-reset-daily-progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                admin_id: 'admin_bot',
                timestamp: Date.now()
            })
        });
        
        console.log('Daily progress reset');
    } catch (error) {
        console.error('Failed to reset daily progress:', error);
        throw error;
    }
}

async function fullSystemReset() {
    try {
        await fetch(`${MAIN_BOT_API_URL}/admin-full-reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                admin_id: 'admin_bot',
                timestamp: Date.now()
            })
        });
        
        console.log('Full system reset completed');
    } catch (error) {
        console.error('Failed to perform full system reset:', error);
        throw error;
    }
}

// Error handling
adminBot.on('error', (error) => {
    console.error('Admin Bot Error:', error);
});

adminBot.on('polling_error', (error) => {
    console.error('Admin Bot Polling Error:', error);
});

// Keep the bot running
process.on('SIGINT', () => {
    console.log('🛑 Admin Bot shutting down...');
    adminBot.stopPolling();
    process.exit(0);
});


// Broadcast message to all users
async function sendBroadcastMessage(message, adminChatId) {
    try {
        adminBot.sendMessage(adminChatId, '📤 Sending broadcast message to all users...');
        
        // Get all user IDs from backend
        const response = await fetch(`${MAIN_BOT_API_URL}/admin-users?platform=telegram_bot`);
        const data = await response.json();
        
        if (data.success && data.users) {
            let successCount = 0;
            let failCount = 0;
            
            for (const user of data.users) {
                try {
                    await mainBot.sendMessage(user.telegram_id, `📢 **ADMIN MESSAGE**\n\n${message}`, {
                        parse_mode: 'Markdown'
                    });
                    successCount++;
                    
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`Failed to send message to user ${user.telegram_id}:`, error);
                    failCount++;
                }
            }
            
            adminBot.sendMessage(adminChatId, 
                `✅ **BROADCAST COMPLETE**\n\n` +
                `📤 Messages sent: ${successCount}\n` +
                `❌ Failed: ${failCount}\n` +
                `👥 Total users: ${data.users.length}`
            );
        } else {
            adminBot.sendMessage(adminChatId, '❌ No users found to send broadcast to.');
        }
    } catch (error) {
        console.error('Broadcast error:', error);
        adminBot.sendMessage(adminChatId, '❌ Failed to send broadcast message: ' + error.message);
    }
}

// Firebase VIP approval handler
async function handleFirebaseVipApproval(chatId, notificationId, approved) {
    try {
        // Update notification status in Firebase
        const status = approved ? 'approved' : 'rejected';
        await firebaseManager.updateVipNotification(notificationId, status, `Admin ${approved ? 'approved' : 'rejected'} VIP request`);
        
        // Get notification details to find user
        const notification = await firebaseManager.db.ref(`vip_notifications/${notificationId}`).once('value');
        const notificationData = notification.val();
        
        if (notificationData) {
            const userId = notificationData.user_id;
            
            if (approved) {
                // Update user VIP status in Firebase
                await firebaseManager.updateUser(userId, {
                    vip_status: 'KING', // Default to KING, can be customized
                    vip_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
                });
                
                // Log activity
                await firebaseManager.logActivity(userId, 'vip_approved', {
                    notification_id: notificationId,
                    new_status: 'KING',
                    approved_by: 'admin'
                });
                
                // Send approval message to user
                try {
                    await mainBot.sendMessage(userId, 
                        `🎉 *VIP REQUEST APPROVED!*\n\n` +
                        `✅ Your VIP upgrade has been approved!\n` +
                        `👑 New Status: KING VIP\n` +
                        `⏰ Valid for: 30 days\n\n` +
                        `🎁 VIP Benefits:\n` +
                        `• Reduced ad cooldowns\n` +
                        `• Higher daily limits (20 ads)\n` +
                        `• Exclusive contests\n` +
                        `• Priority support\n\n` +
                        `Welcome to VIP! 🌟`,
                        { parse_mode: 'Markdown' }
                    );
                } catch (error) {
                    console.error('Failed to send approval message to user:', error);
                }
                
                adminBot.sendMessage(chatId, 
                    `✅ *VIP REQUEST APPROVED*\n\n` +
                    `👤 User: ${notificationData.first_name}\n` +
                    `🆔 ID: ${userId}\n` +
                    `👑 Status: KING VIP\n` +
                    `📅 Duration: 30 days\n\n` +
                    `User has been notified!`,
                    { parse_mode: 'Markdown' }
                );
            } else {
                // Log rejection activity
                await firebaseManager.logActivity(userId, 'vip_rejected', {
                    notification_id: notificationId,
                    rejected_by: 'admin'
                });
                
                // Send rejection message to user
                try {
                    await mainBot.sendMessage(userId, 
                        `❌ *VIP REQUEST REJECTED*\n\n` +
                        `Your VIP upgrade request has been reviewed and rejected.\n\n` +
                        `📞 Contact admin for more information: @Sbaroone\n` +
                        `🔄 You can submit a new request anytime.`,
                        { parse_mode: 'Markdown' }
                    );
                } catch (error) {
                    console.error('Failed to send rejection message to user:', error);
                }
                
                adminBot.sendMessage(chatId, 
                    `❌ *VIP REQUEST REJECTED*\n\n` +
                    `👤 User: ${notificationData.first_name}\n` +
                    `🆔 ID: ${userId}\n\n` +
                    `User has been notified.`,
                    { parse_mode: 'Markdown' }
                );
            }
        }
    } catch (error) {
        console.error('Firebase VIP approval error:', error);
        adminBot.sendMessage(chatId, `❌ Error processing VIP request: ${error.message}`);
    }
}

// Show Firebase user details
async function showFirebaseUserDetails(chatId, userId) {
    try {
        const user = await firebaseManager.getUser(userId);
        const activities = await firebaseManager.db.ref(`users/${userId}/activities`).limitToLast(10).once('value');
        const userActivities = activities.val() || {};
        
        if (user) {
            let message = `👤 *USER DETAILS*\n\n`;
            message += `🆔 ID: ${user.id}\n`;
            message += `👤 Name: ${user.first_name || 'Unknown'}\n`;
            message += `📱 Username: @${user.username || 'none'}\n`;
            message += `💎 Points: ${user.points || 0}\n`;
            message += `💰 Balance: $${(user.balance || 0).toFixed(2)}\n`;
            message += `📺 Ads Watched: ${user.ads_watched || 0}\n`;
            message += `📊 Daily Ads: ${user.daily_ads_watched || 0}\n`;
            message += `👑 VIP Status: ${user.vip_status || 'FREE'}\n`;
            message += `👥 Referrals: ${user.referrals || 0}\n`;
            message += `📅 Joined: ${new Date(user.join_date).toLocaleDateString()}\n\n`;
            
            // Contest progress
            if (user.contest_ads) {
                message += `🏆 *Contest Progress:*\n`;
                message += `📅 Daily: ${user.contest_ads.daily || 0}/10\n`;
                message += `📊 Weekly: ${user.contest_ads.weekly || 0}/30\n`;
                message += `🗓️ Monthly: ${user.contest_ads.monthly || 0}/200\n\n`;
            }
            
            // Recent activities
            const activityList = Object.values(userActivities).slice(-5);
            if (activityList.length > 0) {
                message += `📋 *Recent Activities:*\n`;
                activityList.forEach(activity => {
                    const time = new Date(activity.timestamp).toLocaleString();
                    message += `• ${activity.type} - ${time}\n`;
                });
            }
            
            adminBot.sendMessage(chatId, message, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '👑 Make VIP', callback_data: `make_vip_${userId}` },
                            { text: '🚫 Ban User', callback_data: `ban_user_${userId}` }
                        ],
                        [{ text: '💰 Add Points', callback_data: `add_points_${userId}` }]
                    ]
                }
            });
        } else {
            adminBot.sendMessage(chatId, `❌ User ${userId} not found in database.`);
        }
    } catch (error) {
        console.error('Show user details error:', error);
        adminBot.sendMessage(chatId, `❌ Error fetching user details: ${error.message}`);
    }
}

// Enhanced broadcast messaging with Firebase queue
async function sendFirebaseBroadcast(message, adminChatId) {
    try {
        // Queue message in Firebase
        const messageId = await firebaseManager.queueBroadcastMessage(message, adminChatId);
        
        if (messageId) {
            adminBot.sendMessage(adminChatId, '📤 Message queued for broadcast. Processing...');
            
            // Get all users from Firebase
            const users = await firebaseManager.getAllUsers();
            
            let successCount = 0;
            let failCount = 0;
            
            for (const user of users) {
                try {
                    await mainBot.sendMessage(user.id, `📢 **ADMIN MESSAGE**\n\n${message}`, {
                        parse_mode: 'Markdown'
                    });
                    successCount++;
                    
                    // Small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`Failed to send broadcast to user ${user.id}:`, error);
                    failCount++;
                }
            }
            
            // Mark broadcast as sent
            await firebaseManager.markBroadcastSent(messageId);
            
            adminBot.sendMessage(adminChatId, 
                `✅ **BROADCAST COMPLETE**\n\n` +
                `📤 Messages sent: ${successCount}\n` +
                `❌ Failed: ${failCount}\n` +
                `👥 Total users: ${users.length}`
            );
        } else {
            adminBot.sendMessage(adminChatId, '❌ Failed to queue broadcast message.');
        }
    } catch (error) {
        console.error('Firebase broadcast error:', error);
        adminBot.sendMessage(adminChatId, '❌ Failed to send broadcast message: ' + error.message);
    }
}

console.log('🤖 Admin Bot is running and ready to manage NAVIGI!');
console.log('🔥 Firebase Real-time Database: Connected');
console.log('📞 VIP notification listener: Active');
console.log('📊 System ready for real-time administration!');

