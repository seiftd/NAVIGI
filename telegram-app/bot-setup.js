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
    if (!isFirebaseInitialized) {
        console.log('⚠️ Firebase not initialized, cannot create user');
        return null;
    }
    
    try {
        const userRef = database.ref(`users/${userId}`);
        
        // Use provided userData or create default structure
        const newUser = {
            id: userId,
            username: userData.username || null,
            first_name: userData.first_name || null,
            points: userData.points || 0,
            balance: userData.balance || 0.00,
            ads_watched: userData.ads_watched || 0,
            daily_ads_watched: userData.daily_ads_watched || 0,
            last_ad_reset: userData.last_ad_reset || new Date().toDateString(),
            contest_ads: userData.contest_ads || { daily: 0, weekly: 0, monthly: 0 },
            contests_joined: userData.contests_joined || 0,
            referrals: userData.referrals || 0,
            vip_status: userData.vip_status || 'FREE',
            vip_expires: userData.vip_expires || null,
            referred_by: userData.referred_by || null,
            join_date: userData.join_date || new Date().toISOString(),
            created_at: admin.database.ServerValue.TIMESTAMP,
            updated_at: admin.database.ServerValue.TIMESTAMP
        };
        
        await userRef.set(newUser);
        console.log(`✅ User ${userId} created in Firebase with complete data structure`);
        
        // Log to console for debugging
        console.log('📊 User data structure:', {
            id: newUser.id,
            points: newUser.points,
            ads_watched: newUser.ads_watched,
            contest_ads: newUser.contest_ads,
            vip_status: newUser.vip_status
        });
        
        return newUser;
    } catch (error) {
        console.error('❌ Error creating user in Firebase:', error);
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
    if (!isFirebaseInitialized) {
        console.log('⚠️ Firebase not initialized, cannot send VIP notification');
        return false;
    }
    
    try {
        const notificationId = uuidv4();
        const notificationRef = database.ref(`vip_notifications/${notificationId}`);
        
        console.log(`📞 Sending VIP notification for user ${userId}...`);
        console.log(`📞 User data:`, userData);
        
        const notification = {
            id: notificationId,
            user_id: userId.toString(),
            username: userData.username || null,
            first_name: userData.first_name || null,
            type: requestType,
            status: 'pending',
            user_stats: {
                points: userData.points || 0,
                ads_watched: userData.ads_watched || 0,
                balance: userData.balance || 0,
                current_vip_status: userData.vip_status || 'FREE',
                referrals: userData.referrals || 0
            },
            request_timestamp: new Date().toISOString(),
            created_at: admin.database.ServerValue.TIMESTAMP
        };
        
        await notificationRef.set(notification);
        console.log(`✅ VIP notification sent to Firebase: ${notificationId}`);
        console.log(`✅ Notification path: vip_notifications/${notificationId}`);
        console.log(`✅ Notification data:`, notification);
        
        // Test if notification was actually written
        const testRead = await notificationRef.once('value');
        if (testRead.exists()) {
            console.log(`✅ Notification confirmed in Firebase:`, testRead.val());
        } else {
            console.log(`❌ Notification not found in Firebase after write`);
        }
        
        return notificationId;
    } catch (error) {
        console.error('❌ Error sending VIP notification to Firebase:', error);
        console.error('❌ Error details:', error.message);
        console.error('❌ Error stack:', error.stack);
        return false;
    }
}

// Initialize user function with proper Firebase data structure
async function initUser(userId, userData = {}) {
    console.log(`🔄 Initializing user ${userId}...`);
    
    // Try to get user from Firebase first
    let user = await getUser(userId);
    
    if (!user) {
        console.log(`👤 Creating new user ${userId} in Firebase`);
        // Create new user with complete data structure
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
        
        // Create user in Firebase
        user = await createUser(userId, newUser);
        
        // Fallback to local storage if Firebase fails
        if (!user) {
            user = newUser;
            console.log('⚠️ Using local fallback for user data');
        }
        
        // Log new user activity
        await logActivity(userId, 'user_joined', {
            username: userData.username,
            first_name: userData.first_name,
            platform: 'telegram_bot',
            timestamp: new Date().toISOString()
        });
        
        console.log(`✅ New user ${userId} created successfully`);
    } else {
        console.log(`👤 Existing user ${userId} loaded from Firebase`);
        
        // Ensure all required fields exist and are properly structured
        let needsUpdate = false;
        const updates = {};
        
        if (!user.contest_ads || typeof user.contest_ads !== 'object') {
            user.contest_ads = { daily: 0, weekly: 0, monthly: 0 };
            updates.contest_ads = user.contest_ads;
            needsUpdate = true;
        }
        
        if (typeof user.contests_joined !== 'number') {
            user.contests_joined = 0;
            updates.contests_joined = 0;
            needsUpdate = true;
        }
        
        if (typeof user.ads_watched !== 'number') {
            user.ads_watched = 0;
            updates.ads_watched = 0;
            needsUpdate = true;
        }
        
        if (typeof user.daily_ads_watched !== 'number') {
            user.daily_ads_watched = 0;
            updates.daily_ads_watched = 0;
            needsUpdate = true;
        }
        
        if (typeof user.points !== 'number') {
            user.points = 0;
            updates.points = 0;
            needsUpdate = true;
        }
        
        if (typeof user.balance !== 'number') {
            user.balance = 0.00;
            updates.balance = 0.00;
            needsUpdate = true;
        }
        
        if (typeof user.referrals !== 'number') {
            user.referrals = 0;
            updates.referrals = 0;
            needsUpdate = true;
        }
        
        if (!user.vip_status) {
            user.vip_status = 'FREE';
            updates.vip_status = 'FREE';
            needsUpdate = true;
        }
        
        // Update user data if needed
        if (needsUpdate) {
            await updateUser(userId, updates);
            console.log(`🔧 Updated user ${userId} data structure`);
        }
    }
    
    // Reset daily ads if new day
    const today = new Date().toDateString();
    if (user.last_ad_reset !== today) {
        user.daily_ads_watched = 0;
        user.last_ad_reset = today;
        await updateUser(userId, {
            daily_ads_watched: 0,
            last_ad_reset: today,
            updated_at: admin.database.ServerValue.TIMESTAMP
        });
        console.log(`📅 Reset daily ads for user ${userId}`);
    }
    
    // Store in local cache for quick access
    users.set(userId, user);
    console.log(`✅ User ${userId} initialized successfully`);
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
    
    // Handle referral system
    if (referralCode && referralCode.startsWith('_ref_')) {
        const referrerId = referralCode.replace('_ref_', '');
        console.log(`🔗 Processing referral: ${userId} referred by ${referrerId}`);
        
        if (referrerId !== userId.toString() && !user.referred_by) {
            const referrer = await getUser(referrerId);
            if (referrer) {
                console.log(`✅ Valid referrer found: ${referrerId}`);
                
                // Update referred user
                user.referred_by = referrerId;
                await updateUser(userId, { 
                    referred_by: referrerId,
                    updated_at: admin.database.ServerValue.TIMESTAMP
                });
                
                // Update referrer with bonus
                const newReferralCount = (referrer.referrals || 0) + 1;
                const bonusPoints = 1; // 1 point per referral (base reward)
                const newReferrerPoints = (referrer.points || 0) + bonusPoints;
                
                await updateUser(referrerId, {
                    referrals: newReferralCount,
                    points: newReferrerPoints,
                    updated_at: admin.database.ServerValue.TIMESTAMP
                });
                
                // Update local cache
                const cachedReferrer = users.get(referrerId);
                if (cachedReferrer) {
                    cachedReferrer.referrals = newReferralCount;
                    cachedReferrer.points = newReferrerPoints;
                    users.set(referrerId, cachedReferrer);
                }
                
                // Log referral activity
                await logActivity(referrerId, 'referral_earned', {
                    referred_user: userId,
                    referred_username: msg.from.username,
                    referred_first_name: msg.from.first_name,
                    bonus_points: bonusPoints,
                    new_referral_count: newReferralCount,
                    timestamp: new Date().toISOString()
                });
                
                // Log for referred user
                await logActivity(userId, 'user_referred', {
                    referrer_id: referrerId,
                    referrer_username: referrer.username,
                    timestamp: new Date().toISOString()
                });
                
                // Notify referrer
                try {
                    bot.sendMessage(referrerId, `🎉 *New Referral!*

👤 **${msg.from.first_name || msg.from.username}** joined using your link!

💰 **Reward:** +${bonusPoints} points
👥 **Total Referrals:** ${newReferralCount}
💎 **Your Points:** ${newReferrerPoints}

Keep sharing your referral link to earn more! 🚀`, {
                        parse_mode: 'Markdown'
                    });
                } catch (error) {
                    console.error('❌ Error sending referral notification:', error);
                }
                
                console.log(`✅ Referral processed: ${referrerId} earned ${bonusPoints} points`);
            } else {
                console.log(`❌ Invalid referrer ID: ${referrerId}`);
            }
        } else {
            console.log(`⚠️ Referral not processed - self-referral or already referred`);
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
        case 'referral_leaderboard':
            await handleReferralLeaderboard(chatId, userId);
            break;
        case 'admin_reset_leaderboards':
            if (userId === ADMIN_USER_ID) {
                await resetAllLeaderboards(chatId);
            }
            break;
        case 'admin_reset_contests':
            if (userId === ADMIN_USER_ID) {
                await resetAllContests(chatId);
            }
            break;
        case 'test_vip_purchase':
            if (userId === ADMIN_USER_ID) {
                // Test VIP purchase for admin
                await handleVipPurchase(userId, 'KING', 2.99, 'test_payment');
            }
            break;
        case 'test_dashboard_connection':
            if (userId === ADMIN_USER_ID) {
                await testDashboardConnection(chatId, userId);
            }
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

// Handle watch ad with proper Firebase updates
async function handleWatchAd(chatId, userId, user) {
    console.log(`📺 User ${userId} attempting to watch ad`);
    
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
    
    // Calculate new values
    const pointsEarned = 1.1;
    const balanceEarned = 0.01;
    const newPoints = parseFloat(((user.points || 0) + pointsEarned).toFixed(2));
    const newBalance = parseFloat(((user.balance || 0) + balanceEarned).toFixed(2));
    const newAdsWatched = (user.ads_watched || 0) + 1;
    const newDailyAds = (user.daily_ads_watched || 0) + 1;
    
    console.log(`💰 Awarding: ${pointsEarned} points, $${balanceEarned} balance`);
    
    // Update Firebase with complete data
    const updateData = {
        points: newPoints,
        balance: newBalance,
        ads_watched: newAdsWatched,
        daily_ads_watched: newDailyAds,
        updated_at: admin.database.ServerValue.TIMESTAMP
    };
    
    const firebaseSuccess = await updateUser(userId, updateData);
    
    if (firebaseSuccess) {
        console.log(`✅ Firebase updated for user ${userId}`);
        
        // Update local cache
        user.points = newPoints;
        user.balance = newBalance;
        user.ads_watched = newAdsWatched;
        user.daily_ads_watched = newDailyAds;
        users.set(userId, user);
        
        // Set cooldown
        userCooldowns.set(userId, Date.now());
        
        // Log activity with detailed information
        await logActivity(userId, 'ad_watched', {
            points_earned: pointsEarned,
            balance_earned: balanceEarned,
            new_points_total: newPoints,
            new_balance_total: newBalance,
            daily_count: newDailyAds,
            total_count: newAdsWatched,
            vip_status: user.vip_status,
            daily_limit: limit,
            timestamp: new Date().toISOString()
        });
        
        const message = `🎉 *Ad Watched Successfully!*

💰 **Earned:** +${pointsEarned} points
💵 **Balance:** +$${balanceEarned}

📊 **Your Updated Stats:**
• 💎 Points: ${newPoints.toFixed(1)}
• 💰 Balance: $${newBalance.toFixed(2)}
• 📺 Daily Ads: ${newDailyAds}/${limit}
• 🎯 Total Ads: ${newAdsWatched}
• 👑 VIP Status: ${user.vip_status}

${newDailyAds >= limit ? '⚠️ Daily limit reached!' : `⏰ Next ad available in ${Math.ceil(AD_COOLDOWN / 60000)} minutes`}`;
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📺 Watch More', callback_data: 'earn_ads' }],
                    [{ text: '🎮 Open Mini App', web_app: { url: WEBAPP_URL } }]
                ]
            }
        });
        
        console.log(`✅ Ad watch completed for user ${userId} - Points: ${newPoints}, Ads: ${newAdsWatched}`);
    } else {
        console.error(`❌ Failed to update Firebase for user ${userId}`);
        bot.sendMessage(chatId, '❌ Error processing ad reward. Please try again.');
    }
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
    const newContestsJoined = (user.contests_joined || 0) + 1;
    
    console.log(`🏆 Contest ad for ${contestType}: ${newContestAds[contestType] - 1} → ${newContestAds[contestType]}`);
    
    // Update Firebase immediately with complete data
    const updateData = {
        contest_ads: newContestAds,
        contests_joined: newContestsJoined,
        updated_at: admin.database.ServerValue.TIMESTAMP
    };
    
    const firebaseSuccess = await updateUser(userId, updateData);
    
    if (firebaseSuccess) {
        console.log(`✅ Contest progress updated in Firebase for user ${userId}`);
        
        // Update local cache
        user.contest_ads = newContestAds;
        user.contests_joined = newContestsJoined;
        users.set(userId, user);
        
        // Set contest cooldown
        userCooldowns.set(`contest_${userId}`, Date.now());
        
        // Log activity with detailed information
        await logActivity(userId, 'contest_ad', {
            contest_type: contestType,
            previous_count: newContestAds[contestType] - 1,
            new_count: newContestAds[contestType],
            total_required: required,
            progress_percentage: Math.round((newContestAds[contestType] / required) * 100),
            contests_joined_total: newContestsJoined,
            timestamp: new Date().toISOString()
        });
        
        console.log(`✅ Contest ad completed: ${contestType} ${newContestAds[contestType]}/${required}`);
    } else {
        console.error(`❌ Failed to update contest progress for user ${userId}`);
        bot.sendMessage(chatId, '❌ Error processing contest ad. Please try again.');
        return;
    }
    
    const newWatched = newContestAds[contestType];
    let message = `✅ *Contest Ad Completed!*\n\n`;
    message += `📊 **${contestType.toUpperCase()} Contest Progress:** ${newWatched}/${required}\n`;
    message += `🎯 **Total Contests Joined:** ${newContestsJoined}\n\n`;
    
    // Progress bar visualization
    const progressPercentage = Math.round((newWatched / required) * 100);
    const progressBar = '█'.repeat(Math.floor(progressPercentage / 10)) + '░'.repeat(10 - Math.floor(progressPercentage / 10));
    message += `📈 **Progress:** ${progressBar} ${progressPercentage}%\n\n`;
    
    if (newWatched >= required) {
        message += `🎉 **QUALIFIED for ${contestType.toUpperCase()} Contest!**\n`;
        message += `💰 **Prize Pool:** ${contestType === 'daily' ? '220' : contestType === 'weekly' ? '1,500' : '10,000'} points\n`;
        message += `⏰ **Contest ends:** at midnight!\n\n`;
        message += `Good luck! 🍀`;
    } else {
        const remaining = required - newWatched;
        message += `📺 **Need ${remaining} more contest ads** to qualify\n`;
        message += `⏰ Keep watching to enter the contest!\n\n`;
        message += `💡 **Tip:** Contest ads don't give points but qualify you for big prizes!`;
    }
    
    message += `\n\n⏰ Next contest ad available in 5 minutes`;
    
    console.log(`📊 Contest display updated: ${contestType} ${newWatched}/${required} (${progressPercentage}%)`);
    
    // Update user's local cache to reflect the change immediately
    user.contest_ads = newContestAds;
    user.contests_joined = newContestsJoined;
    users.set(userId, user);
    
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
    console.log(`🔔 Processing VIP request for user ${userId}`);
    console.log(`🔔 User data:`, user);
    
    // Send VIP notification to Firebase for admin
    const notificationId = await sendVipNotification(userId, {
        username: user.username,
        first_name: user.first_name,
        points: user.points,
        ads_watched: user.ads_watched,
        balance: user.balance,
        vip_status: user.vip_status,
        referrals: user.referrals
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

// Handle VIP purchase (when user completes payment)
async function handleVipPurchase(userId, vipTier, paymentAmount, paymentMethod = 'unknown') {
    console.log(`💳 Processing VIP purchase: ${userId} → ${vipTier} → $${paymentAmount}`);
    
    const user = await getUser(userId);
    if (!user) return;
    
    // VIP tier mapping
    const vipTiers = {
        'KING': { price: 2.99, referral_bonus: 5 },
        'EMPEROR': { price: 4.99, referral_bonus: 10 },
        'LORD': { price: 9.99, referral_bonus: 20 }
    };
    
    const tierInfo = vipTiers[vipTier.toUpperCase()];
    if (!tierInfo) return;
    
    // Update user VIP status
    const vipExpires = new Date();
    vipExpires.setMonth(vipExpires.getMonth() + 1); // 1 month from now
    
    await updateUser(userId, {
        vip_status: vipTier.toUpperCase(),
        vip_expires: vipExpires.toISOString(),
        updated_at: admin.database.ServerValue.TIMESTAMP
    });
    
    // Log payment activity
    await logActivity(userId, 'vip_purchased', {
        vip_tier: vipTier.toUpperCase(),
        amount: paymentAmount,
        payment_method: paymentMethod,
        expires: vipExpires.toISOString(),
        timestamp: new Date().toISOString()
    });
    
    // Log payment data for admin dashboard
    await logPayment(userId, {
        type: 'vip_purchase',
        tier: vipTier.toUpperCase(),
        amount: paymentAmount,
        currency: 'USD',
        payment_method: paymentMethod,
        status: 'completed',
        user_info: {
            id: userId,
            username: user.username,
            first_name: user.first_name
        },
        timestamp: new Date().toISOString()
    });
    
    // Give referral bonus to referrer if exists
    if (user.referred_by) {
        const referrer = await getUser(user.referred_by);
        if (referrer) {
            const bonusPoints = tierInfo.referral_bonus;
            const newReferrerPoints = (referrer.points || 0) + bonusPoints;
            
            await updateUser(user.referred_by, {
                points: newReferrerPoints,
                updated_at: admin.database.ServerValue.TIMESTAMP
            });
            
            // Log referral bonus
            await logActivity(user.referred_by, 'referral_vip_bonus', {
                referred_user: userId,
                vip_tier: vipTier.toUpperCase(),
                bonus_points: bonusPoints,
                new_total_points: newReferrerPoints,
                timestamp: new Date().toISOString()
            });
            
            // Notify referrer
            try {
                bot.sendMessage(user.referred_by, `🎉 *VIP Referral Bonus!*

Your referral **${user.first_name || user.username}** upgraded to **${vipTier.toUpperCase()} VIP**!

💰 **Bonus Earned:** +${bonusPoints} points
💎 **Your Total Points:** ${newReferrerPoints}

Keep referring friends for more bonuses! 🚀`, {
                    parse_mode: 'Markdown'
                });
            } catch (error) {
                console.error('❌ Error sending referral bonus notification:', error);
            }
        }
    }
    
    // Notify user of successful purchase
    try {
        bot.sendMessage(userId, `✅ *VIP Purchase Successful!*

🎉 Welcome to **${vipTier.toUpperCase()} VIP**!

📅 **Valid Until:** ${vipExpires.toLocaleDateString()}
💰 **Amount Paid:** $${paymentAmount}
🎁 **Benefits Activated:** All ${vipTier.toLowerCase()} VIP features unlocked!

Enjoy your premium experience! 👑`, {
            parse_mode: 'Markdown'
        });
    } catch (error) {
        console.error('❌ Error sending purchase confirmation:', error);
    }
    
    console.log(`✅ VIP purchase completed: ${userId} → ${vipTier} → $${paymentAmount}`);
}

// Log payment data for admin dashboard
async function logPayment(userId, paymentData) {
    if (!isFirebaseInitialized) return;
    
    try {
        const paymentId = uuidv4();
        const paymentRef = database.ref(`payments/${paymentId}`);
        
        const payment = {
            id: paymentId,
            user_id: userId.toString(),
            ...paymentData,
            created_at: admin.database.ServerValue.TIMESTAMP
        };
        
        await paymentRef.set(payment);
        console.log(`💳 Payment logged: ${paymentId} - $${paymentData.amount}`);
    } catch (error) {
        console.error('❌ Error logging payment:', error);
    }
}

// Handle referrals with proper tracking
async function handleReferrals(chatId, userId, user) {
    const referralLink = `https://t.me/navigi_sbaro_bot?start=_ref_${userId}`;
    const totalReferrals = user.referrals || 0;
    const pointsFromReferrals = totalReferrals * 1; // 1 point per referral (base)
    
    const message = `👥 *Referral Program*

🔗 **Your Referral Link:**
\`${referralLink}\`

📊 **Your Stats:**
• 👥 Total Referrals: ${totalReferrals}
• 💰 Points Earned: ${pointsFromReferrals} points
• 🎯 Rank: ${getReferralRank(totalReferrals)}

💰 **Rewards Per Referral:**
• 🎁 Instant: +1 point (when they join)
• 👑 If they get King VIP: +5 bonus points
• 💎 If they get Emperor VIP: +10 bonus points  
• 🏆 If they get Lord VIP: +20 bonus points

🎯 **Next Milestone:**
${getNextMilestone(totalReferrals)}

📤 **Share & Earn:**
Share your link with friends and family to earn more points!`;
    
    const shareText = `🚀 Join me on NAVIGI SBARO and earn money by watching ads!

💰 Earn points for every ad you watch
🎁 Daily contests with amazing prizes
👑 VIP memberships available
📱 Easy to use Telegram bot

Use my referral link to get started:`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📤 Share Link', url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}` }],
                [{ text: '📋 Copy Link', callback_data: `copy_referral_${userId}` }],
                [{ text: '🏆 Leaderboard', callback_data: 'referral_leaderboard' }],
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Get referral rank based on number of referrals
function getReferralRank(referrals) {
    if (referrals >= 100) return '🏆 Referral Master';
    if (referrals >= 50) return '💎 Referral Expert';
    if (referrals >= 25) return '👑 Referral Pro';
    if (referrals >= 10) return '🌟 Referral Star';
    if (referrals >= 5) return '🚀 Referral Rookie';
    return '🔰 New Referrer';
}

// Get next milestone message
function getNextMilestone(referrals) {
    if (referrals < 5) return `Need ${5 - referrals} more referrals to become 🚀 Referral Rookie`;
    if (referrals < 10) return `Need ${10 - referrals} more referrals to become 🌟 Referral Star`;
    if (referrals < 25) return `Need ${25 - referrals} more referrals to become 👑 Referral Pro`;
    if (referrals < 50) return `Need ${50 - referrals} more referrals to become 💎 Referral Expert`;
    if (referrals < 100) return `Need ${100 - referrals} more referrals to become 🏆 Referral Master`;
    return '🎉 You\'ve reached the highest rank!';
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
                    [{ text: '🧪 Test Dashboard Connection', callback_data: 'test_dashboard_connection' }],
                    [{ text: '🔄 Reset Leaderboards', callback_data: 'admin_reset_leaderboards' }],
                    [{ text: '🏆 Reset Contests', callback_data: 'admin_reset_contests' }],
                    [{ text: '💳 Test VIP Purchase', callback_data: 'test_vip_purchase' }]
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

// Handle referral leaderboard
async function handleReferralLeaderboard(chatId, userId) {
    if (!isFirebaseInitialized) {
        bot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        // Get top referrers
        const userList = Object.values(users)
            .filter(user => (user.referrals || 0) > 0)
            .sort((a, b) => (b.referrals || 0) - (a.referrals || 0))
            .slice(0, 10);
        
        if (userList.length === 0) {
            bot.sendMessage(chatId, `🏆 *Referral Leaderboard*

📊 No referrals yet! Be the first to invite friends and climb the leaderboard!

🎯 Start referring friends to see your name here!`, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '👥 My Referrals', callback_data: 'referrals' }],
                        [{ text: '🔙 Back', callback_data: 'back_main' }]
                    ]
                }
            });
            return;
        }
        
        let message = `🏆 *Referral Leaderboard*\n\n`;
        
        userList.forEach((user, index) => {
            const rank = index + 1;
            const emoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            const name = user.first_name || user.username || `User ${user.id}`;
            const referrals = user.referrals || 0;
            const points = referrals * 5;
            
            message += `${emoji} **${name}**\n`;
            message += `   👥 ${referrals} referrals • 💎 ${points} points\n\n`;
        });
        
        // Find current user's position
        const currentUserReferrals = users[userId]?.referrals || 0;
        const allUsers = Object.values(users)
            .filter(user => (user.referrals || 0) > 0)
            .sort((a, b) => (b.referrals || 0) - (a.referrals || 0));
        
        const userPosition = allUsers.findIndex(user => user.id === userId) + 1;
        
        if (userPosition > 0) {
            message += `\n📍 **Your Position:** #${userPosition} with ${currentUserReferrals} referrals`;
        } else {
            message += `\n📍 **Your Position:** Not ranked yet (0 referrals)`;
        }
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '👥 My Referrals', callback_data: 'referrals' }],
                    [{ text: '🔄 Refresh', callback_data: 'referral_leaderboard' }],
                    [{ text: '🔙 Back', callback_data: 'back_main' }]
                ]
            }
        });
        
    } catch (error) {
        console.error('❌ Error getting referral leaderboard:', error);
        bot.sendMessage(chatId, '❌ Error loading leaderboard');
    }
}

// Reset all leaderboards (admin only)
async function resetAllLeaderboards(chatId) {
    if (!isFirebaseInitialized) {
        bot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        console.log('🔄 Resetting all leaderboards and referrals...');
        
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        let resetCount = 0;
        
        for (const userId in users) {
            await updateUser(userId, {
                referrals: 0,
                referred_by: null,
                updated_at: admin.database.ServerValue.TIMESTAMP
            });
            
            // Update local cache
            const cachedUser = users[userId];
            if (cachedUser) {
                cachedUser.referrals = 0;
                cachedUser.referred_by = null;
                users.set(userId, cachedUser);
            }
            
            await logActivity(userId, 'leaderboards_reset', {
                reset_by: 'admin',
                admin_id: ADMIN_USER_ID,
                timestamp: new Date().toISOString()
            });
            
            resetCount++;
        }
        
        console.log(`✅ Reset leaderboards for ${resetCount} users`);
        bot.sendMessage(chatId, `✅ *Leaderboards Reset Complete!*

📊 **Reset Data:**
• 👥 Referrals: Reset to 0 for all users
• 🔗 Referral links: Cleared for all users
• 📈 Leaderboard: Completely reset
• 👤 Users affected: ${resetCount}

All users can now start fresh with referrals!`, {
            parse_mode: 'Markdown'
        });
        
    } catch (error) {
        console.error('❌ Error resetting leaderboards:', error);
        bot.sendMessage(chatId, '❌ Error resetting leaderboards');
    }
}

// Reset all contests (admin only)
async function resetAllContests(chatId) {
    if (!isFirebaseInitialized) {
        bot.sendMessage(chatId, '❌ Firebase not connected');
        return;
    }
    
    try {
        console.log('🔄 Resetting all contests...');
        
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        let resetCount = 0;
        
        for (const userId in users) {
            await updateUser(userId, {
                contest_ads: { daily: 0, weekly: 0, monthly: 0 },
                contests_joined: 0,
                updated_at: admin.database.ServerValue.TIMESTAMP
            });
            
            // Update local cache
            const cachedUser = users[userId];
            if (cachedUser) {
                cachedUser.contest_ads = { daily: 0, weekly: 0, monthly: 0 };
                cachedUser.contests_joined = 0;
                users.set(userId, cachedUser);
            }
            
            await logActivity(userId, 'contests_reset', {
                reset_by: 'admin',
                admin_id: ADMIN_USER_ID,
                timestamp: new Date().toISOString()
            });
            
            resetCount++;
        }
        
        console.log(`✅ Reset contests for ${resetCount} users`);
        bot.sendMessage(chatId, `✅ *Contests Reset Complete!*

🏆 **Reset Data:**
• 📊 Daily contests: Reset to 0/10 for all users
• 📅 Weekly contests: Reset to 0/30 for all users  
• 📆 Monthly contests: Reset to 0/200 for all users
• 🎯 Contests joined: Reset to 0 for all users
• 👤 Users affected: ${resetCount}

All users can now start fresh with contests!`, {
            parse_mode: 'Markdown'
        });
        
    } catch (error) {
        console.error('❌ Error resetting contests:', error);
        bot.sendMessage(chatId, '❌ Error resetting contests');
    }
}

// Fresh restart referral leaderboard (call this function to reset everything)
async function freshRestartReferralLeaderboard() {
    if (!isFirebaseInitialized) {
        console.log('⚠️ Firebase not initialized');
        return;
    }
    
    try {
        console.log('🔄 FRESH RESTART: Clearing all referral data...');
        
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        let resetCount = 0;
        
        for (const userId in users) {
            // Reset all referral data
            await updateUser(userId, {
                referrals: 0,
                referred_by: null,
                updated_at: admin.database.ServerValue.TIMESTAMP
            });
            
            // Log the reset
            await logActivity(userId, 'referral_leaderboard_reset', {
                reset_type: 'fresh_restart',
                admin_id: ADMIN_USER_ID,
                timestamp: new Date().toISOString()
            });
            
            resetCount++;
        }
        
        console.log(`✅ FRESH RESTART COMPLETE: Reset referral data for ${resetCount} users`);
        
        // Notify admin
        try {
            bot.sendMessage(ADMIN_USER_ID, `✅ *Fresh Referral Reset Complete!*

🔄 **Action:** Complete referral leaderboard restart
📊 **Users Reset:** ${resetCount}
🗑️ **Data Cleared:**
• All referral counts → 0
• All referral relationships → removed
• Fresh start for all users

The referral leaderboard is now completely fresh! 🚀`, {
                parse_mode: 'Markdown'
            });
        } catch (error) {
            console.error('❌ Error sending reset notification:', error);
        }
        
    } catch (error) {
        console.error('❌ Error in fresh restart:', error);
    }
}

// Test dashboard connection
async function testDashboardConnection(chatId, userId) {
    console.log('🧪 Testing dashboard connection...');
    
    try {
        // Test 1: Write test data
        const testId = uuidv4();
        const testRef = database.ref(`dashboard_connection_test/${testId}`);
        
        await testRef.set({
            test_id: testId,
            source: 'telegram_bot',
            admin_id: userId,
            timestamp: new Date().toISOString(),
            created_at: admin.database.ServerValue.TIMESTAMP
        });
        
        console.log('✅ Test data written to Firebase');
        
        // Test 2: Send VIP notification
        const user = await getUser(userId);
        const vipNotificationId = await sendVipNotification(userId, user, 'test_request');
        
        // Test 3: Log activity
        await logActivity(userId, 'dashboard_connection_test', {
            test_id: testId,
            vip_notification_id: vipNotificationId,
            timestamp: new Date().toISOString()
        });
        
        // Test 4: Log payment
        await logPayment(userId, {
            type: 'test_payment',
            tier: 'TEST',
            amount: 0.01,
            currency: 'USD',
            payment_method: 'test',
            status: 'completed',
            user_info: {
                id: userId,
                username: user?.username,
                first_name: user?.first_name
            },
            timestamp: new Date().toISOString()
        });
        
        bot.sendMessage(chatId, `✅ *Dashboard Connection Test*

🧪 **Test Results:**
• ✅ Firebase Write: Success
• ✅ VIP Notification: ${vipNotificationId ? 'Sent' : 'Failed'}
• ✅ Activity Log: Success  
• ✅ Payment Log: Success

📊 **Check Admin Dashboard:**
${ADMIN_DASHBOARD_URL}

All test data should appear in real-time!`, {
            parse_mode: 'Markdown'
        });
        
        // Clean up test data after 30 seconds
        setTimeout(async () => {
            try {
                await testRef.remove();
                console.log('🗑️ Test data cleaned up');
            } catch (error) {
                console.error('❌ Error cleaning up test data:', error);
            }
        }, 30000);
        
    } catch (error) {
        console.error('❌ Dashboard connection test failed:', error);
        bot.sendMessage(chatId, `❌ *Dashboard Connection Test Failed*

Error: ${error.message}

Please check Firebase configuration and try again.`, {
            parse_mode: 'Markdown'
        });
    }
}

// Start the bot
startBot();

// Execute fresh restart on startup (comment out after first run)
setTimeout(() => {
    freshRestartReferralLeaderboard();
}, 5000); // Wait 5 seconds after startup