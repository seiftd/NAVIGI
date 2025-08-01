# 🚀 NAVIGI SBARO - Telegram Mini App Deployment Guide

## ✅ **READY TO DEPLOY!**

Your Telegram Mini App is configured with:
- **Bot Token**: `8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY`
- **Netlify URL**: `https://navigi-bot.netlify.app/`
- **Monetag Ads**: Zone ID `9656288` integrated
- **Payment Methods**: TON Wallet + USDT (TRC20)

---

## 📋 **Step 1: Deploy to Netlify**

### 1.1 Upload Files to Netlify
1. **Drag and drop** the `telegram-app` folder to Netlify
2. **Or connect** your GitHub repository
3. **Set build command**: `npm install` (if using Node.js)
4. **Set publish directory**: `./` (root of telegram-app folder)

### 1.2 Configure Netlify Functions
Your functions are ready in `/netlify/functions/`:
- ✅ `ad-watch.js` - Handles ad watching events
- ✅ `vip-payment.js` - Handles VIP payment submissions

### 1.3 Environment Variables (Optional)
In Netlify dashboard, add these if needed:
```
BOT_TOKEN=8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY
MONETAG_ZONE_ID=9656288
TON_WALLET=UQDXq-8B3TNYV8kv5j5-rq9B5-7W8WqVZQwQ4L8-8qV5-5Kj
TRC20_WALLET=TLDsutnxpdLZaRxhGWBJismwsjY3WITHWX
```

---

## 🤖 **Step 2: Configure Telegram Bot**

### 2.1 Talk to @BotFather
Send these commands to @BotFather:

```
/setdescription
Choose your bot: @navigi_sbaro_bot
Description: 🚀 Earn money by watching ads! Join contests, upgrade to VIP, and withdraw your earnings. Start earning today!

/setabouttext  
Choose your bot: @navigi_sbaro_bot
About: NAVIGI SBARO - The ultimate ad-watching rewards platform on Telegram

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

### 2.2 Set Up Mini App
```
/newapp
Choose your bot: @navigi_sbaro_bot
App name: NAVIGI SBARO
Description: Earn money by watching ads directly in Telegram!
Photo: Upload your app logo
Web App URL: https://navigi-bot.netlify.app/
```

### 2.3 Configure Menu Button
```
/setmenubutton
Choose your bot: @navigi_sbaro_bot
Menu button text: 🚀 Open NAVIGI SBARO
Web App URL: https://navigi-bot.netlify.app/
```

---

## 💰 **Step 3: Payment Setup**

### 3.1 TON Wallet Address
- **Address**: `UQDXq-8B3TNYV8kv5j5-rq9B5-7W8WqVZQwQ4L8-8qV5-5Kj`
- **Network**: TON Blockchain
- **Usage**: VIP payments

### 3.2 TRC20 USDT Address  
- **Address**: `TLDsutnxpdLZaRxhGWBJismwsjY3WITHWX`
- **Network**: TRON (TRC20)
- **Currency**: USDT
- **Usage**: VIP payments

### 3.3 VIP Pricing
- **King Tier**: $2.50/month (≈6.25 TON)
- **Emperor Tier**: $9.00/month (≈22.5 TON)
- **Lord Tier**: $25.00/month (≈62.5 TON)

---

## 📊 **Step 4: Admin Dashboard Integration**

### 4.1 Webhook Endpoints
Your Netlify functions will receive:

**Ad Watch Events** → `/.netlify/functions/ad-watch`
```json
{
  "type": "ad_watch",
  "user_id": 123456789,
  "telegram_user": {
    "id": 123456789,
    "first_name": "John",
    "username": "john_doe"
  },
  "points_earned": 5,
  "ad_type": "monetag_rewarded",
  "timestamp": 1640995200000,
  "platform": "telegram_mini_app"
}
```

**VIP Payment Requests** → `/.netlify/functions/vip-payment`
```json
{
  "type": "vip_payment_request",
  "user_id": 123456789,
  "telegram_user": {...},
  "vip_tier": "EMPEROR",
  "price": 9.00,
  "payment_method": "TON",
  "transaction_hash": "abc123...",
  "status": "pending",
  "platform": "telegram_mini_app"
}
```

### 4.2 Connect to Your Admin Dashboard
In your admin dashboard, create endpoints to receive data from:
- `https://navigi-bot.netlify.app/.netlify/functions/ad-watch`
- `https://navigi-bot.netlify.app/.netlify/functions/vip-payment`

---

## 🎯 **Step 5: Testing**

### 5.1 Test Mini App
1. Open `https://t.me/navigi_sbaro_bot`
2. Send `/start`
3. Click "🚀 Open NAVIGI SBARO"
4. Test all features:
   - ✅ Watch ads (Monetag integration)
   - ✅ VIP payments (TON/USDT)
   - ✅ Profile and stats
   - ✅ Contests and referrals

### 5.2 Test Bot Commands
```
/start - Welcome message with Mini App button
/earn - Direct link to earn section
/vip - VIP upgrade options
/contests - Contest information
/profile - Profile and stats
/withdraw - Withdrawal information
/support - Support contact
/referral - Referral code and sharing
```

### 5.3 Test Payments
1. **TON Wallet**: Send test amount to TON address
2. **USDT TRC20**: Send test amount to TRC20 address
3. **Verify**: Check Netlify function logs for payment data

---

## 🔧 **Step 6: Advanced Configuration**

### 6.1 Custom Domain (Optional)
1. In Netlify: Settings → Domain management
2. Add custom domain: `app.your-domain.com`
3. Update bot WebApp URL in @BotFather

### 6.2 Analytics Setup
Add Google Analytics or similar to track:
- User engagement
- Ad watch rates
- VIP conversion rates
- Revenue metrics

### 6.3 Database Integration
Connect to your database to store:
- User profiles and stats
- Transaction history
- VIP memberships
- Contest participation

---

## 🚀 **Step 7: Launch!**

### 7.1 Soft Launch
1. **Test with friends** first
2. **Verify all functions** work correctly
3. **Check payment processing**
4. **Monitor Netlify function logs**

### 7.2 Marketing Launch
1. **Share bot link**: `https://t.me/navigi_sbaro_bot`
2. **Promote on social media**
3. **Use referral system** for viral growth
4. **Monitor user feedback**

---

## 📞 **Support & Monitoring**

### 7.1 Monitor Netlify Functions
- Check function logs for errors
- Monitor API response times
- Track payment submissions

### 7.2 User Support
- Set up @SbaroSupport channel
- Monitor user feedback
- Handle payment issues quickly

### 7.3 Performance Optimization
- Optimize Monetag ad loading
- Improve Mini App performance
- Monitor user retention rates

---

## ⚡ **Quick Start Checklist**

- [ ] Upload files to Netlify
- [ ] Configure @BotFather settings
- [ ] Set up Mini App URL
- [ ] Test bot commands
- [ ] Verify Monetag ads work
- [ ] Test TON/USDT payments
- [ ] Connect admin dashboard
- [ ] Launch and promote!

---

## 🎉 **You're Ready!**

Your NAVIGI SBARO Telegram Mini App is fully configured and ready to launch! 

**Bot Link**: `https://t.me/navigi_sbaro_bot`
**Mini App**: `https://navigi-bot.netlify.app/`

Start earning from Telegram users worldwide! 🚀💰