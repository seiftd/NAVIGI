package com.navigi.sbaro.data.firebase

import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.media.RingtoneManager
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.navigi.sbaro.MainActivity
import com.navigi.sbaro.R
import com.navigi.sbaro.domain.model.NotificationType
import dagger.hilt.android.AndroidEntryPoint
import kotlin.random.Random

@AndroidEntryPoint
class SbaroFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "SbaroFCMService"
    }

    override fun onNewToken(token: String) {
        Log.d(TAG, "Refreshed token: $token")
        
        // If you want to send messages to this application instance or
        // manage this apps subscriptions on the server side, send the
        // Instance ID token to your app server.
        sendRegistrationToServer(token)
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        // Handle FCM messages here
        Log.d(TAG, "From: ${remoteMessage.from}")

        // Check if message contains a data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            handleDataMessage(remoteMessage.data)
        }

        // Check if message contains a notification payload
        remoteMessage.notification?.let {
            Log.d(TAG, "Message Notification Body: ${it.body}")
            sendNotification(
                title = it.title ?: "",
                body = it.body ?: "",
                data = remoteMessage.data
            )
        }
    }

    private fun handleDataMessage(data: Map<String, String>) {
        val notificationType = data["type"]?.let { NotificationType.valueOf(it) }
        val title = data["title"] ?: ""
        val body = data["body"] ?: ""
        
        when (notificationType) {
            NotificationType.CONTEST_WINNER -> {
                sendContestWinnerNotification(title, body, data)
            }
            NotificationType.WITHDRAWAL_APPROVED -> {
                sendWithdrawalNotification(title, body, data, approved = true)
            }
            NotificationType.WITHDRAWAL_REJECTED -> {
                sendWithdrawalNotification(title, body, data, approved = false)
            }
            NotificationType.GIFT_CARD_READY -> {
                sendGiftCardNotification(title, body, data)
            }
            NotificationType.REFERRAL_EARNING -> {
                sendReferralNotification(title, body, data)
            }
            else -> {
                sendNotification(title, body, data)
            }
        }
    }

    private fun sendContestWinnerNotification(
        title: String,
        body: String,
        data: Map<String, String>
    ) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("navigate_to", "contests")
            putExtra("contest_id", data["contest_id"])
        }
        
        sendNotification(
            title = title,
            body = body,
            intent = intent,
            channelId = "contest_notifications",
            icon = R.drawable.ic_trophy
        )
    }

    private fun sendWithdrawalNotification(
        title: String,
        body: String,
        data: Map<String, String>,
        approved: Boolean
    ) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("navigate_to", "withdraw")
            putExtra("withdrawal_id", data["withdrawal_id"])
        }
        
        sendNotification(
            title = title,
            body = body,
            intent = intent,
            channelId = "withdrawal_notifications",
            icon = if (approved) R.drawable.ic_check_circle else R.drawable.ic_error
        )
    }

    private fun sendGiftCardNotification(
        title: String,
        body: String,
        data: Map<String, String>
    ) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("navigate_to", "withdraw")
            putExtra("gift_card_code", data["card_code"])
            putExtra("gift_card_pin", data["card_pin"])
        }
        
        sendNotification(
            title = title,
            body = body,
            intent = intent,
            channelId = "withdrawal_notifications",
            icon = R.drawable.ic_gift_card
        )
    }

    private fun sendReferralNotification(
        title: String,
        body: String,
        data: Map<String, String>
    ) {
        val intent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            putExtra("navigate_to", "referrals")
        }
        
        sendNotification(
            title = title,
            body = body,
            intent = intent,
            channelId = "referral_notifications",
            icon = R.drawable.ic_people
        )
    }

    private fun sendNotification(
        title: String,
        body: String,
        data: Map<String, String> = emptyMap(),
        intent: Intent = Intent(this, MainActivity::class.java),
        channelId: String = getString(R.string.default_notification_channel_id),
        icon: Int = R.drawable.ic_notification
    ) {
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        
        val pendingIntent = PendingIntent.getActivity(
            this, 
            0, 
            intent,
            PendingIntent.FLAG_ONE_SHOT or PendingIntent.FLAG_IMMUTABLE
        )

        val defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
        val notificationBuilder = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(icon)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setSound(defaultSoundUri)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setVibrate(longArrayOf(1000, 1000, 1000, 1000, 1000))
            .setColor(getColor(R.color.primary))

        // Add action buttons for specific notification types
        data["type"]?.let { type ->
            when (NotificationType.valueOf(type)) {
                NotificationType.GIFT_CARD_READY -> {
                    val viewCardIntent = Intent(this, MainActivity::class.java).apply {
                        putExtra("navigate_to", "gift_card_details")
                        putExtra("card_code", data["card_code"])
                    }
                    val viewCardPendingIntent = PendingIntent.getActivity(
                        this, 1, viewCardIntent, PendingIntent.FLAG_IMMUTABLE
                    )
                    notificationBuilder.addAction(
                        R.drawable.ic_visibility,
                        "View Card",
                        viewCardPendingIntent
                    )
                }
                NotificationType.WITHDRAWAL_APPROVED -> {
                    // Add action to view withdrawal details
                }
                else -> { /* No specific actions */ }
            }
        }

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(Random.nextInt(), notificationBuilder.build())
    }

    private fun sendRegistrationToServer(token: String) {
        // TODO: Implement this method to send token to your backend server
        Log.d(TAG, "sendRegistrationTokenToServer($token)")
        
        // This is where you would typically:
        // 1. Send the token to your backend server
        // 2. Associate it with the current user
        // 3. Store it in your database for future use
    }
}