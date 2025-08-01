package com.navigi.sbaro

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.google.accompanist.systemuicontroller.rememberSystemUiController
import com.navigi.sbaro.data.ads.AdsterraManager
import com.navigi.sbaro.data.notification.NotificationManager
import com.navigi.sbaro.data.repository.UserRepository
import com.navigi.sbaro.presentation.navigation.SbaroNavHost
import com.navigi.sbaro.presentation.theme.NAVIGITheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var adsterraManager: AdsterraManager
    
    @Inject
    lateinit var userRepository: UserRepository
    
    @Inject
    lateinit var notificationManager: NotificationManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        // Initialize Adsterra
        adsterraManager.initialize(this)
        
        // Keep the splash screen on-screen while loading
        splashScreen.setKeepOnScreenCondition {
            // Add your loading condition here
            false
        }
        
        setContent {
            NAVIGITheme {
                val systemUiController = rememberSystemUiController()
                val useDarkIcons = MaterialTheme.colorScheme.background.luminance() > 0.5f
                
                // Set status bar and navigation bar colors
                systemUiController.setSystemBarsColor(
                    color = MaterialTheme.colorScheme.background,
                    darkIcons = useDarkIcons
                )
                
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    SbaroNavHost(
                        adsterraManager = adsterraManager,
                        userRepository = userRepository,
                        notificationManager = notificationManager
                    )
                }
            }
        }
    }
}

// Extension function to calculate luminance
private fun androidx.compose.ui.graphics.Color.luminance(): Float {
    val red = red * 0.299f
    val green = green * 0.587f
    val blue = blue * 0.114f
    return red + green + blue
}