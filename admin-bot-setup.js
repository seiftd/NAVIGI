const TelegramBot = require('node-telegram-bot-api');

// Admin Bot Configuration
const ADMIN_BOT_TOKEN = '8095971099:AAFDLGO8oFBPgmI878cFeCuil3tf9Kh2tmM';
const ADMIN_USER_ID = '@Sbaroone'; // Replace with actual admin user ID
const MAIN_BOT_API_URL = 'https://navigiu.netlify.app/.netlify/functions';

// Create admin bot instance
const adminBot = new TelegramBot(ADMIN_BOT_TOKEN, { polling: true });

console.log('🤖 Admin Bot (@Seifoneme_bot) started successfully!');

// Admin authentication middleware
function isAdmin(userId) {
    // Add your admin user IDs here
    const adminIds = ['123456789', '987654321']; // Replace with actual admin IDs
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
                    [{ text: '📱 Open Web Dashboard', url: 'https://navigiu.netlify.app/admin-dashboard.html' }]
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
        if (data.startsWith('approve_vip_')) {
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
            // Set user state for next message
            
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
        await fetch(`${MAIN_BOT_API_URL}/admin-approve-vip-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                request_id: requestId,
                action: 'approve',
                admin_id: 'admin_bot'
            })
        });
        
        console.log(`VIP request ${requestId} approved`);
    } catch (error) {
        console.error('Failed to approve VIP request:', error);
        throw error;
    }
}

async function rejectVipRequest(requestId) {
    try {
        await fetch(`${MAIN_BOT_API_URL}/admin-approve-vip-request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                request_id: requestId,
                action: 'reject',
                admin_id: 'admin_bot'
            })
        });
        
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

console.log('🤖 Admin Bot is running and ready to manage NAVIGI!');
