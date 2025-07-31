package com.navigi.sbaro.data.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import com.navigi.sbaro.R
import javax.inject.Inject
import javax.inject.Singleton

data class WithdrawalNotification(
    val userId: String,
    val amount: Int,
    val method: String,
    val status: String, // "approved", "rejected", "processing"
    val transactionId: String = "",
    val message: String = ""
)

data class CompetitionNotification(
    val competitionType: String, // "daily", "weekly", "monthly", "vip"
    val prize: Int,
    val winner: String,
    val position: Int,
    val totalParticipants: Int,
    val drawTime: Long
)

data class SystemNotification(
    val type: String, // "streak", "peak_hour", "vip_expired", "security", "referral"
    val title: String,
    val message: String,
    val actionUrl: String? = null,
    val priority: Int = 0 // 0=low, 1=medium, 2=high
)

@Singleton
class NotificationManager @Inject constructor(
    private val context: Context
) {
    
    companion object {
        private const val WITHDRAWAL_CHANNEL_ID = "withdrawal_notifications"
        private const val CONTEST_CHANNEL_ID = "contest_notifications"
        private const val GENERAL_CHANNEL_ID = "general_notifications"
        private const val COMPETITION_CHANNEL_ID = "competition_notifications"
        private const val SYSTEM_CHANNEL_ID = "system_notifications"
        private const val VIP_CHANNEL_ID = "vip_notifications"
    }
    
    init {
        createNotificationChannels()
    }
    
    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            
            // Withdrawal notifications channel
            val withdrawalChannel = NotificationChannel(
                WITHDRAWAL_CHANNEL_ID,
                "Withdrawal Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Notifications about withdrawal status updates"
                enableVibration(true)
                enableLights(true)
            }
            
            // Contest notifications channel
            val contestChannel = NotificationChannel(
                CONTEST_CHANNEL_ID,
                "Contest Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Notifications about contest results and updates"
                enableVibration(true)
            }
            
            // General notifications channel
            val generalChannel = NotificationChannel(
                GENERAL_CHANNEL_ID,
                "General Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "General app notifications"
            }
            
            // Competition notifications channel
            val competitionChannel = NotificationChannel(
                COMPETITION_CHANNEL_ID,
                "Competition Results",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Competition draw results and winners"
                enableVibration(true)
                enableLights(true)
            }
            
            // System notifications channel
            val systemChannel = NotificationChannel(
                SYSTEM_CHANNEL_ID,
                "System Updates",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "System updates, streaks, and bonuses"
                enableVibration(true)
            }
            
            // VIP notifications channel
            val vipChannel = NotificationChannel(
                VIP_CHANNEL_ID,
                "VIP Notifications",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "VIP-exclusive notifications and updates"
                enableVibration(true)
                enableLights(true)
            }
            
            notificationManager.createNotificationChannels(listOf(
                withdrawalChannel,
                contestChannel,
                generalChannel,
                competitionChannel,
                systemChannel,
                vipChannel
            ))
        }
    }
    
    fun showWithdrawalNotification(withdrawal: WithdrawalNotification, isArabic: Boolean = false) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        val (title, message) = when (withdrawal.status) {
            "approved" -> {
                if (isArabic) {
                    "تم قبول طلب السحب" to "تم قبول طلب سحب ${withdrawal.amount} نقطة عبر ${withdrawal.method}. معرف المعاملة: ${withdrawal.transactionId}"
                } else {
                    "Withdrawal Approved" to "Your withdrawal of ${withdrawal.amount} points via ${withdrawal.method} has been approved. Transaction ID: ${withdrawal.transactionId}"
                }
            }
            "rejected" -> {
                if (isArabic) {
                    "تم رفض طلب السحب" to "تم رفض طلب سحب ${withdrawal.amount} نقطة. السبب: ${withdrawal.message}"
                } else {
                    "Withdrawal Rejected" to "Your withdrawal request of ${withdrawal.amount} points was rejected. Reason: ${withdrawal.message}"
                }
            }
            "processing" -> {
                if (isArabic) {
                    "جاري معالجة السحب" to "جاري معالجة طلب سحب ${withdrawal.amount} نقطة عبر ${withdrawal.method}. سيتم الإشعار عند الانتهاء."
                } else {
                    "Withdrawal Processing" to "Your withdrawal of ${withdrawal.amount} points via ${withdrawal.method} is being processed. You'll be notified when complete."
                }
            }
            else -> {
                if (isArabic) {
                    "تحديث طلب السحب" to withdrawal.message
                } else {
                    "Withdrawal Update" to withdrawal.message
                }
            }
        }
        
        val notification = NotificationCompat.Builder(context, WITHDRAWAL_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()
            
        notificationManager.notify(withdrawal.userId.hashCode(), notification)
    }
    
    fun showContestNotification(
        title: String,
        message: String,
        isWinner: Boolean = false,
        isArabic: Boolean = false
    ) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        val notification = NotificationCompat.Builder(context, CONTEST_CHANNEL_ID)
            .setSmallIcon(if (isWinner) R.drawable.ic_trophy else R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()
            
        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
    
    fun showGeneralNotification(
        title: String,
        message: String,
        isArabic: Boolean = false
    ) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        val notification = NotificationCompat.Builder(context, GENERAL_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .build()
            
        notificationManager.notify(System.currentTimeMillis().toInt(), notification)
    }
    
    // Test function to simulate admin approval
    fun simulateWithdrawalApproval(
        userId: String,
        amount: Int,
        method: String,
        isArabic: Boolean = false
    ) {
        // Simulate a delay for processing
        val transactionId = "TXN${System.currentTimeMillis()}"
        
        val approvedWithdrawal = WithdrawalNotification(
            userId = userId,
            amount = amount,
            method = method,
            status = "approved",
            transactionId = transactionId
        )
        
        showWithdrawalNotification(approvedWithdrawal, isArabic)
    }
    
    fun showCompetitionResult(competition: CompetitionNotification, isArabic: Boolean = false) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        val (title, message) = if (competition.position <= getWinnerCount(competition.competitionType)) {
            // Winner notification
            if (isArabic) {
                "🎉 تهانينا! فزت في المسابقة!" to "فزت بالمركز ${competition.position} في مسابقة ${getCompetitionName(competition.competitionType, isArabic)} وحصلت على ${competition.prize} نقطة!"
            } else {
                "🎉 Congratulations! You Won!" to "You placed #${competition.position} in ${getCompetitionName(competition.competitionType, isArabic)} competition and earned ${competition.prize} points!"
            }
        } else {
            // Participation notification
            if (isArabic) {
                "مسابقة ${getCompetitionName(competition.competitionType, isArabic)}" to "انتهت المسابقة. لم تكن من الفائزين هذه المرة، ولكن استمر في المشاركة!"
            } else {
                "${getCompetitionName(competition.competitionType, isArabic)} Competition" to "Competition ended. You didn't win this time, but keep participating!"
            }
        }
        
        val notification = NotificationCompat.Builder(context, COMPETITION_CHANNEL_ID)
            .setSmallIcon(if (competition.position <= getWinnerCount(competition.competitionType)) R.drawable.ic_trophy else R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(message))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()
            
        notificationManager.notify(competition.hashCode(), notification)
    }
    
    fun showSystemNotification(system: SystemNotification, isArabic: Boolean = false) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        val channelId = when (system.type) {
            "vip_expired", "vip_reminder" -> VIP_CHANNEL_ID
            "security", "device_limit" -> SYSTEM_CHANNEL_ID
            else -> GENERAL_CHANNEL_ID
        }
        
        val priority = when (system.priority) {
            2 -> NotificationCompat.PRIORITY_HIGH
            1 -> NotificationCompat.PRIORITY_DEFAULT
            else -> NotificationCompat.PRIORITY_LOW
        }
        
        val icon = when (system.type) {
            "streak" -> R.drawable.ic_check_circle
            "peak_hour" -> R.drawable.ic_visibility
            "vip_expired" -> R.drawable.ic_error
            "security" -> R.drawable.ic_error
            "referral" -> R.drawable.ic_people
            else -> R.drawable.ic_notification
        }
        
        val notification = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(icon)
            .setContentTitle(system.title)
            .setContentText(system.message)
            .setStyle(NotificationCompat.BigTextStyle().bigText(system.message))
            .setPriority(priority)
            .setAutoCancel(true)
            .build()
            
        notificationManager.notify(system.hashCode(), notification)
    }
    
    fun showStreakNotification(streakDays: Int, isArabic: Boolean = false) {
        val (title, message) = if (isArabic) {
            "🔥 سلسلة نشاط!" to "أكملت ${streakDays} أيام متتالية! احصل على نقاط إضافية لاستمرار النشاط."
        } else {
            "🔥 Streak Active!" to "You've completed $streakDays consecutive days! Earn bonus points for continued activity."
        }
        
        val systemNotification = SystemNotification(
            type = "streak",
            title = title,
            message = message,
            priority = 1
        )
        
        showSystemNotification(systemNotification, isArabic)
    }
    
    fun showPeakHourNotification(isArabic: Boolean = false) {
        val (title, message) = if (isArabic) {
            "⚡ ساعات الذروة!" to "ساعات الذروة نشطة الآن (8-11 مساءً)! احصل على +30% نقاط إضافية من مشاهدة الإعلانات."
        } else {
            "⚡ Peak Hours Active!" to "Peak hours are now active (8-11 PM)! Earn +30% bonus points from watching ads."
        }
        
        val systemNotification = SystemNotification(
            type = "peak_hour",
            title = title,
            message = message,
            priority = 1
        )
        
        showSystemNotification(systemNotification, isArabic)
    }
    
    fun showVipExpiryNotification(daysLeft: Int, isArabic: Boolean = false) {
        val (title, message) = if (isArabic) {
            "👑 انتهاء VIP قريبًا" to "ستنتهي عضويتك VIP خلال ${daysLeft} أيام. جدد اشتراكك لمواصلة الاستفادة من المزايا الحصرية."
        } else {
            "👑 VIP Expiring Soon" to "Your VIP membership expires in $daysLeft days. Renew your subscription to continue enjoying exclusive benefits."
        }
        
        val systemNotification = SystemNotification(
            type = "vip_expired",
            title = title,
            message = message,
            priority = 2
        )
        
        showSystemNotification(systemNotification, isArabic)
    }
    
    fun showReferralNotification(referralName: String, bonus: Int, isArabic: Boolean = false) {
        val (title, message) = if (isArabic) {
            "👥 مكافأة إحالة!" to "انضم ${referralName} باستخدام كودك! حصلت على ${bonus} نقطة كمكافأة إحالة."
        } else {
            "👥 Referral Bonus!" to "$referralName joined using your code! You earned $bonus points as referral bonus."
        }
        
        val systemNotification = SystemNotification(
            type = "referral",
            title = title,
            message = message,
            priority = 1
        )
        
        showSystemNotification(systemNotification, isArabic)
    }
    
    private fun getCompetitionName(type: String, isArabic: Boolean): String {
        return when (type) {
            "daily" -> if (isArabic) "اليومية" else "Daily"
            "weekly" -> if (isArabic) "الأسبوعية" else "Weekly"
            "monthly" -> if (isArabic) "الشهرية" else "Monthly"
            "vip" -> if (isArabic) "VIP الحصرية" else "VIP Exclusive"
            else -> if (isArabic) "المسابقة" else "Competition"
        }
    }
    
    private fun getWinnerCount(competitionType: String): Int {
        return when (competitionType) {
            "daily" -> 1
            "weekly" -> 5
            "monthly" -> 10
            "vip" -> 5
            else -> 1
        }
    }
}