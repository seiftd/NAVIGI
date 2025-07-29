# 🚀 NAVIGI Complete Setup & Build Guide

## 📋 Table of Contents
1. [VS Code Setup & Running](#vs-code-setup)
2. [Android App Build Process](#android-build)
3. [Firebase & AdMob Configuration](#firebase-admob-config)
4. [Website Features](#website-features)
5. [Admin Dashboard Tools](#admin-dashboard)
6. [Troubleshooting](#troubleshooting)

---

## 🖥️ VS Code Setup & Running {#vs-code-setup}

### Step 1: Install Required Software
```bash
# 1. Download and install VS Code
# https://code.visualstudio.com/

# 2. Install Node.js (for backend and website)
# https://nodejs.org/ (Download LTS version)

# 3. Install Android Studio (for Android app)
# https://developer.android.com/studio

# 4. Install Git (if not already installed)
# https://git-scm.com/
```

### Step 2: VS Code Extensions
Install these extensions in VS Code:
- **Android iOS Emulator** (by DiemasMichiels)
- **Kotlin** (by mathiasfrohlich)
- **Gradle Language Support** (by naco-siren)
- **ES7+ React/Redux/React-Native snippets** (by dsznajder)
- **Thunder Client** (for API testing)

### Step 3: Open Project in VS Code
```bash
# 1. Open VS Code
# 2. File → Open Folder
# 3. Select your 'navigi-app' folder
# 4. VS Code will open the entire project
```

### Step 4: Setup Terminal in VS Code
```bash
# Open integrated terminal: Ctrl+` (backtick)
# You'll see multiple folders:
# - android-app/
# - backend/
# - website/
# - docs/
```

---

## 📱 Android App Build Process {#android-build}

### Option 1: Using VS Code + Android Studio

#### Step 1: Open Android Project
```bash
# In VS Code terminal:
cd android-app

# Open Android Studio separately:
# File → Open → Select 'android-app' folder
```

#### Step 2: Configure Android SDK in VS Code
```bash
# Add to VS Code settings.json:
{
    "android.sdk.path": "/path/to/Android/Sdk",
    "android.gradle.path": "/path/to/gradle"
}

# On Windows: C:\Users\YourName\AppData\Local\Android\Sdk
# On Mac: ~/Library/Android/sdk
# On Linux: ~/Android/Sdk
```

#### Step 3: Build Commands
```bash
# In VS Code terminal (android-app folder):

# Clean project
./gradlew clean

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug
```

### Option 2: Using Only Android Studio

#### Step 1: Open in Android Studio
1. Open Android Studio
2. File → Open → Select `android-app` folder
3. Wait for Gradle sync to complete

#### Step 2: Build APK
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. APK will be created in: `android-app/app/build/outputs/apk/debug/`

### Option 3: VS Code with Emulator

#### Setup Android Emulator in VS Code:
```bash
# 1. Press Ctrl+Shift+P
# 2. Type "Android iOS Emulator: Run android emulator"
# 3. Select your emulator
# 4. Use "Android iOS Emulator: Run android app" to install
```

---

## 🔧 Firebase & AdMob Configuration {#firebase-admob-config}

### 🔥 Firebase Setup

#### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Project name: `navigi-sbaro`
4. Enable Google Analytics (optional)

#### Step 2: Add Android App to Firebase
1. Click "Add app" → Android icon
2. **Package name**: `com.navigi.sbaro` (exactly this!)
3. App nickname: `NAVIGI`
4. Download `google-services.json`

#### Step 3: Place Firebase Config File
```bash
# Copy google-services.json to:
android-app/app/google-services.json

# The file structure should be:
android-app/
├── app/
│   ├── google-services.json  ← HERE
│   ├── build.gradle.kts
│   └── src/
```

#### Step 4: Enable Firebase Services
In Firebase Console:
1. **Authentication** → Enable Email/Password
2. **Firestore Database** → Create database (production mode)
3. **Cloud Messaging** → No additional setup needed
4. **Storage** → Enable for file uploads

### 📱 AdMob Configuration

#### Step 1: Create AdMob Account
1. Go to https://admob.google.com/
2. Sign in with Google account
3. Click "Get started"

#### Step 2: Create App in AdMob
1. Apps → "Add app"
2. Select "Android"
3. App name: `NAVIGI`
4. Package name: `com.navigi.sbaro`

#### Step 3: Create Ad Units
Create these ad units:
1. **Rewarded Video Ad**:
   - Name: "NAVIGI Rewarded Video"
   - Copy the Ad Unit ID (ca-app-pub-XXXXXXXX/XXXXXXXXX)
2. **Interstitial Ad**:
   - Name: "NAVIGI Interstitial"
   - Copy the Ad Unit ID

#### Step 4: Update AdMob IDs in Code

**File 1**: `android-app/app/src/main/res/values/strings.xml`
```xml
<!-- REPLACE THESE WITH YOUR ACTUAL IDs -->
<string name="admob_app_id">ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
<string name="admob_rewarded_ad_id">ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX</string>
<string name="admob_interstitial_ad_id">ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX</string>
```

**File 2**: `android-app/app/build.gradle.kts`
```kotlin
// In defaultConfig section, REPLACE:
buildConfigField("String", "ADMOB_APP_ID", "\"ca-app-pub-YOUR-APP-ID~XXXXXXXXXX\"")
buildConfigField("String", "ADMOB_REWARDED_AD_ID", "\"ca-app-pub-YOUR-REWARDED-ID/XXXXXXXXXX\"")
buildConfigField("String", "ADMOB_INTERSTITIAL_AD_ID", "\"ca-app-pub-YOUR-INTERSTITIAL-ID/XXXXXXXXXX\"")
```

### 🔧 Backend Firebase Configuration

**File**: `backend/.env`
```bash
# Copy from Firebase Project Settings → Service accounts → Generate new private key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

---

## 🌐 Website Features {#website-features}

### Running the Website
```bash
# In VS Code terminal:
cd website
npm install
npm start

# Website opens at: http://localhost:3000
```

### 🌍 Bilingual Benefits Explanation

The website explains app benefits in both languages:

#### **Arabic (العربية) Benefits**:
- **اربح نقاط سبارو**: شاهد الإعلانات واكسب نقاط يمكن تحويلها إلى أموال حقيقية
- **نظام الإحالة متعدد المستويات**: ادع أصدقاءك واكسب عمولة 5% من أرباحهم مدى الحياة
- **مسابقات يومية وأسبوعية**: شارك في المسابقات واربح جوائز نقدية كبيرة
- **طرق سحب متعددة**: اسحب أرباحك عبر بايننس، باريدي موب، جوجل بلاي أو فليكسي
- **أمان كامل**: تشفير متقدم وحماية بياناتك المالية
- **سهولة الاستخدام**: واجهة بسيطة ومتاحة باللغة العربية

#### **English Benefits**:
- **Earn SBARO Points**: Watch short ads and earn points convertible to real money
- **Multi-Level Referral System**: Invite friends and earn 5% commission for life
- **Daily & Weekly Contests**: Participate and win big cash prizes
- **Multiple Withdrawal Methods**: Withdraw via Binance Pay, BaridiMob, Google Play, Flexy
- **100% Secure**: Advanced encryption protects your financial data
- **User-Friendly**: Simple interface with full Arabic support

### 📄 Website Pages:
- **Homepage** (`/`): Main benefits and features
- **Features** (`/features`): Detailed feature list
- **How It Works** (`/how-it-works`): Step-by-step guide
- **About** (`/about`): Company information
- **Contact** (`/contact`): Support form
- **Admin Login** (`/admin/login`): Dashboard access

---

## 🛠️ Admin Dashboard Tools {#admin-dashboard}

### Accessing Admin Dashboard

#### Method 1: Direct URL
```
http://localhost:3000/admin/login
```

#### Method 2: From Website
1. Go to website footer
2. Click "Admin Panel" link
3. Or add admin link to navbar

### 🔐 Admin Login Credentials:
- **Email**: `seiftouatllol@gmail.com`
- **Password**: `seif0662`

### 📺 Ad Management Tools

#### Adding New Ads:
1. Login to admin dashboard
2. Click **"Ad Management"** in sidebar
3. Click **"Add New Ad"** button
4. Fill form:
   ```
   Title: Summer Sale Advertisement
   Type: Rewarded Video (users get points)
   Points Reward: 15 points
   Duration: 30 seconds
   Video URL: https://example.com/ad-video.mp4
   Description: Special summer promotion
   ```
5. Click **"Add Ad"**

#### Ad Types Available:
- **Rewarded Video**: Users watch full video, get points
- **Interstitial**: Full-screen ads between app screens
- **Banner**: Small ads displayed in app

#### Ad Management Features:
- ✅ **Create, Edit, Delete** ads
- ✅ **Set point rewards** (how many points users earn)
- ✅ **Control ad duration** and type
- ✅ **Track performance** (views, earnings)
- ✅ **Pause/Resume** ads anytime
- ✅ **Upload videos** or use external URLs

### 📋 Survey Management Tools

#### Adding New Surveys:
1. Go to **"Survey Management"**
2. Click **"Add New Survey"**
3. Configure:
   ```
   Title: Product Feedback Survey
   Points Reward: 25 points
   Duration: 5 minutes
   Number of Questions: 10
   Target: All users
   ```
4. Click **"Add Survey"**

#### Survey Features:
- ✅ **Custom surveys** with multiple question types
- ✅ **Set completion rewards** (points for finishing)
- ✅ **Track responses** and completion rates
- ✅ **Export data** for analysis
- ✅ **Schedule surveys** for specific dates
- ✅ **Target specific user groups**

### 💰 Withdrawal Management
- **View all withdrawal requests**
- **Approve/Reject** requests with one click
- **Track payment methods** used
- **Send notifications** to users
- **Export withdrawal reports**

### 🏆 Contest Management
- **Create contests** (Daily, Weekly, Monthly)
- **Set requirements** (ads to watch)
- **Manage prize pools** and winners
- **Automatic winner selection**
- **Send winner notifications**

---

## 🔧 Running All Components {#running-all}

### Complete Development Setup:

#### Terminal 1 - Backend API:
```bash
cd backend
npm install
npm run dev
# Runs on: http://localhost:3000
```

#### Terminal 2 - Website:
```bash
cd website
npm install
npm start
# Runs on: http://localhost:3001
```

#### Terminal 3 - Android App:
```bash
cd android-app
# Open Android Studio or use VS Code Android extension
./gradlew assembleDebug
```

### Access Points:
- **Website**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3001/admin/login
- **Backend API**: http://localhost:3000/api
- **Android App**: Install APK on device/emulator

---

## 🐛 Troubleshooting {#troubleshooting}

### Common Issues:

#### 1. Android Build Errors:
```bash
# Clean and rebuild:
cd android-app
./gradlew clean
./gradlew assembleDebug

# If gradle issues:
./gradlew wrapper --gradle-version 8.2
```

#### 2. Firebase Connection Issues:
- ✅ Check `google-services.json` is in correct location
- ✅ Verify package name is exactly `com.navigi.sbaro`
- ✅ Enable required Firebase services

#### 3. AdMob Not Working:
- ✅ Replace test IDs with your real AdMob IDs
- ✅ Add your app to AdMob console
- ✅ Wait 24-48 hours for ads to start showing

#### 4. Website/Backend Issues:
```bash
# Clear npm cache:
npm cache clean --force

# Reinstall dependencies:
rm -rf node_modules package-lock.json
npm install
```

#### 5. VS Code Android Extension Issues:
- ✅ Set Android SDK path in VS Code settings
- ✅ Install Android command line tools
- ✅ Create Android emulator in Android Studio first

---

## 📱 Building Final APK

### Debug APK (for testing):
```bash
cd android-app
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (for production):
```bash
# Generate keystore first:
keytool -genkey -v -keystore navigi-key.keystore -alias navigi -keyalg RSA -keysize 2048 -validity 10000

# Build release:
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 Quick Checklist

- [ ] ✅ VS Code installed with extensions
- [ ] ✅ Android Studio setup complete
- [ ] ✅ Firebase project created
- [ ] ✅ `google-services.json` added to app
- [ ] ✅ AdMob account created and IDs updated
- [ ] ✅ Backend `.env` configured
- [ ] ✅ Website running at localhost:3001
- [ ] ✅ Admin dashboard accessible
- [ ] ✅ Android app builds successfully
- [ ] ✅ All three components running together

**🔑 Remember**: 
- Admin Email: `seiftouatllol@gmail.com`
- Admin Password: `seif0662`
- Package Name: `com.navigi.sbaro` (don't change this!)

Your complete NAVIGI app is now ready to run and build! 🚀