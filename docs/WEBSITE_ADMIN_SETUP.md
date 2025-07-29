# 🌐 NAVIGI Website & Admin Dashboard Setup Guide

## 📋 Overview

The NAVIGI website includes:
1. **Marketing Website** - Arabic/English landing pages explaining app benefits
2. **Admin Dashboard** - Complete management system for ads, surveys, users, and withdrawals

## 🚀 Quick Setup Instructions

### Step 1: Install Dependencies
```bash
cd website
npm install
```

### Step 2: Start Development Server
```bash
npm start
# Website will open at http://localhost:3001
```

### Step 3: Access Admin Dashboard
1. Go to `http://localhost:3001/admin/login`
2. **Login Credentials**:
   - Email: `seiftouatllol@gmail.com`
   - Password: `seif0662`

## 📱 Marketing Website Features

### 🌍 Bilingual Support (Arabic & English)
- **Homepage**: Explains all app benefits
- **Features**: Detailed feature explanations
- **How It Works**: Step-by-step user journey
- **About**: Company information
- **Contact**: Support contact form

### 💡 Key Benefits Explained:

#### **Arabic Version (العربية)**:
- **اربح نقاط سبارو**: شاهد الإعلانات واكسب نقاط يمكن تحويلها إلى أموال حقيقية
- **نظام الإحالة متعدد المستويات**: ادع أصدقاءك واكسب عمولة 5% من أرباحهم مدى الحياة
- **مسابقات يومية وأسبوعية**: شارك في المسابقات واربح جوائز نقدية كبيرة
- **طرق سحب متعددة**: اسحب أرباحك عبر بايننس، باريدي موب، جوجل بلاي أو فليكسي
- **آمان وموثوقية**: تشفير متقدم وحماية كاملة لبياناتك المالية
- **دعم اللغة العربية**: واجهة كاملة باللغة العربية مع دعم الكتابة من اليمين لليسار

#### **English Version**:
- **Earn SBARO Points**: Watch ads and earn points that can be converted to real money
- **Multi-Level Referral System**: Invite friends and earn 5% commission from their earnings for life
- **Daily & Weekly Contests**: Participate in contests and win big cash prizes
- **Multiple Withdrawal Methods**: Withdraw via Binance Pay, BaridiMob, Google Play or Flexy
- **Safe & Secure**: Advanced encryption and complete protection for your financial data
- **Arabic Language Support**: Full Arabic interface with right-to-left text support

## 🛠️ Admin Dashboard Features

### 📊 Dashboard Overview
- **Total Users**: 10,847 active users
- **Monthly Payouts**: $50,000+
- **Ads Watched**: 156,743 total views
- **Surveys Completed**: 12,847 responses

### 📺 Ad Management

#### How to Add New Ads:
1. Go to **Ad Management** section
2. Click **"Add New Ad"** button
3. Fill in ad details:
   - **Title**: Product Advertisement
   - **Type**: Choose from:
     - Rewarded Video (users get points)
     - Interstitial (between app screens)
     - Banner (display ads)
   - **Points Reward**: 10-50 points per view
   - **Duration**: 15-60 seconds
   - **Video URL**: Direct link to ad video
   - **Description**: Ad content description

#### Ad Management Features:
- ✅ **Create/Edit/Delete** ads
- ✅ **Set point rewards** (how many points users earn)
- ✅ **Control ad duration** and type
- ✅ **Track ad performance** (views, earnings)
- ✅ **Pause/Resume** ads anytime
- ✅ **Upload video content** or use URLs

### 📋 Survey Management

#### How to Add New Surveys:
1. Go to **Survey Management** section
2. Click **"Add New Survey"** button
3. Configure survey:
   - **Title**: Customer Satisfaction Survey
   - **Points Reward**: 20-50 points
   - **Duration**: 3-10 minutes
   - **Number of Questions**: 5-15 questions
   - **Target Audience**: All users or specific groups

#### Survey Features:
- ✅ **Create custom surveys** with multiple question types
- ✅ **Set completion rewards** (points for finishing)
- ✅ **Track response rates** and analytics
- ✅ **Export survey data** for analysis
- ✅ **Schedule surveys** for specific dates
- ✅ **Target specific user groups**

### 💰 Withdrawal Management

#### Approval Process:
1. Users request withdrawals in app
2. Requests appear in **"Withdrawals"** section
3. Admin reviews each request:
   - **Approve**: User gets money within 8 hours
   - **Reject**: User gets notification with reason

#### Supported Payment Methods:
- **Binance Pay**: Minimum $2 (20 points)
- **BaridiMob**: Minimum $5.5 (55 points) → 99 DA
- **Google Play Cards**: $1, $5, $10, $25, $50 cards
- **Flexy (Mobilis/Ooredoo)**: Minimum $1 (10 points) → 18 DA

### 🏆 Contest Management

#### Contest Types:
1. **Daily Contest**:
   - Requirement: Watch 10 ads in a day
   - Prize: 40% of total points (1 winner)
   - Admin keeps: 60%

2. **Weekly Contest**:
   - Requirement: Watch 30 ads in a week
   - Prize: 75% shared among 5 winners (15% each)
   - Admin keeps: 25%

3. **Monthly Contest**:
   - Requirement: Watch 100 ads in a month
   - Prize: 60% shared among 20 winners (3% each)
   - Admin keeps: 40%

### 👥 User Management

#### User Features:
- **View all users** with detailed profiles
- **Block/Unblock users** for violations
- **Track user activity** (ads watched, earnings)
- **Manage referral chains** and commissions
- **Send notifications** to specific users
- **Export user data** for analysis

### 🔔 Notification System

#### Send Notifications for:
- **Contest Winners**: Congratulations messages
- **Withdrawal Updates**: Approved/rejected status
- **New Features**: App updates and news
- **Promotional**: Special offers and bonuses
- **System**: Maintenance and important updates

## 💻 Technical Setup

### Frontend (React.js)
```bash
# Install dependencies
npm install

# Start development
npm start

# Build for production
npm run build
```

### Backend Integration
```bash
# Connect to backend API
# Update API endpoints in src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api'
```

### Environment Variables
```bash
# Create .env file in website folder
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_FIREBASE_CONFIG=your-firebase-config
REACT_APP_ADMIN_EMAIL=seiftouatllol@gmail.com
```

## 🔧 Customization Options

### Branding
- Update logo in `src/assets/logo.png`
- Change colors in `src/App.js` theme configuration
- Modify text content in translation files

### Language Support
- English: `src/i18n/en.json`
- Arabic: `src/i18n/ar.json`
- Add new languages in `src/i18n/` folder

### Admin Features
- Add new dashboard sections
- Customize statistics and charts
- Integrate with analytics tools
- Add export functionality

## 📈 Analytics & Reporting

### Built-in Reports:
- **User Growth**: Daily/weekly/monthly signups
- **Revenue Reports**: Ad revenue and user earnings
- **Engagement Metrics**: Ad views and survey completions
- **Withdrawal Analysis**: Payment method preferences
- **Referral Performance**: Commission tracking

### Export Options:
- **CSV**: User data and transaction history
- **PDF**: Financial reports and summaries
- **Excel**: Detailed analytics with charts

## 🔐 Security Features

### Admin Security:
- **2FA Authentication**: Optional two-factor auth
- **Role-based Access**: Different admin permission levels
- **Audit Logs**: Track all admin actions
- **Session Management**: Auto-logout after inactivity

### Data Protection:
- **Encrypted Storage**: All sensitive data encrypted
- **Secure API**: JWT tokens and rate limiting
- **Privacy Compliance**: GDPR and local privacy laws
- **Backup System**: Daily automated backups

## 🚀 Production Deployment

### Hosting Options:
1. **Vercel** (Recommended for React)
2. **Netlify** (Easy deployment)
3. **AWS S3 + CloudFront** (Scalable)
4. **Google Cloud Platform** (Firebase hosting)

### Domain Setup:
- **Main Site**: `navigi.com`
- **Admin Panel**: `admin.navigi.com`
- **API**: `api.navigi.com`

### SSL Certificate:
- Enable HTTPS for all domains
- Use Let's Encrypt for free SSL
- Configure security headers

## 📞 Support & Maintenance

### Admin Training:
1. **Dashboard Navigation**: 30-minute walkthrough
2. **Ad Management**: How to create and manage ads
3. **User Support**: Handling user issues and withdrawals
4. **Reports**: Understanding analytics and metrics

### Regular Maintenance:
- **Daily**: Check withdrawal requests
- **Weekly**: Review user activity and contests
- **Monthly**: Analyze revenue and growth metrics
- **Quarterly**: Update features and security patches

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js and npm
- [ ] Clone the website repository
- [ ] Run `npm install` in website folder
- [ ] Start with `npm start`
- [ ] Access admin at `/admin/login`
- [ ] Add first advertisement
- [ ] Create first survey
- [ ] Test withdrawal process
- [ ] Configure payment methods
- [ ] Set up notification system

**🔑 Admin Login**: seiftouatllol@gmail.com / seif0662

Your NAVIGI website and admin dashboard are now ready to manage thousands of users and process hundreds of withdrawals daily! 🚀