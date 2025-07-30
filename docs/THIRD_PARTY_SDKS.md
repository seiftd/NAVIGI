# 🔌 Third-Party SDKs Integration Guide

This guide explains how to integrate Tapjoy and Pollfish SDKs for additional earning methods in the NAVIGI app.

## 🚨 **Current Status**

**⚠️ Tapjoy and Pollfish SDKs are temporarily commented out** to prevent build failures. They require specific repositories and setup.

---

## 🎮 **Tapjoy SDK (Game Offers)**

### **What it provides:**
- Game offers and installations
- Video ads
- Offerwall functionality
- User engagement tracking

### **Integration Steps:**

#### **1️⃣ Add Tapjoy Repository:**
In `android-app/build.gradle.kts` (project level), verify this repository exists:
```kotlin
allprojects {
    repositories {
        google()
        mavenCentral()
        
        // Tapjoy Repository
        maven {
            url = uri("https://tapjoy.bintray.com/maven")
        }
        
        // Alternative Tapjoy Repository
        maven {
            url = uri("https://sdk.tapjoy.com/")
        }
    }
}
```

#### **2️⃣ Add Dependency:**
In `android-app/app/build.gradle.kts`, uncomment:
```kotlin
implementation("com.tapjoy:tapjoy-android-sdk:13.1.0")
```

#### **3️⃣ Get Tapjoy App Key:**
1. Register at: https://ltv.tapjoy.com/
2. Create a new app
3. Get your **App Key** and **SDK Key**
4. Add to `backend/.env`:
```env
TAPJOY_APP_KEY=your_tapjoy_app_key_here
TAPJOY_SDK_KEY=your_tapjoy_sdk_key_here
```

#### **4️⃣ Initialize in Android:**
Add to `SbaroApplication.kt`:
```kotlin
import com.tapjoy.Tapjoy

class SbaroApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize Tapjoy
        Tapjoy.connect(this, "YOUR_TAPJOY_APP_KEY")
    }
}
```

---

## 📊 **Pollfish SDK (Surveys)**

### **What it provides:**
- Survey monetization
- User demographic data
- Reward-based surveys
- High-quality survey experience

### **Integration Steps:**

#### **1️⃣ Add Pollfish Repository:**
In `android-app/build.gradle.kts` (project level), verify:
```kotlin
allprojects {
    repositories {
        google()
        mavenCentral()
        
        // Pollfish Repository
        maven {
            url = uri("https://pollfish.jfrog.io/artifactory/pollfish-android")
        }
    }
}
```

#### **2️⃣ Add Dependency:**
In `android-app/app/build.gradle.kts`, uncomment:
```kotlin
implementation("com.pollfish:pollfish-android:6.3.0")
```

#### **3️⃣ Get Pollfish API Key:**
1. Register at: https://www.pollfish.com/
2. Create a new app  
3. Get your **API Key**
4. Add to `backend/.env`:
```env
POLLFISH_API_KEY=your_pollfish_api_key_here
```

#### **4️⃣ Initialize in Android:**
Add to `SbaroApplication.kt`:
```kotlin
import com.pollfish.Pollfish
import com.pollfish.builder.Params

class SbaroApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize Pollfish
        val params = Params.Builder("YOUR_POLLFISH_API_KEY")
            .releaseMode(false) // Set to true for production
            .build()
        
        Pollfish.initWith(this, params)
    }
}
```

---

## 🔧 **Alternative: Build Without SDKs**

If you want to build the app **without** these SDKs initially:

### **✅ Current Setup (Recommended for testing):**
- Tapjoy and Pollfish dependencies are **commented out**
- App builds successfully
- Core functionality works (AdMob, Firebase, etc.)
- You can add these SDKs later when needed

### **🚀 To Enable Later:**
1. Get API keys from Tapjoy and Pollfish
2. Uncomment the dependencies in `build.gradle.kts`
3. Add initialization code to `SbaroApplication.kt`
4. Implement the earning methods in the app

---

## 📋 **Available SDK Versions**

### **Tapjoy Versions to Try:**
```kotlin
// Latest (might require specific repository)
implementation("com.tapjoy:tapjoy-android-sdk:13.1.2")

// Stable alternatives
implementation("com.tapjoy:tapjoy-android-sdk:13.1.0")
implementation("com.tapjoy:tapjoy-android-sdk:12.11.1")
implementation("com.tapjoy:tapjoy-android-sdk:12.10.0")
```

### **Pollfish Versions to Try:**
```kotlin
// Latest (might require specific repository)
implementation("com.pollfish:pollfish-android:6.4.1")

// Stable alternatives  
implementation("com.pollfish:pollfish-android:6.3.0")
implementation("com.pollfish:pollfish-android:6.2.5")
implementation("com.pollfish:pollfish-android:6.1.4")
```

---

## 🛠️ **Troubleshooting**

### **Issue: "Could not find com.tapjoy:tapjoy-android-sdk"**
**Solutions:**
1. Add the Tapjoy repository (see above)
2. Try an older version
3. Use direct AAR files
4. Check if Tapjoy has moved repositories

### **Issue: "Could not find com.pollfish:pollfish-android"**
**Solutions:**
1. Add the Pollfish repository (see above)
2. Try an older version
3. Use direct AAR files
4. Contact Pollfish support for current repository

### **Issue: Build still fails**
**Temporary Solution:**
```kotlin
// Keep these commented out until you get API keys
// implementation("com.tapjoy:tapjoy-android-sdk:13.1.0")
// implementation("com.pollfish:pollfish-android:6.3.0")
```

---

## 💰 **Revenue Integration**

### **Backend API Endpoints:**
- `POST /api/surveys/complete` - Record survey completion
- `POST /api/games/install` - Record game installation  
- `GET /api/offers/available` - Get available offers
- `POST /api/offers/claim` - Claim offer rewards

### **Points Calculation:**
- **Surveys:** 5-50 points based on length
- **Game Installs:** 10-100 points based on game
- **Video Completion:** 2-10 points per video
- **Offer Completion:** Variable based on offer type

---

## 🎯 **Current Status Summary**

**✅ Working Now:**
- Core app functionality
- AdMob integration (your real IDs)
- Firebase backend
- User authentication  
- Point system
- Withdrawal methods

**⏳ Available Later (when you add SDKs):**
- Tapjoy game offers
- Pollfish surveys
- Additional earning methods

**🚀 Recommendation:**
Build and test the core app first, then add these SDKs when you're ready to expand earning methods.

---

## 📞 **SDK Support:**

**Tapjoy:**
- Documentation: https://dev.tapjoy.com/
- Support: https://support.tapjoy.com/

**Pollfish:**
- Documentation: https://www.pollfish.com/docs/
- Support: https://help.pollfish.com/