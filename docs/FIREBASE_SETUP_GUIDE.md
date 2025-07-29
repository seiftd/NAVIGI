# 🔥 Firebase Setup Guide - Change to Your Own Firebase

## 📋 Overview
This guide will help you create your own Firebase project and connect it to your NAVIGI app.

---

## 🚀 Step 1: Create Firebase Account & Project

### **1.1 Go to Firebase Console**
- Open browser and go to: **https://console.firebase.google.com/**
- Sign in with your Google account (create one if you don't have it)

### **1.2 Create New Project**
1. Click the **"Create a project"** button (big blue button)
2. **Project name**: Type `navigi-sbaro` (or any name you prefer)
3. Click **"Continue"**
4. **Google Analytics**: 
   - Toggle **ON** (recommended) or leave **OFF** if you prefer
   - Click **"Continue"**
5. If Analytics is ON:
   - **Analytics account**: Select "Default Account for Firebase" 
   - Click **"Create project"**
6. **Wait** for project creation (30-60 seconds)
7. Click **"Continue"** when done

**✅ You should see**: Firebase project dashboard with menu on left side

---

## 📱 Step 2: Add Android App to Firebase

### **2.1 Add Android App**
1. In Firebase dashboard, click **"Add app"** button
2. Click the **Android icon** (robot icon)

### **2.2 Register App**
1. **Android package name**: Type `com.navigi.sbaro` 
   - ⚠️ **MUST BE EXACTLY**: `com.navigi.sbaro` (don't change this!)
2. **App nickname**: Type `NAVIGI` or `NAVIGI SBARO`
3. **Debug signing certificate SHA-1**: Leave empty for now
4. Click **"Register app"**

### **2.3 Download Config File**
1. **Download** the `google-services.json` file
2. **IMPORTANT**: Save this file to your computer (Desktop or Downloads)
3. Click **"Next"** (ignore the installation steps for now)
4. Click **"Next"** again
5. Click **"Continue to console"**

**✅ You should see**: Android app added to your project

---

## ⚙️ Step 3: Enable Firebase Services

### **3.1 Enable Authentication**
1. **Left sidebar** → Click **"Authentication"**
2. Click **"Get started"** button
3. **Sign-in method** tab → Click **"Email/Password"**
4. **Enable** the toggle switch
5. Click **"Save"**

**✅ You should see**: "Email/Password" shows as "Enabled"

### **3.2 Enable Firestore Database**
1. **Left sidebar** → Click **"Firestore Database"**
2. Click **"Create database"** button
3. **Security rules**: Select **"Start in production mode"**
4. Click **"Next"**
5. **Location**: Choose closest to your location:
   - **US**: `us-central1 (Iowa)` or `us-east1 (South Carolina)`
   - **Europe**: `europe-west1 (Belgium)`
   - **Asia**: `asia-southeast1 (Singapore)`
6. Click **"Done"**

**✅ You should see**: Database created with "Data" and "Rules" tabs

### **3.3 Enable Cloud Storage**
1. **Left sidebar** → Click **"Storage"**
2. Click **"Get started"** button
3. **Security rules**: Click **"Next"** (keep default)
4. **Location**: Same as Firestore location
5. Click **"Done"**

**✅ You should see**: Storage bucket created

### **3.4 Cloud Messaging (Automatically Enabled)**
- **Left sidebar** → Click **"Cloud Messaging"**
- Should already be enabled (no action needed)

---

## 🔑 Step 4: Get Service Account Key (For Backend)

### **4.1 Go to Project Settings**
1. Click **"Settings gear icon"** (top left, next to "Project Overview")
2. Click **"Project settings"**

### **4.2 Generate Service Account**
1. Click **"Service accounts"** tab
2. Click **"Generate new private key"** button
3. **Popup warning**: Click **"Generate key"**
4. **JSON file downloads automatically** - save it safely!

**✅ You should have**: Two files downloaded:
- `google-services.json` (for Android app)
- Service account JSON file (for backend)

---

## 📁 Step 5: Configure Your Project Files

### **5.1 Configure Android App**

#### **Place google-services.json File:**
1. Take the `google-services.json` file you downloaded
2. **Copy it to**: `android-app/app/google-services.json`

**File location should be**:
```
your-project/
└── android-app/
    └── app/
        ├── google-services.json  ← PUT IT HERE
        ├── build.gradle.kts
        └── src/
```

### **5.2 Configure Backend**

#### **Create .env File:**
1. Go to `backend/` folder in your project
2. **Copy** `.env.example` and rename to `.env`
3. **Open** `.env` file in VS Code

#### **Fill Firebase Credentials:**
1. **Open** the service account JSON file you downloaded
2. **Copy these values** from JSON to .env file:

**From JSON file** → **To .env file**:
- `project_id` → `FIREBASE_PROJECT_ID`
- `private_key` → `FIREBASE_PRIVATE_KEY`
- `client_email` → `FIREBASE_CLIENT_EMAIL`

**Example .env file**:
```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=navigi-sbaro-12345
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...(very long key)...-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@navigi-sbaro-12345.iam.gserviceaccount.com

# Admin Credentials (keep these)
ADMIN_EMAIL=seiftouatllol@gmail.com
ADMIN_PASSWORD=seif0662

# Other settings (keep as is)
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
```

**⚠️ Important Notes**:
- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Don't remove the `\n` characters in the private key
- Don't share this file with anyone

---

## ✅ Step 6: Test Firebase Connection

### **6.1 Run Backend to Test**
```bash
# In VS Code terminal:
cd backend
npm install
npm run dev
```

**✅ Success**: You should see:
```
🚀 NAVIGI Backend Server is running on http://localhost:3000
✅ Firebase Admin SDK initialized successfully
```

**❌ Error**: If you see Firebase errors, check:
- `.env` file has correct credentials
- `google-services.json` is in correct location
- Firebase services are enabled

### **6.2 Test Android Build**
```bash
# In VS Code terminal:
cd android-app
./gradlew assembleDebug
```

**✅ Success**: You should see:
```
BUILD SUCCESSFUL in 2m 30s
```

---

## 🔧 Firebase Console - What Each Section Does

### **Authentication**
- **Purpose**: User login/registration for your app
- **Used for**: User accounts, email/password login
- **You'll see**: List of users who register in your app

### **Firestore Database**
- **Purpose**: Store app data (users, points, referrals, etc.)
- **Used for**: All app data storage
- **You'll see**: Collections like "users", "withdrawals", "contests"

### **Cloud Messaging**
- **Purpose**: Send notifications to app users
- **Used for**: Contest winners, withdrawal updates, etc.
- **You'll see**: Notification logs and targeting options

### **Storage**
- **Purpose**: Store files (user photos, documents, etc.)
- **Used for**: Profile pictures, withdrawal documents
- **You'll see**: Uploaded files in folders

### **Analytics (Optional)**
- **Purpose**: Track app usage and user behavior
- **Used for**: See how many people use your app
- **You'll see**: User statistics, popular features

---

## 🚨 Important Security Notes

### **Keep These Files Safe:**
- **Service account JSON**: Contains admin access to your Firebase
- **`.env` file**: Contains all your secret keys
- **Never share** these files publicly or upload to GitHub

### **Firebase Security Rules:**
- **Production mode**: Only your backend can read/write data
- **Test mode**: Anyone can access (never use in production)
- **Current setup**: Production mode (secure)

---

## 🎯 Troubleshooting

### **Error: "Default Firebase app not initialized"**
**Solution**: Check `google-services.json` location
```bash
# Should be here:
android-app/app/google-services.json
```

### **Error: "Firebase Admin SDK not initialized"**
**Solution**: Check backend `.env` file credentials

### **Error: "Package name doesn't match"**
**Solution**: Use exactly `com.navigi.sbaro` in Firebase console

### **Error: "Permission denied"**
**Solution**: Check Firebase services are enabled

---

## 🎉 Success! Your Firebase is Ready

When everything works, you'll have:
- ✅ **Your own Firebase project** (not shared with anyone)
- ✅ **Android app connected** to your Firebase
- ✅ **Backend connected** to your Firebase  
- ✅ **All services enabled** (Auth, Firestore, Storage, Messaging)
- ✅ **Secure configuration** with your own credentials

**Next**: Follow the main setup guide to run everything!

**🔥 Your NAVIGI app now uses YOUR Firebase project! 🚀**