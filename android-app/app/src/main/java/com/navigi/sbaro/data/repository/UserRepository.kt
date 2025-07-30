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
    val contestAdsToday: Int = 0,
    val contestAdsWeek: Int = 0,
    val contestAdsMonth: Int = 0,
    val referralCode: String = "",
    val referredUsers: List<String> = emptyList(),
    val level1Earnings: Int = 0,
    val level2Earnings: Int = 0,
    val contestsWon: Int = 0,
    val isEligibleForDaily: Boolean = true,
    val isEligibleForWeekly: Boolean = true,
    val isEligibleForMonthly: Boolean = true,
    val dailyContestDeadline: Long = 0,
    val weeklyContestDeadline: Long = 0,
    val monthlyContestDeadline: Long = 0
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
        private const val PREF_CONTEST_ADS_TODAY = "contest_ads_today"
        private const val PREF_CONTEST_ADS_WEEK = "contest_ads_week"
        private const val PREF_CONTEST_ADS_MONTH = "contest_ads_month"
        private const val PREF_REFERRAL_CODE = "referral_code"
        private const val PREF_LEVEL1_EARNINGS = "level1_earnings"
        private const val PREF_LEVEL2_EARNINGS = "level2_earnings"
        private const val PREF_CONTESTS_WON = "contests_won"
        private const val PREF_LAST_DAILY_DATE = "last_daily_date"
        private const val PREF_LAST_WEEKLY_DATE = "last_weekly_date"
        private const val PREF_LAST_MONTHLY_DATE = "last_monthly_date"
        private const val PREF_DAILY_CONTEST_DEADLINE = "daily_contest_deadline"
        private const val PREF_WEEKLY_CONTEST_DEADLINE = "weekly_contest_deadline"
        private const val PREF_MONTHLY_CONTEST_DEADLINE = "monthly_contest_deadline"
    }
    
    init {
        loadUserStats()
        loadContestNews()
    }
    
    private fun loadUserStats() {
        val currentUser = auth.currentUser
        val userId = currentUser?.uid ?: "guest"
        
        val totalPoints = prefs.getInt(PREF_TOTAL_POINTS, 0)
        val todayPoints = prefs.getInt(PREF_TODAY_POINTS, 0)
        val referralPoints = prefs.getInt(PREF_REFERRAL_POINTS, 0)
        val adsWatched = prefs.getInt(PREF_ADS_WATCHED, 0)
        val contestAdsToday = prefs.getInt(PREF_CONTEST_ADS_TODAY, 0)
        val contestAdsWeek = prefs.getInt(PREF_CONTEST_ADS_WEEK, 0)
        val contestAdsMonth = prefs.getInt(PREF_CONTEST_ADS_MONTH, 0)
        val referralCode = prefs.getString(PREF_REFERRAL_CODE, null) ?: generateReferralCode(userId)
        val level1Earnings = prefs.getInt(PREF_LEVEL1_EARNINGS, 0)
        val level2Earnings = prefs.getInt(PREF_LEVEL2_EARNINGS, 0)
        val contestsWon = prefs.getInt(PREF_CONTESTS_WON, 0)
        
        // Check contest eligibility and deadlines
        val today = System.currentTimeMillis()
        val lastDaily = prefs.getLong(PREF_LAST_DAILY_DATE, 0)
        val lastWeekly = prefs.getLong(PREF_LAST_WEEKLY_DATE, 0)
        val lastMonthly = prefs.getLong(PREF_LAST_MONTHLY_DATE, 0)
        
        val isEligibleForDaily = (today - lastDaily) > 24 * 60 * 60 * 1000 // 24 hours
        val isEligibleForWeekly = (today - lastWeekly) > 7 * 24 * 60 * 60 * 1000 // 7 days
        val isEligibleForMonthly = (today - lastMonthly) > 30 * 24 * 60 * 60 * 1000 // 30 days
        
        // Calculate contest deadlines (next draw times)
        val dailyDeadline = prefs.getLong(PREF_DAILY_CONTEST_DEADLINE, 0)
        val weeklyDeadline = prefs.getLong(PREF_WEEKLY_CONTEST_DEADLINE, 0)
        val monthlyDeadline = prefs.getLong(PREF_MONTHLY_CONTEST_DEADLINE, 0)
        
        _userStats.value = UserStats(
            totalPoints = totalPoints,
            todayPoints = todayPoints,
            referralPoints = referralPoints,
            adsWatched = adsWatched,
            contestAdsToday = contestAdsToday,
            contestAdsWeek = contestAdsWeek,
            contestAdsMonth = contestAdsMonth,
            referralCode = referralCode,
            level1Earnings = level1Earnings,
            level2Earnings = level2Earnings,
            contestsWon = contestsWon,
            isEligibleForDaily = isEligibleForDaily,
            isEligibleForWeekly = isEligibleForWeekly,
            isEligibleForMonthly = isEligibleForMonthly,
            dailyContestDeadline = dailyDeadline,
            weeklyContestDeadline = weeklyDeadline,
            monthlyContestDeadline = monthlyDeadline
        )
        
        // Save referral code if it was generated
        if (!prefs.contains(PREF_REFERRAL_CODE)) {
            prefs.edit().putString(PREF_REFERRAL_CODE, referralCode).apply()
        }
    }
    
    private fun generateReferralCode(userId: String): String {
        val randomSuffix = Random.nextInt(1000, 9999)
        return "SBARO-${userId.take(4).uppercase()}$randomSuffix"
    }
    
    // Real AdMob profit calculation (70% to user)
    fun addPointsFromAd(adRevenue: Double = 0.02) { // Default $0.02 per ad (typical AdMob rate)
        val currentStats = _userStats.value
        
        // Calculate real profit: User gets 70%, Admin gets 30%
        val userShareUSD = adRevenue * 0.70
        val points = (userShareUSD * 100).toInt() // Convert to points (1 point = $0.01)
        
        val newTotalPoints = currentStats.totalPoints + points
        val newTodayPoints = currentStats.todayPoints + points
        val newAdsWatched = currentStats.adsWatched + 1
        
        _userStats.value = currentStats.copy(
            totalPoints = newTotalPoints,
            todayPoints = newTodayPoints,
            adsWatched = newAdsWatched
        )
        
        // Save to preferences
        prefs.edit()
            .putInt(PREF_TOTAL_POINTS, newTotalPoints)
            .putInt(PREF_TODAY_POINTS, newTodayPoints)
            .putInt(PREF_ADS_WATCHED, newAdsWatched)
            .apply()
        
        // Sync to Firebase
        syncToFirebase()
        
        // Log for admin tracking
        android.util.Log.d("AdRevenue", "Ad Revenue: $${String.format("%.4f", adRevenue)}, User Points: $points, Admin Share: $${String.format("%.4f", adRevenue * 0.30)}")
    }
    
    // Separate contest ad tracking (for contests only)
    fun addContestAd() {
        val currentStats = _userStats.value
        val newContestAdsToday = currentStats.contestAdsToday + 1
        val newContestAdsWeek = currentStats.contestAdsWeek + 1
        val newContestAdsMonth = currentStats.contestAdsMonth + 1
        
        _userStats.value = currentStats.copy(
            contestAdsToday = newContestAdsToday,
            contestAdsWeek = newContestAdsWeek,
            contestAdsMonth = newContestAdsMonth
        )
        
        // Save to preferences
        prefs.edit()
            .putInt(PREF_CONTEST_ADS_TODAY, newContestAdsToday)
            .putInt(PREF_CONTEST_ADS_WEEK, newContestAdsWeek)
            .putInt(PREF_CONTEST_ADS_MONTH, newContestAdsMonth)
            .apply()
        
        // Sync to Firebase
        syncToFirebase()
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