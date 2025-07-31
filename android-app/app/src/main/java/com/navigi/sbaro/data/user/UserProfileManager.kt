package com.navigi.sbaro.data.user

import android.content.Context
import android.graphics.*
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.security.MessageDigest
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.math.absoluteValue

data class UserProfile(
    val userId: String,
    val userName: String,
    val email: String,
    val avatarType: AvatarType,
    val avatarColor: Int,
    val joinDate: Long,
    val lastSeen: Long,
    val deviceId: String,
    val isVerified: Boolean = false
)

enum class AvatarType {
    INITIAL,    // First letter of name
    EMOJI,      // Random emoji
    PATTERN,    // Geometric pattern
    CUSTOM      // User uploaded (future)
}

@Singleton
class UserProfileManager @Inject constructor(
    private val context: Context
) {
    
    companion object {
        private const val AVATAR_SIZE = 120 // dp
        private val AVATAR_COLORS = listOf(
            Color(0xFF3498DB), // Blue
            Color(0xFF2ECC71), // Green
            Color(0xFF9B59B6), // Purple
            Color(0xFFE74C3C), // Red
            Color(0xFFF39C12), // Orange
            Color(0xFF1ABC9C), // Teal
            Color(0xFFE67E22), // Dark Orange
            Color(0xFF34495E), // Dark Blue Gray
            Color(0xFF8E44AD), // Dark Purple
            Color(0xFF27AE60)  // Dark Green
        )
        
        private val AVATAR_EMOJIS = listOf(
            "😀", "😎", "🤖", "👾", "🦄", "🐱", "🐸", "🐧", "🦊", "🐨",
            "🌟", "⚡", "🔥", "💎", "🎯", "🎮", "🎲", "🎪", "🎨", "🎭"
        )
    }
    
    fun generateUserProfile(
        userId: String,
        userName: String,
        email: String,
        deviceId: String
    ): UserProfile {
        val avatarType = AvatarType.INITIAL // Default to initial
        val avatarColor = generateColorFromId(userId)
        
        return UserProfile(
            userId = userId,
            userName = userName.ifEmpty { generateDefaultUsername(userId) },
            email = email,
            avatarType = avatarType,
            avatarColor = avatarColor.toArgb(),
            joinDate = System.currentTimeMillis(),
            lastSeen = System.currentTimeMillis(),
            deviceId = deviceId,
            isVerified = false
        )
    }
    
    fun generateAvatarDrawable(profile: UserProfile): Drawable {
        val bitmap = when (profile.avatarType) {
            AvatarType.INITIAL -> generateInitialAvatar(profile)
            AvatarType.EMOJI -> generateEmojiAvatar(profile)
            AvatarType.PATTERN -> generatePatternAvatar(profile)
            AvatarType.CUSTOM -> generateInitialAvatar(profile) // Fallback
        }
        
        return BitmapDrawable(context.resources, bitmap)
    }
    
    private fun generateInitialAvatar(profile: UserProfile): Bitmap {
        val size = (AVATAR_SIZE * context.resources.displayMetrics.density).toInt()
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        
        // Background circle
        val paint = Paint().apply {
            isAntiAlias = true
            color = profile.avatarColor
        }
        
        val radius = size / 2f
        canvas.drawCircle(radius, radius, radius, paint)
        
        // Text (first letter)
        val initial = profile.userName.firstOrNull()?.uppercaseChar()?.toString() ?: "U"
        val textPaint = Paint().apply {
            isAntiAlias = true
            color = android.graphics.Color.WHITE
            textSize = size * 0.4f
            typeface = Typeface.DEFAULT_BOLD
            textAlign = Paint.Align.CENTER
        }
        
        val textBounds = Rect()
        textPaint.getTextBounds(initial, 0, initial.length, textBounds)
        val textY = radius + textBounds.height() / 2f
        
        canvas.drawText(initial, radius, textY, textPaint)
        
        return bitmap
    }
    
    private fun generateEmojiAvatar(profile: UserProfile): Bitmap {
        val size = (AVATAR_SIZE * context.resources.displayMetrics.density).toInt()
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        
        // Background circle
        val paint = Paint().apply {
            isAntiAlias = true
            color = profile.avatarColor
        }
        
        val radius = size / 2f
        canvas.drawCircle(radius, radius, radius, paint)
        
        // Emoji (selected based on user ID)
        val emojiIndex = profile.userId.hashCode().absoluteValue % AVATAR_EMOJIS.size
        val emoji = AVATAR_EMOJIS[emojiIndex]
        
        val textPaint = Paint().apply {
            isAntiAlias = true
            textSize = size * 0.5f
            textAlign = Paint.Align.CENTER
        }
        
        val textBounds = Rect()
        textPaint.getTextBounds(emoji, 0, emoji.length, textBounds)
        val textY = radius + textBounds.height() / 2f
        
        canvas.drawText(emoji, radius, textY, textPaint)
        
        return bitmap
    }
    
    private fun generatePatternAvatar(profile: UserProfile): Bitmap {
        val size = (AVATAR_SIZE * context.resources.displayMetrics.density).toInt()
        val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
        val canvas = Canvas(bitmap)
        
        // Background circle
        val paint = Paint().apply {
            isAntiAlias = true
            color = profile.avatarColor
        }
        
        val radius = size / 2f
        canvas.drawCircle(radius, radius, radius, paint)
        
        // Geometric pattern based on user ID
        val patternPaint = Paint().apply {
            isAntiAlias = true
            color = android.graphics.Color.WHITE
            alpha = 180
        }
        
        val hash = profile.userId.hashCode()
        val patternType = hash.absoluteValue % 3
        
        when (patternType) {
            0 -> {
                // Diamond pattern
                val path = Path()
                path.moveTo(radius, radius * 0.3f)
                path.lineTo(radius * 1.4f, radius)
                path.lineTo(radius, radius * 1.7f)
                path.lineTo(radius * 0.6f, radius)
                path.close()
                canvas.drawPath(path, patternPaint)
            }
            1 -> {
                // Star pattern
                drawStar(canvas, radius, radius, radius * 0.6f, patternPaint)
            }
            2 -> {
                // Hexagon pattern
                drawHexagon(canvas, radius, radius, radius * 0.7f, patternPaint)
            }
        }
        
        return bitmap
    }
    
    private fun drawStar(canvas: Canvas, centerX: Float, centerY: Float, radius: Float, paint: Paint) {
        val path = Path()
        val points = 5
        val angle = Math.PI / points
        
        path.moveTo(
            (centerX + radius * Math.cos(0.0)).toFloat(),
            (centerY + radius * Math.sin(0.0)).toFloat()
        )
        
        for (i in 1 until points * 2) {
            val r = if (i % 2 == 0) radius else radius * 0.5f
            path.lineTo(
                (centerX + r * Math.cos(i * angle)).toFloat(),
                (centerY + r * Math.sin(i * angle)).toFloat()
            )
        }
        
        path.close()
        canvas.drawPath(path, paint)
    }
    
    private fun drawHexagon(canvas: Canvas, centerX: Float, centerY: Float, radius: Float, paint: Paint) {
        val path = Path()
        val points = 6
        val angle = 2 * Math.PI / points
        
        path.moveTo(
            (centerX + radius * Math.cos(0.0)).toFloat(),
            (centerY + radius * Math.sin(0.0)).toFloat()
        )
        
        for (i in 1 until points) {
            path.lineTo(
                (centerX + radius * Math.cos(i * angle)).toFloat(),
                (centerY + radius * Math.sin(i * angle)).toFloat()
            )
        }
        
        path.close()
        canvas.drawPath(path, paint)
    }
    
    private fun generateColorFromId(userId: String): Color {
        val hash = userId.hashCode().absoluteValue
        return AVATAR_COLORS[hash % AVATAR_COLORS.size]
    }
    
    private fun generateDefaultUsername(userId: String): String {
        val adjectives = listOf("Cool", "Smart", "Lucky", "Brave", "Swift", "Bright", "Bold", "Epic")
        val nouns = listOf("Player", "Gamer", "User", "Hero", "Star", "Pro", "Legend", "Champion")
        
        val hash = userId.hashCode().absoluteValue
        val adjective = adjectives[hash % adjectives.size]
        val noun = nouns[(hash / adjectives.size) % nouns.size]
        val number = (hash % 999) + 1
        
        return "$adjective$noun$number"
    }
    
    fun updateProfile(
        profile: UserProfile,
        newUserName: String? = null,
        newAvatarType: AvatarType? = null
    ): UserProfile {
        return profile.copy(
            userName = newUserName ?: profile.userName,
            avatarType = newAvatarType ?: profile.avatarType,
            lastSeen = System.currentTimeMillis()
        )
    }
    
    fun generateUserCode(profile: UserProfile): String {
        return "USR-${profile.userId.take(4).uppercase()}-${profile.userName.take(3).uppercase()}"
    }
    
    // Security functions
    fun generateDeviceFingerprint(context: Context): String {
        val deviceInfo = "${android.os.Build.MODEL}-${android.os.Build.MANUFACTURER}-${android.os.Build.VERSION.SDK_INT}"
        return hashString(deviceInfo).take(16)
    }
    
    fun detectVpn(): Boolean {
        // Simplified VPN detection (would use more sophisticated methods in production)
        return false // Placeholder
    }
    
    fun validateDeviceLimit(userId: String, deviceId: String, maxDevices: Int = 3): Boolean {
        // Simplified device limit check (would use server-side tracking in production)
        return true // Placeholder
    }
    
    private fun hashString(input: String): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(input.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }
    }
}