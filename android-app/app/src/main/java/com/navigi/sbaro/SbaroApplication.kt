package com.navigi.sbaro

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.google.android.gms.ads.MobileAds
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck
// import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory
import com.google.firebase.messaging.FirebaseMessaging
// import com.pollfish.Pollfish
// import com.pollfish.builder.Position
// import com.tapjoy.Tapjoy
import dagger.hilt.android.HiltAndroidApp
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.util.Hashtable

@HiltAndroidApp
class SbaroApplication : Application() {

    private val applicationScope = CoroutineScope(Dispatchers.Main)

    override fun onCreate() {
        super.onCreate()
        
        // Initialize Firebase
        initializeFirebase()
        
        // Initialize AdMob
        initializeAdMob()
        
        // Initialize third-party SDKs
        initializeThirdPartySDKs()
        
        // Create notification channels
        createNotificationChannels()
        
        // Setup Firebase Cloud Messaging
        setupFirebaseMessaging()
    }

    private fun initializeFirebase() {
        FirebaseApp.initializeApp(this)
        
        // Initialize Firebase App Check for security (temporarily disabled)
        // val firebaseAppCheck = FirebaseAppCheck.getInstance()
        // firebaseAppCheck.installAppCheckProviderFactory(
        //     PlayIntegrityAppCheckProviderFactory.getInstance()
        // )
    }

    private fun initializeAdMob() {
        applicationScope.launch {
            try {
                MobileAds.initialize(this@SbaroApplication) { initializationStatus ->
                    // AdMob initialization complete
                    val statusMap = initializationStatus.adapterStatusMap
                    for (adapterClass in statusMap.keys) {
                        val status = statusMap[adapterClass]
                        android.util.Log.d("AdMob", 
                            "Adapter name: $adapterClass, " +
                            "Description: ${status?.description}, " +
                            "Latency: ${status?.latency}")
                    }
                }
            } catch (e: Exception) {
                android.util.Log.e("AdMob", "Failed to initialize AdMob", e)
            }
        }
    }

    private fun initializeThirdPartySDKs() {
        // Third-party SDKs temporarily disabled until dependencies are added
        /*
        try {
            // Initialize Tapjoy
            val tapjoyConfig = Hashtable<String, Any>()
            tapjoyConfig[Tapjoy.TJC_OPTION_ENABLE_LOGGING] = true
            Tapjoy.connect(this, "YOUR_TAPJOY_APP_KEY", tapjoyConfig) { connected ->
                if (connected) {
                    android.util.Log.d("Tapjoy", "Tapjoy connected successfully")
                } else {
                    android.util.Log.e("Tapjoy", "Tapjoy connection failed")
                }
            }
            
            // Initialize Pollfish
            Pollfish.initWith(this) {
                apiKey("YOUR_POLLFISH_API_KEY")
                position(Position.BOTTOM_RIGHT)
                indicatorPadding(16)
                releaseMode(false) // Set to true for production
            }
            
        } catch (e: Exception) {
            android.util.Log.e("ThirdParty", "Failed to initialize third-party SDKs", e)
        }
        */
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            
            // General notifications channel
            val generalChannel = NotificationChannel(
                getString(R.string.default_notification_channel_id),
                "General Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "General app notifications"
                enableLights(true)
                lightColor = getColor(R.color.primary)
                enableVibration(true)
                setShowBadge(true)
            }
            
            // Contest notifications channel
            val contestChannel = NotificationChannel(
                "contest_notifications",
                "Contest Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Contest results and updates"
                enableLights(true)
                lightColor = getColor(R.color.secondary)
                enableVibration(true)
                setShowBadge(true)
            }
            
            // Withdrawal notifications channel
            val withdrawalChannel = NotificationChannel(
                "withdrawal_notifications",
                "Withdrawal Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Withdrawal status updates"
                enableLights(true)
                lightColor = getColor(R.color.success)
                enableVibration(true)
                setShowBadge(true)
            }
            
            // Referral notifications channel
            val referralChannel = NotificationChannel(
                "referral_notifications",
                "Referral Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Referral earnings and updates"
                enableLights(true)
                lightColor = getColor(R.color.accent)
                enableVibration(false)
                setShowBadge(true)
            }
            
            notificationManager.createNotificationChannels(listOf(
                generalChannel,
                contestChannel,
                withdrawalChannel,
                referralChannel
            ))
        }
    }

    private fun setupFirebaseMessaging() {
        FirebaseMessaging.getInstance().token.addOnCompleteListener { task ->
            if (!task.isSuccessful) {
                android.util.Log.w("FCM", "Fetching FCM registration token failed", task.exception)
                return@addOnCompleteListener
            }

            // Get new FCM registration token
            val token = task.result
            android.util.Log.d("FCM", "FCM Registration Token: $token")
            
            // TODO: Send token to your backend server
        }
        
        // Subscribe to topics
        FirebaseMessaging.getInstance().subscribeToTopic("general")
            .addOnCompleteListener { task ->
                var msg = "Subscribed to general topic"
                if (!task.isSuccessful) {
                    msg = "Subscription to general topic failed"
                }
                android.util.Log.d("FCM", msg)
            }
    }

    companion object {
        // App-wide constants
        const val POINTS_TO_DOLLAR_RATIO = 10 // 10 points = $1
        const val DOLLAR_TO_DA_RATIO = 18 // $1 = 18 DA
        const val USER_REVENUE_SHARE = 0.7 // 70% to user
        const val ADMIN_REVENUE_SHARE = 0.3 // 30% to admin
        const val LEVEL_1_COMMISSION = 0.05 // 5% commission
        const val LEVEL_2_COMMISSION = 0.03 // 3% commission
        
        // Minimum withdrawal amounts
        const val MIN_BINANCE_WITHDRAWAL = 20 // 20 points = $2
        const val MIN_BARIDIMOB_WITHDRAWAL = 55 // 55 points = $5.5
        const val MIN_FLEXY_WITHDRAWAL = 10 // 10 points = $1
        
        // Contest requirements
        const val DAILY_CONTEST_ADS = 10
        const val WEEKLY_CONTEST_ADS = 30
        const val MONTHLY_CONTEST_ADS = 100
    }
}