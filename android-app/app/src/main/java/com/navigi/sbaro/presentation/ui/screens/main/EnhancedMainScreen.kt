package com.navigi.sbaro.presentation.ui.screens.main

import android.app.Activity
import android.content.Intent
import androidx.compose.animation.*
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.navigi.sbaro.R
import com.navigi.sbaro.data.ads.AdsterraManager
import com.navigi.sbaro.data.notification.NotificationManager
import com.navigi.sbaro.data.repository.ContestInfo
import com.navigi.sbaro.data.repository.UserRepository
import com.navigi.sbaro.data.repository.UserStats
import com.navigi.sbaro.data.repository.VipTier
import com.navigi.sbaro.presentation.navigation.SbaroDestinations
import com.navigi.sbaro.presentation.navigation.bottomNavItems
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EnhancedMainScreen(
    onNavigateToAuth: () -> Unit,
    userRepository: UserRepository,
    adsterraManager: AdsterraManager,
    notificationManager: NotificationManager
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination?.route
    
    var isArabic by remember { mutableStateOf(false) }
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                bottomNavItems.forEach { item ->
                    NavigationBarItem(
                        icon = { Icon(item.icon, contentDescription = item.label) },
                        label = { Text(if (isArabic) item.arabicLabel else item.label) },
                        selected = currentDestination == item.route,
                        onClick = {
                            if (currentDestination != item.route) {
                                navController.navigate(item.route) {
                                    popUpTo(navController.graph.startDestinationId) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = SbaroDestinations.HOME,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(SbaroDestinations.HOME) {
                EnhancedHomeScreen(
                    userRepository = userRepository,
                    adsterraManager = adsterraManager,
                    isArabic = isArabic,
                    onLanguageToggle = { isArabic = !isArabic }
                )
            }
            
            composable(SbaroDestinations.EARN) {
                EnhancedEarnScreen(
                    userRepository = userRepository,
                    adsterraManager = adsterraManager,
                    isArabic = isArabic
                )
            }
            
            composable(SbaroDestinations.CONTESTS) {
                EnhancedContestsScreen(
                    userRepository = userRepository,
                    isArabic = isArabic
                )
            }
            
                            composable(SbaroDestinations.WITHDRAW) { 
                    EnhancedWithdrawScreen(
                        userRepository = userRepository,
                        notificationManager = notificationManager,
                        isArabic = isArabic
                    )
                }
            
            composable(SbaroDestinations.PROFILE) {
                EnhancedProfileScreen(
                    userRepository = userRepository,
                    isArabic = isArabic,
                    onLanguageToggle = { isArabic = !isArabic },
                    onNavigateToAuth = onNavigateToAuth
                )
            }
        }
    }
}

@Composable
private fun EnhancedHomeScreen(
    userRepository: UserRepository,
    isArabic: Boolean,
    onLanguageToggle: () -> Unit
) {
    val userStats by userRepository.userStats.collectAsState()
    val contestNews by userRepository.contestNews.collectAsState()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Header with language toggle
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isArabic) "مرحباً بك في نافيجي" else "Welcome to NAVIGI",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.Bold
                )
                
                TextButton(
                    onClick = onLanguageToggle
                ) {
                    Text(if (isArabic) "English" else "العربية")
                }
            }
        }
        
        // Points Summary Card
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
                        text = if (isArabic) "نقاطك الإجمالية" else "Your Total Points",
                        style = MaterialTheme.typography.titleMedium
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "${userStats.totalPoints}",
                            style = MaterialTheme.typography.headlineLarge,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(Color(0xFF3498DB), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "SB",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        if (userStats.vipTier != VipTier.NONE) {
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "👑", style = MaterialTheme.typography.titleLarge)
                        }
                    }
                    
                    // VIP Status
                    if (userStats.vipTier != VipTier.NONE) {
                        Text(
                            text = "VIP • ${userRepository.getRemainingVipDays()} ${if (isArabic) "أيام متبقية" else "days left"}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Medium
                        )
                    }
                    
                    // Daily Ads Info
                    Text(
                        text = "${if (isArabic) "إعلانات اليوم" else "Today's Ads"}: ${userStats.dailyEarnAds}/${userStats.dailyAdLimit}",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (userStats.dailyEarnAds < userStats.dailyAdLimit) {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        } else {
                            MaterialTheme.colorScheme.error
                        }
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (isArabic) "اليوم" else "Today",
                                style = MaterialTheme.typography.bodySmall
                            )
                            Text(
                                text = "${userStats.todayPoints}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.secondary
                            )
                        }
                        
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (isArabic) "الإحالات" else "Referrals",
                                style = MaterialTheme.typography.bodySmall
                            )
                            Text(
                                text = "${userStats.referralPoints}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.tertiary
                            )
                        }
                        
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (isArabic) "الإعلانات" else "Ads",
                                style = MaterialTheme.typography.bodySmall
                            )
                            Text(
                                text = "${userStats.adsWatched}",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.error
                            )
                        }
                    }
                }
            }
        }
        
        // Contest News Section
        item {
            Text(
                text = if (isArabic) "أخبار المسابقات" else "Contest News",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }
        
        items(contestNews) { contest ->
            ContestNewsCard(contest = contest, isArabic = isArabic)
        }
        
        // Quick Actions
        item {
            Text(
                text = if (isArabic) "إجراءات سريعة" else "Quick Actions",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
        }
        
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { /* Navigate to earn */ },
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.secondaryContainer
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.secondary
                        )
                        Text(
                            text = if (isArabic) "شاهد إعلان" else "Watch Ad",
                            style = MaterialTheme.typography.bodyMedium,
                            textAlign = TextAlign.Center
                        )
                    }
                }
                
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { /* Navigate to contests */ },
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.tertiaryContainer
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Default.EmojiEvents,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.tertiary
                        )
                        Text(
                            text = if (isArabic) "مسابقات" else "Contests",
                            style = MaterialTheme.typography.bodyMedium,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ContestNewsCard(
    contest: ContestInfo,
    isArabic: Boolean
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                Icons.Default.EmojiEvents,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(40.dp)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = if (isArabic) {
                        when (contest.contestName) {
                            "Daily Contest" -> "مسابقة يومية"
                            "Weekly Contest" -> "مسابقة أسبوعية"
                            "Monthly Contest" -> "مسابقة شهرية"
                            else -> contest.contestName
                        }
                    } else contest.contestName,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = if (isArabic) "الفائز: ${contest.winner}" else "Winner: ${contest.winner}",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = contest.date,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = "${contest.prize}",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = if (isArabic) "نقطة" else "points",
                    style = MaterialTheme.typography.bodySmall
                )
            }
        }
    }
}

@Composable
private fun EnhancedEarnScreen(
    userRepository: UserRepository,
    adsterraManager: AdsterraManager,
    isArabic: Boolean
) {
    val context = LocalContext.current
    val userStats by userRepository.userStats.collectAsState()
    var showRewardDialog by remember { mutableStateOf(false) }
    var rewardAmount by remember { mutableStateOf(0) }
    var rewardUSD by remember { mutableStateOf(0.0) }
    var errorMessage by remember { mutableStateOf("") }
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = if (isArabic) "اربح النقاط" else "Earn Points",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
        }
        
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
                    Icon(
                        Icons.Default.PlayArrow,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = if (isArabic) "شاهد إعلان مكافآت" else "Watch Rewarded Ad",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    
                    Text(
                        text = if (isArabic) "احصل على 70% من ربح الإعلان" else "Earn 70% of ad profit",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    // Daily limit progress
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isArabic) "إعلانات اليوم:" else "Today's Ads:",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "${userStats.dailyEarnAds}/${userStats.dailyAdLimit}",
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Bold,
                            color = if (userStats.dailyEarnAds < userStats.dailyAdLimit) {
                                MaterialTheme.colorScheme.primary
                            } else {
                                MaterialTheme.colorScheme.error
                            }
                        )
                    }
                    
                    // VIP status if applicable
                    if (userStats.vipTier != VipTier.NONE) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = if (isArabic) "VIP:" else "VIP:",
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.Medium,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                text = "${userRepository.getRemainingVipDays()} ${if (isArabic) "أيام متبقية" else "days left"}",
                                style = MaterialTheme.typography.bodySmall,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Button(
                        onClick = {
                            if (userStats.dailyEarnAds >= userStats.dailyAdLimit) {
                                errorMessage = if (isArabic) {
                                    "وصلت للحد الأقصى اليومي (${userStats.dailyAdLimit} إعلان)"
                                } else {
                                    "Daily limit reached (${userStats.dailyAdLimit} ads)"
                                }
                            } else if (adsterraManager.isRewardedAdReady()) {
                                adsterraManager.showRewardedAd(
                                    activity = context as Activity,
                                    onRewarded = { adRevenue ->
                                        // Use real Adsterra profit calculation with limit check
                                        val success = userRepository.addPointsFromAd(adRevenue)
                                        if (success) {
                                            // Calculate user's actual points and USD value (70% of revenue)
                                            val userShareUSD = adRevenue * 0.70
                                            val userPoints = (userShareUSD * 100).toInt()
                                            rewardAmount = userPoints
                                            rewardUSD = userShareUSD
                                            showRewardDialog = true
                                        } else {
                                            errorMessage = if (isArabic) {
                                                "وصلت للحد الأقصى اليومي"
                                            } else {
                                                "Daily limit reached"
                                            }
                                        }
                                    },
                                    onAdFailed = { error ->
                                        errorMessage = error
                                    }
                                )
                            } else {
                                errorMessage = if (isArabic) {
                                    "الإعلان غير جاهز، حاول مرة أخرى بعد قليل"
                                } else {
                                    "Ad not ready, try again in a moment"
                                }
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = userStats.dailyEarnAds < userStats.dailyAdLimit && adsterraManager.isRewardedAdReady()
                    ) {
                        Text(
                            when {
                                userStats.dailyEarnAds >= userStats.dailyAdLimit -> if (isArabic) "الحد اليومي مكتمل" else "Daily Limit Reached"
                                adsterraManager.isRewardedAdReady() -> if (isArabic) "شاهد الإعلان" else "Watch Ad"
                                else -> if (isArabic) "جاري التحميل..." else "Loading..."
                            }
                        )
                    }
                    
                    Text(
                        text = if (isArabic) "الإعلان جاهز: " else "Ad Ready: " + 
                              if (adsterraManager.isRewardedAdReady()) "✅" else "⏳",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (adsterraManager.isRewardedAdReady()) 
                            MaterialTheme.colorScheme.primary 
                        else MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
        
        // Other earning methods
        item {
            EarningMethodCard(
                icon = Icons.Default.Games,
                title = if (isArabic) "العب الألعاب" else "Play Games",
                description = if (isArabic) "أكمل عروض الألعاب" else "Complete game offers",
                points = "5-50",
                isArabic = isArabic,
                isEnabled = false,
                onClick = { /* Coming soon */ }
            )
        }
        
        item {
            EarningMethodCard(
                icon = Icons.Default.Poll,
                title = if (isArabic) "أجب على الاستطلاعات" else "Answer Surveys",
                description = if (isArabic) "شارك في الاستطلاعات" else "Participate in surveys",
                points = "20-100",
                isArabic = isArabic,
                isEnabled = false,
                onClick = { /* Coming soon */ }
            )
        }
        
        item {
            EarningMethodCard(
                icon = Icons.Default.ThumbUp,
                title = if (isArabic) "اعجابات يوتيوب" else "YouTube Likes",
                description = if (isArabic) "اعجب بالفيديوهات" else "Like videos",
                points = "2-5",
                isArabic = isArabic,
                isEnabled = false,
                onClick = { /* Coming soon */ }
            )
        }
    }
    
    // Reward Dialog
    if (showRewardDialog) {
        AlertDialog(
            onDismissRequest = { showRewardDialog = false },
            title = {
                Text(if (isArabic) "تهانينا!" else "Congratulations!")
            },
            text = {
                Text(
                    if (isArabic) 
                        "تهانينا!\nحصلت على $rewardAmount نقطة\n($${String.format("%.4f", rewardUSD)} - 70% من الربح)"
                    else 
                        "Congratulations!\nYou earned $rewardAmount points\n($${String.format("%.4f", rewardUSD)} - 70% of profit)"
                )
            },
            confirmButton = {
                TextButton(onClick = { showRewardDialog = false }) {
                    Text(if (isArabic) "حسناً" else "OK")
                }
            }
        )
    }
    
    // Error Message
    if (errorMessage.isNotEmpty()) {
        LaunchedEffect(errorMessage) {
            kotlinx.coroutines.delay(3000)
            errorMessage = ""
        }
        
        Snackbar(
            modifier = Modifier.padding(16.dp),
            action = {
                TextButton(onClick = { errorMessage = "" }) {
                    Text(if (isArabic) "إغلاق" else "Dismiss")
                }
            }
        ) {
            Text(errorMessage)
        }
    }
}

@Composable
private fun EarningMethodCard(
    icon: ImageVector,
    title: String,
    description: String,
    points: String,
    isArabic: Boolean,
    isEnabled: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(enabled = isEnabled) { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = if (isEnabled) 
                MaterialTheme.colorScheme.surface 
            else MaterialTheme.colorScheme.surfaceVariant
        )
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                modifier = Modifier.size(40.dp),
                tint = if (isEnabled) 
                    MaterialTheme.colorScheme.primary 
                else MaterialTheme.colorScheme.onSurfaceVariant
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = if (isEnabled) 
                        MaterialTheme.colorScheme.onSurface 
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (!isEnabled) {
                    Text(
                        text = if (isArabic) "قريباً" else "Coming Soon",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
            
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    text = points,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = if (isEnabled) 
                        MaterialTheme.colorScheme.primary 
                    else MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    text = if (isArabic) "نقطة" else "points",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

// Bottom Navigation Items are now imported from the navigation package