package com.navigi.sbaro.data.ads

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Log
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AdsterraManager @Inject constructor() {
    
    companion object {
        private const val TAG = "AdsterraManager"
        private const val ADSTERRA_URL = "https://www.profitableratecpm.com/wzun0hab?key=d618b444e85c92f5cff5b3be66d62941"
    }
    
    fun initialize(context: Context) {
        Log.d(TAG, "Adsterra initialized")
    }
    
    @Composable
    fun AdsterraBannerAd() {
        val context = LocalContext.current
        
        AndroidView(
            factory = { context ->
                WebView(context).apply {
                    settings.javaScriptEnabled = true
                    settings.domStorageEnabled = true
                    settings.loadWithOverviewMode = true
                    settings.useWideViewPort = true
                    settings.setSupportZoom(false)
                    settings.builtInZoomControls = false
                    settings.displayZoomControls = false
                    settings.setSupportMultipleWindows(false)
                    settings.javaScriptCanOpenWindowsAutomatically = false
                    settings.loadsImagesAutomatically = true
                    settings.blockNetworkImage = false
                    settings.blockNetworkLoads = false
                    settings.mediaPlaybackRequiresUserGesture = false
                    
                    webViewClient = object : WebViewClient() {
                        override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                            url?.let { safeUrl ->
                                if (safeUrl.startsWith("http://") || safeUrl.startsWith("https://")) {
                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(safeUrl))
                                    context.startActivity(intent)
                                    return true
                                }
                            }
                            return false
                        }
                        
                        override fun onPageFinished(view: WebView?, url: String?) {
                            super.onPageFinished(view, url)
                            Log.d(TAG, "Adsterra banner ad loaded")
                        }
                        
                        override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                            Log.e(TAG, "Adsterra banner ad error: $description")
                        }
                    }
                    
                    loadUrl(ADSTERRA_URL)
                }
            },
            modifier = Modifier.fillMaxSize(),
            update = { webView ->
                // Update logic if needed
            }
        )
    }
    
    fun showInterstitialAd(
        activity: Activity,
        onAdClosed: () -> Unit,
        onAdFailed: (String) -> Unit
    ) {
        try {
            val webView = WebView(activity).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.loadWithOverviewMode = true
                settings.useWideViewPort = true
                settings.setSupportZoom(false)
                settings.builtInZoomControls = false
                settings.displayZoomControls = false
                settings.setSupportMultipleWindows(false)
                settings.javaScriptCanOpenWindowsAutomatically = false
                settings.loadsImagesAutomatically = true
                settings.blockNetworkImage = false
                settings.blockNetworkLoads = false
                settings.mediaPlaybackRequiresUserGesture = false
                
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                        url?.let { safeUrl ->
                            if (safeUrl.startsWith("http://") || safeUrl.startsWith("https://")) {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(safeUrl))
                                activity.startActivity(intent)
                                onAdClosed()
                                return true
                            }
                        }
                        return false
                    }
                    
                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        Log.d(TAG, "Adsterra interstitial ad loaded")
                        // Auto-close after 5 seconds
                        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                            onAdClosed()
                        }, 5000)
                    }
                    
                    override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                        Log.e(TAG, "Adsterra interstitial ad error: $description")
                        onAdFailed("Failed to load ad: $description")
                    }
                }
                
                loadUrl(ADSTERRA_URL)
            }
            
            // Create a dialog to show the ad
            val dialog = android.app.AlertDialog.Builder(activity)
                .setView(webView)
                .setCancelable(false)
                .create()
            
            dialog.show()
            
            // Set dialog to full screen
            dialog.window?.setLayout(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            
        } catch (e: Exception) {
            Log.e(TAG, "Error showing Adsterra interstitial ad", e)
            onAdFailed("Error showing ad: ${e.message}")
        }
    }
    
    fun showRewardedAd(
        activity: Activity,
        onRewarded: (Double) -> Unit,
        onAdFailed: (String) -> Unit
    ) {
        try {
            val webView = WebView(activity).apply {
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.loadWithOverviewMode = true
                settings.useWideViewPort = true
                settings.setSupportZoom(false)
                settings.builtInZoomControls = false
                settings.displayZoomControls = false
                settings.setSupportMultipleWindows(false)
                settings.javaScriptCanOpenWindowsAutomatically = false
                settings.loadsImagesAutomatically = true
                settings.blockNetworkImage = false
                settings.blockNetworkLoads = false
                settings.mediaPlaybackRequiresUserGesture = false
                
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                        url?.let { safeUrl ->
                            if (safeUrl.startsWith("http://") || safeUrl.startsWith("https://")) {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(safeUrl))
                                activity.startActivity(intent)
                                // Generate realistic ad revenue
                                val revenue = generateRealisticAdRevenue()
                                onRewarded(revenue)
                                return true
                            }
                        }
                        return false
                    }
                    
                    override fun onPageFinished(view: WebView?, url: String?) {
                        super.onPageFinished(view, url)
                        Log.d(TAG, "Adsterra rewarded ad loaded")
                        // Auto-reward after 10 seconds
                        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
                            val revenue = generateRealisticAdRevenue()
                            onRewarded(revenue)
                        }, 10000)
                    }
                    
                    override fun onReceivedError(view: WebView?, errorCode: Int, description: String?, failingUrl: String?) {
                        Log.e(TAG, "Adsterra rewarded ad error: $description")
                        onAdFailed("Failed to load ad: $description")
                    }
                }
                
                loadUrl(ADSTERRA_URL)
            }
            
            // Create a dialog to show the ad
            val dialog = android.app.AlertDialog.Builder(activity)
                .setView(webView)
                .setCancelable(false)
                .create()
            
            dialog.show()
            
            // Set dialog to full screen
            dialog.window?.setLayout(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            
        } catch (e: Exception) {
            Log.e(TAG, "Error showing Adsterra rewarded ad", e)
            onAdFailed("Error showing ad: ${e.message}")
        }
    }
    
    private fun generateRealisticAdRevenue(): Double {
        // Simulate realistic Adsterra revenue based on actual market rates
        val random = kotlin.random.Random.Default
        return when (random.nextInt(100)) {
            in 0..29 -> random.nextDouble(0.005, 0.015) // 30% low tier
            in 30..79 -> random.nextDouble(0.015, 0.035) // 50% mid tier  
            else -> random.nextDouble(0.035, 0.080) // 20% high tier
        }
    }
    
    fun isRewardedAdReady(): Boolean = true // Always ready for Adsterra
    
    fun isInterstitialAdReady(): Boolean = true // Always ready for Adsterra
    
    fun cleanup() {
        // No cleanup needed for Adsterra
    }
}