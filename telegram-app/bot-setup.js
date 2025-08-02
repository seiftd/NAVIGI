const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Bot configuration with your actual credentials
const BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
const ADMIN_USER_ID = 7544271642; // @Sbaroone
const WEBAPP_URL = 'https://navigiu.netlify.app/';
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
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: "https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/"
        });
        database = admin.database();
        isFirebaseInitialized = true;
        console.log('🔥 Firebase initialized successfully!');
        console.log('📍 Database: https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/');
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// User data cache
const users = new Map();
const userCooldowns = new Map();

// Cooldown settings
const AD_COOLDOWN = 7 * 60 * 1000; // 7 minutes
const CONTEST_COOLDOWN = 5 * 60 * 1000; // 5 minutes for contests
const DAILY_LOGIN_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

// Daily limits
const DAILY_LIMITS = {
    'FREE': 12,
    'KING': 20,
    'EMPEROR': 30,
    'LORD': 50
};

// Firebase helper functions
async function createUser(userId, userData) {
    if (!isFirebaseInitialized) return null;
    try {
        const userRef = database.ref(`users/${userId}`);
        const newUser = {
            id: userId,
            username: userData.username || null,
            first_name: userData.first_name || null,
            points: 0,
            balance: 0.00,
            ads_watched: 0,
            daily_ads_watched: 0,
            last_ad_reset: new Date().toDateString(),
            contest_ads: { daily: 0, weekly: 0, monthly: 0 },
            contests_joined: 0,
            referrals: 0,
            vip_status: 'FREE',
            vip_expires: null,
            referred_by: null,
            join_date: new Date().toISOString(),
            created_at: admin.database.ServerValue.TIMESTAMP,
            updated_at: admin.database.ServerValue.TIMESTAMP
        };
        await userRef.set(newUser);
        console.log(`✅ User ${userId} created in Firebase`);
        return newUser;
    } catch (error) {
        console.error('❌ Error creating user:', error);
        return null;
    }
}

async function getUser(userId) {
    if (!isFirebaseInitialized) return null;
    try {
        const userRef = database.ref(`users/${userId}`);
        const snapshot = await userRef.once('value');
        return snapshot.val();
    } catch (error) {
        console.error('❌ Error getting user:', error);
        return null;
    }
}

async function updateUser(userId, updates) {
    if (!isFirebaseInitialized) return false;
    try {
        const userRef = database.ref(`users/${userId}`);
        await userRef.update({
            ...updates,
            updated_at: admin.database.ServerValue.TIMESTAMP
        });
        console.log(`✅ User ${userId} updated in Firebase`);
        return true;
    } catch (error) {
        console.error('❌ Error updating user:', error);
        return false;
    }
}

async function logActivity(userId, activityType, data = {}) {
    if (!isFirebaseInitialized) return false;
    try {
        const activityId = uuidv4();
        const activityRef = database.ref(`activities/${activityId}`);
        
        const activity = {
            id: activityId,
            user_id: userId,
            type: activityType,
            data: data,
            timestamp: admin.database.ServerValue.TIMESTAMP,
            created_at: new Date().toISOString()
        };
        
        await activityRef.set(activity);
        console.log(`✅ Activity logged: ${activityType} for user ${userId}`);
        return true;
    } catch (error) {
        console.error('❌ Error logging activity:', error);
        return false;
    }
}

async function sendVipNotification(userId, userData, requestType = 'request') {
    if (!isFirebaseInitialized) return false;
    try {
        const notificationId = uuidv4();
        const notificationRef = database.ref(`vip_notifications/${notificationId}`);
        
        const notification = {
            id: notificationId,
            user_id: userId,
            username: userData.username,
            first_name: userData.first_name,
            type: requestType,
            status: 'pending',
            timestamp: admin.database.ServerValue.TIMESTAMP,
            created_at: new Date().toISOString()
        };
        
        await notificationRef.set(notification);
        console.log(`✅ VIP notification sent for user ${userId}`);
        return notificationId;
    } catch (error) {
        console.error('❌ Error sending VIP notification:', error);
        return false;
    }
}

// Initialize user function
async function initUser(userId, userData = {}) {
    // Try to get user from Firebase first
    let user = await getUser(userId);
    
    if (!user) {
        // Create new user in Firebase
        user = await createUser(userId, userData);
        
        // Fallback to local storage if Firebase fails
        if (!user) {
            user = {
                id: userId,
                username: userData.username || null,
                first_name: userData.first_name || null,
                points: 0,
                balance: 0.00,
                ads_watched: 0,
                daily_ads_watched: 0,
                last_ad_reset: new Date().toDateString(),
                contest_ads: { daily: 0, weekly: 0, monthly: 0 },
                contests_joined: 0,
                referrals: 0,
                vip_status: 'FREE',
                vip_expires: null,
                referred_by: null,
                join_date: new Date().toISOString()
            };
        }
        
        // Log new user activity
        await logActivity(userId, 'user_joined', {
            username: userData.username,
            first_name: userData.first_name,
            platform: 'telegram_bot'
        });
    } else {
        // User exists, ensure contest_ads is properly structured
        if (!user.contest_ads || typeof user.contest_ads !== 'object') {
            user.contest_ads = { daily: 0, weekly: 0, monthly: 0 };
            await updateUser(userId, { contest_ads: user.contest_ads });
        }
    }
    
    // Reset daily ads if new day
    const today = new Date().toDateString();
    if (user.last_ad_reset !== today) {
        user.daily_ads_watched = 0;
        user.last_ad_reset = today;
        await updateUser(userId, {
            daily_ads_watched: 0,
            last_ad_reset: today
        });
    }
    
    // Store in local cache
    users.set(userId, user);
    return user;
}

// Start command
bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const referralCode = match[1] ? match[1].trim() : null;
    
    // Initialize user
    const user = await initUser(userId, {
        username: msg.from.username,
        first_name: msg.from.first_name
    });
    
    // Handle referral
    if (referralCode && referralCode.startsWith('_ref_')) {
        const referrerId = referralCode.replace('_ref_', '');
        if (referrerId !== userId.toString() && !user.referred_by) {
            const referrer = await getUser(referrerId);
            if (referrer) {
                user.referred_by = referrerId;
                await updateUser(userId, { referred_by: referrerId });
                
                // Update referrer
                await updateUser(referrerId, {
                    referrals: (referrer.referrals || 0) + 1,
                    points: (referrer.points || 0) + 1
                });
                
                await logActivity(referrerId, 'referral_earned', {
                    referred_user: userId,
                    username: msg.from.username
                });
                
                bot.sendMessage(referrerId, `🎉 New referral! You earned 1 point. Total referrals: ${(referrer.referrals || 0) + 1}`);
            }
        }
    }
    
    const welcomeMessage = `🚀 Welcome to NAVIGI SBARO!

💎 Your Stats:
Points: ${user.points || 0}
Balance: $${(user.balance || 0).toFixed(2)}
VIP Status: ${user.vip_status || 'FREE'}

🎯 What you can do:
• Watch video ads to earn points
• Join contests for big prizes
• Refer friends for bonus points
• Upgrade to VIP for better rewards

Choose an option below:`;

    const keyboard = {
        inline_keyboard: [
            [
                { text: '📺 Watch Ads', callback_data: 'earn_ads' },
                { text: '🏆 Contests', callback_data: 'contests' }
            ],
            [
                { text: '👑 VIP Upgrade', callback_data: 'vip_upgrade' },
                { text: '👥 Referrals', callback_data: 'referrals' }
            ],
            [
                { text: '👤 Profile', callback_data: 'profile' },
                { text: '🎮 Open Mini App', web_app: { url: WEBAPP_URL } }
            ]
        ]
    };
    
    bot.sendMessage(chatId, welcomeMessage, { reply_markup: keyboard });
});

// Handle callback queries
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    
    // Initialize user if not exists
    const user = await initUser(userId, {
        username: query.from.username,
        first_name: query.from.first_name
    });
    
    switch (data) {
        case 'earn_ads':
            await handleEarnAds(chatId, userId, user);
            break;
        case 'watch_ad':
            await handleWatchAd(chatId, userId, user);
            break;
        case 'contests':
            await handleContests(chatId, userId, user);
            break;
        case 'contest_daily':
            await handleContestAd(chatId, userId, user, 'daily');
            break;
        case 'contest_weekly':
            await handleContestAd(chatId, userId, user, 'weekly');
            break;
        case 'contest_monthly':
            await handleContestAd(chatId, userId, user, 'monthly');
            break;
        case 'vip_upgrade':
            await handleVipUpgrade(chatId, userId, user);
            break;
        case 'request_vip':
            await handleVipRequest(chatId, userId, user);
            break;
        case 'referrals':
            await handleReferrals(chatId, userId, user);
            break;
        case 'profile':
            await handleProfile(chatId, userId, user);
            break;
    }
    
    bot.answerCallbackQuery(query.id);
});

// Handle earn ads
async function handleEarnAds(chatId, userId, user) {
    const limit = DAILY_LIMITS[user.vip_status || 'FREE'];
    
    // Check cooldown
    const lastAdTime = userCooldowns.get(userId) || 0;
    const timeRemaining = AD_COOLDOWN - (Date.now() - lastAdTime);
    
    let message = `📺 *Earn Points with Video Ads*\n\n`;
    message += `💎 Points per ad: 1.1\n`;
    message += `⏱️ Ad duration: 2x 15-second videos\n`;
    message += `📊 Today: ${user.daily_ads_watched || 0}/${limit} ads\n`;
    message += `🎯 VIP Status: ${user.vip_status || 'FREE'}\n\n`;
    
    const keyboard = { inline_keyboard: [] };
    
    if ((user.daily_ads_watched || 0) >= limit) {
        message += `❌ Daily limit reached! Reset at midnight.`;
        keyboard.inline_keyboard.push([{ text: '🔙 Back', callback_data: 'back_main' }]);
    } else if (timeRemaining > 0) {
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        message += `⏰ Next ad available in: ${minutes} minutes`;
        keyboard.inline_keyboard.push([{ text: '🔙 Back', callback_data: 'back_main' }]);
    } else {
        message += `✅ Ready to watch ads!`;
        keyboard.inline_keyboard.push([{ text: '▶️ Watch Video Ads', callback_data: 'watch_ad' }]);
        keyboard.inline_keyboard.push([{ text: '🔙 Back', callback_data: 'back_main' }]);
    }
    
    bot.sendMessage(chatId, message, { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
    });
}

// Handle watch ad
async function handleWatchAd(chatId, userId, user) {
    const limit = DAILY_LIMITS[user.vip_status || 'FREE'];
    const lastAdTime = userCooldowns.get(userId) || 0;
    const timeRemaining = AD_COOLDOWN - (Date.now() - lastAdTime);
    
    if ((user.daily_ads_watched || 0) >= limit) {
        bot.sendMessage(chatId, '❌ Daily ad limit reached!');
        return;
    }
    
    if (timeRemaining > 0) {
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        bot.sendMessage(chatId, `⏰ Please wait ${minutes} minutes before next ad.`);
        return;
    }
    
    // Award points and update user
    const newPoints = (user.points || 0) + 1.1;
    const newBalance = (user.balance || 0) + 0.01;
    const newAdsWatched = (user.ads_watched || 0) + 1;
    const newDailyAds = (user.daily_ads_watched || 0) + 1;
    
    // Update Firebase
    await updateUser(userId, {
        points: newPoints,
        balance: newBalance,
        ads_watched: newAdsWatched,
        daily_ads_watched: newDailyAds
    });
    
    // Update local cache
    user.points = newPoints;
    user.balance = newBalance;
    user.ads_watched = newAdsWatched;
    user.daily_ads_watched = newDailyAds;
    users.set(userId, user);
    
    // Set cooldown
    userCooldowns.set(userId, Date.now());
    
    // Log activity
    await logActivity(userId, 'ad_watched', {
        points_earned: 1.1,
        balance_earned: 0.01,
        daily_count: newDailyAds,
        total_count: newAdsWatched,
        vip_status: user.vip_status
    });
    
    const message = `🎉 Ad watched successfully!

💰 Earned: +1.1 points
💵 Balance: +$0.01

📊 Your Stats:
• Points: ${newPoints.toFixed(1)}
• Balance: $${newBalance.toFixed(2)}
• Daily Ads: ${newDailyAds}/${limit}
• Total Ads: ${newAdsWatched}`;
    
    bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [
                [{ text: '📺 Watch More', callback_data: 'earn_ads' }],
                [{ text: '🎮 Open Mini App', web_app: { url: WEBAPP_URL } }]
            ]
        }
    });
}

// Handle contests
async function handleContests(chatId, userId, user) {
    // Ensure contest_ads is properly initialized
    if (!user.contest_ads || typeof user.contest_ads !== 'object') {
        user.contest_ads = { daily: 0, weekly: 0, monthly: 0 };
        await updateUser(userId, { contest_ads: user.contest_ads });
        users.set(userId, user);
    }
    
    let message = `🏆 *Contest Center*\n\n`;
    message += `Join contests by watching contest ads!\n`;
    message += `Contest ads don't earn points but qualify you for prizes.\n\n`;
    
    // Daily Contest
    const dailyAds = user.contest_ads.daily || 0;
    const dailyStatus = dailyAds >= 10 ? '✅' : '🔵';
    message += `${dailyStatus} *Daily Contest* (${dailyAds}/10 ads)\n`;
    message += `🏆 Prize: 220 points\n`;
    message += `⏰ Reset: Every 24 hours\n\n`;
    
    // Weekly Contest  
    const weeklyAds = user.contest_ads.weekly || 0;
    const weeklyStatus = weeklyAds >= 30 ? '✅' : '🔵';
    message += `${weeklyStatus} *Weekly Contest* (${weeklyAds}/30 ads)\n`;
    message += `🏆 Prize: 275 points\n`;
    message += `⏰ Reset: Every Sunday\n\n`;
    
    // Monthly Contest
    const monthlyAds = user.contest_ads.monthly || 0;
    const monthlyStatus = monthlyAds >= 200 ? '✅' : '🔵';
    message += `${monthlyStatus} *Monthly Contest* (${monthlyAds}/200 ads)\n`;
    message += `🏆 Prize: VIP King + 275 points\n`;
    message += `⏰ Reset: Every month\n\n`;
    
    const keyboard = {
        inline_keyboard: [
            [
                { text: `📺 Daily (${dailyAds}/10)`, callback_data: 'contest_daily' },
                { text: `📺 Weekly (${weeklyAds}/30)`, callback_data: 'contest_weekly' }
            ],
            [
                { text: `📺 Monthly (${monthlyAds}/200)`, callback_data: 'contest_monthly' }
            ],
            [
                { text: '🔙 Back', callback_data: 'back_main' }
            ]
        ]
    };
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
}

// Handle contest ads
async function handleContestAd(chatId, userId, user, contestType) {
    const requirements = { daily: 10, weekly: 30, monthly: 200 };
    const required = requirements[contestType];
    const watched = user.contest_ads[contestType] || 0;
    
    // Check contest cooldown
    const lastContestAdTime = userCooldowns.get(`contest_${userId}`) || 0;
    const timeRemaining = CONTEST_COOLDOWN - (Date.now() - lastContestAdTime);
    
    if (timeRemaining > 0) {
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        bot.sendMessage(chatId, `⏰ Contest ad cooldown: ${minutes} minutes`);
        return;
    }
    
    if (watched >= required) {
        bot.sendMessage(chatId, `✅ You've completed the ${contestType} contest requirements!`);
        return;
    }
    
    // Increment contest ads - REAL TIME UPDATE
    const newContestAds = { ...user.contest_ads };
    newContestAds[contestType] = (newContestAds[contestType] || 0) + 1;
    
    // Update Firebase immediately
    await updateUser(userId, {
        contest_ads: newContestAds,
        contests_joined: (user.contests_joined || 0) + 1
    });
    
    // Update local cache
    user.contest_ads = newContestAds;
    user.contests_joined = (user.contests_joined || 0) + 1;
    users.set(userId, user);
    
    // Set contest cooldown
    userCooldowns.set(`contest_${userId}`, Date.now());
    
    // Log activity
    await logActivity(userId, 'contest_ad', {
        contest_type: contestType,
        new_count: newContestAds[contestType],
        total_required: required
    });
    
    const newWatched = newContestAds[contestType];
    let message = `✅ *Contest Ad Completed!*\n\n`;
    message += `📊 ${contestType.toUpperCase()} Progress: ${newWatched}/${required}\n`;
    
    if (newWatched >= required) {
        message += `🎉 Contest requirements met! You're entered in the ${contestType} contest!\n`;
    } else {
        message += `📺 ${required - newWatched} more ads needed for ${contestType} contest\n`;
    }
    
    message += `⏰ Next contest ad in 5 minutes`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🏆 Contests', callback_data: 'contests' }],
                [{ text: '🏠 Main Menu', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle VIP upgrade
async function handleVipUpgrade(chatId, userId, user) {
    const message = `👑 *VIP Upgrade*

🔗 Visit our website to upgrade:
${WEBAPP_URL}payment.html

💎 VIP Benefits:
• Reduced ad cooldowns
• Higher daily limits
• Exclusive contests
• Priority support

📞 Or request manual approval from admin:`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🌐 Open Website', url: `${WEBAPP_URL}payment.html` }],
                [{ text: '📞 Request VIP Approval', callback_data: 'request_vip' }],
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle VIP request
async function handleVipRequest(chatId, userId, user) {
    // Send VIP notification to Firebase for admin
    const notificationId = await sendVipNotification(userId, {
        username: user.username,
        first_name: user.first_name
    }, 'request');
    
    if (notificationId) {
        // Log activity
        await logActivity(userId, 'vip_request', {
            notification_id: notificationId,
            current_status: user.vip_status,
            points: user.points,
            ads_watched: user.ads_watched
        });
        
        bot.sendMessage(chatId, `📞 *VIP Request Sent!*

✅ Your VIP upgrade request has been sent to admin.
🔔 You'll receive a notification when processed.

👤 User: ${user.first_name || 'User'}
🆔 ID: ${userId}
💎 Points: ${user.points || 0}
📺 Ads: ${user.ads_watched || 0}`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔙 Back', callback_data: 'back_main' }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, `❌ *Request Failed*

Unable to send VIP request. Please contact admin directly: @Sbaroone`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📧 Contact Admin', url: 'https://t.me/Sbaroone' }],
                    [{ text: '🔙 Back', callback_data: 'back_main' }]
                ]
            }
        });
    }
}

// Handle referrals
async function handleReferrals(chatId, userId, user) {
    const referralLink = `https://t.me/navigi_sbaro_bot?start=_ref_${userId}`;
    
    const message = `👥 *Referral Program*

🔗 Your referral link:
\`${referralLink}\`

📊 Stats:
• Referrals: ${user.referrals || 0}
• Points earned: ${user.referrals || 0} points

💰 Rewards:
• +1 point per referral
• +5 points if they buy King VIP
• +10 points if they buy Emperor VIP
• +15 points if they buy Lord VIP`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📤 Share Link', url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join NAVIGI SBARO and earn points!` }],
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle profile
async function handleProfile(chatId, userId, user) {
    const username = user.username ? `@${user.username}` : 'Not set';
    
    let message = `👤 *Your Profile*

🆔 User ID: \`${userId}\`
👤 Username: ${username}
💎 Points: ${user.points || 0}
💰 Balance: $${(user.balance || 0).toFixed(2)}
📺 Ads Watched: ${user.ads_watched || 0}
📊 Daily Ads: ${user.daily_ads_watched || 0}/${DAILY_LIMITS[user.vip_status || 'FREE']}
👑 VIP Status: ${user.vip_status || 'FREE'}
👥 Referrals: ${user.referrals || 0}
🏆 Contests Joined: ${user.contests_joined || 0}`;
    
    if (user.vip_expires) {
        const daysLeft = Math.ceil((new Date(user.vip_expires) - new Date()) / (1000 * 60 * 60 * 24));
        message += `\n⏰ VIP Expires: ${daysLeft} days`;
    }
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle back to main menu
bot.on('callback_query', async (query) => {
    if (query.data === 'back_main') {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        const user = await initUser(userId, {
            username: query.from.username,
            first_name: query.from.first_name
        });
        
        const welcomeMessage = `🏠 *Main Menu*

💎 Your Stats:
Points: ${user.points || 0}
Balance: $${(user.balance || 0).toFixed(2)}
VIP Status: ${user.vip_status || 'FREE'}

Choose an option:`;

        const keyboard = {
            inline_keyboard: [
                [
                    { text: '📺 Watch Ads', callback_data: 'earn_ads' },
                    { text: '🏆 Contests', callback_data: 'contests' }
                ],
                [
                    { text: '👑 VIP Upgrade', callback_data: 'vip_upgrade' },
                    { text: '👥 Referrals', callback_data: 'referrals' }
                ],
                [
                    { text: '👤 Profile', callback_data: 'profile' },
                    { text: '🎮 Open Mini App', web_app: { url: WEBAPP_URL } }
                ]
            ]
        };
        
        bot.editMessageText(welcomeMessage, {
            chat_id: chatId,
            message_id: query.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: keyboard
        });
        
        bot.answerCallbackQuery(query.id);
    }
});

// Admin commands
bot.onText(/\/admin/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId === ADMIN_USER_ID) {
        const stats = await getSystemStats();
        const message = `🔧 *Admin Panel*

Dashboard: ${ADMIN_DASHBOARD_URL}

📊 Bot Stats:
• Total Users: ${stats.total_users || 0}
• Active Today: ${stats.active_today || 0}
• Total Points: ${stats.total_points || 0}
• Total Ads: ${stats.total_ads || 0}`;
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🌐 Open Dashboard', url: ADMIN_DASHBOARD_URL }],
                    [{ text: '🔄 Reset Leaderboards', callback_data: 'admin_reset_leaderboards' }],
                    [{ text: '🏆 Reset Contests', callback_data: 'admin_reset_contests' }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, '❌ Access denied');
    }
});

// Admin reset functions
bot.on('callback_query', async (query) => {
    if (query.data === 'admin_reset_leaderboards' && query.from.id === ADMIN_USER_ID) {
        await resetAllLeaderboards();
        bot.answerCallbackQuery(query.id, { text: '✅ Leaderboards reset!' });
        bot.sendMessage(query.message.chat.id, '✅ All leaderboards and referrals have been reset to zero!');
    }
    
    if (query.data === 'admin_reset_contests' && query.from.id === ADMIN_USER_ID) {
        await resetAllContests();
        bot.answerCallbackQuery(query.id, { text: '✅ Contests reset!' });
        bot.sendMessage(query.message.chat.id, '✅ All contest progress has been reset to zero!');
    }
});

async function resetAllLeaderboards() {
    if (!isFirebaseInitialized) return false;
    try {
        console.log('🔄 Resetting all leaderboards and referrals...');
        
        const usersRef = database.ref('users');
        const snapshot = await usersRef.once('value');
        const usersData = snapshot.val() || {};
        
        for (const userId in usersData) {
            await updateUser(userId, {
                referrals: 0,
                referred_by: null
            });
            
            await logActivity(userId, 'leaderboards_reset', {
                reset_by: 'admin',
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('✅ All leaderboards and referrals reset successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error resetting leaderboards:', error);
        return false;
    }
}

async function resetAllContests() {
    if (!isFirebaseInitialized) return false;
    try {
        console.log('🔄 Resetting all contests...');
        
        const usersRef = database.ref('users');
        const snapshot = await usersRef.once('value');
        const usersData = snapshot.val() || {};
        
        for (const userId in usersData) {
            await updateUser(userId, {
                contest_ads: { daily: 0, weekly: 0, monthly: 0 },
                contests_joined: 0
            });
            
            await logActivity(userId, 'contests_reset', {
                reset_by: 'admin',
                timestamp: new Date().toISOString()
            });
        }
        
        console.log('✅ All contests reset successfully!');
        return true;
    } catch (error) {
        console.error('❌ Error resetting contests:', error);
        return false;
    }
}

async function getSystemStats() {
    if (!isFirebaseInitialized) return {};
    try {
        const [usersSnapshot, activitiesSnapshot] = await Promise.all([
            database.ref('users').once('value'),
            database.ref('activities').once('value')
        ]);
        
        const users = usersSnapshot.val() || {};
        const activities = activitiesSnapshot.val() || {};
        
        return {
            total_users: Object.keys(users).length,
            total_activities: Object.keys(activities).length,
            active_today: Object.values(users).filter(u => 
                u.last_ad_reset === new Date().toDateString()
            ).length,
            total_points: Object.values(users).reduce((sum, u) => sum + (u.points || 0), 0),
            total_ads: Object.values(users).reduce((sum, u) => sum + (u.ads_watched || 0), 0)
        };
    } catch (error) {
        console.error('❌ Error getting system stats:', error);
        return {};
    }
}

// Initialize Firebase and start bot
async function startBot() {
    console.log('🚀 Starting NAVIGI SBARO Bot...');
    
    // Initialize Firebase
    const firebaseInitialized = initializeFirebase();
    
    if (firebaseInitialized) {
        // Clear test data for fresh start
        try {
            const rootRef = database.ref('/');
            await rootRef.update({
                system: {
                    initialized: true,
                    last_reset: admin.database.ServerValue.TIMESTAMP,
                    version: '1.0.0',
                    admin_dashboard: ADMIN_DASHBOARD_URL
                }
            });
            console.log('✅ System initialized in Firebase');
        } catch (error) {
            console.error('❌ Error initializing system:', error);
        }
    }
    
    console.log('🤖 NAVIGI SBARO Bot started successfully!');
    console.log('📊 Admin Dashboard:', ADMIN_DASHBOARD_URL);
    console.log('🎮 WebApp URL:', WEBAPP_URL);
    console.log('👤 Admin ID:', ADMIN_USER_ID);
    console.log('🔥 Firebase Real-time Database: Connected');
    console.log('📊 System ready for production use!');
}

// Start the bot
startBot();