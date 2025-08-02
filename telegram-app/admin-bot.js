const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Admin Bot configuration with your actual credentials
const ADMIN_BOT_TOKEN = '8095971099:AAFDLGO8oFBPgmI878cFeCuil3tf9Kh2tmM';
const MAIN_BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
const ADMIN_USER_ID = 7544271642; // @Sbaroone
const ADMIN_DASHBOARD_URL = 'https://navigiu.netlify.app/admin-dashboard';

// Firebase configuration with your actual credentials
const firebaseConfig = {
    type: "service_account",
    project_id: "navigi-sbaro-bot",
    private_key_id: "2cd76e607b9ac1e25adb85950d1cd8d0aa3838ff",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqN0JXFFz7FgaS\nCAro/hyX1xdVoDz8Lqzpb+xhXFAuotkixzqG0IEKc4YCniNhxnRR8YIF+561UQEh\ng6/GSz3unuPqYEvsA91vvvjFjNSYKq53Zd4myL6AfHSef01mljdHXSMB1uDekSB5\nr81XiI6FbS+ca3i6tXkcVkxPy2xfnDJZSeQOaxgfFX2WeKkt0hRoa7KWETI9Co0G\nbIx//bmKB9P5wcc6jvUQmVT9qkBn0cyYZfGSx3sFLGOUcCUR/InZqAb4V25PuV/Z\nnlKvUywd85chpBvPrhSDulQNI0oSWK61jhiwUHckC8BTath4uQNG+yEMOAA7zZ0w\nGlEd0T4RAgMBAAECggEAAT6mtErQlEB4u1QmOkZzcJPQ1p41m/V+a7WXEa4yYujr\ndBLnZWl8bBZkrju4UAR6wMemlwMcScCmJLfZDvbpZMeSLJpYK8lqcuD/YjhxrIwx\nWuuqiHeS1w8x7h/Jsdya2mF+ukp3OgFvLpyfwIpd2nFuNfNePmVJ1bB23eWDrR5M\n9my4fIoSrxiGZnbQpLuIbuhc0RZjVb0fXcCri3QVlryoWonhIRRezaX3wN3os6WW\nN5ROPCJNGrldlQwfZZ24a81MUHmJncKUl3ZEPK1dIGncZ1OMyhCh/BTYbmQU3dYG\nZeK4DrcrJ7l66O8IBkkPUR5J/BdRXgM5h9u8D9QbbQKBgQDugtUk6yV/rvtDG13j\nl+nJokzqhvkh8Jzn3wSRXp7MFAf2liDBNw7Aj7cXpMZk0UYowFt+CNI80vsDCe0I\nHQYYp9TAx+JoRWN9zf6WwoZyEOnOOXFXukWslm7ZzLYuNf5rEhoUYOH4D6I/kT62\nO30BrsHTWvWGarJPfTqHtgw75QKBgQC2sm9z0JPdhcIXxAl8x5/S4opL5EBNID+m\njlj/vQMHMkurEpP685wLXNDugyLaWzt0NtfwKnTIIaZUb21gInAUPMrMhTOsRlMG\nNm7ijHZL3Tyg4L6n+nlW2koAd/kOjPP6xbYEWGRIYnZATcFSi7ZGrJlmD6VRthUB\nAFIB/lCOvQKBgH+YVlZtxZ3NCnYYCd5bwqIvxV4h3t2dTxNsZ5EtQV6DyM7N+a/j\nuGyjdZucdtYwbowWe9us9Gu9orM5eCjC/iPqhRKs3B5UIKmIrg4Q+sPC8JF2gYAh\nEm0F/T9fGIcYM4csI++K9Ngz5OSE2zu6D2H7D432Nys1oTaNE+bOKTVRAoGAbA0M\nLYrmaNV6/WNL2SiXNboV4NyVywePnYoCyP2YlOECL6NFMd5yI6Y5S1bzfgEHIKxu\n+fOiLdr47GcaYQj9EHsD1gHRlcnhwILhAcvhCu1FtkA1glN5AA0KR0ytWBW1FlNo\nWxmL9eOF3HIgLBnFK/dYoiwOskzmDzmJRvSJ4GECgYEAgn93FQKP6smVxd7iO61X\nhCst4R9nhMMJNRs9ybOQyGFfClxJChsIggY8oroS8PixiDpVkHqT/BkQtTHWO9EB\nU+82sQNllrTrWFGAwKavmFzziZYdhq3JmWvIkdfEVnXFxk1caQmEnRQQeVl81Geg\n9RuZuXk9GJUWev4Kl+rJBWY=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@navigi-sbaro-bot.iam.gserviceaccount.com",
    client_id: "117901818637830270085",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40navigi-sbaro-bot.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

// Initialize Firebase Admin SDK
let database = null;
let isFirebaseInitialized = false;

function initializeFirebase() {
    try {
        // Check if Firebase is already initialized
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(firebaseConfig),
                databaseURL: "https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/"
            });
        }
        database = admin.database();
        isFirebaseInitialized = true;
        console.log('🔥 Admin Bot Firebase initialized successfully!');
        console.log('📍 Database: https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/');
        return true;
    } catch (error) {
        console.error('❌ Admin Bot Firebase initialization failed:', error);
        return false;
    }
}

// Initialize admin bot
const adminBot = new TelegramBot(ADMIN_BOT_TOKEN, { polling: true });

// Initialize main bot for sending messages to users
const mainBot = new TelegramBot(MAIN_BOT_TOKEN, { polling: false });

// Start command for admin bot
adminBot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId === ADMIN_USER_ID) {
        const welcomeMessage = `🔧 *NAVIGI SBARO Admin Bot*

Welcome to the admin control panel!

🎯 *Available Commands:*
• /dashboard - View system statistics
• /vip - Manage VIP requests
• /users - User management
• /broadcast - Send broadcast message
• /reset - Reset system data

📊 *Quick Access:*`;

        const keyboard = {
            inline_keyboard: [
                [
                    { text: '📊 Dashboard', callback_data: 'admin_dashboard' },
                    { text: '👑 VIP Requests', callback_data: 'admin_vip' }
                ],
                [
                    { text: '👥 Users', callback_data: 'admin_users' },
                    { text: '📢 Broadcast', callback_data: 'admin_broadcast' }
                ],
                [
                    { text: '🌐 Web Dashboard', url: ADMIN_DASHBOARD_URL }
                ]
            ]
        };
        
        adminBot.sendMessage(chatId, welcomeMessage, {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        });
    } else {
        adminBot.sendMessage(chatId, '❌ Access denied. This bot is for administrators only.');
    }
});

// Dashboard command
adminBot.onText(/\/dashboard/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== ADMIN_USER_ID) {
        adminBot.sendMessage(chatId, '❌ Access denied');
        return;
    }
    
    if (!isFirebaseInitialized) {
        adminBot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        // Get system statistics
        const [usersSnapshot, activitiesSnapshot, vipNotificationsSnapshot] = await Promise.all([
            database.ref('users').once('value'),
            database.ref('activities').once('value'),
            database.ref('vip_notifications').orderByChild('status').equalTo('pending').once('value')
        ]);
        
        const users = usersSnapshot.val() || {};
        const activities = activitiesSnapshot.val() || {};
        const vipNotifications = vipNotificationsSnapshot.val() || {};
        
        const totalUsers = Object.keys(users).length;
        const totalActivities = Object.keys(activities).length;
        const pendingVipRequests = Object.keys(vipNotifications).length;
        const totalPoints = Object.values(users).reduce((sum, user) => sum + (user.points || 0), 0);
        const totalAds = Object.values(users).reduce((sum, user) => sum + (user.ads_watched || 0), 0);
        const activeToday = Object.values(users).filter(user => 
            user.last_ad_reset === new Date().toDateString()
        ).length;
        
        const vipUsers = Object.values(users).filter(user => user.vip_status !== 'FREE').length;
        
        const dashboardMessage = `📊 *NAVIGI SBARO Dashboard*

👥 *Users:* ${totalUsers.toLocaleString()}
🟢 *Active Today:* ${activeToday}
👑 *VIP Users:* ${vipUsers}

💎 *Points Distributed:* ${totalPoints.toLocaleString()}
📺 *Total Ads Watched:* ${totalAds.toLocaleString()}
📊 *Total Activities:* ${totalActivities.toLocaleString()}

📞 *Pending VIP Requests:* ${pendingVipRequests}

🌐 *Web Dashboard:* ${ADMIN_DASHBOARD_URL}
🔥 *Firebase:* Connected
⏰ *Last Update:* ${new Date().toLocaleString()}`;

        const keyboard = {
            inline_keyboard: [
                [
                    { text: '👑 Handle VIP Requests', callback_data: 'admin_vip' },
                    { text: '👥 View Users', callback_data: 'admin_users' }
                ],
                [
                    { text: '🔄 Refresh', callback_data: 'admin_dashboard' },
                    { text: '🌐 Web Dashboard', url: ADMIN_DASHBOARD_URL }
                ]
            ]
        };
        
        adminBot.sendMessage(chatId, dashboardMessage, {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        });
        
    } catch (error) {
        console.error('❌ Error getting dashboard stats:', error);
        adminBot.sendMessage(chatId, '❌ Error retrieving dashboard statistics');
    }
});

// VIP management command
adminBot.onText(/\/vip/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId !== ADMIN_USER_ID) {
        adminBot.sendMessage(chatId, '❌ Access denied');
        return;
    }
    
    await showVipRequests(chatId);
});

// Show VIP requests
async function showVipRequests(chatId) {
    if (!isFirebaseInitialized) {
        adminBot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        const vipNotificationsSnapshot = await database.ref('vip_notifications')
            .orderByChild('status')
            .equalTo('pending')
            .once('value');
        
        const vipNotifications = vipNotificationsSnapshot.val() || {};
        const notifications = Object.values(vipNotifications);
        
        if (notifications.length === 0) {
            adminBot.sendMessage(chatId, '✅ No pending VIP requests');
            return;
        }
        
        let message = `👑 *Pending VIP Requests* (${notifications.length})\n\n`;
        
        for (const notification of notifications.slice(0, 5)) { // Show max 5 at a time
            const userSnapshot = await database.ref(`users/${notification.user_id}`).once('value');
            const user = userSnapshot.val() || {};
            
            message += `👤 *${notification.first_name || 'Unknown'}*\n`;
            message += `🆔 ID: \`${notification.user_id}\`\n`;
            if (notification.username) message += `📱 @${notification.username}\n`;
            message += `💎 Points: ${user.points || 0}\n`;
            message += `📺 Ads: ${user.ads_watched || 0}\n`;
            message += `👥 Referrals: ${user.referrals || 0}\n`;
            message += `⏰ ${formatTimeAgo(new Date(notification.created_at))}\n\n`;
        }
        
        const keyboard = {
            inline_keyboard: []
        };
        
        // Add approve/reject buttons for each request
        for (const notification of notifications.slice(0, 3)) { // Max 3 buttons per row
            keyboard.inline_keyboard.push([
                { 
                    text: `✅ Approve ${notification.first_name || 'User'}`, 
                    callback_data: `vip_approve_${notification.id}_${notification.user_id}` 
                },
                { 
                    text: `❌ Reject ${notification.first_name || 'User'}`, 
                    callback_data: `vip_reject_${notification.id}_${notification.user_id}` 
                }
            ]);
        }
        
        keyboard.inline_keyboard.push([
            { text: '🔄 Refresh', callback_data: 'admin_vip' },
            { text: '✅ Approve All', callback_data: 'vip_approve_all' }
        ]);
        
        adminBot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: keyboard
        });
        
    } catch (error) {
        console.error('❌ Error getting VIP requests:', error);
        adminBot.sendMessage(chatId, '❌ Error retrieving VIP requests');
    }
}

// Handle callback queries
adminBot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    
    if (userId !== ADMIN_USER_ID) {
        adminBot.answerCallbackQuery(query.id, { text: '❌ Access denied' });
        return;
    }
    
    try {
        if (data === 'admin_dashboard') {
            adminBot.answerCallbackQuery(query.id);
            // Trigger dashboard command
            adminBot.emit('message', { chat: { id: chatId }, from: { id: userId }, text: '/dashboard' });
        }
        else if (data === 'admin_vip') {
            adminBot.answerCallbackQuery(query.id);
            await showVipRequests(chatId);
        }
        else if (data.startsWith('vip_approve_')) {
            const [, , notificationId, targetUserId] = data.split('_');
            await handleVipApproval(chatId, notificationId, targetUserId, true);
            adminBot.answerCallbackQuery(query.id, { text: '✅ VIP request approved!' });
        }
        else if (data.startsWith('vip_reject_')) {
            const [, , notificationId, targetUserId] = data.split('_');
            await handleVipApproval(chatId, notificationId, targetUserId, false);
            adminBot.answerCallbackQuery(query.id, { text: '❌ VIP request rejected!' });
        }
        else if (data === 'vip_approve_all') {
            await approveAllVipRequests(chatId);
            adminBot.answerCallbackQuery(query.id, { text: '✅ All VIP requests approved!' });
        }
        else {
            adminBot.answerCallbackQuery(query.id);
        }
    } catch (error) {
        console.error('❌ Error handling callback query:', error);
        adminBot.answerCallbackQuery(query.id, { text: '❌ Error processing request' });
    }
});

// Handle VIP approval/rejection
async function handleVipApproval(chatId, notificationId, targetUserId, approved) {
    if (!isFirebaseInitialized) {
        adminBot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        const vipTier = approved ? 'KING' : 'FREE';
        const status = approved ? 'approved' : 'rejected';
        const adminResponse = approved ? `Approved as ${vipTier}` : 'Request rejected by admin';
        
        // Update notification status
        await database.ref(`vip_notifications/${notificationId}`).update({
            status: status,
            admin_response: adminResponse,
            processed_at: admin.database.ServerValue.TIMESTAMP,
            processed_by: ADMIN_USER_ID
        });
        
        if (approved) {
            // Update user VIP status
            const vipExpiry = new Date();
            vipExpiry.setDate(vipExpiry.getDate() + 30); // 30 days
            
            await database.ref(`users/${targetUserId}`).update({
                vip_status: vipTier,
                vip_expires: vipExpiry.toISOString(),
                updated_at: admin.database.ServerValue.TIMESTAMP
            });
            
            // Log activity
            await database.ref(`activities/${uuidv4()}`).set({
                id: uuidv4(),
                user_id: targetUserId,
                type: 'vip_approved',
                data: {
                    vip_tier: vipTier,
                    approved_by: 'admin',
                    notification_id: notificationId
                },
                timestamp: admin.database.ServerValue.TIMESTAMP,
                created_at: new Date().toISOString()
            });
            
            // Send success message to user via main bot
            try {
                await mainBot.sendMessage(targetUserId, `🎉 *VIP Request Approved!*

Congratulations! Your VIP upgrade request has been approved by admin.

👑 *New Status:* ${vipTier} VIP
⏰ *Valid Until:* ${vipExpiry.toLocaleDateString()}

🎯 *VIP Benefits:*
• Higher daily ad limits (20 ads/day)
• Reduced cooldowns (5 minutes)
• Exclusive contests
• Priority support

Welcome to VIP! 🚀`, {
                    parse_mode: 'Markdown'
                });
            } catch (error) {
                console.error('❌ Error sending approval message to user:', error);
            }
            
            adminBot.sendMessage(chatId, `✅ VIP request approved for user ${targetUserId}\n👑 Status: ${vipTier}\n⏰ Expires: ${vipExpiry.toLocaleDateString()}`);
        } else {
            // Log rejection activity
            await database.ref(`activities/${uuidv4()}`).set({
                id: uuidv4(),
                user_id: targetUserId,
                type: 'vip_rejected',
                data: {
                    rejected_by: 'admin',
                    notification_id: notificationId
                },
                timestamp: admin.database.ServerValue.TIMESTAMP,
                created_at: new Date().toISOString()
            });
            
            // Send rejection message to user via main bot
            try {
                await mainBot.sendMessage(targetUserId, `❌ *VIP Request Rejected*

Unfortunately, your VIP upgrade request has been rejected by admin.

💡 *Possible reasons:*
• Insufficient activity
• Not enough ads watched
• Account too new

🎯 *To improve your chances:*
• Watch more ads daily
• Refer friends to the bot
• Be more active in contests
• Try again after a few days

Contact admin: @Sbaroone`, {
                    parse_mode: 'Markdown'
                });
            } catch (error) {
                console.error('❌ Error sending rejection message to user:', error);
            }
            
            adminBot.sendMessage(chatId, `❌ VIP request rejected for user ${targetUserId}`);
        }
        
        // Refresh VIP requests display
        setTimeout(() => showVipRequests(chatId), 2000);
        
    } catch (error) {
        console.error('❌ Error handling VIP approval:', error);
        adminBot.sendMessage(chatId, '❌ Error processing VIP request');
    }
}

// Approve all VIP requests
async function approveAllVipRequests(chatId) {
    if (!isFirebaseInitialized) {
        adminBot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        const vipNotificationsSnapshot = await database.ref('vip_notifications')
            .orderByChild('status')
            .equalTo('pending')
            .once('value');
        
        const vipNotifications = vipNotificationsSnapshot.val() || {};
        const notifications = Object.values(vipNotifications);
        
        if (notifications.length === 0) {
            adminBot.sendMessage(chatId, '✅ No pending VIP requests to approve');
            return;
        }
        
        let approvedCount = 0;
        
        for (const notification of notifications) {
            try {
                await handleVipApproval(chatId, notification.id, notification.user_id, true);
                approvedCount++;
            } catch (error) {
                console.error('❌ Error approving VIP request:', error);
            }
        }
        
        adminBot.sendMessage(chatId, `✅ Approved ${approvedCount} VIP requests!`);
        
    } catch (error) {
        console.error('❌ Error approving all VIP requests:', error);
        adminBot.sendMessage(chatId, '❌ Error processing VIP requests');
    }
}

// Broadcast message command
adminBot.onText(/\/broadcast (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const message = match[1];
    
    if (userId !== ADMIN_USER_ID) {
        adminBot.sendMessage(chatId, '❌ Access denied');
        return;
    }
    
    if (!isFirebaseInitialized) {
        adminBot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        // Get all users
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        const userIds = Object.keys(users);
        
        if (userIds.length === 0) {
            adminBot.sendMessage(chatId, '❌ No users found');
            return;
        }
        
        adminBot.sendMessage(chatId, `📢 Broadcasting message to ${userIds.length} users...`);
        
        let sentCount = 0;
        let failedCount = 0;
        
        // Send message to all users
        for (const userId of userIds) {
            try {
                await mainBot.sendMessage(userId, `📢 *Admin Broadcast*\n\n${message}`, {
                    parse_mode: 'Markdown'
                });
                sentCount++;
            } catch (error) {
                failedCount++;
                console.error(`❌ Failed to send broadcast to user ${userId}:`, error.message);
            }
            
            // Add small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Log broadcast activity
        await database.ref(`activities/${uuidv4()}`).set({
            id: uuidv4(),
            user_id: ADMIN_USER_ID,
            type: 'admin_broadcast',
            data: {
                message: message,
                sent_count: sentCount,
                failed_count: failedCount,
                total_users: userIds.length
            },
            timestamp: admin.database.ServerValue.TIMESTAMP,
            created_at: new Date().toISOString()
        });
        
        adminBot.sendMessage(chatId, `✅ Broadcast completed!\n\n📊 *Results:*\n• Sent: ${sentCount}\n• Failed: ${failedCount}\n• Total: ${userIds.length}`);
        
    } catch (error) {
        console.error('❌ Error sending broadcast:', error);
        adminBot.sendMessage(chatId, '❌ Error sending broadcast message');
    }
});

// Real-time VIP notification listener
function setupVipNotificationListener() {
    if (!isFirebaseInitialized) {
        console.log('⚠️ Firebase not initialized - VIP listener not set up');
        return;
    }
    
    try {
        database.ref('vip_notifications')
            .orderByChild('status')
            .equalTo('pending')
            .on('child_added', async (snapshot) => {
                const notification = snapshot.val();
                console.log('📞 New VIP notification received:', notification);
                
                // Send instant notification to admin
                try {
                    const userSnapshot = await database.ref(`users/${notification.user_id}`).once('value');
                    const user = userSnapshot.val() || {};
                    
                    const message = `🔔 *New VIP Request!*

👤 *User:* ${notification.first_name || 'Unknown'}
🆔 *ID:* \`${notification.user_id}\`
${notification.username ? `📱 *Username:* @${notification.username}\n` : ''}
💎 *Points:* ${user.points || 0}
📺 *Ads Watched:* ${user.ads_watched || 0}
👥 *Referrals:* ${user.referrals || 0}
⏰ *Requested:* ${formatTimeAgo(new Date(notification.created_at))}

Quick actions:`;
                    
                    const keyboard = {
                        inline_keyboard: [
                            [
                                { 
                                    text: '✅ Approve as KING', 
                                    callback_data: `vip_approve_${notification.id}_${notification.user_id}` 
                                },
                                { 
                                    text: '❌ Reject', 
                                    callback_data: `vip_reject_${notification.id}_${notification.user_id}` 
                                }
                            ],
                            [
                                { text: '👑 View All VIP Requests', callback_data: 'admin_vip' }
                            ]
                        ]
                    };
                    
                    adminBot.sendMessage(ADMIN_USER_ID, message, {
                        parse_mode: 'Markdown',
                        reply_markup: keyboard
                    });
                    
                } catch (error) {
                    console.error('❌ Error sending VIP notification to admin:', error);
                }
            });
        
        console.log('👂 VIP notification listener set up successfully');
    } catch (error) {
        console.error('❌ Error setting up VIP notification listener:', error);
    }
}

// Utility functions
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Initialize admin bot
async function startAdminBot() {
    console.log('🚀 Starting NAVIGI SBARO Admin Bot...');
    
    // Initialize Firebase
    const firebaseInitialized = initializeFirebase();
    
    if (firebaseInitialized) {
        // Set up real-time VIP notification listener
        setupVipNotificationListener();
        
        console.log('✅ Admin Bot started successfully!');
        console.log('📊 Admin Dashboard:', ADMIN_DASHBOARD_URL);
        console.log('👤 Admin User ID:', ADMIN_USER_ID);
        console.log('🔥 Firebase Real-time Database: Connected');
        console.log('👂 VIP notification listener: Active');
        console.log('📊 Admin bot ready for real-time VIP management!');
    } else {
        console.log('⚠️ Admin Bot started without Firebase connection');
    }
}

// Error handling
adminBot.on('error', (error) => {
    console.error('❌ Admin Bot error:', error);
});

adminBot.on('polling_error', (error) => {
    console.error('❌ Admin Bot polling error:', error);
});

// Start the admin bot
startAdminBot();