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

@Singleton
class NotificationManager @Inject constructor(
    private val context: Context
) {
    
    companion object {
        private const val WITHDRAWAL_CHANNEL_ID = "withdrawal_notifications"
        private const val CONTEST_CHANNEL_ID = "contest_notifications"
        private const val GENERAL_CHANNEL_ID = "general_notifications"
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
            
            notificationManager.createNotificationChannels(listOf(
                withdrawalChannel,
                contestChannel,
                generalChannel
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
}