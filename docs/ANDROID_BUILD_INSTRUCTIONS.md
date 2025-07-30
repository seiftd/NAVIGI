# 📱 ANDROID APP BUILD INSTRUCTIONS

## 🚀 **HOW TO BUILD NAVIGI ANDROID APP**

### **📋 Prerequisites:**

#### **1. Install Android Studio:**
- Download from: https://developer.android.com/studio
- Install with default settings
- **Important:** Install Android SDK and tools

#### **2. Install Java JDK 17:**
- Download from: https://adoptium.net/temurin/releases/
- Choose JDK 17 (LTS)
- Add to PATH environment variable

#### **3. Set Environment Variables:**
```cmd
# Add these to your Windows Environment Variables:
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot
ANDROID_HOME=C:\Users\[YOUR_USERNAME]\AppData\Local\Android\Sdk
```

---

## 🔧 **BUILD COMMANDS (Windows):**

### **📁 Navigate to Android Project:**
```powershell
cd C:\Users\Seif\Desktop\NAVIGI\android-app
```

### **🧹 Clean Project:**
```powershell
# Use gradlew.bat for Windows (not ./gradlew)
.\gradlew.bat clean
```

### **🔨 Build Debug APK:**
```powershell
.\gradlew.bat assembleDebug
```

### **🔨 Build Release APK:**
```powershell
.\gradlew.bat assembleRelease
```

### **📱 Install on Device/Emulator:**
```powershell
.\gradlew.bat installDebug
```

---

## 🏃‍♂️ **STEP-BY-STEP BUILD PROCESS:**

### **Step 1: Open Terminal in Android Project**
```powershell
cd C:\Users\Seif\Desktop\NAVIGI\android-app
```

### **Step 2: Check Gradle Wrapper**
```powershell
# This should show available tasks
.\gradlew.bat tasks
```

### **Step 3: Clean and Build**
```powershell
# Clean previous builds
.\gradlew.bat clean

# Build debug version
.\gradlew.bat assembleDebug
```

### **Step 4: Find Your APK**
```
📁 Location: android-app\app\build\outputs\apk\debug\
📱 File: app-debug.apk
```

---

## 🛠️ **TROUBLESHOOTING:**

### **❌ Error: "gradlew not recognized"**
**Solution:** Use `.\gradlew.bat` instead of `./gradlew`

### **❌ Error: "SDK not found"**
**Solution:** 
1. Open Android Studio
2. Go to: File → Settings → Appearance & Behavior → System Settings → Android SDK
3. Note the SDK path
4. Set ANDROID_HOME environment variable

### **❌ Error: "Java not found"**
**Solution:**
1. Install JDK 17
2. Set JAVA_HOME environment variable
3. Restart PowerShell

### **❌ Error: "Build failed"**
**Solution:**
```powershell
# Update Gradle Wrapper
.\gradlew.bat wrapper --gradle-version 8.0

# Sync project
.\gradlew.bat sync
```

---

## 📱 **BUILDING FOR RELEASE:**

### **1. Generate Keystore (First Time Only):**
```powershell
keytool -genkey -v -keystore navigi-release-key.keystore -alias navigi -keyalg RSA -keysize 2048 -validity 10000
```

### **2. Create keystore.properties:**
Create `android-app/keystore.properties`:
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=navigi
storeFile=navigi-release-key.keystore
```

### **3. Build Release APK:**
```powershell
.\gradlew.bat assembleRelease
```

### **4. Find Release APK:**
```
📁 Location: android-app\app\build\outputs\apk\release\
📱 File: app-release.apk
```

---

## 📦 **APK LOCATIONS:**

### **Debug APK:**
```
android-app\app\build\outputs\apk\debug\app-debug.apk
```

### **Release APK:**
```
android-app\app\build\outputs\apk\release\app-release.apk
```

---

## 🚀 **QUICK BUILD COMMANDS:**

### **For Testing (Debug):**
```powershell
cd android-app
.\gradlew.bat clean assembleDebug
```

### **For Release (Production):**
```powershell
cd android-app
.\gradlew.bat clean assembleRelease
```

---

## 📱 **INSTALL ON DEVICE:**

### **1. Enable Developer Options:**
- Go to Settings → About Phone
- Tap "Build Number" 7 times
- Enable "USB Debugging"

### **2. Connect Device and Install:**
```powershell
# Install debug version
.\gradlew.bat installDebug

# Or use ADB directly
adb install app\build\outputs\apk\debug\app-debug.apk
```

---

## 🎯 **EXPECTED OUTPUT:**

### **✅ Successful Build:**
```
BUILD SUCCESSFUL in 2m 15s
45 actionable tasks: 45 executed

✅ APK Location: android-app\app\build\outputs\apk\debug\app-debug.apk
📱 Size: ~25-30 MB
🚀 Ready to install!
```

---

## 🔧 **ANDROID STUDIO METHOD:**

### **Alternative: Build with Android Studio**
1. **Open Android Studio**
2. **Open Project:** `C:\Users\Seif\Desktop\NAVIGI\android-app`
3. **Wait for Gradle Sync**
4. **Build Menu → Build Bundle(s)/APK(s) → Build APK(s)**
5. **Find APK in:** `app\build\outputs\apk\debug\`

---

## 🎉 **SUCCESS! YOU'LL HAVE:**

- [x] ✅ **APK file ready to install**
- [x] ✅ **All features included (ads, referrals, contests)**
- [x] ✅ **Arabic/English support**
- [x] ✅ **AdMob integration with your IDs**
- [x] ✅ **Firebase ready for your project**

### **📱 Install APK:**
1. Transfer APK to your Android device
2. Enable "Unknown Sources" in settings
3. Tap APK to install
4. Open NAVIGI app and start earning! 💰

**🚀 Your Android app is ready to make money! 🎯**