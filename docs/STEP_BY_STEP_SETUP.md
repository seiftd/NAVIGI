# 🚀 Complete Step-by-Step Setup Guide

## 📋 Table of Contents
1. [Install Required Software](#install-software)
2. [Setup VS Code](#setup-vscode)
3. [Create Your Firebase Project](#firebase-setup)
4. [Configure Project](#configure-project)
5. [Run Everything](#run-everything)
6. [Test & Verify](#test-verify)

---

## 💻 1. Install Required Software {#install-software}

### **Download & Install These (Required):**

#### **Step 1.1: Install VS Code**
- Go to: https://code.visualstudio.com/
- Download for your OS (Windows/Mac/Linux)
- Install with default settings

#### **Step 1.2: Install Node.js**
- Go to: https://nodejs.org/
- Download **LTS version** (Long Term Support)
- Install with default settings
- **Test**: Open terminal/cmd and type: `node --version`

#### **Step 1.3: Install Android Studio**
- Go to: https://developer.android.com/studio
- Download Android Studio
- Install with default settings
- **During setup**: Install Android SDK (API 30 or higher)

#### **Step 1.4: Install Git**
- Go to: https://git-scm.com/
- Download and install
- **Test**: Open terminal/cmd and type: `git --version`

---

## 🖥️ 2. Setup VS Code {#setup-vscode}

### **Step 2.1: Install VS Code Extensions**
1. Open VS Code
2. Click Extensions icon (left sidebar) or press `Ctrl+Shift+X`
3. Install these extensions:
   - **Android iOS Emulator** (by DiemasMichiels)
   - **Kotlin** (by mathiasfrohlich) 
   - **Gradle Language Support** (by naco-siren)
   - **ES7+ React/Redux/React-Native snippets** (by dsznajder)
   - **Thunder Client** (for API testing)

### **Step 2.2: Configure Android SDK Path**
1. In VS Code: `Ctrl+Shift+P` → Type "Preferences: Open Settings (JSON)"
2. Add these lines:
```json
{
    "android.sdk.path": "C:\\Users\\YourName\\AppData\\Local\\Android\\Sdk",
    "android.gradle.path": "C:\\Program Files\\Android\\Android Studio\\gradle"
}
```
**Note**: Adjust paths for your OS:
- **Windows**: `C:\Users\YourName\AppData\Local\Android\Sdk`
- **Mac**: `~/Library/Android/sdk`
- **Linux**: `~/Android/Sdk`

### **Step 2.3: Open Project in VS Code**
1. Download/extract your NAVIGI project folder
2. VS Code → File → Open Folder
3. Select your `navigi-app` folder
4. VS Code will open the entire project

---

## 🔥 3. Create Your Firebase Project {#firebase-setup}

### **Step 3.1: Create Firebase Account & Project**
1. Go to: https://console.firebase.google.com/
2. Sign in with your Google account
3. Click **"Create a project"**
4. **Project name**: Type `navigi-sbaro` (or your preferred name)
5. **Google Analytics**: Enable (optional but recommended)
6. Click **"Create project"**

### **Step 3.2: Add Android App to Firebase**
1. In Firebase Console, click **"Add app"** → **Android icon**
2. **Android package name**: `com.navigi.sbaro` ⚠️ **EXACTLY THIS**
3. **App nickname**: `NAVIGI`
4. **Debug signing certificate**: Leave empty for now
5. Click **"Register app"**

### **Step 3.3: Download Configuration File**
1. **Download** `google-services.json` file
2. **IMPORTANT**: Save this file, you'll need it next

### **Step 3.4: Enable Firebase Services**
1. **Authentication**:
   - Left sidebar → Authentication → Get started
   - Sign-in method → Email/Password → Enable → Save

2. **Firestore Database**:
   - Left sidebar → Firestore Database → Create database
   - **Security rules**: Start in production mode
   - **Location**: Choose closest to your users

3. **Cloud Messaging**:
   - Left sidebar → Cloud Messaging (already enabled by default)

4. **Storage**:
   - Left sidebar → Storage → Get started
   - **Security rules**: Start in production mode

### **Step 3.5: Get Service Account Key (For Backend)**
1. In Firebase Console → Project Settings (gear icon)
2. **Service accounts** tab
3. Click **"Generate new private key"**
4. **Download** the JSON file (save it safely)

---

## ⚙️ 4. Configure Project {#configure-project}

### **Step 4.1: Configure Android App**

#### **Place Firebase Config File:**
1. Take the `google-services.json` file you downloaded
2. Copy it to: `android-app/app/google-services.json`
3. **File structure should be**:
```
android-app/
├── app/
│   ├── google-services.json  ← HERE
│   ├── build.gradle.kts
│   └── src/
```

#### **Update AdMob IDs (Optional for now):**
**File**: `android-app/app/src/main/res/values/strings.xml`
```xml
<!-- You can use test IDs for now, replace later -->
<string name="admob_app_id">ca-app-pub-3940256099942544~3347511713</string>
<string name="admob_rewarded_ad_id">ca-app-pub-3940256099942544/5224354917</string>
<string name="admob_interstitial_ad_id">ca-app-pub-3940256099942544/1033173712</string>
```

### **Step 4.2: Configure Backend**

#### **Create Backend Environment File:**
1. Go to `backend/` folder
2. Copy `.env.example` to `.env`:
```bash
# In VS Code terminal:
cd backend
cp .env.example .env
```

#### **Update Backend .env File:**
**File**: `backend/.env`
```bash
# Basic Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Firebase Configuration (UPDATE THESE!)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_FROM_JSON_FILE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Admin Credentials
ADMIN_EMAIL=seiftouatllol@gmail.com
ADMIN_PASSWORD=seif0662

# AdMob (Test IDs for now)
ADMOB_APP_ID=ca-app-pub-3940256099942544~3347511713

# Other settings (keep as is)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
POINTS_TO_DOLLAR_RATIO=10
MIN_BINANCE_WITHDRAWAL=20
DAILY_CONTEST_ADS=10
WEEKLY_CONTEST_ADS=30
MONTHLY_CONTEST_ADS=100
```

#### **How to Fill Firebase Credentials:**
1. Open the service account JSON file you downloaded
2. Copy these values:
   - **project_id** → `FIREBASE_PROJECT_ID`
   - **private_key** → `FIREBASE_PRIVATE_KEY` 
   - **client_email** → `FIREBASE_CLIENT_EMAIL`

**Example**:
```bash
FIREBASE_PROJECT_ID=navigi-sbaro-12345
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@navigi-sbaro-12345.iam.gserviceaccount.com
```

### **Step 4.3: Configure Website**
**File**: `website/.env` (create this file)
```bash
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
```

---

## 🏃‍♂️ 5. Run Everything {#run-everything}

### **Step 5.1: Open VS Code Terminal**
1. In VS Code, press `Ctrl+`` (backtick) to open terminal
2. You'll need **3 terminals** (click + icon to create new ones)

### **Step 5.2: Start Backend (Terminal 1)**
```bash
cd backend
npm install
npm run dev
```
**Expected output**: 
```
🚀 NAVIGI Backend Server is running on http://localhost:3000
✅ Firebase Admin SDK initialized successfully
```

### **Step 5.3: Start Website (Terminal 2)**
```bash
cd website
npm install
npm start
```
**Expected output**:
```
Local:            http://localhost:3001
On Your Network:  http://192.168.1.100:3001
```

### **Step 5.4: Build Android App (Terminal 3)**
```bash
cd android-app
./gradlew clean
./gradlew assembleDebug
```
**Expected output**:
```
BUILD SUCCESSFUL in 2m 30s
```

---

## ✅ 6. Test & Verify {#test-verify}

### **Step 6.1: Test Website**
1. Open browser: http://localhost:3001
2. **Should see**: Beautiful NAVIGI homepage in English
3. **Click language**: Switch to Arabic (العربية)
4. **Check footer**: Find "Admin Panel" link

### **Step 6.2: Test Admin Dashboard**
1. Go to: http://localhost:3001/admin/login
2. **Login with**:
   - Email: `seiftouatllol@gmail.com`
   - Password: `seif0662`
3. **Should see**: Dashboard with statistics
4. **Test**: Try adding a new ad or survey

### **Step 6.3: Test Backend API**
1. Open browser: http://localhost:3000/health
2. **Should see**: `{"status":"OK","timestamp":"..."}`

### **Step 6.4: Verify Android Build**
1. Check if APK was created: `android-app/app/build/outputs/apk/debug/app-debug.apk`
2. **File should exist** and be ~20-50MB

---

## 🎯 Common Issues & Solutions

### **Issue 1: Firebase Connection Failed**
**Solution**:
- Check `google-services.json` is in correct location
- Verify package name is exactly `com.navigi.sbaro`
- Check Firebase credentials in backend `.env`

### **Issue 2: Android Build Failed**
**Solution**:
```bash
cd android-app
./gradlew clean
./gradlew build --refresh-dependencies
```

### **Issue 3: Website Won't Start**
**Solution**:
```bash
cd website
rm -rf node_modules package-lock.json
npm install
npm start
```

### **Issue 4: Backend Won't Start**
**Solution**:
```bash
cd backend  
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Issue 5: Permission Denied (Linux/Mac)**
**Solution**:
```bash
chmod +x gradlew
./gradlew assembleDebug
```

---

## 🔧 What Each Component Does

### **Backend (Port 3000)**
- **Purpose**: API server for mobile app and admin dashboard
- **Features**: User management, Firebase integration, admin tools
- **Test URL**: http://localhost:3000/health

### **Website (Port 3001)**  
- **Purpose**: Marketing website + admin dashboard
- **Features**: Arabic/English content, admin panel access
- **Test URL**: http://localhost:3001

### **Android App**
- **Purpose**: Mobile app for users to earn money
- **Features**: Ad watching, referrals, contests, withdrawals
- **Output**: APK file for installation

---

## 📱 Next Steps After Setup

### **1. Setup AdMob (For Real Ads)**
1. Go to: https://admob.google.com/
2. Create account and add your app
3. Get real Ad Unit IDs
4. Replace test IDs in code

### **2. Test on Real Device**
1. Enable Developer Options on Android phone
2. Connect via USB
3. Install APK: `adb install app-debug.apk`

### **3. Deploy to Production**
1. **Backend**: Deploy to Heroku, Railway, or DigitalOcean
2. **Website**: Deploy to Vercel, Netlify, or Firebase Hosting
3. **Android**: Publish to Google Play Store

---

## 🎉 Success Checklist

- [ ] ✅ VS Code opens project without errors
- [ ] ✅ Backend runs on http://localhost:3000
- [ ] ✅ Website runs on http://localhost:3001  
- [ ] ✅ Admin login works (seiftouatllol@gmail.com / seif0662)
- [ ] ✅ Can add new ads in admin dashboard
- [ ] ✅ Can add new surveys in admin dashboard
- [ ] ✅ Android app builds successfully (APK created)
- [ ] ✅ Firebase services are enabled
- [ ] ✅ No error messages in terminals

**🎯 When all checkboxes are ✅, your NAVIGI app is fully working!**

---

## 📞 Need Help?

If you get stuck:
1. **Check terminal outputs** for error messages
2. **Verify all files** are in correct locations
3. **Double-check Firebase configuration**
4. **Make sure all required software is installed**

**Your NAVIGI app will be earning money for users once everything is set up! 🚀**