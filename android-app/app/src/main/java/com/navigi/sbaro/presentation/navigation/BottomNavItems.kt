package com.navigi.sbaro.presentation.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.ui.graphics.vector.ImageVector

data class BottomNavItem(
    val route: String,
    val icon: ImageVector,
    val label: String,
    val arabicLabel: String
)

val bottomNavItems = listOf(
    BottomNavItem(SbaroDestinations.HOME, Icons.Default.Home, "Home", "الرئيسية"),
    BottomNavItem(SbaroDestinations.EARN, Icons.Default.PlayArrow, "Earn", "اربح"),
    BottomNavItem(SbaroDestinations.CONTESTS, Icons.Default.EmojiEvents, "Contests", "مسابقات"),
    BottomNavItem(SbaroDestinations.WITHDRAW, Icons.Default.AccountBalanceWallet, "Withdraw", "سحب"),
    BottomNavItem(SbaroDestinations.PROFILE, Icons.Default.Person, "Profile", "الملف الشخصي")
)