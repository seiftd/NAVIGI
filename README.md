# NAVIGI (SBARO) - Ads Rewards App with Referral System

A comprehensive Android application that allows users to watch ads and earn points, featuring a multi-level referral system, contests, multiple withdrawal methods, and an admin dashboard.

## 🏗️ Project Structure

```
navigi-app/
├── android-app/                 # Android application (Kotlin + Jetpack Compose)
├── backend/                     # Node.js backend API
├── admin-dashboard/             # React.js admin dashboard
├── firebase-config/             # Firebase configuration files
└── docs/                        # Documentation
```

## 🚀 Features

### User Features
- 📱 **User Registration & Login** - Email/phone authentication with unique referral codes
- 📺 **Ad Watching** - Integrated Google AdMob with 70% revenue sharing
- 🔄 **Multi-Level Referral System** - 5% Level 1, 3% Level 2 earnings
- 💰 **Multiple Withdrawal Methods** - Binance Pay, BaridiMob, Google Play Cards, Flexy
- 🏆 **Contest System** - Daily, Weekly, Monthly contests with prizes
- 🎮 **Additional Earning Methods** - Games, surveys, video likes
- 🔔 **Push Notifications** - Real-time updates via Firebase FCM
- 🌐 **Localization** - Arabic (RTL) and English (LTR) support

### Admin Features
- 📊 **Statistics Dashboard** - Earnings, users, revenue analytics
- 💳 **Withdrawal Management** - Approve/reject withdrawal requests
- 🏆 **Contest Management** - Automated winner selection and prize allocation
- 👥 **User Management** - View, block, delete users
- 📱 **Push Notifications** - Send custom notifications
- 🔐 **Security** - JWT authentication with 2FA

## 🛠️ Technology Stack

### Android App
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM + Clean Architecture
- **Backend**: Firebase (Auth, Firestore, FCM)
- **Ads**: Google AdMob SDK
- **Additional SDKs**: Tapjoy (games), Pollfish (surveys), YouTube API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth + JWT
- **Security**: AES-256 encryption, rate limiting

### Admin Dashboard
- **Framework**: React.js
- **UI Library**: Material-UI
- **State Management**: Redux Toolkit
- **Authentication**: JWT with 2FA

## 🎨 Design System

- **Primary Color**: #3498DB (Blue)
- **Secondary Color**: #2ECC71 (Green)
- **Modern UI/UX**: Material Design 3
- **Icons**: Custom app and SBARO point icons

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- Android Studio
- Firebase Project
- Google AdMob Account

### Setup Instructions
1. Clone the repository
2. Set up Firebase project
3. Configure environment variables
4. Install dependencies
5. Run development servers

## 📊 Revenue Model

### Ad Revenue Sharing
- **User**: 70% of ad revenue
- **Admin**: 30% of ad revenue

### Referral Commission (from admin's 30%)
- **Level 1**: 5% of referred user's earnings
- **Level 2**: 3% of indirect referral's earnings

### Contest Prize Distribution
- **Daily**: 40% to winner, 60% to admin
- **Weekly**: 75% to winners (15% each), 25% to admin
- **Monthly**: 60% to winners (3% each), 40% to admin

## 🔐 Security Features

- AES-256 encryption for sensitive data
- HTTPS for all communications
- Rate limiting and fraud detection
- JWT authentication with 2FA for admin
- Secure API endpoints with validation

## 🌍 Localization

- **English (LTR)**: Default language
- **Arabic (RTL)**: Full RTL support with proper text direction

## 📱 Minimum Requirements

- **Android**: API level 24 (Android 7.0)
- **Internet**: Required for all features
- **Storage**: 50MB for app installation

## 👨‍💻 Development Team

- **Admin Email**: seiftouatllol@gmail.com
- **Admin Password**: seif0662

## 📄 License

This project is proprietary software developed for NAVIGI/SBARO.
