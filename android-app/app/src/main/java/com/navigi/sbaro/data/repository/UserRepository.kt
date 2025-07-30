package com.navigi.sbaro.data.repository

import android.content.Context
import android.content.SharedPreferences
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.ktx.toObject
import com.navigi.sbaro.domain.model.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.random.Random

data class UserStats(
    val totalPoints: Int = 0,
    val todayPoints: Int = 0,
    val referralPoints: Int = 0,
    val adsWatched: Int = 0,
    val dailyEarnAds: Int = 0,
    val contestAdsToday: Int = 0,
    val contestAdsWeek: Int = 0,
    val contestAdsMonth: Int = 0,
    val vipContestAds: Int = 0,
    val referralCode: String = "",
    val referredUsers: List<String> = emptyList(),
    val level1Earnings: Int = 0,
    val level2Earnings: Int = 0,
    val contestsWon: Int = 0,
    val isEligibleForDaily: Boolean = true,
    val isEligibleForWeekly: Boolean = true,
    val isEligibleForMonthly: Boolean = true,
    val isEligibleForVip: Boolean = true,
    val dailyContestDeadline: Long = 0,
    val weeklyContestDeadline: Long = 0,
    val monthlyContestDeadline: Long = 0,
    val vipContestDeadline: Long = 0,
    val isVip: Boolean = false,
    val vipExpiryDate: Long = 0,
    val dailyAdLimit: Int = 12
)

data class ContestInfo(
    val contestName: String,
    val prize: Int,
    val winner: String,
    val date: String
)

@Singleton
class UserRepository @Inject constructor(
    private val context: Context,
    private val firestore: FirebaseFirestore,
    private val auth: FirebaseAuth
) {
    
    private val prefs: SharedPreferences = context.getSharedPreferences("sbaro_prefs", Context.MODE_PRIVATE)
    
    private val _userStats = MutableStateFlow(UserStats())
    val userStats: StateFlow<UserStats> = _userStats.asStateFlow()
    
    private val _contestNews = MutableStateFlow<List<ContestInfo>>(emptyList())
    val contestNews: StateFlow<List<ContestInfo>> = _contestNews.asStateFlow()
    
    companion object {
        private const val PREF_TOTAL_POINTS = "total_points"
        private const val PREF_TODAY_POINTS = "today_points"
        private const val PREF_REFERRAL_POINTS = "referral_points"
        private const val PREF_ADS_WATCHED = "ads_watched"
        private const val PREF_DAILY_EARN_ADS = "daily_earn_ads"
        private const val PREF_CONTEST_ADS_TODAY = "contest_ads_today"
        private const val PREF_CONTEST_ADS_WEEK = "contest_ads_week"
        private const val PREF_CONTEST_ADS_MONTH = "contest_ads_month"
        private const val PREF_VIP_CONTEST_ADS = "vip_contest_ads"
        private const val PREF_REFERRAL_CODE = "referral_code"
        private const val PREF_LEVEL1_EARNINGS = "level1_earnings"
        private const val PREF_LEVEL2_EARNINGS = "level2_earnings"
        private const val PREF_CONTESTS_WON = "contests_won"
        private const val PREF_LAST_DAILY_DATE = "last_daily_date"
        private const val PREF_LAST_WEEKLY_DATE = "last_weekly_date"
        private const val PREF_LAST_MONTHLY_DATE = "last_monthly_date"
        private const val PREF_LAST_VIP_DATE = "last_vip_date"
        private const val PREF_DAILY_CONTEST_DEADLINE = "daily_contest_deadline"
        private const val PREF_WEEKLY_CONTEST_DEADLINE = "weekly_contest_deadline"
        private const val PREF_MONTHLY_CONTEST_DEADLINE = "monthly_contest_deadline"
        private const val PREF_VIP_CONTEST_DEADLINE = "vip_contest_deadline"
        private const val PREF_IS_VIP = "is_vip"
        private const val PREF_VIP_EXPIRY_DATE = "vip_expiry_date"
        private const val PREF_LAST_AD_RESET_DATE = "last_ad_reset_date"
    }
    
    init {
        loadUserStats()
        loadContestNews()
    }
    
    private fun loadUserStats() {
        val currentUser = auth.currentUser
        val userId = currentUser?.uid ?: "guest"
        
        // Check if we need to reset daily counters
        checkAndResetDailyCounters()
        
        val totalPoints = prefs.getInt(PREF_TOTAL_POINTS, 0)
        val todayPoints = prefs.getInt(PREF_TODAY_POINTS, 0)
        val referralPoints = prefs.getInt(PREF_REFERRAL_POINTS, 0)
        val adsWatched = prefs.getInt(PREF_ADS_WATCHED, 0)
        val dailyEarnAds = prefs.getInt(PREF_DAILY_EARN_ADS, 0)
        val contestAdsToday = prefs.getInt(PREF_CONTEST_ADS_TODAY, 0)
        val contestAdsWeek = prefs.getInt(PREF_CONTEST_ADS_WEEK, 0)
        val contestAdsMonth = prefs.getInt(PREF_CONTEST_ADS_MONTH, 0)
        val vipContestAds = prefs.getInt(PREF_VIP_CONTEST_ADS, 0)
        val referralCode = prefs.getString(PREF_REFERRAL_CODE, null) ?: generateReferralCode(userId)
        val level1Earnings = prefs.getInt(PREF_LEVEL1_EARNINGS, 0)
        val level2Earnings = prefs.getInt(PREF_LEVEL2_EARNINGS, 0)
        val contestsWon = prefs.getInt(PREF_CONTESTS_WON, 0)
        
        // VIP status
        val isVip = prefs.getBoolean(PREF_IS_VIP, false)
        val vipExpiryDate = prefs.getLong(PREF_VIP_EXPIRY_DATE, 0)
        val currentVipStatus = isVip && vipExpiryDate > System.currentTimeMillis()
        val dailyAdLimit = if (currentVipStatus) 25 else 12
        
        // Update VIP status if expired
        if (isVip && vipExpiryDate <= System.currentTimeMillis()) {
            prefs.edit().putBoolean(PREF_IS_VIP, false).apply()
        }
        
        // Check contest eligibility and deadlines
        val today = System.currentTimeMillis()
        val lastDaily = prefs.getLong(PREF_LAST_DAILY_DATE, 0)
        val lastWeekly = prefs.getLong(PREF_LAST_WEEKLY_DATE, 0)
        val lastMonthly = prefs.getLong(PREF_LAST_MONTHLY_DATE, 0)
        val lastVip = prefs.getLong(PREF_LAST_VIP_DATE, 0)
        
        val isEligibleForDaily = (today - lastDaily) > 24 * 60 * 60 * 1000 // 24 hours
        val isEligibleForWeekly = (today - lastWeekly) > 7 * 24 * 60 * 60 * 1000 // 7 days
        val isEligibleForMonthly = (today - lastMonthly) > 30 * 24 * 60 * 60 * 1000 // 30 days
        val isEligibleForVip = currentVipStatus && (today - lastVip) > 3 * 24 * 60 * 60 * 1000 // 3 days
        
        // Calculate contest deadlines (next draw times)
        val dailyDeadline = prefs.getLong(PREF_DAILY_CONTEST_DEADLINE, 0)
        val weeklyDeadline = prefs.getLong(PREF_WEEKLY_CONTEST_DEADLINE, 0)
        val monthlyDeadline = prefs.getLong(PREF_MONTHLY_CONTEST_DEADLINE, 0)
        val vipDeadline = prefs.getLong(PREF_VIP_CONTEST_DEADLINE, 0)
        
        _userStats.value = UserStats(
            totalPoints = totalPoints,
            todayPoints = todayPoints,
            referralPoints = referralPoints,
            adsWatched = adsWatched,
            dailyEarnAds = dailyEarnAds,
            contestAdsToday = contestAdsToday,
            contestAdsWeek = contestAdsWeek,
            contestAdsMonth = contestAdsMonth,
            vipContestAds = vipContestAds,
            referralCode = referralCode,
            level1Earnings = level1Earnings,
            level2Earnings = level2Earnings,
            contestsWon = contestsWon,
            isEligibleForDaily = isEligibleForDaily,
            isEligibleForWeekly = isEligibleForWeekly,
            isEligibleForMonthly = isEligibleForMonthly,
            isEligibleForVip = isEligibleForVip,
            dailyContestDeadline = dailyDeadline,
            weeklyContestDeadline = weeklyDeadline,
            monthlyContestDeadline = monthlyDeadline,
            vipContestDeadline = vipDeadline,
            isVip = currentVipStatus,
            vipExpiryDate = vipExpiryDate,
            dailyAdLimit = dailyAdLimit
        )
        
        // Save referral code if it was generated
        if (!prefs.contains(PREF_REFERRAL_CODE)) {
            prefs.edit().putString(PREF_REFERRAL_CODE, referralCode).apply()
        }
    }
    
    private fun checkAndResetDailyCounters() {
        val today = System.currentTimeMillis()
        val lastResetDate = prefs.getLong(PREF_LAST_AD_RESET_DATE, 0)
        val daysDiff = (today - lastResetDate) / (24 * 60 * 60 * 1000)
        
        if (daysDiff >= 1) {
            // Reset daily counters
            prefs.edit()
                .putInt(PREF_DAILY_EARN_ADS, 0)
                .putInt(PREF_TODAY_POINTS, 0)
                .putLong(PREF_LAST_AD_RESET_DATE, today)
                .apply()
        }
    }
    
    private fun generateReferralCode(userId: String): String {
        val randomSuffix = Random.nextInt(1000, 9999)
        return "SBARO-${userId.take(4).uppercase()}$randomSuffix"
    }
    
    // Real AdMob profit calculation (70% to user) with daily limits
    fun addPointsFromAd(adRevenue: Double = 0.02): Boolean { // Returns true if ad was counted, false if limit reached
        val currentStats = _userStats.value
        
        // Check daily limit
        if (currentStats.dailyEarnAds >= currentStats.dailyAdLimit) {
            return false // Daily limit reached
        }
        
        // Calculate real profit: User gets 70%, Admin gets 30%
        val userShareUSD = adRevenue * 0.70
        val points = (userShareUSD * 100).toInt() // Convert to points (1 point = $0.01)
        
        val newTotalPoints = currentStats.totalPoints + points
        val newTodayPoints = currentStats.todayPoints + points
        val newAdsWatched = currentStats.adsWatched + 1
        val newDailyEarnAds = currentStats.dailyEarnAds + 1
        
        _userStats.value = currentStats.copy(
            totalPoints = newTotalPoints,
            todayPoints = newTodayPoints,
            adsWatched = newAdsWatched,
            dailyEarnAds = newDailyEarnAds
        )
        
        // Save to preferences
        prefs.edit()
            .putInt(PREF_TOTAL_POINTS, newTotalPoints)
            .putInt(PREF_TODAY_POINTS, newTodayPoints)
            .putInt(PREF_ADS_WATCHED, newAdsWatched)
            .putInt(PREF_DAILY_EARN_ADS, newDailyEarnAds)
            .apply()
        
        // Sync to Firebase
        syncToFirebase()
        
        // Log for admin tracking
        android.util.Log.d("AdRevenue", "Ad Revenue: $${String.format("%.4f", adRevenue)}, User Points: $points, Admin Share: $${String.format("%.4f", adRevenue * 0.30)}, Daily Ads: $newDailyEarnAds/${currentStats.dailyAdLimit}")
        
        return true
    }
    
    // Separate contest ad tracking (for contests only)
    fun addContestAd(contestType: String) {
        val currentStats = _userStats.value
        
        when (contestType) {
            "daily" -> {
                val newContestAdsToday = currentStats.contestAdsToday + 1
                _userStats.value = currentStats.copy(contestAdsToday = newContestAdsToday)
                prefs.edit().putInt(PREF_CONTEST_ADS_TODAY, newContestAdsToday).apply()
            }
            "weekly" -> {
                val newContestAdsWeek = currentStats.contestAdsWeek + 1
                _userStats.value = currentStats.copy(contestAdsWeek = newContestAdsWeek)
                prefs.edit().putInt(PREF_CONTEST_ADS_WEEK, newContestAdsWeek).apply()
            }
            "monthly" -> {
                val newContestAdsMonth = currentStats.contestAdsMonth + 1
                _userStats.value = currentStats.copy(contestAdsMonth = newContestAdsMonth)
                prefs.edit().putInt(PREF_CONTEST_ADS_MONTH, newContestAdsMonth).apply()
            }
            "vip" -> {
                val newVipContestAds = currentStats.vipContestAds + 1
                _userStats.value = currentStats.copy(vipContestAds = newVipContestAds)
                prefs.edit().putInt(PREF_VIP_CONTEST_ADS, newVipContestAds).apply()
            }
        }
        
        // Sync to Firebase
        syncToFirebase()
    }
    
    // VIP subscription management
    fun activateVip() {
        val currentTime = System.currentTimeMillis()
        val expiryTime = currentTime + (30 * 24 * 60 * 60 * 1000L) // 30 days
        
        prefs.edit()
            .putBoolean(PREF_IS_VIP, true)
            .putLong(PREF_VIP_EXPIRY_DATE, expiryTime)
            .apply()
            
        loadUserStats() // Refresh to update daily limit to 25
        syncToFirebase()
    }
    
    fun checkVipStatus(): Pair<Boolean, Long> {
        val isVip = prefs.getBoolean(PREF_IS_VIP, false)
        val expiryDate = prefs.getLong(PREF_VIP_EXPIRY_DATE, 0)
        val isActive = isVip && expiryDate > System.currentTimeMillis()
        return Pair(isActive, expiryDate)
    }
    
    fun getRemainingVipDays(): Int {
        val (isActive, expiryDate) = checkVipStatus()
        if (!isActive) return 0
        
        val currentTime = System.currentTimeMillis()
        val remainingTime = expiryDate - currentTime
        return (remainingTime / (24 * 60 * 60 * 1000)).toInt()
    }
    
    // Legacy method for other point sources
    fun addPoints(points: Int, source: String = "other") {
        val currentStats = _userStats.value
        val newTotalPoints = currentStats.totalPoints + points
        val newTodayPoints = currentStats.todayPoints + points
        
        _userStats.value = currentStats.copy(
            totalPoints = newTotalPoints,
            todayPoints = newTodayPoints
        )
        
        // Save to preferences
        prefs.edit()
            .putInt(PREF_TOTAL_POINTS, newTotalPoints)
            .putInt(PREF_TODAY_POINTS, newTodayPoints)
            .apply()
        
        // Sync to Firebase
        syncToFirebase()
    }
    
    fun addReferralEarnings(points: Int, level: Int) {
        val currentStats = _userStats.value
        val newReferralPoints = currentStats.referralPoints + points
        val newTotalPoints = currentStats.totalPoints + points
        
        val newLevel1Earnings = if (level == 1) currentStats.level1Earnings + points else currentStats.level1Earnings
        val newLevel2Earnings = if (level == 2) currentStats.level2Earnings + points else currentStats.level2Earnings
        
        _userStats.value = currentStats.copy(
            totalPoints = newTotalPoints,
            referralPoints = newReferralPoints,
            level1Earnings = newLevel1Earnings,
            level2Earnings = newLevel2Earnings
        )
        
        // Save to preferences
        prefs.edit()
            .putInt(PREF_TOTAL_POINTS, newTotalPoints)
            .putInt(PREF_REFERRAL_POINTS, newReferralPoints)
            .putInt(PREF_LEVEL1_EARNINGS, newLevel1Earnings)
            .putInt(PREF_LEVEL2_EARNINGS, newLevel2Earnings)
            .apply()
        
        syncToFirebase()
    }
    
    fun joinContest(contestType: String): Boolean {
        val currentStats = _userStats.value
        val today = System.currentTimeMillis()
        
        when (contestType) {
            "daily" -> {
                if (currentStats.isEligibleForDaily && currentStats.contestAdsToday >= 10) {
                    prefs.edit().putLong(PREF_LAST_DAILY_DATE, today).apply()
                    // Set deadline for next draw (24 hours from now)
                    val deadline = today + (24 * 60 * 60 * 1000)
                    prefs.edit().putLong(PREF_DAILY_CONTEST_DEADLINE, deadline).apply()
                    loadUserStats() // Refresh eligibility
                    return true
                }
            }
            "weekly" -> {
                if (currentStats.isEligibleForWeekly && currentStats.contestAdsWeek >= 30) {
                    prefs.edit().putLong(PREF_LAST_WEEKLY_DATE, today).apply()
                    // Set deadline for next draw (7 days from now)
                    val deadline = today + (7 * 24 * 60 * 60 * 1000)
                    prefs.edit().putLong(PREF_WEEKLY_CONTEST_DEADLINE, deadline).apply()
                    loadUserStats() // Refresh eligibility
                    return true
                }
            }
            "monthly" -> {
                if (currentStats.isEligibleForMonthly && currentStats.contestAdsMonth >= 100) {
                    prefs.edit().putLong(PREF_LAST_MONTHLY_DATE, today).apply()
                    // Set deadline for next draw (30 days from now)
                    val deadline = today + (30 * 24 * 60 * 60 * 1000)
                    prefs.edit().putLong(PREF_MONTHLY_CONTEST_DEADLINE, deadline).apply()
                    loadUserStats() // Refresh eligibility
                    return true
                }
            }
            "vip" -> {
                if (currentStats.isEligibleForVip && currentStats.vipContestAds >= 30) {
                    prefs.edit().putLong(PREF_LAST_VIP_DATE, today).apply()
                    // Set deadline for next draw (3 days from now)
                    val deadline = today + (3 * 24 * 60 * 60 * 1000)
                    prefs.edit().putLong(PREF_VIP_CONTEST_DEADLINE, deadline).apply()
                    loadUserStats() // Refresh eligibility
                    return true
                }
            }
        }
        return false
    }
    
    fun processReferral(referralCode: String): Boolean {
        // In a real app, this would validate against Firebase
        // For now, just simulate adding referral earnings
        if (referralCode.startsWith("SBARO-") && referralCode != _userStats.value.referralCode) {
            // Simulate level 1 referral (5% of 10 points = 0.5, rounded to 1 point)
            addReferralEarnings(1, 1)
            return true
        }
        return false
    }
    
    private fun loadContestNews() {
        // Sample contest news data
        val sampleNews = listOf(
            ContestInfo("Daily Contest", 40, "User-ABCD1234", "Today"),
            ContestInfo("Weekly Contest", 150, "User-EFGH5678", "Yesterday"),
            ContestInfo("Monthly Contest", 600, "User-IJKL9012", "2 days ago")
        )
        _contestNews.value = sampleNews
    }
    
    private fun syncToFirebase() {
        val currentUser = auth.currentUser ?: return
        val userId = currentUser.uid
        
        val userData = mapOf(
            "totalPoints" to _userStats.value.totalPoints,
            "todayPoints" to _userStats.value.todayPoints,
            "referralPoints" to _userStats.value.referralPoints,
            "adsWatched" to _userStats.value.adsWatched,
            "referralCode" to _userStats.value.referralCode,
            "level1Earnings" to _userStats.value.level1Earnings,
            "level2Earnings" to _userStats.value.level2Earnings,
            "contestsWon" to _userStats.value.contestsWon,
            "lastUpdated" to System.currentTimeMillis()
        )
        
        firestore.collection("users").document(userId)
            .set(userData)
            .addOnSuccessListener {
                android.util.Log.d("UserRepository", "User data synced to Firebase")
            }
            .addOnFailureListener { e ->
                android.util.Log.e("UserRepository", "Failed to sync user data", e)
            }
    }
    
    fun getUserId(): String {
        return auth.currentUser?.uid ?: "guest"
    }
    
    fun getUserEmail(): String {
        return auth.currentUser?.email ?: "guest@navigi.com"
    }
    
    fun resetTodayPoints() {
        _userStats.value = _userStats.value.copy(todayPoints = 0)
        prefs.edit().putInt(PREF_TODAY_POINTS, 0).apply()
    }
}