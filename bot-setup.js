const TelegramBot = require('node-telegram-bot-api');
const { FirebaseManager } = require('./firebase-config');

// Bot configuration
const BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
const WEBAPP_URL = 'https://navigiu.netlify.app/';
const ADMIN_DASHBOARD_URL = 'https://navigiu.netlify.app/admin-dashboard.html';

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Initialize Firebase Manager
const firebaseManager = new FirebaseManager();

// User data storage (fallback for when Firebase is not available)
const users = new Map();
const userCooldowns = new Map();
const contestCooldowns = new Map();

// Ad cooldown settings (7 minutes)
const AD_COOLDOWN = 7 * 60 * 1000; // 7 minutes in milliseconds
const VIP_AD_COOLDOWN = 7 * 60 * 1000; // Same 7 minutes for VIP

// Daily limits
const DAILY_LIMITS = {
    'FREE': 12,
    'KING': 20,
    'EMPEROR': 30,
    'LORD': 50
};

// Initialize user data with Firebase integration
async function initUser(userId, userData = {}) {
    // Try to get user from Firebase first
    let user = await firebaseManager.getUser(userId);
    
    if (!user) {
        // Create new user in Firebase
        user = await firebaseManager.createUser(userId, userData);
        
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
            users.set(userId, user);
        }
        
        // Log new user activity
        await firebaseManager.logActivity(userId, 'user_joined', {
            username: userData.username,
            first_name: userData.first_name,
            platform: 'telegram_bot'
        });
    }
    
    // Also store in local cache for quick access
    users.set(userId, user);
    return user;
}

// Reset daily ads if new day
function checkDailyReset(userId) {
    const user = users.get(userId);
    const today = new Date().toDateString();
    
    if (user.last_ad_reset !== today) {
        user.daily_ads_watched = 0;
        user.last_ad_reset = today;
        users.set(userId, user);
    }
}

// Format time remaining
function formatTimeRemaining(milliseconds) {
    const minutes = Math.floor(milliseconds / (60 * 1000));
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
    return `${minutes}m ${seconds}s`;
}

// Send data to admin dashboard
async function sendToAdminDashboard(action, data) {
    try {
        const response = await fetch('https://navigiu.netlify.app/.netlify/functions/bot-dashboard-sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: action,
                data: data,
                timestamp: new Date().toISOString()
            })
        });
        
        console.log(`Dashboard sync: ${action}`, data);
        return response.ok;
    } catch (error) {
        console.error('Dashboard sync error:', error);
        return false;
    }
}

// Start command
bot.onText(/\/start(.*)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const referralCode = match[1] ? match[1].trim() : null;
    
    // Initialize user
    const user = initUser(userId, {
        username: msg.from.username,
        first_name: msg.from.first_name
    });
    
    // Handle referral
    if (referralCode && referralCode.startsWith('_ref_')) {
        const referrerId = referralCode.replace('_ref_', '');
        if (referrerId !== userId.toString() && users.has(referrerId)) {
            user.referred_by = referrerId;
            const referrer = users.get(referrerId);
            referrer.referrals += 1;
            referrer.points += 1; // 1 point for referral
            users.set(referrerId, referrer);
            
            bot.sendMessage(referrerId, `🎉 New referral! You earned 1 point. Total referrals: ${referrer.referrals}`);
        }
    }
    
    // Sync with dashboard
    await sendToAdminDashboard('user_join', {
        user_id: userId,
        username: msg.from.username,
        platform: 'telegram_bot',
        referred_by: user.referred_by
    });
    
    const welcomeMessage = `🚀 Welcome to NAVIGI SBARO!

💎 Your Stats:
Points: ${user.points}
Balance: $${user.balance.toFixed(2)}
VIP Status: ${user.vip_status}

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
                { text: '💰 Withdraw', callback_data: 'withdraw' }
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
    const user = initUser(userId, {
        username: query.from.username,
        first_name: query.from.first_name
    });
    
    checkDailyReset(userId);
    
    switch (data) {
        case 'earn_ads':
            await handleEarnAds(chatId, userId);
            break;
        case 'watch_ad':
            await handleWatchAd(chatId, userId);
            break;
        case 'contests':
            await handleContests(chatId, userId);
            break;
        case 'contest_daily':
            await handleContestAd(chatId, userId, 'daily');
            break;
        case 'contest_weekly':
            await handleContestAd(chatId, userId, 'weekly');
            break;
        case 'contest_monthly':
            await handleContestAd(chatId, userId, 'monthly');
            break;
        case 'vip_upgrade':
            await handleVipUpgrade(chatId, userId);
            break;
        case 'referrals':
            await handleReferrals(chatId, userId);
            break;
        case 'profile':
            await handleProfile(chatId, userId);
            break;
        case 'withdraw':
            await handleWithdraw(chatId, userId);
            break;
        case 'request_vip':
            await handleVipRequest(chatId, userId);
            break;
        case 'back_main':
            bot.editMessageText('🏠 Main Menu', {
                chat_id: chatId,
                message_id: query.message.message_id,
                reply_markup: {
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
                            { text: '💰 Withdraw', callback_data: 'withdraw' }
                        ]
                    ]
                }
            });
            break;
    }
    
    bot.answerCallbackQuery(query.id);
});

// Handle earn ads section
async function handleEarnAds(chatId, userId) {
    const user = users.get(userId);
    const limit = DAILY_LIMITS[user.vip_status];
    
    // Check cooldown
    const lastAdTime = userCooldowns.get(userId) || 0;
    const cooldownTime = user.vip_status === 'FREE' ? AD_COOLDOWN : VIP_AD_COOLDOWN;
    const timeRemaining = cooldownTime - (Date.now() - lastAdTime);
    
    let message = `📺 *Earn Points with Video Ads*\n\n`;
    message += `💎 Points per ad: 1.1\n`;
    message += `⏱️ Ad duration: 2x 15-second videos\n`;
    message += `📊 Today: ${user.daily_ads_watched}/${limit} ads\n`;
    message += `🎯 VIP Status: ${user.vip_status}\n\n`;
    
    const keyboard = { inline_keyboard: [] };
    
    if (user.daily_ads_watched >= limit) {
        message += `❌ Daily limit reached! Reset at midnight.`;
        keyboard.inline_keyboard.push([{ text: '🔙 Back', callback_data: 'back_main' }]);
    } else if (timeRemaining > 0) {
        message += `⏰ Next ad available in: ${formatTimeRemaining(timeRemaining)}`;
        keyboard.inline_keyboard.push([{ text: '🔙 Back', callback_data: 'back_main' }]);
    } else {
        message += `✅ Ready to watch ads!`;
        keyboard.inline_keyboard.push([{ text: '▶️ Watch 2x Video Ads', callback_data: 'watch_ad' }]);
        keyboard.inline_keyboard.push([{ text: '🔙 Back', callback_data: 'back_main' }]);
    }
    
    bot.sendMessage(chatId, message, { 
        parse_mode: 'Markdown',
        reply_markup: keyboard 
    });
}

// Handle watch ad
async function handleWatchAd(chatId, userId) {
    const user = users.get(userId);
    
    // Double check cooldown and limits
    const lastAdTime = userCooldowns.get(userId) || 0;
    const cooldownTime = user.vip_status === 'FREE' ? AD_COOLDOWN : VIP_AD_COOLDOWN;
    const timeRemaining = cooldownTime - (Date.now() - lastAdTime);
    const limit = DAILY_LIMITS[user.vip_status];
    
    if (user.daily_ads_watched >= limit) {
        bot.sendMessage(chatId, '❌ Daily ad limit reached!');
        return;
    }
    
    if (timeRemaining > 0) {
        bot.sendMessage(chatId, `⏰ Please wait ${formatTimeRemaining(timeRemaining)} before next ad.`);
        return;
    }
    
    // Log ad start activity
    await firebaseManager.logActivity(userId, 'ad_started', {
        vip_status: user.vip_status,
        daily_count: user.daily_ads_watched,
        limit: limit
    });
    
    // Show first video ad
    bot.sendMessage(chatId, '📺 *First Video Ad (15 seconds)*\n\nWatch the complete video to continue...', {
        parse_mode: 'Markdown'
    });
    
    // Send first video (replace with actual video file_id or URL)
    const firstVideoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'; // Replace with Monetag video
    
    try {
        await bot.sendVideo(chatId, firstVideoUrl, {
            caption: '📺 Video Ad 1/2 - Watch completely!',
            reply_markup: {
                inline_keyboard: [[
                    { text: '✅ Watched First Video', callback_data: 'first_video_done' }
                ]]
            }
        });
    } catch (error) {
        // Fallback to text-based ad simulation
        await bot.sendMessage(chatId, '📺 *Video Ad 1/2*\n\n🎬 [Simulated 15-second video ad playing...]\n\nPlease wait 15 seconds...', {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                    { text: '✅ Watched First Video (15s)', callback_data: 'first_video_done' }
                ]]
            }
        });
    }
}

// Handle first video completion
bot.on('callback_query', async (query) => {
    if (query.data === 'first_video_done') {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        
        // Show second video ad
        bot.sendMessage(chatId, '📺 *Second Video Ad (15 seconds)*\n\nWatch the complete video to earn points...', {
            parse_mode: 'Markdown'
        });
        
        const secondVideoUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'; // Replace with Monetag video
        
        try {
            await bot.sendVideo(chatId, secondVideoUrl, {
                caption: '📺 Video Ad 2/2 - Watch completely!',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '✅ Watched Second Video', callback_data: 'second_video_done' }
                    ]]
                }
            });
        } catch (error) {
            // Fallback to text-based ad simulation
            await bot.sendMessage(chatId, '📺 *Video Ad 2/2*\n\n🎬 [Simulated 15-second video ad playing...]\n\nPlease wait 15 seconds...', {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '✅ Watched Second Video (15s)', callback_data: 'second_video_done' }
                    ]]
                }
            });
        }
        
        bot.answerCallbackQuery(query.id);
    }
});

// Handle second video completion
bot.on('callback_query', async (query) => {
    if (query.data === 'second_video_done') {
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        const user = users.get(userId);
        
        // Award points
        user.points += 1.1;
        user.balance += 0.011;
        user.ads_watched += 1;
        user.daily_ads_watched += 1;
        users.set(userId, user);
        
        // Set cooldown
        userCooldowns.set(userId, Date.now());
        
        // Sync with dashboard
        await sendToAdminDashboard('ad_watched', {
            user_id: userId,
            points_earned: 1.1,
            platform: 'telegram_bot'
        });
        
        const message = `🎉 *Congratulations!*\n\n✅ Both videos watched!\n💎 Earned: 1.1 points\n💰 Balance: $${user.balance.toFixed(2)}\n📊 Total Points: ${user.points}\n\n⏰ Next ads in 7 minutes`;
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '📺 Earn More', callback_data: 'earn_ads' }],
                    [{ text: '🏠 Main Menu', callback_data: 'back_main' }]
                ]
            }
        });
        
        bot.answerCallbackQuery(query.id, { text: '🎉 +1.1 points earned!' });
    }
});

// Handle contests
async function handleContests(chatId, userId) {
    const user = users.get(userId);
    
    let message = `🏆 *Contest Center*\n\n`;
    message += `Join contests by watching contest ads!\n`;
    message += `Contest ads don't earn points but qualify you for prizes.\n\n`;
    
    // Daily Contest
    const dailyAds = user.contest_ads.daily;
    const dailyStatus = dailyAds >= 10 ? '✅' : '🔵';
    message += `${dailyStatus} *Daily Contest* (${dailyAds}/10 ads)\n`;
    message += `🏆 Prize: 220 points (20% of pool)\n`;
    message += `⏰ Reset: Every 24 hours\n\n`;
    
    // Weekly Contest  
    const weeklyAds = user.contest_ads.weekly;
    const weeklyStatus = weeklyAds >= 30 ? '✅' : '🔵';
    message += `${weeklyStatus} *Weekly Contest* (${weeklyAds}/30 ads)\n`;
    message += `🏆 Prize: 275 points (10% each, 5 winners)\n`;
    message += `⏰ Reset: Every Sunday\n\n`;
    
    // Monthly Contest
    const monthlyAds = user.contest_ads.monthly;
    const monthlyStatus = monthlyAds >= 200 ? '✅' : '🔵';
    message += `${monthlyStatus} *Monthly Contest* (${monthlyAds}/200 ads)\n`;
    message += `🏆 Prize: VIP King + 275 points (3 winners)\n`;
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
async function handleContestAd(chatId, userId, contestType) {
    const user = users.get(userId);
    const requirements = { daily: 10, weekly: 30, monthly: 200 };
    const required = requirements[contestType];
    const watched = user.contest_ads[contestType];
    
    // Check contest cooldown (7 minutes)
    const lastContestAdTime = contestCooldowns.get(userId) || 0;
    const timeRemaining = AD_COOLDOWN - (Date.now() - lastContestAdTime);
    
    if (timeRemaining > 0) {
        bot.sendMessage(chatId, `⏰ Contest ad cooldown: ${formatTimeRemaining(timeRemaining)}`);
        return;
    }
    
    if (watched >= required) {
        bot.sendMessage(chatId, `✅ You've completed the ${contestType} contest requirements!`);
        return;
    }
    
    // Show contest video ad
    bot.sendMessage(chatId, `📺 *${contestType.toUpperCase()} Contest Ad*\n\nWatch 2x 15-second videos for contest entry (no points earned)`, {
        parse_mode: 'Markdown'
    });
    
    // Contest video ad simulation
    try {
        await bot.sendMessage(chatId, '📺 *Contest Video 1/2*\n\n🎬 [Contest ad playing...]\n\nNo points earned - contest entry only!', {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                    { text: '✅ Watched Contest Video 1', callback_data: `contest_${contestType}_first` }
                ]]
            }
        });
    } catch (error) {
        console.error('Contest ad error:', error);
    }
}

// Handle contest video completions
bot.on('callback_query', async (query) => {
    const data = query.data;
    
    if (data.startsWith('contest_') && data.endsWith('_first')) {
        const contestType = data.replace('contest_', '').replace('_first', '');
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        
        // Show second contest video
        await bot.sendMessage(chatId, '📺 *Contest Video 2/2*\n\n🎬 [Contest ad playing...]\n\nComplete to enter contest!', {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                    { text: '✅ Watched Contest Video 2', callback_data: `contest_${contestType}_second` }
                ]]
            }
        });
        
        bot.answerCallbackQuery(query.id);
    }
    
    if (data.startsWith('contest_') && data.endsWith('_second')) {
        const contestType = data.replace('contest_', '').replace('_second', '');
        const chatId = query.message.chat.id;
        const userId = query.from.id;
        const user = users.get(userId);
        
        // Increment contest ads
        user.contest_ads[contestType] += 1;
        users.set(userId, user);
        
        // Update Firebase with real-time contest progress
        await firebaseManager.updateContestProgress(userId, contestType);
        await firebaseManager.updateUser(userId, {
            contest_ads: user.contest_ads,
            contests_joined: user.contests_joined
        });
        
        // Set contest cooldown
        contestCooldowns.set(userId, Date.now());
        
        // Sync with dashboard
        await sendToAdminDashboard('contest_ad_watched', {
            user_id: userId,
            contest_type: contestType,
            platform: 'telegram_bot'
        });
        
        const requirements = { daily: 10, weekly: 30, monthly: 200 };
        const required = requirements[contestType];
        const watched = user.contest_ads[contestType];
        
        let message = `✅ *Contest Ad Completed!*\n\n`;
        message += `📊 ${contestType.toUpperCase()} Progress: ${watched}/${required}\n`;
        
        if (watched >= required) {
            message += `🎉 Contest requirements met! You're entered in the ${contestType} contest!\n`;
        } else {
            message += `📺 ${required - watched} more ads needed for ${contestType} contest\n`;
        }
        
        message += `⏰ Next contest ad in 7 minutes`;
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🏆 Contests', callback_data: 'contests' }],
                    [{ text: '🏠 Main Menu', callback_data: 'back_main' }]
                ]
            }
        });
        
        bot.answerCallbackQuery(query.id, { text: '✅ Contest ad completed!' });
    }
});

// Handle VIP upgrade
async function handleVipUpgrade(chatId, userId) {
    const user = users.get(userId);
    
    const message = `👑 *VIP Upgrade*\n\n🔗 Visit our website to upgrade:\n${WEBAPP_URL}payment.html\n\n💎 VIP Benefits:\n• Reduced ad cooldowns\n• Higher daily limits\n• Exclusive contests\n• Priority support\n\n📞 Or request manual approval from admin:`;
    
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

// Handle referrals
async function handleReferrals(chatId, userId) {
    const user = users.get(userId);
    const referralLink = `https://t.me/navigi_sbaro_bot?start=_ref_${userId}`;
    
    const message = `👥 *Referral Program*\n\n🔗 Your referral link:\n\`${referralLink}\`\n\n📊 Stats:\n• Referrals: ${user.referrals}\n• Points earned: ${user.referrals} points\n\n💰 Rewards:\n• +1 point per referral\n• +5 points if they buy King VIP\n• +10 points if they buy Emperor VIP\n• +15 points if they buy Lord VIP`;
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '📤 Share Link', url: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=Join NAVIGI SBARO and earn points!` }],
                [{ text: '🏆 Leaderboard', callback_data: 'referral_leaderboard' }],
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle referral leaderboard
bot.on('callback_query', async (query) => {
    if (query.data === 'referral_leaderboard') {
        const chatId = query.message.chat.id;
        
        // Get top referrers
        const topReferrers = Array.from(users.values())
            .filter(user => user.referrals > 0)
            .sort((a, b) => b.referrals - a.referrals)
            .slice(0, 10);
        
        let message = `🏆 *Referral Leaderboard*\n\n`;
        
        if (topReferrers.length === 0) {
            message += `No referrals yet. Be the first!`;
        } else {
            topReferrers.forEach((user, index) => {
                const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
                const username = user.username ? `@${user.username}` : `User ${user.id}`;
                message += `${medal} ${username} - ${user.referrals} referrals\n`;
            });
            
            message += `\n🎁 Weekly Rewards:\n`;
            message += `🥇 #1: 50 points (if 50+ referrals)\n`;
            message += `🎁 800+ referrals: 1 TON reward!`;
        }
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '👥 My Referrals', callback_data: 'referrals' }],
                    [{ text: '🔙 Back', callback_data: 'back_main' }]
                ]
            }
        });
        
        bot.answerCallbackQuery(query.id);
    }
});

// Handle profile
async function handleProfile(chatId, userId) {
    const user = users.get(userId);
    const username = user.username ? `@${user.username}` : 'Not set';
    
    let message = `👤 *Your Profile*\n\n`;
    message += `🆔 User ID: \`${userId}\`\n`;
    message += `👤 Username: ${username}\n`;
    message += `💎 Points: ${user.points}\n`;
    message += `💰 Balance: $${user.balance.toFixed(2)}\n`;
    message += `📺 Ads Watched: ${user.ads_watched}\n`;
    message += `📊 Daily Ads: ${user.daily_ads_watched}/${DAILY_LIMITS[user.vip_status]}\n`;
    message += `👑 VIP Status: ${user.vip_status}\n`;
    message += `👥 Referrals: ${user.referrals}\n`;
    message += `🏆 Contests Joined: ${user.contests_joined}\n`;
    
    if (user.vip_expires) {
        const daysLeft = Math.ceil((new Date(user.vip_expires) - new Date()) / (1000 * 60 * 60 * 24));
        message += `⏰ VIP Expires: ${daysLeft} days\n`;
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

// Handle withdraw
async function handleWithdraw(chatId, userId) {
    const user = users.get(userId);
    
    let message = `💰 *Withdraw Earnings*\n\n`;
    message += `💎 Available: ${user.points} points\n`;
    message += `💰 Balance: $${user.balance.toFixed(2)}\n\n`;
    message += `💳 Minimum Withdrawals:\n`;
    message += `• USDT TRC20: $3.00\n`;
    message += `• Binance Pay: $2.00\n`;
    message += `• TON Wallet: 1 TON ($3.60)\n\n`;
    
    if (user.balance < 2.00) {
        message += `❌ Insufficient balance for withdrawal`;
    } else {
        message += `✅ Ready to withdraw!`;
    }
    
    bot.sendMessage(chatId, message, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '🌐 Withdraw on Website', url: `${WEBAPP_URL}` }],
                [{ text: '🔙 Back', callback_data: 'back_main' }]
            ]
        }
    });
}

// Handle VIP request
async function handleVipRequest(chatId, userId) {
    const user = users.get(userId);
    
    // Send VIP notification to Firebase for admin bot
    const notificationId = await firebaseManager.sendVipNotification(userId, {
        username: user.username,
        first_name: user.first_name
    }, 'request');
    
    if (notificationId) {
        // Log activity
        await firebaseManager.logActivity(userId, 'vip_request', {
            notification_id: notificationId,
            current_status: user.vip_status,
            points: user.points,
            ads_watched: user.ads_watched
        });
        
        bot.sendMessage(chatId, `📞 *VIP Request Sent!*\n\n✅ Your VIP upgrade request has been sent to admin.\n🔔 You'll receive a notification when processed.\n\n👤 User: ${user.first_name || 'User'}\n🆔 ID: ${userId}\n💎 Points: ${user.points}\n📺 Ads: ${user.ads_watched}`, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔙 Back', callback_data: 'back_main' }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, `❌ *Request Failed*\n\nUnable to send VIP request. Please contact admin directly: @Sbaroone`, {
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

// Admin commands
bot.onText(/\/admin/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    // Simple admin check (replace with proper authentication)
    const adminIds = ['YOUR_ADMIN_USER_ID']; // Replace with actual admin user IDs
    
    if (adminIds.includes(userId.toString())) {
        const message = `🔧 *Admin Panel*\n\nDashboard: ${ADMIN_DASHBOARD_URL}\n\n📊 Bot Stats:\n• Total Users: ${users.size}\n• Active Today: ${Array.from(users.values()).filter(u => u.last_ad_reset === new Date().toDateString()).length}`;
        
        bot.sendMessage(chatId, message, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🌐 Open Dashboard', url: ADMIN_DASHBOARD_URL }]
                ]
            }
        });
    } else {
        bot.sendMessage(chatId, '❌ Access denied');
    }
});

// Periodic tasks (run every hour)
setInterval(async () => {
    console.log(`Bot Stats: ${users.size} users, ${userCooldowns.size} active cooldowns`);
    
    // Sync user stats with dashboard
    const stats = {
        total_users: users.size,
        active_users: Array.from(users.values()).filter(u => u.last_ad_reset === new Date().toDateString()).length,
        total_points: Array.from(users.values()).reduce((sum, u) => sum + u.points, 0),
        total_ads: Array.from(users.values()).reduce((sum, u) => sum + u.ads_watched, 0)
    };
    
    await sendToAdminDashboard('bot_stats', stats);
}, 60 * 60 * 1000); // Every hour

// Initialize Firebase and clear test data on startup
async function initializeBot() {
    console.log('🚀 Initializing NAVIGI SBARO Bot...');
    
    // Clear test data for fresh start
    const cleared = await firebaseManager.clearTestData();
    if (cleared) {
        console.log('✅ Test data cleared - Fresh database ready!');
    }
    
    console.log('🤖 NAVIGI SBARO Bot started successfully!');
    console.log('📊 Dashboard URL:', ADMIN_DASHBOARD_URL);
    console.log('🔗 Bot URL: https://t.me/navigi_sbaro_bot');
    console.log('🔥 Firebase Real-time Database: Connected');
    console.log('📊 System ready for production use!');
}

// Start the bot
initializeBot();