# 🤖 Android SDK Setup Guide

This guide will help you fix the **"SDK location not found"** error when building the NAVIGI Android app.

## 🚨 **ERROR YOU'RE SEEING:**
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable or by setting the sdk.dir path in your project's local properties file at 'C:\Users\Seif\Desktop\NAVIGI\android-app\local.properties'.
```

---

## 🔧 **SOLUTION: Configure Android SDK Location**

### **Step 1: Find Your Android SDK Path**

#### **🪟 Windows Users:**

**Method A: Check Android Studio (Easiest)**
1. Open **Android Studio**
2. Go to **File** → **Settings**
3. Navigate to **Appearance & Behavior** → **System Settings** → **Android SDK**
4. Copy the **"Android SDK Location"** path
5. It should look like: `C:\Users\YourUsername\AppData\Local\Android\Sdk`

**Method B: Check Common Locations**
- **Most Common:** `C:\Users\%USERNAME%\AppData\Local\Android\Sdk`
- **Alternative:** `C:\Android\Sdk`
- **Command Line Tools:** `C:\android-sdk`

**Method C: Check Environment Variable**
```cmd
echo %ANDROID_HOME%
```

#### **🐧 Linux Users:**
- **Default:** `/home/yourusername/Android/Sdk`
- **Check:** `echo $ANDROID_HOME`

#### **🍎 Mac Users:**
- **Default:** `/Users/yourusername/Library/Android/sdk`
- **Check:** `echo $ANDROID_HOME`

---

### **Step 2: Create local.properties File**

#### **📁 Location:** `android-app/local.properties`

**For Windows (User "Seif"):**
```properties
sdk.dir=C\:\\Users\\Seif\\AppData\\Local\\Android\\Sdk
```

**For Linux:**
```properties
sdk.dir=/home/seif/Android/Sdk
```

**For Mac:**
```properties
sdk.dir=/Users/seif/Library/Android/sdk
```

---

## 🚀 **QUICK FIX FOR SEIF:**

### **1️⃣ Create the file:**
```bash
cd C:\Users\Seif\Desktop\NAVIGI\android-app
notepad local.properties
```

### **2️⃣ Add this content:**
```properties
# Android SDK Location for Seif's machine
sdk.dir=C\:\\Users\\Seif\\AppData\\Local\\Android\\Sdk
```

### **3️⃣ Save and close**

### **4️⃣ Verify the path exists:**
```cmd
dir "C:\Users\Seif\AppData\Local\Android\Sdk"
```

If the directory doesn't exist, try these alternatives:
- `C:\Android\Sdk`
- `C:\android-sdk`
- Check where you installed Android Studio

---

## 📋 **ALTERNATIVE: Set Environment Variable**

### **Windows:**
1. Press **Win + R**, type `sysdm.cpl`
2. Click **Environment Variables**
3. Add **New System Variable:**
   - **Name:** `ANDROID_HOME`
   - **Value:** `C:\Users\Seif\AppData\Local\Android\Sdk`
4. Restart command prompt

### **Linux/Mac:**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=/path/to/your/android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

---

## 🛠️ **If You Don't Have Android SDK:**

### **Install Android Studio (Recommended):**
1. Download from: https://developer.android.com/studio
2. Install with default settings
3. SDK will be installed automatically
4. Note the installation path

### **Install SDK Command Line Tools Only:**
1. Download from: https://developer.android.com/studio#command-tools
2. Extract to `C:\android-sdk`
3. Use path: `C\:\\android-sdk`

---

## ✅ **Test Your Setup:**

After creating `local.properties`, test the build:

```bash
cd android-app
.\gradlew.bat assembleDebug
```

---

## 🎯 **Common Issues & Solutions:**

### **Issue 1: "Path contains spaces"**
**Solution:** Use double backslashes and proper escaping:
```properties
sdk.dir=C\:\\Program Files\\Android\\Sdk
```

### **Issue 2: "Permission denied"**
**Solution:** Run command prompt as Administrator

### **Issue 3: "SDK not found"**
**Solution:** Verify the path exists and contains these folders:
- `build-tools/`
- `platforms/`
- `platform-tools/`

---

## 📝 **File Template:**

Copy the `local.properties.example` file and rename it to `local.properties`, then uncomment and update the appropriate `sdk.dir` line for your system.

---

## 🎉 **After Success:**

Once configured correctly, you should see:
```
BUILD SUCCESSFUL in Xs
```

Your APK will be generated at:
`android-app/app/build/outputs/apk/debug/app-debug.apk`