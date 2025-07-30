package com.navigi.sbaro.presentation.ui.screens.main

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.navigi.sbaro.R
import com.navigi.sbaro.data.notification.NotificationManager
import com.navigi.sbaro.data.repository.UserRepository
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun EnhancedContestsScreen(
    userRepository: UserRepository,
    isArabic: Boolean
) {
    val userStats by userRepository.userStats.collectAsState()
    var showJoinDialog by remember { mutableStateOf(false) }
    var selectedContest by remember { mutableStateOf("") }
    var contestResult by remember { mutableStateOf("") }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = if (isArabic) "المسابقات" else "Contests",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
        item {
            Text(
                text = if (isArabic) "انضم إلى المسابقات واربح جوائز رائعة!" else "Join contests and win amazing prizes!",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        // Daily Contest
        item {
            ContestCard(
                title = if (isArabic) "مسابقة يومية" else "Daily Contest",
                description = if (isArabic) "شاهد 10 إعلانات للمشاركة" else "Watch 10 ads to participate",
                prize = "40 نقطة" + if (isArabic) "" else " points",
                requirement = "10 ${if (isArabic) "إعلانات" else "ads"}",
                userAds = userStats.contestAdsToday,
                isEligible = userStats.isEligibleForDaily,
                deadline = userStats.dailyContestDeadline,
                isArabic = isArabic,
                onJoin = {
                    selectedContest = "daily"
                    showJoinDialog = true
                },
                onWatchAd = {
                    userRepository.addContestAd("daily")
                }
            )
        }
        
        // Weekly Contest
        item {
            ContestCard(
                title = if (isArabic) "مسابقة أسبوعية" else "Weekly Contest",
                description = if (isArabic) "شاهد 30 إعلان للمشاركة" else "Watch 30 ads to participate",
                prize = "150 نقطة" + if (isArabic) "" else " points",
                requirement = "30 ${if (isArabic) "إعلان" else "ads"}",
                userAds = userStats.contestAdsWeek,
                isEligible = userStats.isEligibleForWeekly,
                deadline = userStats.weeklyContestDeadline,
                isArabic = isArabic,
                onJoin = {
                    selectedContest = "weekly"
                    showJoinDialog = true
                },
                onWatchAd = {
                    userRepository.addContestAd("weekly")
                }
            )
        }
        
        // Monthly Contest
        item {
            ContestCard(
                title = if (isArabic) "مسابقة شهرية" else "Monthly Contest",
                description = if (isArabic) "شاهد 100 إعلان للمشاركة" else "Watch 100 ads to participate",
                prize = "600 نقطة" + if (isArabic) "" else " points",
                requirement = "100 ${if (isArabic) "إعلان" else "ads"}",
                userAds = userStats.contestAdsMonth,
                isEligible = userStats.isEligibleForMonthly,
                deadline = userStats.monthlyContestDeadline,
                isArabic = isArabic,
                onJoin = {
                    selectedContest = "monthly"
                    showJoinDialog = true
                },
                onWatchAd = {
                    userRepository.addContestAd("monthly")
                }
            )
        }
        
        // VIP Contest (only for VIP users)
        if (userStats.isVip) {
            item {
                ContestCard(
                    title = if (isArabic) "مسابقة VIP" else "VIP Contest",
                    description = if (isArabic) "شاهد 30 إعلان كل 3 أيام للمشاركة" else "Watch 30 ads every 3 days to participate",
                    prize = "10% " + if (isArabic) "من نقاط المسابقة" else "of contest points",
                    requirement = "30 ${if (isArabic) "إعلان" else "ads"}",
                    userAds = userStats.vipContestAds,
                    isEligible = userStats.isEligibleForVip,
                    deadline = userStats.vipContestDeadline,
                    isArabic = isArabic,
                    onJoin = {
                        selectedContest = "vip"
                        showJoinDialog = true
                    },
                    onWatchAd = {
                        userRepository.addContestAd("vip")
                    }
                )
            }
        }
    }
    
    // Join Contest Dialog
    if (showJoinDialog) {
        AlertDialog(
            onDismissRequest = { showJoinDialog = false },
            title = {
                Text(if (isArabic) "انضم إلى المسابقة" else "Join Contest")
            },
            text = {
                Text(
                    if (isArabic) "هل تريد الانضمام إلى هذه المسابقة؟" 
                    else "Do you want to join this contest?"
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        val success = userRepository.joinContest(selectedContest)
                        contestResult = if (success) {
                            if (isArabic) "تم الانضمام بنجاح!" else "Successfully joined!"
                        } else {
                            if (isArabic) "لا تستطيع الانضمام الآن" else "Cannot join at this time"
                        }
                        showJoinDialog = false
                    }
                ) {
                    Text(if (isArabic) "انضم" else "Join")
                }
            },
            dismissButton = {
                TextButton(onClick = { showJoinDialog = false }) {
                    Text(if (isArabic) "إلغاء" else "Cancel")
                }
            }
        )
    }
    
    // Contest Result Message
    if (contestResult.isNotEmpty()) {
        LaunchedEffect(contestResult) {
            kotlinx.coroutines.delay(3000)
            contestResult = ""
        }
    }
}

@Composable
private fun ContestCard(
    title: String,
    description: String,
    prize: String,
    requirement: String,
    userAds: Int,
    isEligible: Boolean,
    deadline: Long,
    isArabic: Boolean,
    onJoin: () -> Unit,
    onWatchAd: () -> Unit
) {
    val requiredAds = requirement.split(" ")[0].toIntOrNull() ?: 0
    val canJoin = userAds >= requiredAds && isEligible
    val hasRequiredAds = userAds >= requiredAds
    
    // Countdown timer state
    var timeRemaining by remember { mutableStateOf("") }
    
    LaunchedEffect(deadline) {
        while (deadline > 0) {
            val currentTime = System.currentTimeMillis()
            if (deadline > currentTime) {
                val diff = deadline - currentTime
                val days = diff / (24 * 60 * 60 * 1000)
                val hours = (diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
                val minutes = (diff % (60 * 60 * 1000)) / (60 * 1000)
                val seconds = (diff % (60 * 1000)) / 1000
                
                timeRemaining = if (days > 0) {
                    if (isArabic) "${days}د ${hours}س ${minutes}د" else "${days}d ${hours}h ${minutes}m"
                } else if (hours > 0) {
                    if (isArabic) "${hours}س ${minutes}د ${seconds}ث" else "${hours}h ${minutes}m ${seconds}s"
                } else {
                    if (isArabic) "${minutes}د ${seconds}ث" else "${minutes}m ${seconds}s"
                }
                delay(1000)
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
                hasRequiredAds -> Color(0xFF4CAF50) // Green when user has required ads
                canJoin -> MaterialTheme.colorScheme.primaryContainer 
                else -> MaterialTheme.colorScheme.surfaceVariant
            }
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = description,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Icon(
                    Icons.Default.EmojiEvents,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = if (canJoin) 
                        MaterialTheme.colorScheme.primary 
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = if (isArabic) "الجائزة" else "Prize",
                        style = MaterialTheme.typography.bodySmall
                    )
                    Text(
                        text = prize,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
                
                Column(horizontalAlignment = Alignment.End) {
                    Text(
                        text = if (isArabic) "المطلوب" else "Required",
                        style = MaterialTheme.typography.bodySmall
                    )
                    Text(
                        text = requirement,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Progress bar
            LinearProgressIndicator(
                progress = (userAds.toFloat() / requiredAds).coerceAtMost(1f),
                modifier = Modifier.fillMaxWidth(),
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = if (isArabic) "تقدمك: $userAds/$requiredAds" else "Your progress: $userAds/$requiredAds",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Countdown timer
            if (deadline > 0 && timeRemaining.isNotEmpty()) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isArabic) "وقت السحب:" else "Draw in:",
                        style = MaterialTheme.typography.bodySmall,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = timeRemaining,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = if (hasRequiredAds) Color.White else MaterialTheme.colorScheme.primary
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
            }
            
            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Watch Ad for Contest button (if user needs more ads)
                if (userAds < requiredAds) {
                    Button(
                        onClick = onWatchAd,
                        modifier = Modifier.weight(1f),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.secondary
                        )
                    ) {
                        Text(if (isArabic) "شاهد إعلان" else "Watch Ad")
                    }
                }
                
                // Join Contest button
                Button(
                    onClick = onJoin,
                    enabled = canJoin,
                    modifier = if (userAds < requiredAds) Modifier.weight(1f) else Modifier.fillMaxWidth()
                ) {
                    Text(
                        if (!isEligible) {
                            if (isArabic) "تم الانضمام بالفعل" else "Already Joined"
                        } else if (userAds < requiredAds) {
                            if (isArabic) "انضم" else "Join"
                        } else {
                            if (isArabic) "انضم الآن" else "Join Now"
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun EnhancedWithdrawScreen(
    userRepository: UserRepository,
    notificationManager: NotificationManager,
    isArabic: Boolean
) {
    val userStats by userRepository.userStats.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = if (isArabic) "سحب النقاط" else "Withdraw Points",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
        // Balance Card
        item {
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
                    Text(
                        text = if (isArabic) "رصيدك المتاح" else "Available Balance",
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        text = "${userStats.totalPoints} SBARO",
                        style = MaterialTheme.typography.headlineLarge,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "≈ $${String.format("%.2f", userStats.totalPoints / 10.0)}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        
        // VIP Upgrade Card
        item {
            VipUpgradeCard(
                userRepository = userRepository,
                isArabic = isArabic
            )
        }
        
        // Test notification button (for demonstration)
        item {
            Button(
                onClick = {
                    notificationManager.simulateWithdrawalApproval(
                        userId = "current_user",
                        amount = 50,
                        method = "Binance Pay",
                        isArabic = isArabic
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.tertiary
                )
            ) {
                Text(if (isArabic) "🧪 اختبار إشعار الموافقة" else "🧪 Test Approval Notification")
            }
        }
        
        item {
            Text(
                text = if (isArabic) "طرق السحب" else "Withdrawal Methods",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }
        
        // Binance Pay
        item {
            WithdrawMethodCard(
                icon = Icons.Default.AccountBalance,
                title = "Binance Pay",
                description = if (isArabic) "حد أدنى: 20 نقطة ($2)" else "Min: 20 points ($2)",
                minPoints = 20,
                userPoints = userStats.totalPoints,
                isArabic = isArabic,
                onWithdraw = { /* Handle withdrawal */ }
            )
        }
        
        // BaridiMob
        item {
            WithdrawMethodCard(
                icon = Icons.Default.PhoneAndroid,
                title = "BaridiMob",
                description = if (isArabic) "حد أدنى: 55 نقطة (99 DA)" else "Min: 55 points (99 DA)",
                minPoints = 55,
                userPoints = userStats.totalPoints,
                isArabic = isArabic,
                onWithdraw = { /* Handle withdrawal */ }
            )
        }
        
        // Google Play Gift Cards
        item {
            WithdrawMethodCard(
                icon = Icons.Default.CardGiftcard,
                title = "Google Play Gift Card",
                description = if (isArabic) "حد أدنى: 10 نقاط ($1)" else "Min: 10 points ($1)",
                minPoints = 10,
                userPoints = userStats.totalPoints,
                isArabic = isArabic,
                onWithdraw = { /* Handle withdrawal */ }
            )
        }
        
        // Flexy
        item {
            WithdrawMethodCard(
                icon = Icons.Default.Smartphone,
                title = "Flexy (Mobilis/Ooredoo)",
                description = if (isArabic) "حد أدنى: 10 نقاط (18 DA)" else "Min: 10 points (18 DA)",
                minPoints = 10,
                userPoints = userStats.totalPoints,
                isArabic = isArabic,
                onWithdraw = { /* Handle withdrawal */ }
            )
        }
        
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.secondaryContainer
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = if (isArabic) "ملاحظة مهمة" else "Important Note",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = if (isArabic) 
                            "• جميع طلبات السحب تتم معالجتها يدوياً خلال 8 ساعات\n• تأكد من صحة البيانات المدخلة\n• رسوم المعاملة مدفوعة من قبلنا"
                        else 
                            "• All withdrawal requests are processed manually within 8 hours\n• Please ensure your details are correct\n• Transaction fees are covered by us",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSecondaryContainer
                    )
                }
            }
        }
    }
}

@Composable
private fun WithdrawMethodCard(
    icon: ImageVector,
    title: String,
    description: String,
    minPoints: Int,
    userPoints: Int,
    isArabic: Boolean,
    onWithdraw: () -> Unit
) {
    val canWithdraw = userPoints >= minPoints
    
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(40.dp),
                tint = if (canWithdraw) 
                    MaterialTheme.colorScheme.primary 
                else MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Button(
                onClick = onWithdraw,
                enabled = canWithdraw
            ) {
                Text(if (isArabic) "سحب" else "Withdraw")
            }
        }
    }
}

@Composable
fun EnhancedProfileScreen(
    userRepository: UserRepository,
    isArabic: Boolean,
    onLanguageToggle: () -> Unit,
    onNavigateToAuth: () -> Unit
) {
    val userStats by userRepository.userStats.collectAsState()
    val clipboardManager = LocalClipboardManager.current
    var showReferralDialog by remember { mutableStateOf(false) }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Profile Header
        item {
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
                    // Avatar
                    Box(
                        modifier = Modifier
                            .size(80.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.primary),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = userRepository.getUserEmail().first().uppercase(),
                            style = MaterialTheme.typography.headlineLarge,
                            color = MaterialTheme.colorScheme.onPrimary,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = userRepository.getUserEmail(),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Text(
                        text = "ID: ${userRepository.getUserId().take(8)}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    // Language Toggle
                    TextButton(onClick = onLanguageToggle) {
                        Icon(Icons.Default.Language, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(if (isArabic) "English" else "العربية")
                    }
                }
            }
        }
        
        // Statistics
        item {
            Text(
                text = if (isArabic) "إحصائياتي" else "My Statistics",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }
        
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatCard(
                    title = if (isArabic) "إجمالي النقاط" else "Total Points",
                    value = "${userStats.totalPoints}",
                    modifier = Modifier.weight(1f)
                )
                
                StatCard(
                    title = if (isArabic) "الإعلانات" else "Ads Watched",
                    value = "${userStats.adsWatched}",
                    modifier = Modifier.weight(1f)
                )
            }
        }
        
        // Referral System
        item {
            Text(
                text = if (isArabic) "نظام الإحالة" else "Referral System",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }
        
        item {
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = if (isArabic) "كودك الخاص" else "Your Referral Code",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = userStats.referralCode,
                            style = MaterialTheme.typography.headlineSmall,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary
                        )
                        
                        Row {
                            IconButton(
                                onClick = {
                                    clipboardManager.setText(AnnotatedString(userStats.referralCode))
                                }
                            ) {
                                Icon(Icons.Default.ContentCopy, contentDescription = "Copy")
                            }
                            
                            IconButton(onClick = { showReferralDialog = true }) {
                                Icon(Icons.Default.Share, contentDescription = "Share")
                            }
                        }
                    }
                }
            }
        }
        
        // Referral Earnings
        item {
            Card(
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    Text(
                        text = if (isArabic) "أرباح الإحالة" else "Referral Earnings",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (isArabic) "المستوى الأول" else "Level 1",
                                style = MaterialTheme.typography.bodySmall
                            )
                            Text(
                                text = "${userStats.level1Earnings}",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "5%",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
                        
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (isArabic) "المستوى الثاني" else "Level 2",
                                style = MaterialTheme.typography.bodySmall
                            )
                            Text(
                                text = "${userStats.level2Earnings}",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.tertiary
                            )
                            Text(
                                text = "3%",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
                        
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (isArabic) "الإجمالي" else "Total",
                                style = MaterialTheme.typography.bodySmall
                            )
                            Text(
                                text = "${userStats.referralPoints}",
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.error
                            )
                            Text(
                                text = if (isArabic) "نقطة" else "points",
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
            }
        }
        
        // Logout Button
        item {
            Spacer(modifier = Modifier.height(16.dp))
            
            Button(
                onClick = onNavigateToAuth,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.error
                )
            ) {
                Icon(Icons.Default.ExitToApp, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(if (isArabic) "تسجيل الخروج" else "Logout")
            }
        }
    }
    
    // Referral Share Dialog
    if (showReferralDialog) {
        AlertDialog(
            onDismissRequest = { showReferralDialog = false },
            title = {
                Text(if (isArabic) "شارك كود الإحالة" else "Share Referral Code")
            },
            text = {
                Text(
                    if (isArabic) 
                        "انضم إلى NAVIGI واربح النقاط! استخدم كودي: ${userStats.referralCode}"
                    else 
                        "Join NAVIGI and earn points! Use my code: ${userStats.referralCode}"
                )
            },
            confirmButton = {
                TextButton(onClick = { showReferralDialog = false }) {
                    Text(if (isArabic) "إغلاق" else "Close")
                }
            }
        )
    }
}

@Composable
private fun StatCard(
    title: String,
    value: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Text(
                text = title,
                style = MaterialTheme.typography.bodySmall,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
fun VipUpgradeCard(
    userRepository: UserRepository,
    isArabic: Boolean,
    onVipActivated: () -> Unit = {}
) {
    val userStats by userRepository.userStats.collectAsState()
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = if (userStats.isVip) Color(0xFF4CAF50) else Color(0xFFFFD700)
        )
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // VIP Crown Icon
            Text(
                text = "👑",
                style = MaterialTheme.typography.headlineLarge
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = if (userStats.isVip) {
                    if (isArabic) "أنت عضو VIP!" else "You are VIP!"
                } else {
                    if (isArabic) "ترقى إلى VIP" else "Upgrade to VIP"
                },
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = if (userStats.isVip) Color.White else Color.Black
            )
            
            if (userStats.isVip) {
                Text(
                    text = "${userRepository.getRemainingVipDays()} ${if (isArabic) "أيام متبقية" else "days remaining"}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.White
                )
            } else {
                Text(
                    text = if (isArabic) "20 USDT شهريًا" else "20 USDT monthly",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // VIP Benefits
            if (!userStats.isVip) {
                Column(
                    horizontalAlignment = Alignment.Start
                ) {
                    Text(
                        text = if (isArabic) "مزايا VIP:" else "VIP Benefits:",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    BenefitRow("✅", if (isArabic) "25 إعلان يوميًا (بدلًا من 12)" else "25 daily ads (instead of 12)", isArabic)
                    BenefitRow("🎯", if (isArabic) "مسابقة VIP كل 3 أيام" else "VIP contest every 3 days", isArabic)
                    BenefitRow("👥", if (isArabic) "5 فائزين × 10% لكل واحد" else "5 winners × 10% each", isArabic)
                    BenefitRow("💰", if (isArabic) "أولوية في السحب" else "Priority withdrawals", isArabic)
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Payment Instructions
                Text(
                    text = if (isArabic) "ادفع إلى:" else "Pay to:",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
                
                Text(
                    text = "TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX",
                    style = MaterialTheme.typography.bodySmall,
                    fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                    color = Color.Black
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // QR Code placeholder (you'd implement actual QR generation)
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .background(Color.White, RoundedCornerShape(8.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "QR CODE\n📱",
                        textAlign = TextAlign.Center,
                        style = MaterialTheme.typography.bodySmall
                    )
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Test VIP button (for demonstration)
                Button(
                    onClick = {
                        userRepository.activateVip()
                        onVipActivated()
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF4CAF50)
                    )
                ) {
                    Text(
                        text = if (isArabic) "🧪 تفعيل VIP (للاختبار)" else "🧪 Activate VIP (Test)",
                        color = Color.White
                    )
                }
            }
        }
    }
}

@Composable
private fun BenefitRow(icon: String, text: String, isArabic: Boolean) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(vertical = 2.dp)
    ) {
        Text(
            text = icon,
            style = MaterialTheme.typography.bodyMedium
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = text,
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Black
        )
    }
}