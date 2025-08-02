const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const TelegramBot = require('node-telegram-bot-api');

// ================================
// CONFIGURATION
// ================================

const BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
const ADMIN_USER_ID = 7544271642;

// Firebase Service Account Configuration
const serviceAccount = {
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

const DATABASE_URL = "https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app";

// ================================
// INITIALIZE SERVICES
// ================================

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: DATABASE_URL
});

const database = admin.database();

// Initialize Bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ================================
// BOT STATUS & CONTROL
// ================================

let botStatus = 'online';
let botStats = {
    totalUsers: 0,
    activeUsers: 0,
    messagesToday: 0,
    commandsExecuted: 0,
    lastActivity: new Date()
};

// Update bot statistics
async function updateBotStats() {
    try {
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        const activitiesSnapshot = await database.ref('activities').once('value');
        const activities = activitiesSnapshot.val() || {};
        
        const today = new Date().toDateString();
        const todayActivities = Object.values(activities).filter(activity => 
            new Date(activity.timestamp).toDateString() === today
        );
        
        botStats = {
            totalUsers: Object.keys(users).length,
            activeUsers: todayActivities.length,
            messagesToday: todayActivities.length,
            commandsExecuted: todayActivities.length,
            lastActivity: new Date()
        };
        
        return botStats;
    } catch (error) {
        console.error('Error updating bot stats:', error);
        return botStats;
    }
}

// ================================
// API ENDPOINTS
// ================================

// Get bot status
app.get('/api/bot-status', async (req, res) => {
    try {
        const stats = await updateBotStats();
        res.json({
            status: botStatus,
            connected: botStatus === 'online',
            stats: stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            connected: false,
            error: error.message
        });
    }
});

// Send bot command
app.post('/api/bot-command', async (req, res) => {
    try {
        const { command, params } = req.body;
        
        switch (command) {
            case 'broadcast':
                await sendBroadcastMessage(params.message);
                break;
                
            case 'restart':
                await restartBot();
                break;
                
            case 'stop':
                await stopBot();
                break;
                
            case 'start':
                await startBot();
                break;
                
            case 'stats':
                const stats = await updateBotStats();
                return res.json({ success: true, data: stats });
                
            case 'sendVipNotification':
                await sendVipNotification(params.userId, params.message);
                break;
                
            case 'resetUser':
                await resetUserData(params.userId);
                break;
                
            case 'exportLogs':
                const logs = await exportBotLogs();
                return res.json({ success: true, data: logs });
                
            case 'updateConfig':
                await updateBotConfig(params);
                break;
                
            default:
                return res.status(400).json({ success: false, error: 'Unknown command' });
        }
        
        res.json({ success: true, message: `Command ${command} executed successfully` });
    } catch (error) {
        console.error('Bot command error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ================================
// BOT COMMAND IMPLEMENTATIONS
// ================================

// Send broadcast message
async function sendBroadcastMessage(message) {
    try {
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        let sentCount = 0;
        for (const userId in users) {
            try {
                await bot.sendMessage(userId, `📢 **BROADCAST MESSAGE**\n\n${message}\n\n_From NAVIGI Admin_`, { parse_mode: 'Markdown' });
                sentCount++;
                await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
            } catch (error) {
                console.error(`Failed to send broadcast to ${userId}:`, error);
            }
        }
        
        console.log(`Broadcast sent to ${sentCount} users`);
        return sentCount;
    } catch (error) {
        console.error('Broadcast error:', error);
        throw error;
    }
}

// Restart bot
async function restartBot() {
    try {
        botStatus = 'restarting';
        console.log('Bot restart initiated');
        
        // Stop polling
        bot.stopPolling();
        
        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Restart polling
        bot.startPolling();
        botStatus = 'online';
        
        console.log('Bot restarted successfully');
    } catch (error) {
        console.error('Bot restart error:', error);
        botStatus = 'error';
        throw error;
    }
}

// Stop bot
async function stopBot() {
    try {
        botStatus = 'stopped';
        bot.stopPolling();
        console.log('Bot stopped');
    } catch (error) {
        console.error('Bot stop error:', error);
        throw error;
    }
}

// Start bot
async function startBot() {
    try {
        botStatus = 'starting';
        bot.startPolling();
        botStatus = 'online';
        console.log('Bot started');
    } catch (error) {
        console.error('Bot start error:', error);
        botStatus = 'error';
        throw error;
    }
}

// Send VIP notification
async function sendVipNotification(userId, message) {
    try {
        await bot.sendMessage(userId, `👑 **VIP NOTIFICATION**\n\n${message}\n\n_From NAVIGI Admin_`, { parse_mode: 'Markdown' });
        console.log(`VIP notification sent to ${userId}`);
    } catch (error) {
        console.error('VIP notification error:', error);
        throw error;
    }
}

// Reset user data
async function resetUserData(userId) {
    try {
        await database.ref(`users/${userId}`).remove();
        await database.ref(`activities`).orderByChild('user_id').equalTo(userId).once('value').then(snapshot => {
            snapshot.forEach(child => child.ref.remove());
        });
        console.log(`User data reset for ${userId}`);
    } catch (error) {
        console.error('User reset error:', error);
        throw error;
    }
}

// Export bot logs
async function exportBotLogs() {
    try {
        const activitiesSnapshot = await database.ref('activities').once('value');
        const activities = activitiesSnapshot.val() || {};
        
        const logs = Object.values(activities).map(activity => ({
            timestamp: new Date(activity.timestamp).toISOString(),
            level: 'INFO',
            message: `${activity.type} - ${getActivityDetails(activity)}`,
            userId: activity.user_id
        }));
        
        return logs;
    } catch (error) {
        console.error('Export logs error:', error);
        throw error;
    }
}

// Update bot configuration
async function updateBotConfig(config) {
    try {
        await database.ref('bot_config').set(config);
        console.log('Bot configuration updated');
    } catch (error) {
        console.error('Config update error:', error);
        throw error;
    }
}

// Helper function for activity details
function getActivityDetails(activity) {
    switch (activity.type) {
        case 'watch_ad':
            return `Watched ad for ${activity.points || 0} points`;
        case 'vip_upgrade':
            return `Upgraded to ${activity.tier || 'VIP'}`;
        case 'contest_participation':
            return `Participated in contest`;
        default:
            return activity.type;
    }
}

// ================================
// START SERVER
// ================================

app.listen(PORT, () => {
    console.log(`🚀 NAVIGI API Server running on port ${PORT}`);
    console.log(`📊 Bot status: ${botStatus}`);
    console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
});

// Update stats periodically
setInterval(updateBotStats, 30000); // Every 30 seconds

module.exports = app;