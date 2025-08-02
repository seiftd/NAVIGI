# 🚀 NAVIGI SBARO Bot - Enhanced Version 2.0

> **Advanced Telegram Bot with Real-time Firebase Integration and Admin Dashboard**

A comprehensive Telegram bot system featuring enhanced navigation, real-time Firebase integration, and a powerful admin dashboard for complete control and monitoring.

## ✨ Key Features

### 🤖 Enhanced Bot Navigation
- **Modernized Menu System**: Intuitive navigation with categorized sections
- **Smart Earn Zone**: Dedicated area for all earning activities
- **VIP Center**: Premium experience management
- **Digital Wallet**: Complete financial overview
- **Settings & Support**: User preferences and help center

### 📊 Advanced Admin Dashboard
- **Real-time Monitoring**: Live Firebase data synchronization
- **Enhanced Controls**: Bulk operations, broadcasting, analytics
- **Time-based Analytics**: 1h, 24h, 7d, 30d reporting
- **Export Functionality**: CSV/JSON data export
- **Bot Command Center**: Direct bot control from dashboard

### 🔥 Firebase Integration
- **Real-time Database**: Instant data synchronization
- **User Management**: Complete user lifecycle tracking
- **Activity Logging**: Detailed user activity monitoring
- **VIP System**: Automated VIP request handling

## 🏗️ Project Structure

```
navigi-sbaro-bot/
├── telegram-bot/           # Main bot application
│   └── bot.js             # Enhanced bot with new navigation
├── admin-dashboard/        # Admin control panel
│   ├── index.html         # Enhanced dashboard UI
│   └── dashboard.js       # Advanced dashboard controls
├── firebase-config.js     # Firebase configuration
├── start-bots.js         # Bot orchestration
├── ecosystem.config.js   # PM2 production config
└── .env.example          # Environment template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase project with Realtime Database
- Telegram bot token

### 1. Clone & Install
```bash
git clone https://github.com/navigi/sbaro-bot.git
cd navigi-sbaro-bot
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Start Development
```bash
# Start both bots
npm run dev

# Start main bot only
npm run dev:main

# Start dashboard locally
npm run dev:dashboard
```

### 4. Production Deployment
```bash
# Using PM2
npm run pm2:start

# Direct production start
npm run deploy
```

## 🎮 Bot Navigation System

### Main Menu
```
🚀 NAVIGI SBARO - Navigation Hub

📊 Your Dashboard:
• 💎 Points: 1,234.5
• 💰 Balance: $12.34
• 👑 VIP Status: KING
• 📺 Daily Ads: 15/50

🎮 Navigation Menu:
[📺 Earn Zone] [🏆 Contests]
[👥 Referrals] [👑 VIP Center]
[📊 My Profile] [💰 Wallet]
[⚙️ Settings] [📞 Support]
[🔄 Refresh Stats]
```

### Enhanced Features
- **Earn Zone**: Consolidated earning hub with progress tracking
- **VIP Center**: Premium status management and upgrades
- **Digital Wallet**: Complete financial overview with history
- **Smart Navigation**: Context-aware buttons and quick actions

## 📊 Admin Dashboard Features

### Enhanced Controls
- **Real-time Monitoring**: Live user activity and statistics
- **Time Range Selection**: 1h, 24h, 7d, 30d analytics
- **Auto Refresh**: Configurable automatic data updates
- **Manual Refresh**: Instant data synchronization

### Quick Actions
- **📢 Send Broadcast**: Mass messaging to all users
- **📥 Export Users**: CSV/JSON data export
- **🔄 Refresh Data**: Force Firebase sync

### Advanced Tabs
- **📈 Analytics & Reports**: Detailed statistics and trends
- **🤖 Bot Controls**: Direct bot command interface
- **⚙️ System Settings**: Dashboard configuration

## 🔧 Configuration

### Environment Variables
```env
# Bot Configuration
BOT_TOKEN=your_bot_token
ADMIN_USER_ID=your_admin_id

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_DATABASE_URL=your_database_url
FIREBASE_PRIVATE_KEY=your_private_key

# Settings
VIP_LIMITS_FREE=20
VIP_LIMITS_KING=50
AD_COOLDOWN=300000
```

### Firebase Database Structure
```json
{
  "users": {
    "user_id": {
      "username": "string",
      "points": "number",
      "balance": "number",
      "vip_status": "FREE|KING|EMPEROR|LORD",
      "daily_ads_watched": "number",
      "last_activity": "timestamp"
    }
  },
  "activities": {
    "activity_id": {
      "user_id": "string",
      "type": "ad_watched|contest_joined",
      "timestamp": "timestamp",
      "data": "object"
    }
  }
}
```

## 🚀 Deployment Options

### Option 1: PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
npm run pm2:start

# Monitor
npm run pm2:logs

# Restart
npm run pm2:restart
```

### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Option 3: Cloud Deployment
- **Heroku**: Use `Procfile` with `web: npm start`
- **Railway**: Connect GitHub repo and deploy
- **DigitalOcean**: Use App Platform with Node.js

## 📊 Monitoring & Analytics

### Dashboard Metrics
- **Total Users**: Real-time user count
- **Active Users**: Users active in selected timeframe
- **VIP Users**: Premium subscribers
- **Total Earnings**: System-wide earnings
- **Ads Watched**: Advertisement engagement

### Performance Monitoring
- **Firebase Connection**: Real-time status
- **Bot Uptime**: System availability
- **Response Times**: Performance metrics
- **Error Rates**: System health

## 🔐 Security Features

- **Rate Limiting**: Prevents spam and abuse
- **Input Validation**: Secure data handling
- **Environment Variables**: Secure credential management
- **Firebase Rules**: Database access control

## 🛠️ Development

### Scripts
```bash
npm run dev          # Development mode
npm run lint         # Code linting
npm run test         # Run tests
npm run logs         # View logs
```

### Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support

- **Admin Contact**: @Sbaroone
- **Website**: https://navigiu.netlify.app
- **Dashboard**: https://navigiu.netlify.app/admin-dashboard

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔄 Version History

### v2.0.0 (Current)
- ✅ Enhanced bot navigation system
- ✅ Advanced admin dashboard
- ✅ Real-time Firebase integration
- ✅ Performance optimizations
- ✅ Production deployment configs

### v1.0.0
- Basic bot functionality
- Simple Firebase integration
- Basic admin features

---

**🚀 Ready for Production!** 
Start earning with NAVIGI SBARO Bot today!
