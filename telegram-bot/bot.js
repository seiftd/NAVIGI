const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// ================================
// CONFIGURATION - YOUR CREDENTIALS
// ================================

const BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
const ADMIN_USER_ID = 7544271642; // @Sbaroone

// Firebase Service Account Configuration
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

const DATABASE_URL = "https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app";

// ================================
// INITIALIZE FIREBASE & BOT
// ================================

let database = null;
let isFirebaseInitialized = false;

// Initialize Firebase
function initializeFirebase() {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: DATABASE_URL
        });
        
        database = admin.database();
        isFirebaseInitialized = true;
        
        console.log('🔥 Firebase initialized successfully');
        console.log('🌐 Database URL:', DATABASE_URL);
        return true;
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        return false;
    }
}

// Initialize Bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ================================
// FIREBASE HELPER FUNCTIONS
// ================================

// Create user in Firebase
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

// Get user from Firebase
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

// Update user in Firebase
async function updateUser(userId, updateData) {
    if (!isFirebaseInitialized) return false;
    
    try {
        const userRef = database.ref(`users/${userId}`);
        await userRef.update({
            ...updateData,
            updated_at: admin.database.ServerValue.TIMESTAMP
        });
        return true;
    } catch (error) {
        console.error('❌ Error updating user:', error);
        return false;
    }
}

// Log activity to Firebase
async function logActivity(userId, activityType, data = {}) {
    if (!isFirebaseInitialized) return false;
    
    try {
        const activityId = uuidv4();
        const activityRef = database.ref(`activities/${activityId}`);
        
        const activity = {
            id: activityId,
            user_id: userId.toString(),
            type: activityType,
            data: data,
            timestamp: new Date().toISOString(),
            created_at: admin.database.ServerValue.TIMESTAMP
        };
        
        await activityRef.set(activity);
        return true;
    } catch (error) {
        console.error('❌ Error logging activity:', error);
        return false;
    }
}

// Send VIP notification to Firebase
async function sendVipNotification(userId, userData) {
    if (!isFirebaseInitialized) return false;
    
    try {
        const notificationId = uuidv4();
        const notificationRef = database.ref(`vip_notifications/${notificationId}`);
        
        const notification = {
            id: notificationId,
            user_id: userId.toString(),
            username: userData.username || null,
            first_name: userData.first_name || null,
            type: 'vip_request',
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
        console.log(`📞 VIP notification sent: ${notificationId}`);
        return notificationId;
    } catch (error) {
        console.error('❌ Error sending VIP notification:', error);
        return false;
    }
}

// Log payment to Firebase
async function logPayment(userId, paymentData) {
    if (!isFirebaseInitialized) return false;
    
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
        console.log(`💳 Payment logged: ${paymentId}`);
        return paymentId;
    } catch (error) {
        console.error('❌ Error logging payment:', error);
        return false;
    }
}

// ================================
// BOT CONFIGURATION
// ================================

const DAILY_LIMITS = {
    'FREE': 20,
    'KING': 50,
    'EMPEROR': 100,
    'LORD': 200
};

const AD_COOLDOWN = 5 * 60 * 1000; // 5 minutes
const CONTEST_AD_COOLDOWN = 5 * 60 * 1000; // 5 minutes

const userCooldowns = new Map();
const contestCooldowns = new Map();

// ================================
// USER MANAGEMENT
// ================================

// Initialize user
async function initUser(userId, userData = {}) {
    console.log(`🔄 Initializing user ${userId}...`);
    
    let user = await getUser(userId);
    
    if (!user) {
        // Create new user
        user = await createUser(userId, userData);
        
        if (user) {
            await logActivity(userId, 'user_joined', {
                username: userData.username,
                first_name: userData.first_name,
                platform: 'telegram_bot'
            });
        }
    } else {
        // Reset daily ads if new day
        const today = new Date().toDateString();
        if (user.last_ad_reset !== today) {
            await updateUser(userId, {
                daily_ads_watched: 0,
                last_ad_reset: today
            });
            user.daily_ads_watched = 0;
            user.last_ad_reset = today;
        }
    }
    
    return user;
}

// ================================
// BOT COMMANDS
// ================================

// Start command with referral handling
bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const referralCode = match[1].trim();
    
    console.log(`👤 User ${userId} started bot`);
    
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
                // Update referred user
                await updateUser(userId, { referred_by: referrerId });
                
                // Update referrer (1 point + VIP bonuses)
                const bonusPoints = 1;
                const newReferrerPoints = (referrer.points || 0) + bonusPoints;
                const newReferralCount = (referrer.referrals || 0) + 1;
                
                await updateUser(referrerId, {
                    referrals: newReferralCount,
                    points: newReferrerPoints
                });
                
                // Log activities
                await logActivity(referrerId, 'referral_earned', {
                    referred_user: userId,
                    bonus_points: bonusPoints,
                    new_referral_count: newReferralCount
                });
                
                await logActivity(userId, 'user_referred', {
                    referrer_id: referrerId
                });
                
                // Notify referrer
                try {
                    bot.sendMessage(referrerId, `🎉 *New Referral!*

👤 **${msg.from.first_name || msg.from.username}** joined using your link!

💰 **Reward:** +${bonusPoints} point
👥 **Total Referrals:** ${newReferralCount}
💎 **Your Points:** ${newReferrerPoints}

💡 **VIP Bonuses:**
• King VIP: +5 points
• Emperor VIP: +10 points  
• Lord VIP: +20 points`, {
                        parse_mode: 'Markdown'
                    });
                } catch (error) {
                    console.error('❌ Error sending referral notification:', error);
                }
            }
        }
    }
    
    // Welcome message
    const welcomeMessage = `🚀 *Welcome to NAVIGI SBARO!*

💰 **Earn money by watching ads!**
🏆 **Join daily contests for big prizes!**
👥 **Refer friends and earn bonuses!**

📊 **Your Stats:**
• 💎 Points: ${user?.points || 0}
• 💰 Balance: $${(user?.balance || 0).toFixed(2)}
• 👑 VIP Status: ${user?.vip_status || 'FREE'}

Choose an option below:`;
    
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📺 Watch Ads & Earn', callback_data: 'earn_ads' }],
                [{ text: '🏆 Join Contests', callback_data: 'contests' }],
                [{ text: '👥 Referral Program', callback_data: 'referrals' }],
                [{ text: '👑 VIP Upgrade', callback_data: 'vip_upgrade' }],
                [{ text: '📊 My Profile', callback_data: 'profile' }]
            ]
        }
    });
});

// Admin command
bot.onText(/\/admin/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (userId === ADMIN_USER_ID) {
        const message = `🔧 *Admin Panel*

📊 **System Status:**
• 🔥 Firebase: ${isFirebaseInitialized ? 'Connected' : 'Disconnected'}
• 🤖 Bot: Online
• 📱 Dashboard: https://navigiu.netlify.app/admin-dashboard

**Admin Controls:**`;
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🌐 Open Dashboard', url: 'https://navigiu.netlify.app/admin-dashboard' }],
                    [{ text: '🧪 Test Connection', callback_data: 'admin_test' }],
                    [{ text: '🔄 Reset Referrals', callback_data: 'admin_reset_referrals' }],
                    [{ text: '💳 Test VIP Purchase', callback_data: 'admin_test_vip' }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, '❌ Access denied');
    }
});

// ================================
// CALLBACK HANDLERS
// ================================

bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;
    const data = query.data;
    
    // Get user data
    const user = await getUser(userId);
    if (!user) {
        bot.answerCallbackQuery(query.id, { text: 'Please restart the bot with /start' });
        return;
    }
    
    switch (data) {
        case 'earn_ads':
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
            
        case 'referrals':
            await handleReferrals(chatId, userId, user);
            break;
            
        case 'vip_upgrade':
            await handleVipUpgrade(chatId, userId, user);
            break;
            
        case 'profile':
            await handleProfile(chatId, userId, user);
            break;
            
        // Admin commands
        case 'admin_test':
            if (userId === ADMIN_USER_ID) {
                await testConnection(chatId, userId);
            }
            break;
            
        case 'admin_reset_referrals':
            if (userId === ADMIN_USER_ID) {
                await resetAllReferrals(chatId);
            }
            break;
            
        case 'admin_test_vip':
            if (userId === ADMIN_USER_ID) {
                await testVipPurchase(chatId, userId);
            }
            break;
    }
    
    bot.answerCallbackQuery(query.id);
});

// ================================
// FEATURE HANDLERS
// ================================

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
    const pointsEarned = 1.1;
    const balanceEarned = 0.01;
    const newPoints = parseFloat(((user.points || 0) + pointsEarned).toFixed(2));
    const newBalance = parseFloat(((user.balance || 0) + balanceEarned).toFixed(2));
    const newAdsWatched = (user.ads_watched || 0) + 1;
    const newDailyAds = (user.daily_ads_watched || 0) + 1;
    
    // Update Firebase
    const success = await updateUser(userId, {
        points: newPoints,
        balance: newBalance,
        ads_watched: newAdsWatched,
        daily_ads_watched: newDailyAds
    });
    
    if (success) {
        // Set cooldown
        userCooldowns.set(userId, Date.now());
        
        // Log activity
        await logActivity(userId, 'ad_watched', {
            points_earned: pointsEarned,
            balance_earned: balanceEarned,
            new_points_total: newPoints,
            new_balance_total: newBalance,
            daily_count: newDailyAds,
            total_count: newAdsWatched
        });
        
        const message = `🎉 *Ad Watched Successfully!*

💰 **Earned:** +${pointsEarned} points
💵 **Balance:** +$${balanceEarned}

📊 **Your Stats:**
• 💎 Points: ${newPoints}
• 💰 Balance: $${newBalance.toFixed(2)}
• 📺 Daily Ads: ${newDailyAds}/${limit}
• 🎯 Total Ads: ${newAdsWatched}`;
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📺 Watch Another Ad', callback_data: 'earn_ads' }],
                    [{ text: '🏠 Main Menu', callback_data: 'back_main' }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, '❌ Error processing ad reward. Please try again.');
    }
}

// Handle contests
async function handleContests(chatId, userId, user) {
    const message = `🏆 *Daily Contests*

Join contests by watching contest ads!

📊 **Your Progress:**
• 📅 Daily: ${user.contest_ads?.daily || 0}/10 ads
• 📆 Weekly: ${user.contest_ads?.weekly || 0}/30 ads  
• 🗓️ Monthly: ${user.contest_ads?.monthly || 0}/200 ads

💰 **Prize Pools:**
• 📅 Daily: 220 points
• 📆 Weekly: 1,500 points
• 🗓️ Monthly: 10,000 points

Choose a contest to join:`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📅 Daily Contest (10 ads)', callback_data: 'contest_daily' }],
                [{ text: '📆 Weekly Contest (30 ads)', callback_data: 'contest_weekly' }],
                [{ text: '🗓️ Monthly Contest (200 ads)', callback_data: 'contest_monthly' }],
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle contest ad
async function handleContestAd(chatId, userId, user, contestType) {
    const requirements = { daily: 10, weekly: 30, monthly: 200 };
    const required = requirements[contestType];
    
    const lastContestTime = contestCooldowns.get(`${userId}_${contestType}`) || 0;
    const timeRemaining = CONTEST_AD_COOLDOWN - (Date.now() - lastContestTime);
    
    if (timeRemaining > 0) {
        const minutes = Math.ceil(timeRemaining / (60 * 1000));
        bot.sendMessage(chatId, `⏰ Please wait ${minutes} minutes before next contest ad.`);
        return;
    }
    
    // Update contest progress
    const newContestAds = { ...user.contest_ads };
    newContestAds[contestType] = (newContestAds[contestType] || 0) + 1;
    const newContestsJoined = (user.contests_joined || 0) + 1;
    
    // Update Firebase
    const success = await updateUser(userId, {
        contest_ads: newContestAds,
        contests_joined: newContestsJoined
    });
    
    if (success) {
        // Set cooldown
        contestCooldowns.set(`${userId}_${contestType}`, Date.now());
        
        // Log activity
        await logActivity(userId, 'contest_ad', {
            contest_type: contestType,
            new_count: newContestAds[contestType],
            total_required: required,
            progress_percentage: Math.round((newContestAds[contestType] / required) * 100)
        });
        
        const newWatched = newContestAds[contestType];
        const progressPercentage = Math.round((newWatched / required) * 100);
        const progressBar = '█'.repeat(Math.floor(progressPercentage / 10)) + '░'.repeat(10 - Math.floor(progressPercentage / 10));
        
        let message = `✅ *Contest Ad Completed!*

📊 **${contestType.toUpperCase()} Contest Progress:** ${newWatched}/${required}
📈 **Progress:** ${progressBar} ${progressPercentage}%

`;
        
        if (newWatched >= required) {
            message += `🎉 **QUALIFIED for ${contestType.toUpperCase()} Contest!**
💰 **Prize Pool:** ${contestType === 'daily' ? '220' : contestType === 'weekly' ? '1,500' : '10,000'} points
⏰ **Contest ends:** at midnight!

Good luck! 🍀`;
        } else {
            const remaining = required - newWatched;
            message += `📺 **Need ${remaining} more contest ads** to qualify
⏰ Keep watching to enter the contest!

💡 **Tip:** Contest ads don't give points but qualify you for big prizes!`;
        }
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🏆 Watch Another Contest Ad', callback_data: `contest_${contestType}` }],
                    [{ text: '🏠 Main Menu', callback_data: 'back_main' }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, '❌ Error processing contest ad. Please try again.');
    }
}

// Handle referrals
async function handleReferrals(chatId, userId, user) {
    const referralLink = `https://t.me/navigi_sbaro_bot?start=_ref_${userId}`;
    const totalReferrals = user.referrals || 0;
    
    const message = `👥 *Referral Program*

🔗 **Your Referral Link:**
\`${referralLink}\`

📊 **Your Stats:**
• 👥 Total Referrals: ${totalReferrals}
• 💰 Points Earned: ${totalReferrals} points

💰 **Rewards Per Referral:**
• 🎁 Instant: +1 point (when they join)
• 👑 King VIP purchase: +5 bonus points
• 💎 Emperor VIP purchase: +10 bonus points  
• 🏆 Lord VIP purchase: +20 bonus points

📤 **Share & Earn:**
Share your link with friends and family!`;
    
    const shareText = `🚀 Join me on NAVIGI SBARO and earn money by watching ads!

💰 Earn points for every ad you watch
🏆 Daily contests with amazing prizes
👑 VIP memberships available

Use my referral link to get started:`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📤 Share Link', url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}` }],
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle VIP upgrade
async function handleVipUpgrade(chatId, userId, user) {
    // Send VIP notification to admin dashboard
    const notificationId = await sendVipNotification(userId, user);
    
    if (notificationId) {
        await logActivity(userId, 'vip_request', {
            notification_id: notificationId,
            current_status: user.vip_status,
            points: user.points,
            ads_watched: user.ads_watched
        });
        
        bot.sendMessage(chatId, `📞 *VIP Request Sent!*

✅ Your VIP upgrade request has been sent to admin.
🔔 You'll receive a notification when processed.

👤 **Your Info:**
• 🆔 ID: ${userId}
• 💎 Points: ${user.points || 0}
• 📺 Ads: ${user.ads_watched || 0}
• 👑 Current Status: ${user.vip_status}

💰 **VIP Tiers:**
• 🥉 King VIP: $2.99/month (50 daily ads)
• 🥈 Emperor VIP: $4.99/month (100 daily ads)
• 🥇 Lord VIP: $9.99/month (200 daily ads)`, {
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

// Handle profile
async function handleProfile(chatId, userId, user) {
    const username = user.username ? `@${user.username}` : 'Not set';
    const joinDate = new Date(user.join_date).toLocaleDateString();
    
    const message = `📊 *Your Profile*

👤 **User Info:**
• 🆔 ID: ${userId}
• 👤 Username: ${username}
• 📅 Joined: ${joinDate}

💰 **Stats:**
• 💎 Points: ${user.points || 0}
• 💰 Balance: $${(user.balance || 0).toFixed(2)}
• 📺 Ads Watched: ${user.ads_watched || 0}
• 👥 Referrals: ${user.referrals || 0}
• 👑 VIP Status: ${user.vip_status}

🏆 **Contest Progress:**
• 📅 Daily: ${user.contest_ads?.daily || 0}/10
• 📆 Weekly: ${user.contest_ads?.weekly || 0}/30
• 🗓️ Monthly: ${user.contest_ads?.monthly || 0}/200`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// ================================
// ADMIN FUNCTIONS
// ================================

// Test connection
async function testConnection(chatId, userId) {
    try {
        console.log('🧪 Testing Firebase connection...');
        
        // Test write
        const testId = uuidv4();
        const testRef = database.ref(`connection_test/${testId}`);
        
        await testRef.set({
            test_id: testId,
            source: 'telegram_bot',
            admin_id: userId,
            timestamp: new Date().toISOString(),
            created_at: admin.database.ServerValue.TIMESTAMP
        });
        
        // Test VIP notification
        const user = await getUser(userId);
        const vipNotificationId = await sendVipNotification(userId, user);
        
        // Test activity log
        await logActivity(userId, 'connection_test', {
            test_id: testId,
            vip_notification_id: vipNotificationId
        });
        
        // Test payment log
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
        
        bot.sendMessage(chatId, `✅ *Connection Test Successful!*

🧪 **Test Results:**
• ✅ Firebase Write: Success
• ✅ VIP Notification: ${vipNotificationId ? 'Sent' : 'Failed'}
• ✅ Activity Log: Success  
• ✅ Payment Log: Success

📊 **Check Admin Dashboard:**
https://navigiu.netlify.app/admin-dashboard

All test data should appear in real-time!`, {
            parse_mode: 'Markdown'
        });
        
        // Clean up after 30 seconds
        setTimeout(async () => {
            try {
                await testRef.remove();
            } catch (error) {
                console.error('❌ Error cleaning up test data:', error);
            }
        }, 30000);
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
        bot.sendMessage(chatId, `❌ *Connection Test Failed*

Error: ${error.message}`, {
            parse_mode: 'Markdown'
        });
    }
}

// Reset all referrals
async function resetAllReferrals(chatId) {
    try {
        console.log('🔄 Resetting all referrals...');
        
        const usersSnapshot = await database.ref('users').once('value');
        const users = usersSnapshot.val() || {};
        
        let resetCount = 0;
        for (const userId in users) {
            await updateUser(userId, {
                referrals: 0,
                referred_by: null
            });
            resetCount++;
        }
        
        bot.sendMessage(chatId, `✅ *Referrals Reset Complete!*

📊 **Reset Data:**
• 👥 All referral counts → 0
• 🔗 All referral relationships → cleared
• 👤 Users affected: ${resetCount}

Fresh start for everyone!`, {
            parse_mode: 'Markdown'
        });
        
    } catch (error) {
        console.error('❌ Error resetting referrals:', error);
        bot.sendMessage(chatId, '❌ Error resetting referrals');
    }
}

// Test VIP purchase
async function testVipPurchase(chatId, userId) {
    try {
        const user = await getUser(userId);
        
        // Simulate VIP purchase
        await updateUser(userId, {
            vip_status: 'KING',
            vip_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        });
        
        // Log payment
        await logPayment(userId, {
            type: 'vip_purchase',
            tier: 'KING',
            amount: 2.99,
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
        
        // Log activity
        await logActivity(userId, 'vip_purchased', {
            vip_tier: 'KING',
            amount: 2.99,
            payment_method: 'test'
        });
        
        bot.sendMessage(chatId, `✅ *Test VIP Purchase Complete!*

👑 **Upgraded to:** KING VIP
💰 **Amount:** $2.99
📅 **Valid Until:** ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

Check the admin dashboard to see the payment data!`, {
            parse_mode: 'Markdown'
        });
        
    } catch (error) {
        console.error('❌ Test VIP purchase failed:', error);
        bot.sendMessage(chatId, '❌ Test VIP purchase failed');
    }
}

// Handle back to main menu
bot.on('callback_query', async (query) => {
    if (query.data === 'back_main') {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        
        const user = await getUser(userId);
        
        const welcomeMessage = `🚀 *NAVIGI SBARO - Main Menu*

📊 **Your Stats:**
• 💎 Points: ${user?.points || 0}
• 💰 Balance: $${(user?.balance || 0).toFixed(2)}
• 👑 VIP Status: ${user?.vip_status || 'FREE'}

Choose an option:`;
        
        bot.editMessageText(welcomeMessage, {
            chat_id: chatId,
            message_id: query.message.message_id,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📺 Watch Ads & Earn', callback_data: 'earn_ads' }],
                    [{ text: '🏆 Join Contests', callback_data: 'contests' }],
                    [{ text: '👥 Referral Program', callback_data: 'referrals' }],
                    [{ text: '👑 VIP Upgrade', callback_data: 'vip_upgrade' }],
                    [{ text: '📊 My Profile', callback_data: 'profile' }]
                ]
            }
        });
        
        bot.answerCallbackQuery(query.id);
    }
});

// ================================
// INITIALIZE BOT
// ================================

async function startBot() {
    console.log('🚀 Starting NAVIGI SBARO Bot...');
    
    // Initialize Firebase
    if (initializeFirebase()) {
        console.log('✅ Firebase connected successfully');
    } else {
        console.log('❌ Firebase connection failed - bot will run with limited functionality');
    }
    
    console.log('🤖 Bot started successfully!');
    console.log('👤 Admin ID:', ADMIN_USER_ID);
    console.log('🌐 Dashboard URL: https://navigiu.netlify.app/admin-dashboard');
    console.log('📊 System ready for production!');
}

// Start the bot
startBot();

// Error handling
bot.on('polling_error', (error) => {
    console.error('❌ Polling error:', error);
});

process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Unhandled rejection:', error);
});