package com.navigi.sbaro.data.ads

import android.app.Activity
import android.content.Context
import android.util.Log
import com.navigi.sbaro.data.repository.VipTier
import kotlinx.coroutines.delay
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton

enum class AdProvider {
    ADGEM,      // Primary provider
    ADPUMB,     // Backup global
    MONETISE,   // MENA region focus
    OFFERTORO,  // Daily competition
    TAPJOY      // Weekly competition
}

enum class AdType {
    EARNING,
    DAILY_COMPETITION,
    WEEKLY_COMPETITION,
    MONTHLY_COMPETITION,
    VIP_EXCLUSIVE
}

data class AdRequest(
    val provider: AdProvider,
    val type: AdType,
    val minValue: Double = 0.018,
    val vipTier: VipTier = VipTier.NONE
)

data class AdResult(
    val success: Boolean,
    val revenue: Double,
    val points: Double,
    val provider: AdProvider,
    val error: String? = null
)

@Singleton
class AdvancedAdNetworkManager @Inject constructor() {
    
    companion object {
        private const val TAG = "AdvancedAdManager"
        private const val MIN_AD_VALUE = 0.018
        private const val BASE_POINTS_PER_AD = 1.1
        
        // Cooldown times in milliseconds
        private const val REGULAR_COOLDOWN = 3 * 60 * 1000L // 3 minutes
        private const val VIP_COOLDOWN = 1 * 60 * 1000L // 1 minute
        
        // Peak hours: 8-11 PM local time
        private const val PEAK_HOUR_START = 20 // 8 PM
        private const val PEAK_HOUR_END = 23   // 11 PM
        private const val PEAK_HOUR_BONUS = 0.3 // 30% bonus
    }
    
    private var currentPrimaryProvider = AdProvider.ADGEM
    private var lastProviderSwitch = System.currentTimeMillis()
    private val providerSwitchInterval = 7 * 24 * 60 * 60 * 1000L // 1 week
    
    fun initialize(context: Context) {
        Log.d(TAG, "Initializing Advanced Ad Network Manager")
        checkProviderRotation()
    }
    
    fun canShowAd(
        lastAdTime: Long,
        vipTier: VipTier,
        dailyAdsWatched: Int,
        isVpnDetected: Boolean
    ): Pair<Boolean, String?> {
        
        // VPN detection check
        if (isVpnDetected) {
            return Pair(false, "VPN detected. Disable VPN to watch ads.")
        }
        
        // Daily limit check
        val dailyLimit = getDailyAdLimit(vipTier)
        if (dailyAdsWatched >= dailyLimit) {
            return Pair(false, "Daily ad limit reached ($dailyLimit ads)")
        }
        
        // Cooldown check
        val cooldownTime = if (vipTier != VipTier.NONE) VIP_COOLDOWN else REGULAR_COOLDOWN
        val timeSinceLastAd = System.currentTimeMillis() - lastAdTime
        
        if (timeSinceLastAd < cooldownTime) {
            val remainingTime = (cooldownTime - timeSinceLastAd) / 1000
            return Pair(false, "Please wait ${remainingTime}s before next ad")
        }
        
        return Pair(true, null)
    }
    
    suspend fun showAd(
        activity: Activity,
        request: AdRequest,
        onSuccess: (AdResult) -> Unit,
        onFailure: (String) -> Unit
    ) {
        try {
            // Check provider rotation
            checkProviderRotation()
            
            // Attempt primary provider first
            var provider = selectProvider(request)
            var result = simulateAdRequest(provider, request)
            
            // Try backup providers if primary fails
            if (!result.success && provider == currentPrimaryProvider) {
                val backupProviders = getBackupProviders(request.type)
                for (backupProvider in backupProviders) {
                    Log.d(TAG, "Trying backup provider: $backupProvider")
                    result = simulateAdRequest(backupProvider, request)
                    if (result.success) {
                        provider = backupProvider
                        break
                    }
                }
            }
            
            if (result.success) {
                // Simulate ad display delay
                delay(2000) // 2 second ad display
                onSuccess(result)
                Log.d(TAG, "Ad successful: ${result.provider}, Revenue: $${String.format("%.4f", result.revenue)}, Points: ${result.points}")
            } else {
                onFailure(result.error ?: "Ad failed to load")
            }
            
        } catch (e: Exception) {
            Log.e(TAG, "Ad display error", e)
            onFailure("Ad display error: ${e.message}")
        }
    }
    
    private fun selectProvider(request: AdRequest): AdProvider {
        return when (request.type) {
            AdType.EARNING -> currentPrimaryProvider
            AdType.DAILY_COMPETITION -> AdProvider.OFFERTORO
            AdType.WEEKLY_COMPETITION -> AdProvider.TAPJOY
            AdType.MONTHLY_COMPETITION -> AdProvider.ADGEM
            AdType.VIP_EXCLUSIVE -> AdProvider.ADGEM
        }
    }
    
    private fun getBackupProviders(adType: AdType): List<AdProvider> {
        return when (adType) {
            AdType.EARNING -> listOf(AdProvider.ADPUMB, AdProvider.MONETISE)
            AdType.DAILY_COMPETITION -> listOf(AdProvider.ADPUMB)
            AdType.WEEKLY_COMPETITION -> listOf(AdProvider.MONETISE)
            AdType.MONTHLY_COMPETITION -> listOf(AdProvider.ADPUMB, AdProvider.MONETISE)
            AdType.VIP_EXCLUSIVE -> listOf(AdProvider.ADPUMB, AdProvider.MONETISE)
        }
    }
    
    private fun simulateAdRequest(provider: AdProvider, request: AdRequest): AdResult {
        // Simulate ad availability based on provider
        val availability = when (provider) {
            AdProvider.ADGEM -> 0.95 // 95% availability (primary)
            AdProvider.ADPUMB -> 0.85 // 85% availability (global backup)
            AdProvider.MONETISE -> 0.80 // 80% availability (MENA focus)
            AdProvider.OFFERTORO -> 0.90 // 90% availability (daily competition)
            AdProvider.TAPJOY -> 0.88 // 88% availability (weekly competition)
        }
        
        // Random availability check
        if (Math.random() > availability) {
            return AdResult(
                success = false,
                revenue = 0.0,
                points = 0.0,
                provider = provider,
                error = "No qualifying ads available from $provider"
            )
        }
        
        // Generate realistic ad revenue
        val baseRevenue = generateAdRevenue(provider, request.minValue)
        
        // Check minimum value threshold
        if (baseRevenue < request.minValue) {
            return AdResult(
                success = false,
                revenue = 0.0,
                points = 0.0,
                provider = provider,
                error = "Ad value below minimum threshold ($${String.format("%.3f", request.minValue)})"
            )
        }
        
        // Calculate points with bonuses
        var points = BASE_POINTS_PER_AD
        
        // Peak hour bonus (8-11 PM local time)
        if (isPeakHour()) {
            points *= (1 + PEAK_HOUR_BONUS)
            Log.d(TAG, "Peak hour bonus applied: +${(PEAK_HOUR_BONUS * 100).toInt()}%")
        }
        
        // VIP tier bonus for mining points
        val miningBonus = getMiningBonus(request.vipTier)
        points += miningBonus
        
        return AdResult(
            success = true,
            revenue = baseRevenue,
            points = points,
            provider = provider
        )
    }
    
    private fun generateAdRevenue(provider: AdProvider, minValue: Double): Double {
        val random = Random()
        
        // Different revenue ranges by provider
        return when (provider) {
            AdProvider.ADGEM -> {
                // Primary provider: higher revenue
                minValue + random.nextDouble() * (0.045 - minValue)
            }
            AdProvider.ADPUMB -> {
                // Global backup: medium revenue
                minValue + random.nextDouble() * (0.035 - minValue)
            }
            AdProvider.MONETISE -> {
                // MENA focus: medium-high revenue
                minValue + random.nextDouble() * (0.040 - minValue)
            }
            AdProvider.OFFERTORO -> {
                // Competition provider: higher revenue for competitions
                minValue + random.nextDouble() * (0.050 - minValue)
            }
            AdProvider.TAPJOY -> {
                // Competition provider: higher revenue for competitions
                minValue + random.nextDouble() * (0.048 - minValue)
            }
        }
    }
    
    private fun isPeakHour(): Boolean {
        val calendar = Calendar.getInstance()
        val hour = calendar.get(Calendar.HOUR_OF_DAY)
        return hour in PEAK_HOUR_START..PEAK_HOUR_END
    }
    
    private fun getMiningBonus(vipTier: VipTier): Double {
        return when (vipTier) {
            VipTier.NONE -> 0.0
            VipTier.KING -> 10.0 / 16.0  // 10 daily mining points ÷ 16 daily ads
            VipTier.EMPEROR -> 15.0 / 20.0 // 15 daily mining points ÷ 20 daily ads
            VipTier.LORD -> 20.0 / 25.0  // 20 daily mining points ÷ 25 daily ads
        }
    }
    
    fun getDailyAdLimit(vipTier: VipTier): Int {
        return when (vipTier) {
            VipTier.NONE -> 12
            VipTier.KING -> 16
            VipTier.EMPEROR -> 20
            VipTier.LORD -> 25
        }
    }
    
    fun getCooldownMinutes(vipTier: VipTier): Int {
        return if (vipTier != VipTier.NONE) 1 else 3
    }
    
    private fun checkProviderRotation() {
        val currentTime = System.currentTimeMillis()
        if (currentTime - lastProviderSwitch > providerSwitchInterval) {
            // Weekly provider rotation
            currentPrimaryProvider = when (currentPrimaryProvider) {
                AdProvider.ADGEM -> AdProvider.ADPUMB
                AdProvider.ADPUMB -> AdProvider.MONETISE
                AdProvider.MONETISE -> AdProvider.ADGEM
                else -> AdProvider.ADGEM
            }
            lastProviderSwitch = currentTime
            Log.d(TAG, "Provider rotated to: $currentPrimaryProvider")
        }
    }
    
    fun getCurrentProvider(): AdProvider = currentPrimaryProvider
    
    fun isAdReady(): Boolean {
        // Simulate ad readiness (always ready for demo)
        return true
    }
    
    fun getProviderStatus(): Map<AdProvider, Boolean> {
        return mapOf(
            AdProvider.ADGEM to true,
            AdProvider.ADPUMB to true,
            AdProvider.MONETISE to true,
            AdProvider.OFFERTORO to true,
            AdProvider.TAPJOY to true
        )
    }
}