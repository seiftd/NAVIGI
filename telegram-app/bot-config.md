# NAVIGI SBARO - Telegram Bot Configuration

## 🤖 Bot Setup Instructions

### 1. Create Your Telegram Bot

1. **Contact @BotFather** on Telegram
2. **Send** `/newbot`
3. **Choose a name** for your bot: `NAVIGI SBARO`
4. **Choose a username**: `@navigi_sbaro_bot` (must end with `_bot`)
5. **Save the bot token** you receive

### 2. Configure Bot Settings

Send these commands to @BotFather:

```
/setdescription
Choose your bot: @navigi_sbaro_bot
Description: 🚀 Earn money by watching ads! Join contests, upgrade to VIP, and withdraw your earnings. Start earning today!

/setabouttext
Choose your bot: @navigi_sbaro_bot
About: NAVIGI SBARO - The ultimate ad-watching rewards platform on Telegram

/setuserpic
Choose your bot: @navigi_sbaro_bot
Upload your app logo image

/setcommands
Choose your bot: @navigi_sbaro_bot
Commands:
start - 🚀 Start earning with NAVIGI SBARO
earn - 💰 Watch ads and earn points
vip - 👑 Upgrade to VIP membership
contests - 🏆 Join active contests
profile - 👤 View your profile and stats
withdraw - 💸 Withdraw your earnings
support - ❓ Get help and support
referral - 🎁 Share your referral code
```

### 3. Enable Mini App

```
/newapp
Choose your bot: @navigi_sbaro_bot
App name: NAVIGI SBARO
Description: Earn money by watching ads directly in Telegram!
Photo: Upload your app icon
Web App URL: https://yourdomain.com/telegram-app/
```

### 4. Bot Configuration Variables

Create a `.env` file with these variables:

```env
# Telegram Bot Configuration
BOT_TOKEN=8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY
BOT_USERNAME=navigi_sbaro_bot
WEBAPP_URL=https://navigi-bot.netlify.app/

# Backend API
API_BASE_URL=https://navigi-bot.netlify.app/.netlify/functions
WEBHOOK_URL=https://navigi-bot.netlify.app/.netlify/functions

# Database
DATABASE_URL=your_database_connection_string

# Payment Configuration
TON_WALLET_ADDRESS=UQDXq-8B3TNYV8kv5j5-rq9B5-7W8WqVZQwQ4L8-8qV5-5Kj
TRC20_WALLET_ADDRESS=TLDsutnxpdLZaRxhGWBJismwsjY3WITHWX

# Monetag Configuration
MONETAG_ZONE_ID=9656288
MONETAG_SDK_URL=//libtl.com/sdk.js
```

## 🔧 Bot Commands Implementation

### Basic Commands

#### /start Command
```javascript
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    
    const welcomeMessage = `
🚀 *Welcome to NAVIGI SBARO!*

Earn money by watching ads directly in Telegram!

💰 *How it works:*
• Watch short video ads
• Earn points for each ad
• Convert points to real money
• Withdraw via PayPal or Crypto

👑 *VIP Benefits:*
• More ads per day
• Higher earnings
• Exclusive contests
• Priority support

🎁 *Get Started:*
• Tap the button below to open the app
• Watch your first ad
• Start earning immediately!
    `;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '🚀 Open NAVIGI SBARO', web_app: { url: WEBAPP_URL } }],
            [{ text: '🎁 Join with Referral', callback_data: 'referral' }],
            [{ text: '❓ Help', callback_data: 'help' }]
        ]
    };
    
    bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});
```

#### /earn Command
```javascript
bot.onText(/\/earn/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '💰 Watch Ads & Earn', web_app: { url: `${WEBAPP_URL}#earn` } }],
            [{ text: '📊 View Stats', web_app: { url: `${WEBAPP_URL}#profile` } }]
        ]
    };
    
    bot.sendMessage(chatId, '💰 *Ready to earn?*\n\nTap below to start watching ads and earning points!', {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});
```

#### /vip Command
```javascript
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
    `;
    
    const keyboard = {
        inline_keyboard: [
            [{ text: '👑 Upgrade to VIP', web_app: { url: `${WEBAPP_URL}#vip` } }],
            [{ text: '💰 Pay with Telegram Stars', callback_data: 'pay_stars' }],
            [{ text: '🔗 Pay with Crypto', callback_data: 'pay_crypto' }]
        ]
    };
    
    bot.sendMessage(chatId, vipMessage, {
        parse_mode: 'Markdown',
        reply_markup: keyboard
    });
});
```

### 5. Webhook Setup

```javascript
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const bot = new TelegramBot(BOT_TOKEN);

// Set webhook
bot.setWebHook(`${WEBHOOK_URL}/bot${BOT_TOKEN}`);

// Webhook endpoint
app.post(`/bot${BOT_TOKEN}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

// Mini App data validation
app.post('/validate-telegram-data', (req, res) => {
    const { initData } = req.body;
    
    // Validate Telegram WebApp data
    const isValid = validateTelegramWebAppData(initData);
    
    if (isValid) {
        res.json({ valid: true });
    } else {
        res.status(400).json({ valid: false });
    }
});
```

## 🎯 Integration with Your Backend

### User Registration
```javascript
// When user starts the bot
async function registerUser(telegramUser) {
    const userData = {
        telegram_id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        language_code: telegramUser.language_code,
        is_premium: telegramUser.is_premium,
        joined_at: new Date()
    };
    
    // Save to your database
    await saveUserToDatabase(userData);
    
    // Initialize user stats
    await initializeUserStats(telegramUser.id);
}
```

### Payment Processing
```javascript
// Handle Telegram Stars payments
bot.on('pre_checkout_query', (query) => {
    bot.answerPreCheckoutQuery(query.id, true);
});

bot.on('successful_payment', async (msg) => {
    const payment = msg.successful_payment;
    const userId = msg.from.id;
    
    // Process VIP upgrade
    await processVipUpgrade(userId, payment.invoice_payload);
    
    bot.sendMessage(msg.chat.id, '🎉 Payment successful! Your VIP membership is now active!');
});
```

## 📱 Menu Button Configuration

Set up the menu button to open your Mini App:

```
/setmenubutton
Choose your bot: @navigi_sbaro_bot
Menu button text: 🚀 Open NAVIGI SBARO
Web App URL: https://yourdomain.com/telegram-app/
```

## 🔐 Security Considerations

1. **Validate all Telegram WebApp data**
2. **Use HTTPS for all endpoints**
3. **Implement rate limiting**
4. **Validate user permissions**
5. **Secure payment processing**

## 🚀 Deployment Checklist

- [ ] Bot created with @BotFather
- [ ] Mini App configured
- [ ] Webhook endpoint set up
- [ ] SSL certificate installed
- [ ] Database configured
- [ ] Payment methods integrated
- [ ] ADSTERRA ads configured
- [ ] Admin dashboard connected
- [ ] Testing completed

## 📞 Support Setup

Create support channels:
- **Support Bot**: @navigi_sbaro_support_bot
- **Support Group**: @navigi_sbaro_support
- **Channel**: @navigi_sbaro_news

## 🎉 Launch Strategy

1. **Soft Launch**: Test with limited users
2. **Beta Testing**: Gather feedback
3. **Marketing**: Promote on Telegram channels
4. **Referral Program**: Incentivize sharing
5. **Regular Updates**: Keep users engaged

---

**📝 Note**: Replace all placeholder URLs and tokens with your actual values before deployment.