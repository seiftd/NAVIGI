# 🚨 QUICK FIX - Backend Error

## ❌ **Your Error:**
```
Error: Cannot find module 'firebase-admin'
MODULE_NOT_FOUND
```

## ✅ **QUICK SOLUTION:**

### **1. Stop Backend (Press Ctrl+C in terminal)**

### **2. Delete and Reinstall Dependencies:**
```bash
# In VS Code terminal, go to backend folder:
cd backend

# Windows - Delete old files:
rmdir /s node_modules
del package-lock.json

# Install fresh dependencies:
npm install
```

### **3. Create .env File (If Missing):**
```bash
# Copy the example file:
copy .env.example .env
```

### **4. Edit .env File:**
Open `backend/.env` and add your Firebase credentials:
```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
ADMIN_EMAIL=seiftouatllol@gmail.com
ADMIN_PASSWORD=seif0662
```

### **5. Start Backend Again:**
```bash
npm run dev
```

### **✅ Success - Should Show:**
```
🚀 NAVIGI Backend Server is running on http://localhost:3000
✅ Firebase Admin SDK initialized successfully
```

---

## 📱 **ADMOB SETUP - Quick Steps:**

### **1. Create AdMob Account:**
- Go to: https://admob.google.com/
- Sign in with Google
- Click "Get started"

### **2. Add Your App:**
- Apps → Add app → Android
- App name: `NAVIGI`
- Package: `com.navigi.sbaro`

### **3. Create Ad Units:**
- Add ad unit → Rewarded (copy the ID)
- Add ad unit → Interstitial (copy the ID)

### **4. Update Your App:**
**File**: `android-app/app/src/main/res/values/strings.xml`
```xml
<string name="admob_app_id">YOUR_APP_ID_HERE</string>
<string name="admob_rewarded_ad_id">YOUR_REWARDED_ID_HERE</string>
<string name="admob_interstitial_ad_id">YOUR_INTERSTITIAL_ID_HERE</string>
```

**Use Test IDs First:**
```xml
<string name="admob_app_id">ca-app-pub-3940256099942544~3347511713</string>
<string name="admob_rewarded_ad_id">ca-app-pub-3940256099942544/5224354917</string>
<string name="admob_interstitial_ad_id">ca-app-pub-3940256099942544/1033173712</string>
```

---

## 🎯 **If Still Having Issues:**

1. **Check Node.js version**: `node --version` (should be 16+)
2. **Check if you have .env file** in backend folder
3. **Make sure you have Firebase project** created
4. **Follow the detailed guides** in other docs

**Your backend should work after these steps! 🚀**