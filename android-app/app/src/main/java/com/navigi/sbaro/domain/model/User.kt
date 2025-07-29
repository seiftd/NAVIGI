package com.navigi.sbaro.domain.model

import com.navigi.sbaro.SbaroApplication
import kotlinx.serialization.Serializable

@Serializable
data class User(
    val id: String = "",
    val email: String = "",
    val phoneNumber: String = "",
    val displayName: String = "",
    val profileImageUrl: String = "",
    val referralCode: String = "",
    val referredByCode: String = "",
    val sbaroPoints: Long = 0L,
    val totalEarnings: Double = 0.0,
    val totalWithdrawn: Double = 0.0,
    val adsWatched: Int = 0,
    val dailyAdsWatched: Int = 0,
    val weeklyAdsWatched: Int = 0,
    val monthlyAdsWatched: Int = 0,
    val lastAdWatchedAt: String = "",
    val dailyResetAt: String = "",
    val weeklyResetAt: String = "",
    val monthlyResetAt: String = "",
    val referralEarnings: Double = 0.0,
    val directReferrals: List<String> = emptyList(),
    val level1ReferralEarnings: Double = 0.0,
    val level2ReferralEarnings: Double = 0.0,
    val contestParticipations: List<String> = emptyList(),
    val contestWins: List<ContestWin> = emptyList(),
    val withdrawalHistory: List<String> = emptyList(),
    val fcmToken: String = "",
    val isActive: Boolean = true,
    val isBlocked: Boolean = false,
    val preferredLanguage: String = "en",
    val notificationsEnabled: Boolean = true,
    val biometricEnabled: Boolean = false,
    val lastLoginAt: String = "",
    val createdAt: String = "",
    val updatedAt: String = "",
    val deviceInfo: DeviceInfo? = null,
    val gamingEarnings: Double = 0.0,
    val surveyEarnings: Double = 0.0,
    val videoLikeEarnings: Double = 0.0,
    val level: Int = 1,
    val experience: Int = 0,
    val achievements: List<String> = emptyList(),
    val streakDays: Int = 0,
    val longestStreak: Int = 0,
    val lastActiveDate: String = ""
)

@Serializable
data class ContestWin(
    val contestId: String,
    val contestType: ContestType,
    val position: Int,
    val prizePoints: Long,
    val winDate: String
)

@Serializable
data class DeviceInfo(
    val deviceId: String,
    val deviceModel: String,
    val osVersion: String,
    val appVersion: String,
    val ipAddress: String = "",
    val country: String = "",
    val city: String = ""
)

enum class ContestType {
    DAILY,
    WEEKLY,
    MONTHLY
}

// Extension functions for User model
fun User.getDollarBalance(): Double = sbaroPoints.toDouble() / SbaroApplication.POINTS_TO_DOLLAR_RATIO

fun User.getDaBalance(): Double = getDollarBalance() * SbaroApplication.DOLLAR_TO_DA_RATIO

fun User.canWithdrawBinance(): Boolean = sbaroPoints >= SbaroApplication.MIN_BINANCE_WITHDRAWAL

fun User.canWithdrawBaridiMob(): Boolean = sbaroPoints >= SbaroApplication.MIN_BARIDIMOB_WITHDRAWAL

fun User.canWithdrawFlexy(): Boolean = sbaroPoints >= SbaroApplication.MIN_FLEXY_WITHDRAWAL

fun User.getTotalReferrals(): Int = directReferrals.size

fun User.isEligibleForDailyContest(): Boolean = dailyAdsWatched >= SbaroApplication.DAILY_CONTEST_ADS

fun User.isEligibleForWeeklyContest(): Boolean = weeklyAdsWatched >= SbaroApplication.WEEKLY_CONTEST_ADS

fun User.isEligibleForMonthlyContest(): Boolean = monthlyAdsWatched >= SbaroApplication.MONTHLY_CONTEST_ADS

fun User.getDailyProgress(): Float = (dailyAdsWatched.toFloat() / SbaroApplication.DAILY_CONTEST_ADS).coerceAtMost(1f)

fun User.getWeeklyProgress(): Float = (weeklyAdsWatched.toFloat() / SbaroApplication.WEEKLY_CONTEST_ADS).coerceAtMost(1f)

fun User.getMonthlyProgress(): Float = (monthlyAdsWatched.toFloat() / SbaroApplication.MONTHLY_CONTEST_ADS).coerceAtMost(1f)