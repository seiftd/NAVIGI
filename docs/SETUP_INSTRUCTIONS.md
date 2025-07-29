# 🚀 NAVIGI Setup Instructions

## 📱 Part 1: Export & Setup in VS Code

### Step 1: Download the Project
```bash
# Clone or download the project
git clone <your-repository-url>
cd navigi-app
```

### Step 2: Open in VS Code
1. Open VS Code
2. File → Open Folder → Select `navigi-app` folder
3. Install recommended extensions:
   - Android iOS Emulator
   - Flutter (if using Flutter)
   - ES7+ React/Redux/React-Native snippets

### Step 3: Setup Android Development
1. **Install Android Studio** from https://developer.android.com/studio
2. **Setup Android SDK**:
   - Open Android Studio
   - Go to Tools → SDK Manager
   - Install Android SDK (API 24 or higher)
   - Install Android SDK Build-Tools
   - Install Android Emulator

3. **Setup Environment Variables**:
   ```bash
   # Add to your ~/.bashrc or ~/.zshrc
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## 🔑 Part 2: AdMob Configuration

### Step 1: Create AdMob Account
1. Go to https://admob.google.com/
2. Sign in with Google account
3. Create new app or add existing app

### Step 2: Get AdMob IDs
1. In AdMob console, go to **Apps**
2. Click your app
3. Copy **App ID** (looks like: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
4. Create ad units:
   - **Rewarded Ad** (for earning points)
   - **Interstitial Ad** (for bonus points)
5. Copy each **Ad Unit ID**

### Step 3: Configure AdMob in Android App
1. **Update strings.xml**:
   ```xml
   <!-- android-app/app/src/main/res/values/strings.xml -->
   <string name="admob_app_id">ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>
   <string name="admob_rewarded_ad_id">ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX</string>
   <string name="admob_interstitial_ad_id">ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX</string>
   ```

2. **Update AndroidManifest.xml**:
   ```xml
   <!-- android-app/app/src/main/AndroidManifest.xml -->
   <meta-data
       android:name="com.google.android.gms.ads.APPLICATION_ID"
       android:value="@string/admob_app_id" />
   ```

3. **Update BuildConfig**:
   ```kotlin
   // android-app/app/build.gradle.kts
   buildConfigField("String", "ADMOB_APP_ID", "\"ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX\"")
   buildConfigField("String", "ADMOB_REWARDED_AD_ID", "\"ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX\"")
   ```

## 🔥 Part 3: Firebase Setup

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name: "navigi-sbaro"
4. Enable Google Analytics (optional)

### Step 2: Add Android App
1. Click "Add app" → Android
2. Enter package name: `com.navigi.sbaro`
3. Download `google-services.json`
4. Place it in `android-app/app/` folder

### Step 3: Enable Firebase Services
1. **Authentication**: Enable Email/Password and Google Sign-in
2. **Firestore**: Create database in production mode
3. **Cloud Messaging**: Enable FCM
4. **Storage**: Enable for file uploads

### Step 4: Update Backend Configuration
```bash
# backend/.env (copy from .env.example)
FIREBASE_PROJECT_ID=navigi-sbaro
# Add other Firebase credentials from service account
```

## 🏃‍♂️ Part 4: Running the Application

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Firebase credentials
npm run dev
```

### Android App Setup
```bash
cd android-app
# Open in Android Studio or VS Code with Android extension
# Build and run on emulator or device
```

## 📱 Part 5: Testing the App

### Create Android Emulator
1. Open Android Studio
2. AVD Manager → Create Virtual Device
3. Choose Pixel 4 (API 30+)
4. Start emulator

### Run App
1. Connect device or start emulator
2. In VS Code: Ctrl+Shift+P → "Flutter: Launch Emulator" (if using Flutter)
3. Or use Android Studio: Run → Run 'app'

## 🔧 Part 6: Troubleshooting

### Common Issues:
1. **Build Errors**: Clean project and rebuild
2. **Firebase Errors**: Check google-services.json placement
3. **AdMob Errors**: Verify App ID and Ad Unit IDs
4. **Permission Errors**: Check AndroidManifest.xml permissions

### Debug Mode:
- Use test AdMob IDs during development
- Enable debug mode in Firebase
- Check Android Studio Logcat for errors

## 📋 Part 7: Production Checklist

Before releasing:
- [ ] Replace test AdMob IDs with production IDs
- [ ] Enable ProGuard/R8 code obfuscation
- [ ] Test on multiple devices
- [ ] Configure Firebase Security Rules
- [ ] Set up Google Play Console
- [ ] Generate signed APK/AAB

## 🆘 Getting Help

If you encounter issues:
1. Check Android Studio Logcat
2. Review Firebase console logs
3. Verify all configuration files
4. Test on different devices/emulators

---

**Next Step**: Follow the Website & Admin Dashboard setup guide!