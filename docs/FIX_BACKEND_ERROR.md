# 🔧 Fix Backend Error & Complete Setup

## 🚨 Error You're Seeing:
```
Error: Cannot find module 'firebase-admin'
MODULE_NOT_FOUND
[nodemon] app crashed - waiting for file changes before starting...
```

## ✅ **SOLUTION - Follow These Steps:**

### **Step 1: Stop the Backend**
- In VS Code terminal where backend is running, press `Ctrl+C` to stop it

### **Step 2: Delete node_modules and Reinstall**
```bash
# In VS Code terminal:
cd backend

# Delete old modules (Windows)
rmdir /s node_modules
del package-lock.json

# OR on Mac/Linux:
# rm -rf node_modules package-lock.json

# Reinstall everything
npm install
```

### **Step 3: Verify Dependencies Installed**
```bash
# Check if firebase-admin is installed:
npm list firebase-admin

# Should show: firebase-admin@12.0.0
```

### **Step 4: Check Your .env File**
Make sure `backend/.env` exists and has your Firebase credentials:

**File**: `backend/.env`
```bash
# Basic Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# Firebase Configuration (UPDATE WITH YOUR DETAILS!)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Admin Credentials
ADMIN_EMAIL=seiftouatllol@gmail.com
ADMIN_PASSWORD=seif0662

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Other Settings
POINTS_TO_DOLLAR_RATIO=10
MIN_BINANCE_WITHDRAWAL=20
DAILY_CONTEST_ADS=10
WEEKLY_CONTEST_ADS=30
MONTHLY_CONTEST_ADS=100
```

### **Step 5: Create .env File (If Missing)**
```bash
# In backend folder:
cd backend

# Copy example file:
cp .env.example .env

# Edit the .env file with your Firebase credentials
```

### **Step 6: Start Backend Again**
```bash
npm run dev
```

### **✅ Success - You Should See:**
```
🚀 NAVIGI Backend Server is running on http://localhost:3000
✅ Firebase Admin SDK initialized successfully
✅ Server initialization complete
```

---

## 🎯 If Still Not Working:

### **Check Node.js Version:**
```bash
node --version
# Should be v16.0.0 or higher
```

### **Clear npm Cache:**
```bash
npm cache clean --force
npm install
```

### **Reinstall Node.js (If Needed):**
- Go to https://nodejs.org/
- Download and install latest LTS version
- Restart VS Code

---

## 🔥 Firebase Setup (If Not Done Yet):

### **1. Create Firebase Project:**
- Go to https://console.firebase.google.com/
- Create project named `navigi-sbaro`
- Add Android app with package `com.navigi.sbaro`

### **2. Download Files:**
- Download `google-services.json` (for Android)
- Download service account JSON (for backend)

### **3. Place Files:**
- `google-services.json` → `android-app/app/google-services.json`
- Update `backend/.env` with service account credentials

### **4. Enable Services:**
- Authentication (Email/Password)
- Firestore Database
- Cloud Storage
- Cloud Messaging

---

## 📱 Complete AdMob Setup Guide

### **Step 1: Create AdMob Account**
1. Go to https://admob.google.com/
2. Sign in with Google account
3. Click **"Get started"**

### **Step 2: Create App in AdMob**
1. Click **"Apps"** → **"Add app"**
2. Select **"Android"**
3. **App name**: `NAVIGI`
4. **Package name**: `com.navigi.sbaro` (EXACTLY THIS!)
5. Click **"Add app"**

### **Step 3: Create Ad Units**

#### **Create Rewarded Video Ad:**
1. Click **"Ad units"** → **"Add ad unit"**
2. Select **"Rewarded"**
3. **Ad unit name**: `NAVIGI Rewarded Video`
4. Click **"Create ad unit"**
5. **Copy the Ad Unit ID**: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`

#### **Create Interstitial Ad:**
1. Click **"Add ad unit"** → **"Interstitial"**
2. **Ad unit name**: `NAVIGI Interstitial`
3. Click **"Create ad unit"**
4. **Copy the Ad Unit ID**: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`

### **Step 4: Get App ID**
1. Go to **"App settings"** in AdMob
2. **Copy App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### **Step 5: Update Android App with AdMob IDs**

#### **File 1**: `android-app/app/src/main/res/values/strings.xml`
```xml
<!-- REPLACE WITH YOUR REAL AdMob IDs -->
<string name="admob_app_id">ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
<string name="admob_rewarded_ad_id">ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX</string>
<string name="admob_interstitial_ad_id">ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX</string>
```

#### **File 2**: `android-app/app/build.gradle.kts`
```kotlin
// In defaultConfig section, UPDATE:
buildConfigField("String", "ADMOB_APP_ID", "\"ca-app-pub-YOUR-APP-ID~XXXXXXXXXX\"")
buildConfigField("String", "ADMOB_REWARDED_AD_ID", "\"ca-app-pub-YOUR-REWARDED-ID/XXXXXXXXXX\"")
buildConfigField("String", "ADMOB_INTERSTITIAL_AD_ID", "\"ca-app-pub-YOUR-INTERSTITIAL-ID/XXXXXXXXXX\"")
```

### **Step 6: Update Backend with AdMob**

#### **File**: `backend/.env`
```bash
# Add your AdMob App ID:
ADMOB_APP_ID=ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX
```

### **Step 7: Test AdMob Integration**

#### **Build Android App:**
```bash
cd android-app
./gradlew clean
./gradlew assembleDebug
```

#### **Install and Test:**
- Install APK on device/emulator
- Check if ads load (may take 24-48 hours for real ads)
- Test with AdMob test IDs first

---

## 🧪 AdMob Test IDs (Use These First):

For testing, use these official Google test IDs:

```xml
<!-- TEST IDs - Replace with real ones later -->
<string name="admob_app_id">ca-app-pub-3940256099942544~3347511713</string>
<string name="admob_rewarded_ad_id">ca-app-pub-3940256099942544/5224354917</string>
<string name="admob_interstitial_ad_id">ca-app-pub-3940256099942544/1033173712</string>
```

---

## 📋 Complete Setup Checklist:

- [ ] ✅ Backend runs without errors (`npm run dev`)
- [ ] ✅ Website runs (`npm start` in website folder)
- [ ] ✅ Firebase project created and configured
- [ ] ✅ `google-services.json` in `android-app/app/`
- [ ] ✅ Backend `.env` has Firebase credentials
- [ ] ✅ AdMob account created
- [ ] ✅ AdMob IDs updated in Android app
- [ ] ✅ Android app builds successfully
- [ ] ✅ All three components working together

---

## 🎉 **Final Test:**

### **1. Backend Working:**
```bash
# Visit: http://localhost:3000/health
# Should show: {"status":"OK","timestamp":"..."}
```

### **2. Website Working:**
```bash
# Visit: http://localhost:3001
# Should show: Beautiful NAVIGI homepage
```

### **3. Admin Dashboard:**
```bash
# Visit: http://localhost:3001/admin/login
# Login: seiftouatllol@gmail.com / seif0662
```

### **4. Android App:**
```bash
# APK created: android-app/app/build/outputs/apk/debug/app-debug.apk
```

**🚀 When all these work, your NAVIGI app is fully ready!**

---

## 🆘 Need More Help?

### **Common Issues:**

1. **"Firebase not initialized"** → Check `.env` file credentials
2. **"Package name mismatch"** → Use exactly `com.navigi.sbaro`
3. **"AdMob ads not showing"** → Use test IDs first, wait 24-48 hours for real ads
4. **"Module not found"** → Delete `node_modules`, run `npm install`

**Your NAVIGI app will be earning money for users once this setup is complete! 💰**