# 🚀 NAVIGI SBARO - Admin Dashboard & Bot Control

A comprehensive admin dashboard with real-time bot control integration for the NAVIGI SBARO Telegram bot system.

## 📋 Features

### 🔥 Dashboard Features
- **Real-time Firebase Integration** - Live data synchronization
- **User Management** - View, search, and manage all users
- **Activity Monitoring** - Track user interactions and activities
- **VIP Request Management** - Approve/reject VIP upgrade requests
- **Payment Tracking** - Monitor revenue and payment history
- **Export Functionality** - Export data to CSV format

### 🤖 Bot Control Features
- **Real-time Bot Status** - Monitor bot online/offline status
- **Bot Statistics** - View total users, active users, messages
- **Broadcast Messages** - Send messages to all users
- **VIP Notifications** - Send personalized VIP messages
- **User Management** - Reset user data remotely
- **Bot Configuration** - Update VIP limits and cooldowns
- **System Logs** - Export bot activity logs
- **Bot Control** - Start, stop, restart bot remotely

## 🛠️ Installation

### Prerequisites
- Node.js >= 16.0.0
- Python 3.x (for simple HTTP server)
- Firebase project with Realtime Database

### Setup

1. **Install Dependencies**
```bash
cd admin-dashboard
npm install
```

2. **Configure Firebase**
   - Update Firebase configuration in `dashboard.js`
   - Ensure Firebase Realtime Database is enabled
   - Set up proper security rules

3. **Configure Bot Token**
   - Update bot token in `api-server.js`
   - Ensure bot has proper permissions

## 🚀 Running the System

### Option 1: Development Mode
```bash
# Terminal 1: Start API Server
npm run dev

# Terminal 2: Start Dashboard (Simple HTTP Server)
npm run dashboard

# Or use Python directly
python -m http.server 8000
```

### Option 2: Production Mode
```bash
# Start API Server
npm start

# Serve dashboard files using your preferred web server
# (nginx, Apache, or cloud hosting)
```

## 📊 Dashboard Navigation

### 1. Dashboard Overview
- **Total Users** - Number of registered users
- **Total Revenue** - Earnings from VIP purchases
- **User Activities** - Total logged actions
- **VIP Requests** - Pending approval requests
- **Recent Activities** - Latest user interactions

### 2. User Management
- **User List** - Complete user database
- **Search Users** - Find specific users
- **Export Users** - Download user data as CSV
- **User Details** - View individual user information

### 3. User Activities
- **Activity Log** - All user interactions
- **Activity Types** - Watch ads, VIP upgrades, contests
- **Search Activities** - Filter by user or activity type
- **Export Activities** - Download activity logs

### 4. VIP Requests
- **Pending Requests** - VIP upgrade requests
- **Approve/Reject** - Manage VIP applications
- **Bulk Actions** - Approve all requests at once
- **Request Details** - View user information

### 5. Payment Management
- **Payment History** - All transactions
- **Revenue Stats** - Total and monthly earnings
- **Success Rate** - Payment completion rate
- **Export Payments** - Download payment data

### 6. Bot Control ⭐ NEW
- **Bot Status** - Real-time online/offline status
- **Bot Statistics** - Users, messages, commands
- **Broadcast Messages** - Send to all users
- **VIP Notifications** - Send to specific users
- **User Management** - Reset user data
- **Bot Configuration** - Update settings
- **System Logs** - Export activity logs
- **Bot Control** - Start/stop/restart bot

## 🔧 Bot Control Features

### Real-time Status Monitoring
- **Online/Offline Status** - Live bot connection status
- **User Statistics** - Total and active user counts
- **Message Tracking** - Daily message count
- **Command Execution** - Commands processed today

### Message Broadcasting
```javascript
// Send broadcast to all users
await sendBotCommand('broadcast', { 
    message: 'Important announcement for all users!' 
});
```

### VIP Notifications
```javascript
// Send VIP message to specific user
await sendBotCommand('sendVipNotification', {
    userId: '123456789',
    message: 'Special VIP offer just for you!'
});
```

### User Management
```javascript
// Reset user data
await sendBotCommand('resetUser', {
    userId: '123456789'
});
```

### Bot Configuration
```javascript
// Update bot settings
await sendBotCommand('updateConfig', {
    vipLimits: {
        FREE: 20,
        KING: 50,
        EMPEROR: 100,
        LORD: 200
    },
    cooldowns: {
        ad: 300,
        contest: 300
    }
});
```

## 🔌 API Endpoints

### Bot Status
```
GET /api/bot-status
```
Returns bot status and statistics

### Bot Commands
```
POST /api/bot-command
```
Send commands to the bot:
- `broadcast` - Send message to all users
- `restart` - Restart the bot
- `stop` - Stop the bot
- `start` - Start the bot
- `stats` - Get bot statistics
- `sendVipNotification` - Send VIP message
- `resetUser` - Reset user data
- `exportLogs` - Export activity logs
- `updateConfig` - Update bot configuration

## 📱 Integration with Telegram Bot

The dashboard integrates seamlessly with the main Telegram bot:

1. **Real-time Data Sync** - Firebase Realtime Database
2. **Bot Control** - Direct API communication
3. **User Management** - Remote user data management
4. **Activity Tracking** - Monitor all bot interactions
5. **Payment Integration** - Track VIP purchases

## 🔒 Security Features

- **Firebase Authentication** - Secure data access
- **API Rate Limiting** - Prevent abuse
- **Input Validation** - Sanitize all inputs
- **Error Handling** - Graceful error management
- **Logging** - Comprehensive activity logging

## 📈 Monitoring & Analytics

### Real-time Metrics
- **User Growth** - New user registrations
- **Activity Trends** - User engagement patterns
- **Revenue Tracking** - VIP purchase analytics
- **Bot Performance** - Response times and uptime

### Export Capabilities
- **User Data** - Complete user database
- **Activity Logs** - All user interactions
- **Payment History** - Transaction records
- **Bot Logs** - System activity logs

## 🚀 Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start API server
npm run dev

# Start dashboard (in another terminal)
python -m http.server 8000

# Access dashboard at http://localhost:8000
```

### Production Deployment
1. **Deploy API Server** - Use PM2 or similar
2. **Serve Dashboard** - Use nginx or cloud hosting
3. **Configure Domain** - Set up proper domain
4. **SSL Certificate** - Enable HTTPS
5. **Firewall Rules** - Secure API endpoints

## 🔧 Configuration

### Firebase Configuration
Update `dashboard.js` with your Firebase credentials:
```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### Bot Configuration
Update `api-server.js` with your bot token:
```javascript
const BOT_TOKEN = 'your-bot-token';
const ADMIN_USER_ID = your-admin-user-id;
```

## 📞 Support

For support and questions:
- **Documentation** - Check this README
- **Issues** - Report bugs and feature requests
- **Community** - Join our Telegram group

## 🎯 Roadmap

- [ ] **Advanced Analytics** - Detailed user behavior analysis
- [ ] **A/B Testing** - Test different bot configurations
- [ ] **Multi-bot Support** - Manage multiple bots
- [ ] **Mobile App** - Native mobile dashboard
- [ ] **Webhook Integration** - Real-time notifications
- [ ] **Advanced Security** - Two-factor authentication

---

**Made with ❤️ by NAVIGI Team**