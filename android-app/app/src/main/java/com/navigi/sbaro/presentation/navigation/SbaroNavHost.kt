package com.navigi.sbaro.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.navigi.sbaro.presentation.ui.screens.auth.LoginScreen
import com.navigi.sbaro.presentation.ui.screens.auth.RegisterScreen
import com.navigi.sbaro.presentation.ui.screens.main.MainScreen
import com.navigi.sbaro.presentation.ui.screens.splash.SplashScreen

@Composable
fun SbaroNavHost(
    navController: NavHostController = rememberNavController(),
    startDestination: String = SbaroDestinations.SPLASH
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // Splash Screen
        composable(SbaroDestinations.SPLASH) {
            SplashScreen(
                onNavigateToLogin = {
                    navController.navigate(SbaroDestinations.LOGIN) {
                        popUpTo(SbaroDestinations.SPLASH) { inclusive = true }
                    }
                },
                onNavigateToMain = {
                    navController.navigate(SbaroDestinations.MAIN) {
                        popUpTo(SbaroDestinations.SPLASH) { inclusive = true }
                    }
                }
            )
        }

        // Authentication Screens
        composable(SbaroDestinations.LOGIN) {
            LoginScreen(
                onNavigateToRegister = {
                    navController.navigate(SbaroDestinations.REGISTER)
                },
                onNavigateToMain = {
                    navController.navigate(SbaroDestinations.MAIN) {
                        popUpTo(SbaroDestinations.LOGIN) { inclusive = true }
                    }
                }
            )
        }

        composable(SbaroDestinations.REGISTER) {
            RegisterScreen(
                onNavigateToLogin = {
                    navController.popBackStack()
                },
                onNavigateToMain = {
                    navController.navigate(SbaroDestinations.MAIN) {
                        popUpTo(SbaroDestinations.REGISTER) { inclusive = true }
                    }
                }
            )
        }

        // Main App Screen (contains bottom navigation)
        composable(SbaroDestinations.MAIN) {
            MainScreen(
                onNavigateToAuth = {
                    navController.navigate(SbaroDestinations.LOGIN) {
                        popUpTo(SbaroDestinations.MAIN) { inclusive = true }
                    }
                }
            )
        }
    }
}

object SbaroDestinations {
    const val SPLASH = "splash"
    const val LOGIN = "login"
    const val REGISTER = "register"
    const val MAIN = "main"
    
    // Main app destinations (handled within MainScreen)
    const val HOME = "home"
    const val EARN = "earn"
    const val CONTESTS = "contests"
    const val WITHDRAW = "withdraw"
    const val PROFILE = "profile"
    const val REFERRALS = "referrals"
    
    // Detail screens
    const val CONTEST_DETAIL = "contest_detail"
    const val WITHDRAWAL_DETAIL = "withdrawal_detail"
    const val REFERRAL_DETAIL = "referral_detail"
    const val SETTINGS = "settings"
    const val PRIVACY_POLICY = "privacy_policy"
    const val TERMS_OF_SERVICE = "terms_of_service"
}