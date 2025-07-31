package com.navigi.sbaro.presentation.ui.screens.main

import android.app.Activity
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.draw.clip
import com.navigi.sbaro.data.ads.AdMobManager
import com.navigi.sbaro.data.notification.NotificationManager
import com.navigi.sbaro.data.repository.UserRepository
import com.navigi.sbaro.data.repository.UserStats
import com.navigi.sbaro.data.repository.VipTier

// COMPLETE PROFILE SCREEN WITH AVATARS AND VIP SYSTEM
@Composable
fun CompleteProfileScreen(
    userRepository: UserRepository,
    notificationManager: NotificationManager,
    isArabic: Boolean,
    onNavigateToAuth: () -> Unit
) {
    val userStats by userRepository.userStats.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            // USER AVATAR AND INFO CARD
            UserAvatarCard(
                userStats = userStats,
                isArabic = isArabic
            )
        }
        
        item {
            // VIP SUBSCRIPTION CARD WITH ALL TIERS
            VipSubscriptionCard(
                userRepository = userRepository,
                userStats = userStats,
                isArabic = isArabic
            )
        }
        
        item {
            // EARNINGS STATS CARD
            EarningsStatsCard(
                userStats = userStats,
                isArabic = isArabic
            )
        }
        
        item {
            // REFERRAL INFO CARD
            ReferralInfoCard(
                userStats = userStats,
                isArabic = isArabic
            )
        }
        
        item {
            // SETTINGS AND LOGOUT
            ProfileSettingsCard(
                onNavigateToAuth = onNavigateToAuth,
                isArabic = isArabic
            )
        }
    }
}

// USER AVATAR CARD WITH DYNAMIC AVATAR GENERATION
@Composable
private fun UserAvatarCard(
    userStats: UserStats,
    isArabic: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // DYNAMIC USER AVATAR
            Box(
                modifier = Modifier
                    .size(120.dp)
                    .background(
                        brush = Brush.radialGradient(
                            colors = listOf(
                                Color(0xFF3498DB),
                                Color(0xFF2980B9),
                                Color(0xFF1F618D)
                            )
                        ),
                        shape = CircleShape
                    )
                    .border(4.dp, Color(0xFFFFD700), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                // Generate avatar letter from referral code
                val avatarLetter = userStats.referralCode.takeLast(4).firstOrNull()?.uppercaseChar() ?: 'U'
                Text(
                    text = avatarLetter.toString(),
                    style = MaterialTheme.typography.headlineLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = sp(48)
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // USERNAME WITH GENERATED NAME
            Text(
                text = "SBARO${userStats.referralCode.takeLast(4)}",
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            
            // VIP STATUS BADGE
            if (userStats.vipTier != VipTier.NONE) {
                Spacer(modifier = Modifier.height(8.dp))
                
                Surface(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                    shape = RoundedCornerShape(20.dp),
                    color = Color(0xFFFFD700)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "👑",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "${userStats.vipTier.name} VIP",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.Black
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // TOTAL POINTS DISPLAY
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${userStats.totalPoints}",
                    style = MaterialTheme.typography.headlineLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "SBARO",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Medium,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                if (userStats.vipTier != VipTier.NONE) {
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "👑",
                        style = MaterialTheme.typography.headlineMedium
                    )
                }
            }
        }
    }
}

// VIP SUBSCRIPTION CARD WITH ALL TIERS
@Composable
private fun VipSubscriptionCard(
    userRepository: UserRepository,
    userStats: UserStats,
    isArabic: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (userStats.vipTier != VipTier.NONE) 
                Color(0xFF4CAF50) else Color(0xFFFFD700)
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // CROWN ICON
            Text(
                text = "👑",
                style = MaterialTheme.typography.headlineLarge,
                fontSize = sp(64)
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            if (userStats.vipTier != VipTier.NONE) {
                // CURRENT VIP STATUS
                Text(
                    text = if (isArabic) "أنت عضو VIP!" else "You are VIP Member!",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                
                Text(
                    text = "${userRepository.getRemainingVipDays()} ${if (isArabic) "أيام متبقية" else "days remaining"}",
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // CURRENT VIP BENEFITS
                VipBenefitsDisplay(userStats, isArabic, true)
                
            } else {
                // VIP UPGRADE OPTIONS
                Text(
                    text = if (isArabic) "ترقى إلى VIP واستمتع بالمزايا الحصرية" else "Upgrade to VIP & Enjoy Exclusive Benefits",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // ALL VIP TIER OPTIONS
                VipTierOptions(userRepository, isArabic)
            }
        }
    }
}

// VIP TIER OPTIONS WITH PRICING
@Composable
private fun VipTierOptions(
    userRepository: UserRepository,
    isArabic: Boolean
) {
    val vipTiers = listOf(
        VipTierInfo(
            tier = VipTier.KING,
            price = "$2.50",
            period = "month",
            benefits = listOf(
                "16 ads/day (vs 12 regular)",
                "1 minute cooldown (vs 3 min)",
                "10 mining points daily",
                "King tier badge"
            ),
            color = Color(0xFF3498DB)
        ),
        VipTierInfo(
            tier = VipTier.EMPEROR,
            price = "$9.00", 
            period = "month",
            benefits = listOf(
                "20 ads/day maximum",
                "1 minute cooldown",
                "15 mining points daily",
                "VIP-only competitions",
                "Emperor tier badge"
            ),
            color = Color(0xFF9B59B6)
        ),
        VipTierInfo(
            tier = VipTier.LORD,
            price = "$25.00",
            period = "month", 
            benefits = listOf(
                "25 ads/day maximum",
                "1 minute cooldown",
                "20 mining points daily",
                "Priority withdrawals",
                "Exclusive Lord competitions",
                "Lord tier badge"
            ),
            color = Color(0xFFE74C3C)
        )
    )
    
    Column(
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        vipTiers.forEach { tierInfo ->
            VipTierCard(
                tierInfo = tierInfo,
                onUpgrade = { 
                    // Activate VIP (demo)
                    userRepository.activateVip()
                },
                isArabic = isArabic
            )
        }
        
        // PAYMENT INFO
        Spacer(modifier = Modifier.height(8.dp))
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            color = Color.White.copy(alpha = 0.9f)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = if (isArabic) "الدفع عبر TRON (TRC20)" else "Payment via TRON (TRC20)",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX",
                    style = MaterialTheme.typography.bodyMedium,
                    fontFamily = FontFamily.Monospace,
                    color = Color.Black,
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}

data class VipTierInfo(
    val tier: VipTier,
    val price: String,
    val period: String,
    val benefits: List<String>,
    val color: Color
)

// VIP TIER CARD WITH DETAILED BENEFITS
@Composable
private fun VipTierCard(
    tierInfo: VipTierInfo,
    onUpgrade: () -> Unit,
    isArabic: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.95f)
        ),
        border = BorderStroke(2.dp, tierInfo.color)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // TIER HEADER
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "${tierInfo.tier.name} TIER",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = tierInfo.color
                    )
                    Text(
                        text = "Premium Features",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                }
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = tierInfo.price,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF2ECC71)
                    )
                    Text(
                        text = "/${tierInfo.period}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // BENEFITS LIST
            tierInfo.benefits.forEach { benefit ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 4.dp)
                ) {
                    Surface(
                        shape = CircleShape,
                        color = tierInfo.color,
                        modifier = Modifier.size(20.dp)
                    ) {
                        Box(
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "✓",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = benefit,
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Black
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // UPGRADE BUTTON
            Button(
                onClick = onUpgrade,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = tierInfo.color
                ),
                shape = RoundedCornerShape(8.dp)
            ) {
                Text(
                    text = if (isArabic) "ترقية الآن (تجريبي)" else "Upgrade Now (Demo)",
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// CURRENT VIP BENEFITS DISPLAY
@Composable
private fun VipBenefitsDisplay(
    userStats: UserStats,
    isArabic: Boolean,
    isCurrentTier: Boolean
) {
    val benefits = when (userStats.vipTier) {
        VipTier.KING -> listOf(
            "✅ 16 ads per day",
            "✅ 1 minute cooldown",
            "✅ 10 mining points daily",
            "✅ King tier badge"
        )
        VipTier.EMPEROR -> listOf(
            "✅ 20 ads per day", 
            "✅ 1 minute cooldown",
            "✅ 15 mining points daily",
            "✅ VIP competitions access",
            "✅ Emperor tier badge"
        )
        VipTier.LORD -> listOf(
            "✅ 25 ads per day",
            "✅ 1 minute cooldown", 
            "✅ 20 mining points daily",
            "✅ Priority withdrawals",
            "✅ Exclusive Lord competitions",
            "✅ Lord tier badge"
        )
        else -> emptyList()
    }
    
    Surface(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        color = Color.White.copy(alpha = 0.2f)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = if (isArabic) "مزاياك الحالية:" else "Your Current Benefits:",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(8.dp))
            
            benefits.forEach { benefit ->
                Text(
                    text = benefit,
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White,
                    modifier = Modifier.padding(vertical = 2.dp)
                )
            }
        }
    }
}

// EARNINGS STATS CARD WITH DETAILED METRICS
@Composable
private fun EarningsStatsCard(
    userStats: UserStats,
    isArabic: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = if (isArabic) "📊 إحصائيات الأرباح" else "📊 Earnings Statistics",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // STATS GRID
            val stats = listOf(
                StatData("💰", "Total Points", "${userStats.totalPoints}", MaterialTheme.colorScheme.primary),
                StatData("📅", "Today's Points", "${userStats.todayPoints}", Color(0xFF2ECC71)),
                StatData("👀", "Ads Watched", "${userStats.adsWatched}", Color(0xFF3498DB)),
                StatData("👥", "Referral Points", "${userStats.referralPoints}", Color(0xFF9B59B6)),
                StatData("🏆", "Contests Won", "${userStats.contestsWon}", Color(0xFFE74C3C)),
                StatData("🔥", "Streak Days", "${userStats.streakDays}", Color(0xFFFF6B35))
            )
            
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.height(240.dp)
            ) {
                items(stats) { stat ->
                    StatCard(stat = stat)
                }
            }
        }
    }
}

data class StatData(
    val emoji: String,
    val label: String,
    val value: String,
    val color: Color
)

@Composable
private fun StatCard(stat: StatData) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(100.dp),
        shape = RoundedCornerShape(12.dp),
        color = stat.color.copy(alpha = 0.1f),
        border = BorderStroke(1.dp, stat.color.copy(alpha = 0.3f))
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = stat.emoji,
                style = MaterialTheme.typography.headlineSmall
            )
            Text(
                text = stat.value,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = stat.color
            )
            Text(
                text = stat.label,
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center,
                maxLines = 1,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// REFERRAL INFO CARD WITH DETAILED STATS
@Composable
private fun ReferralInfoCard(
    userStats: UserStats,
    isArabic: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = if (isArabic) "👥 نظام الإحالة" else "👥 Referral System",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // REFERRAL CODE DISPLAY
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = MaterialTheme.colorScheme.surface,
                border = BorderStroke(2.dp, MaterialTheme.colorScheme.primary)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = if (isArabic) "كود الإحالة الخاص بك:" else "Your Referral Code:",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Medium
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = userStats.referralCode,
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                        fontFamily = FontFamily.Monospace
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = if (isArabic) "شارك هذا الكود مع أصدقائك" else "Share this code with friends",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // REFERRAL STATS
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                ReferralStatItem(
                    value = "${userStats.referredUsers.size}",
                    label = if (isArabic) "المُحالون" else "Referred Users",
                    color = Color(0xFF3498DB)
                )
                
                ReferralStatItem(
                    value = "${userStats.level1Earnings}",
                    label = if (isArabic) "أرباح الإحالة" else "Referral Earnings",
                    color = Color(0xFF2ECC71)
                )
                
                ReferralStatItem(
                    value = "${(userStats.level1Earnings * 0.05).toInt()}",
                    label = if (isArabic) "عمولة شهرية" else "Monthly Commission",
                    color = Color(0xFFE74C3C)
                )
            }
        }
    }
}

@Composable
private fun ReferralStatItem(
    value: String,
    label: String,
    color: Color
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = color
        )
        Text(
            text = label,
            style = MaterialTheme.typography.bodySmall,
            textAlign = TextAlign.Center,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

// PROFILE SETTINGS CARD
@Composable
private fun ProfileSettingsCard(
    onNavigateToAuth: () -> Unit,
    isArabic: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = if (isArabic) "⚙️ الإعدادات" else "⚙️ Settings",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // SETTINGS OPTIONS
            ProfileMenuItem(
                icon = "🔔",
                title = if (isArabic) "الإشعارات" else "Notifications",
                subtitle = if (isArabic) "إدارة تفضيلات الإشعارات" else "Manage notification preferences",
                onClick = { /* TODO: Navigate to notifications */ }
            )
            
            ProfileMenuItem(
                icon = "🌍", 
                title = if (isArabic) "اللغة" else "Language",
                subtitle = if (isArabic) "تغيير لغة التطبيق" else "Change app language",
                onClick = { /* TODO: Language picker */ }
            )
            
            ProfileMenuItem(
                icon = "🛡️",
                title = if (isArabic) "الأمان" else "Security",
                subtitle = if (isArabic) "إعدادات الأمان والخصوصية" else "Security and privacy settings",
                onClick = { /* TODO: Security settings */ }
            )
            
            ProfileMenuItem(
                icon = "❓",
                title = if (isArabic) "المساعدة والدعم" else "Help & Support", 
                subtitle = if (isArabic) "احصل على المساعدة" else "Get help and support",
                onClick = { /* TODO: Help screen */ }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // LOGOUT BUTTON
            Button(
                onClick = onNavigateToAuth,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "🚪",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isArabic) "تسجيل الخروج" else "Logout",
                        style = MaterialTheme.typography.titleMedium,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}

@Composable
private fun ProfileMenuItem(
    icon: String,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = icon,
                style = MaterialTheme.typography.headlineSmall
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Text(
                text = "→",
                style = MaterialTheme.typography.titleLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}

// ENHANCED COMPETITIONS SCREEN WITH VISUAL PROGRESS
@Composable
fun CompleteCompetitionsScreen(
    userRepository: UserRepository,
    isArabic: Boolean
) {
    val userStats by userRepository.userStats.collectAsState()
    val context = LocalContext.current
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = if (isArabic) "🏆 المسابقات والجوائز" else "🏆 Competitions & Prizes",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
        // DAILY COMPETITION
        item {
            EnhancedContestCard(
                title = if (isArabic) "مسابقة يومية" else "Daily Competition",
                description = if (isArabic) "شاهد 10 إعلانات واربح جوائز يومية" else "Watch 10 ads and win daily prizes",
                prize = "30% of daily revenue",
                requirement = "10 ads",
                userAds = userStats.dailyCompetitionAds,
                deadline = userStats.dailyContestDeadline,
                isEligible = userStats.isEligibleForDaily,
                providerName = "OfferToro",
                isArabic = isArabic,
                onWatchAd = { 
                    userRepository.addContestAd("daily")
                },
                onJoin = {
                    userRepository.joinContest("daily")
                }
            )
        }
        
        // WEEKLY COMPETITION  
        item {
            EnhancedContestCard(
                title = if (isArabic) "مسابقة أسبوعية" else "Weekly Competition",
                description = if (isArabic) "شاهد 25 إعلان خلال 5 أيام" else "Watch 25 ads over 5 days",
                prize = "10% each to 5 winners",
                requirement = "25 ads",
                userAds = userStats.weeklyCompetitionAds,
                deadline = userStats.weeklyContestDeadline,
                isEligible = userStats.isEligibleForWeekly,
                providerName = "Tapjoy",
                isArabic = isArabic,
                onWatchAd = { 
                    userRepository.addContestAd("weekly")
                },
                onJoin = {
                    userRepository.joinContest("weekly")
                }
            )
        }
        
        // MONTHLY COMPETITION
        item {
            EnhancedContestCard(
                title = if (isArabic) "مسابقة شهرية" else "Monthly Competition", 
                description = if (isArabic) "شاهد 120 إعلان خلال 30 يوم" else "Watch 120 ads over 30 days",
                prize = "5% each to 10 winners",
                requirement = "120 ads",
                userAds = userStats.monthlyCompetitionAds,
                deadline = userStats.monthlyContestDeadline,
                isEligible = userStats.isEligibleForMonthly,
                providerName = "AdGem",
                isArabic = isArabic,
                onWatchAd = { 
                    userRepository.addContestAd("monthly")
                },
                onJoin = {
                    userRepository.joinContest("monthly")
                }
            )
        }
        
        // VIP EXCLUSIVE COMPETITION (only for VIP users)
        if (userStats.vipTier != VipTier.NONE) {
            item {
                EnhancedContestCard(
                    title = if (isArabic) "مسابقة VIP الحصرية" else "VIP Exclusive Competition",
                    description = if (isArabic) "شاهد 30 إعلان خلال 3 أيام (VIP فقط)" else "Watch 30 ads over 3 days (VIP only)",
                    prize = "10% each to 5 VIP winners",
                    requirement = "30 ads",
                    userAds = userStats.vipContestAds,
                    deadline = userStats.vipContestDeadline,
                    isEligible = userStats.isEligibleForVip,
                    providerName = "Premium",
                    isArabic = isArabic,
                    isVipExclusive = true,
                    onWatchAd = { 
                        userRepository.addContestAd("vip")
                    },
                    onJoin = {
                        userRepository.joinContest("vip")
                    }
                )
            }
        }
    }
}

// ENHANCED CONTEST CARD WITH VISUAL PROGRESS
@Composable
private fun EnhancedContestCard(
    title: String,
    description: String,
    prize: String,
    requirement: String,
    userAds: Int,
    deadline: Long,
    isEligible: Boolean,
    providerName: String,
    isArabic: Boolean,
    isVipExclusive: Boolean = false,
    onWatchAd: () -> Unit,
    onJoin: () -> Unit
) {
    val requiredAds = requirement.split(" ")[0].toIntOrNull() ?: 0
    val progress = (userAds.toFloat() / requiredAds.toFloat()).coerceIn(0f, 1f)
    val isCompleted = userAds >= requiredAds
    
    // Calculate time remaining
    var timeRemaining by remember { mutableStateOf("") }
    
    LaunchedEffect(deadline) {
        while (deadline > 0) {
            val currentTime = System.currentTimeMillis()
            if (deadline > currentTime) {
                val diff = deadline - currentTime
                val days = diff / (24 * 60 * 60 * 1000)
                val hours = (diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
                val minutes = (diff % (60 * 60 * 1000)) / (60 * 1000)
                
                timeRemaining = if (days > 0) {
                    if (isArabic) "${days}د ${hours}س" else "${days}d ${hours}h"
                } else {
                    if (isArabic) "${hours}س ${minutes}د" else "${hours}h ${minutes}m"
                }
                kotlinx.coroutines.delay(60000) // Update every minute
            } else {
                timeRemaining = if (isArabic) "انتهت المسابقة" else "Contest ended"
                break
            }
        }
    }
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = when {
                isVipExclusive -> Color(0xFFFFD700).copy(alpha = 0.9f)
                isCompleted -> Color(0xFF4CAF50).copy(alpha = 0.9f)
                else -> MaterialTheme.colorScheme.surfaceVariant
            }
        ),
        border = if (isVipExclusive) BorderStroke(2.dp, Color(0xFFFFD700)) else null
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            // HEADER WITH PROVIDER
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (isVipExclusive) {
                            Text(
                                text = "👑",
                                style = MaterialTheme.typography.titleMedium
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                        }
                        Text(
                            text = title,
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = if (isCompleted) Color.White else MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Text(
                        text = "Provider: $providerName",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (isCompleted) Color.White.copy(alpha = 0.8f) else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                if (timeRemaining.isNotEmpty()) {
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = if (isCompleted) Color.White.copy(alpha = 0.2f) else MaterialTheme.colorScheme.primary.copy(alpha = 0.1f)
                    ) {
                        Text(
                            text = timeRemaining,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (isCompleted) Color.White else MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // DESCRIPTION
            Text(
                text = description,
                style = MaterialTheme.typography.bodyMedium,
                color = if (isCompleted) Color.White.copy(alpha = 0.9f) else MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // PROGRESS BAR
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "$userAds / $requiredAds ads",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Medium,
                        color = if (isCompleted) Color.White else MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "${(progress * 100).toInt()}%",
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.Bold,
                        color = if (isCompleted) Color.White else MaterialTheme.colorScheme.primary
                    )
                }
                
                Spacer(modifier = Modifier.height(8.dp))
                
                LinearProgressIndicator(
                    progress = progress,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = if (isCompleted) Color.White else MaterialTheme.colorScheme.primary,
                    trackColor = if (isCompleted) Color.White.copy(alpha = 0.3f) else MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // PRIZE INFO
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp),
                color = if (isCompleted) Color.White.copy(alpha = 0.2f) else MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "🏆",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = prize,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = if (isCompleted) Color.White else MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // ACTION BUTTONS
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // WATCH AD BUTTON (if not completed)
                if (!isCompleted) {
                    Button(
                        onClick = onWatchAd,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isVipExclusive) Color(0xFF9B59B6) else MaterialTheme.colorScheme.secondary
                        )
                    ) {
                        Text(
                            text = if (isArabic) "شاهد إعلان" else "Watch Ad",
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
                
                // JOIN/STATUS BUTTON
                Button(
                    onClick = onJoin,
                    enabled = isCompleted && isEligible,
                    modifier = if (isCompleted) Modifier.fillMaxWidth() else Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = when {
                            isCompleted && isEligible -> Color(0xFF4CAF50)
                            !isEligible -> MaterialTheme.colorScheme.outline
                            else -> MaterialTheme.colorScheme.primary
                        }
                    )
                ) {
                    val buttonText = when {
                        !isEligible -> if (isArabic) "تم الانضمام" else "Already Joined"
                        isCompleted -> if (isArabic) "مؤهل للسحب" else "Eligible for Draw"
                        else -> if (isArabic) "انضم" else "Join Contest"
                    }
                    Text(
                        text = buttonText,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}