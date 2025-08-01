const TelegramBot = require('node-telegram-bot-api');

// Your bot configuration
const BOT_TOKEN = '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY';
const WEBAPP_URL = 'https://navigi-bot.netlify.app/';
const WEBHOOK_URL = 'https://navigi-bot.netlify.app/.netlify/functions/telegram-webhook';

// Initialize bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 NAVIGI SBARO Telegram Bot Starting...');

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    
    console.log(`New user started bot: ${user.first_name} (${user.id})`);
    
    const welcomeMessage = `
🚀 *Welcome to NAVIGI SBARO!*

Earn money by watching ads directly in Telegram!

💰 *How it works:*
• Watch short video ads powered by Monetag
• Earn 5 points for each ad
• Convert points to real money
• Withdraw via PayPal or Crypto

👑 *VIP Benefits:*
• King Tier ($2.50/month) - 16 ads/day
• Emperor Tier ($9.00/month) - 20 ads/day  
• Lord Tier ($25.00/month) - 25 ads/day

🎁 *Get Started:*
• Tap the button below to open the app
• Watch your first ad
• Start earning immediately!

💳 *Payment Methods:*
• TON Wallet
• USDT (TRC20)
    `;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '🚀 Open NAVIGI SBARO', web_app: { url: WEBAPP_URL } }],
            [
                { text: '💰 Watch Ads', web_app: { url: `${WEBAPP_URL}#earn` } },
                { text: '👑 VIP Upgrade', web_app: { url: `${WEBAPP_URL}#vip` } }
            ],
            [
                { text: '🏆 Contests', web_app: { url: `${WEBAPP_URL}#contests` } },
                { text: '👤 Profile', web_app: { url: `${WEBAPP_URL}#profile` } }
            ],
            [{ text: '❓ Help & Support', callback_data: 'help' }]
        ]
    };
    
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle /earn command
bot.onText(/\/earn/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '💰 Watch Ads & Earn', web_app: { url: `${WEBAPP_URL}#earn` } }],
            [{ text: '📊 View Stats', web_app: { url: `${WEBAPP_URL}#profile` } }]
        ]
    };
    
    bot.sendMessage(chatId, '💰 *Ready to earn?*\n\nTap below to start watching Monetag ads and earning points!\n\n🎯 *Earn 5 points per ad*\n⏱️ *30-second ads*\n💸 *Convert to real money*', {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle /vip command
bot.onText(/\/vip/, (msg) => {
    const chatId = msg.chat.id;
    
    const vipMessage = `
👑 *VIP MEMBERSHIP*

Unlock exclusive benefits and higher earnings!

*🔥 KING TIER - $2.50/month*
• 16 ads per day
• 1-minute cooldown
• 10 daily mining points
• Priority support

*💎 EMPEROR TIER - $9.00/month*
• 20 ads per day
• VIP exclusive competitions
• 15 daily mining points
• Premium support

*🏆 LORD TIER - $25.00/month*
• 25 ads per day
• Priority withdrawals
• 20 daily mining points
• Personal support manager

💳 *Payment Methods:*
• TON Wallet
• USDT (TRC20)
    `;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '👑 Upgrade to VIP', web_app: { url: `${WEBAPP_URL}#vip` } }],
            [
                { text: '💎 Pay with TON', callback_data: 'pay_ton' },
                { text: '💰 Pay with USDT', callback_data: 'pay_usdt' }
            ]
        ]
    };
    
    bot.sendMessage(chatId, vipMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle /contests command
bot.onText(/\/contests/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '🏆 View Active Contests', web_app: { url: `${WEBAPP_URL}#contests` } }]
        ]
    };
    
    bot.sendMessage(chatId, '🏆 *Active Contests*\n\nJoin contests to win amazing prizes!\n\n• Daily Points Contest - $100 prize pool\n• VIP Weekly Challenge - $500 prize pool\n• Referral Competition - Bonus rewards', {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle /profile command
bot.onText(/\/profile/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '👤 View Profile', web_app: { url: `${WEBAPP_URL}#profile` } }]
        ]
    };
    
    bot.sendMessage(chatId, '👤 *Your Profile*\n\nView your stats, referral code, and settings.', {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle /withdraw command
bot.onText(/\/withdraw/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '💸 Withdraw Earnings', web_app: { url: `${WEBAPP_URL}#profile` } }]
        ]
    };
    
    bot.sendMessage(chatId, '💸 *Withdraw Earnings*\n\nMinimum withdrawal: $10.00\n\n💳 *Methods:*\n• PayPal\n• USDT (TRC20)\n\n⏱️ *Processing time:* 24-48 hours', {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle /support command
bot.onText(/\/support/, (msg) => {
    const chatId = msg.chat.id;
    
    const supportMessage = `
❓ *Support & Help*

Need assistance? We're here to help!

📧 *Email:* support@navigi-sbaro.com
💬 *Telegram:* @SbaroSupport
⏰ *Hours:* 24/7 Support

🔗 *Quick Links:*
• How to earn points
• VIP membership benefits
• Payment methods
• Withdrawal process

We typically respond within 2-4 hours.
    `;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '🚀 Open App', web_app: { url: WEBAPP_URL } }],
            [{ text: '💬 Contact Support', url: 'https://t.me/SbaroSupport' }]
        ]
    };
    
    bot.sendMessage(chatId, supportMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle /referral command
bot.onText(/\/referral/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    const referralCode = `SBARO-${userId.toString().slice(-6).toUpperCase()}`;
    const shareText = `🚀 Join me on NAVIGI SBARO and earn money by watching ads! Use my referral code: ${referralCode}`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(`https://t.me/navigi_sbaro_bot`)}&text=${encodeURIComponent(shareText)}`;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '🎁 View Referral Program', web_app: { url: `${WEBAPP_URL}#profile` } }],
            [{ text: '📤 Share with Friends', url: shareUrl }]
        ]
    };
    
    bot.sendMessage(chatId, `🎁 *Your Referral Code*\n\n\`${referralCode}\`\n\nEarn bonus points for each friend you invite!\n\n💰 *Rewards:*\n• 50 points for each referral\n• 10% of their earnings\n• Special bonuses for active referrals`, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});

// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    const chatId = message.chat.id;
    
    switch (data) {
        case 'help':
            bot.sendMessage(chatId, '❓ *Need Help?*\n\nContact our support team:\n📧 support@navigi-sbaro.com\n💬 @SbaroSupport\n\nOr open the app for detailed guides and FAQs.', {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🚀 Open App', web_app: { url: WEBAPP_URL } }]
                    ]
                }
            });
            break;
            
        case 'pay_ton':
            bot.sendMessage(chatId, '💎 *TON Wallet Payment*\n\nOpen the app to complete your VIP upgrade with TON wallet.\n\n🔒 Secure payment processing\n⚡ Instant activation after confirmation', {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💎 Pay with TON', web_app: { url: `${WEBAPP_URL}#vip` } }]
                    ]
                }
            });
            break;
            
        case 'pay_usdt':
            bot.sendMessage(chatId, '💰 *USDT (TRC20) Payment*\n\nOpen the app to complete your VIP upgrade with USDT.\n\n🔒 Secure payment processing\n⚡ Instant activation after confirmation', {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '💰 Pay with USDT', web_app: { url: `${WEBAPP_URL}#vip` } }]
                    ]
                }
            });
            break;
    }
    
    bot.answerCallbackQuery(callbackQuery.id);
});

// Handle web app data
bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app.data);
    
    console.log('Web app data received:', data);
    
    // Handle different types of data from the web app
    switch (data.type) {
        case 'ad_watched':
            bot.sendMessage(chatId, `🎉 Congratulations! You earned ${data.points} points by watching an ad!`);
            break;
            
        case 'vip_upgrade':
            bot.sendMessage(chatId, `👑 VIP upgrade request received for ${data.tier} tier. We'll process your payment within 6 hours!`);
            break;
            
        case 'contest_joined':
            bot.sendMessage(chatId, `🏆 You've successfully joined the ${data.contest} contest! Good luck!`);
            break;
    }
});

// Error handling
bot.on('error', (error) => {
    console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

// Set up webhook (uncomment for production)
// bot.setWebHook(`${WEBHOOK_URL}/bot${BOT_TOKEN}`);

console.log('✅ NAVIGI SBARO Bot is running!');
console.log(`📱 Web App URL: ${WEBAPP_URL}`);
console.log(`🔗 Bot Link: https://t.me/navigi_sbaro_bot`);

// Export for use in other files
module.exports = bot;