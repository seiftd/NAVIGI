// Firebase configuration for client-side
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "navigi-sbaro-bot.firebaseapp.com",
    databaseURL: "https://navigi-sbaro-bot-default-rtdb.firebaseio.com",
    projectId: "navigi-sbaro-bot",
    storageBucket: "navigi-sbaro-bot.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Telegram Mini App - NAVIGI SBARO with Firebase Integration
class TelegramSbaroApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.userStats = {
            totalPoints: 0,
            totalBalance: 0,
            vipStatus: 'FREE',
            adsWatched: 0,
            contestAdsWatched: 0, // Separate counter for contest ads
            contestsJoined: 0,
            referrals: 0
        };
        this.currentTab = 'home';
        this.isArabic = localStorage.getItem('isArabic') === 'true';
        this.firebaseInitialized = false;
        this.database = null;
        
        // Daily login and tasks
        this.dailyLoginClaimed = false;
        this.lastDailyLogin = localStorage.getItem('lastDailyLogin') || '0';
        this.tasks = {
            channelSubscription: localStorage.getItem('task_channel') === 'true',
            visitBot1: localStorage.getItem('task_bot1') === 'true',
            visitBot2: localStorage.getItem('task_bot2') === 'true',
            visitWebsite: localStorage.getItem('task_website') === 'true'
        };
        
        // VIP Mining System
        this.vipMining = {
            king: { dailyPoints: 10, minedToday: parseInt(localStorage.getItem('vip_king_mined') || '0'), lastClaim: localStorage.getItem('vip_king_last_claim') || '0' },
            emperor: { dailyPoints: 15, minedToday: parseInt(localStorage.getItem('vip_emperor_mined') || '0'), lastClaim: localStorage.getItem('vip_emperor_last_claim') || '0' },
            lord: { dailyPoints: 20, minedToday: parseInt(localStorage.getItem('vip_lord_mined') || '0'), lastClaim: localStorage.getItem('vip_lord_last_claim') || '0' }
        };
        
        this.init();
    }

    async init() {
        try {
            // Initialize Firebase
            await this.initFirebase();
            
            // Initialize Telegram WebApp
            this.initTelegramWebApp();
            
            // Initialize UI
            this.initUI();
            
            // Load user data
            await this.loadUserData();
            
            // Initialize daily progress
            this.updateDailyProgress();
            
            // Initialize Monetag
            this.initMonetag();
            
            // Set up real-time listeners
            this.setupRealtimeListeners();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('NAVIGI SBARO Telegram Mini App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize app. Please try again.');
        }
    }

    async initFirebase() {
        try {
            // Check if Firebase is available
            if (typeof firebase !== 'undefined') {
                // Initialize Firebase
                if (!firebase.apps.length) {
                    firebase.initializeApp(firebaseConfig);
                }
                this.database = firebase.database();
                this.firebaseInitialized = true;
                console.log('🔥 Firebase initialized successfully');
            } else {
                console.warn('⚠️ Firebase not available - using local storage fallback');
                this.firebaseInitialized = false;
            }
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            this.firebaseInitialized = false;
        }
    }

    initTelegramWebApp() {
        // Expand the app to full height
        this.tg.expand();
        
        // Enable closing confirmation
        this.tg.enableClosingConfirmation();
        
        // Set header color
        this.tg.setHeaderColor('#3498db');
        
        // Get user data from Telegram
        if (this.tg.initDataUnsafe?.user) {
            this.user = this.tg.initDataUnsafe.user;
            console.log('Telegram user loaded:', this.user);
        }
        
        // Apply Telegram theme
        this.applyTelegramTheme();
        
        // Handle theme changes
        this.tg.onEvent('themeChanged', () => {
            this.applyTelegramTheme();
        });
        
        // Handle main button
        this.tg.MainButton.setText('Watch Ad & Earn');
        this.tg.MainButton.onClick(() => {
            this.watchAd();
        });
    }

    applyTelegramTheme() {
        const root = document.documentElement;
        const themeParams = this.tg.themeParams;
        
        if (themeParams.bg_color) {
            root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
        }
        if (themeParams.text_color) {
            root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
        }
        if (themeParams.hint_color) {
            root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
        }
        if (themeParams.button_color) {
            root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
        }
        if (themeParams.button_text_color) {
            root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
        }
        if (themeParams.secondary_bg_color) {
            root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
        }
        
        // Apply dark theme class if needed
        if (themeParams.bg_color && this.isColorDark(themeParams.bg_color)) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    isColorDark(color) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness < 128;
    }

    initUI() {
        // Initialize navigation
        this.initNavigation();
        
        // Initialize modals
        this.initModals();
        
        // Update welcome text with user name
        if (this.user) {
            const welcomeText = document.getElementById('welcomeText');
            if (welcomeText) {
                welcomeText.textContent = `Welcome back, ${this.user.first_name}!`;
            }
        }
        
        // Initialize event listeners
        this.initEventListeners();
    }

    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tab = item.dataset.tab;
                this.switchTab(tab);
            });
        });
    }

    initModals() {
        const modal = document.getElementById('modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    initEventListeners() {
        // Language toggle
        document.getElementById('languageBtn').addEventListener('click', () => {
            this.toggleLanguage();
        });
        
        // Notification button
        document.getElementById('notificationBtn').addEventListener('click', () => {
            this.showNotifications();
        });
    }

    async loadUserData() {
        try {
            // Load saved user progress first
            this.loadUserProgress();
            
            // Load real user data from backend
            if (this.user) {
                // Update profile information
                document.getElementById('profileName').textContent = 
                    `${this.user.first_name} ${this.user.last_name || ''}`.trim();
                document.getElementById('profileUsername').textContent = 
                    this.user.username ? `@${this.user.username}` : `ID: ${this.user.id}`;
                
                // Set profile avatar if available
                if (this.user.photo_url) {
                    const avatar = document.getElementById('profileAvatar');
                    avatar.innerHTML = `<img src="${this.user.photo_url}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                }
                
                // Load real user stats from backend
                await this.fetchRealUserStats();
            }
            
            // Update stats display
            this.updateStatsDisplay();
            
            // Generate referral code based on user ID
            if (this.user) {
                const referralCode = `SBARO-${this.user.id.toString().slice(-6).toUpperCase()}`;
                document.getElementById('referralCode').textContent = referralCode;
            }
            
            // Initialize contest timers and eligibility
            this.initContestTimers();
            this.updateContestEligibility();
            
            // Initialize task and VIP mining UI
            this.updateDailyLoginUI();
            this.updateVipMiningUI();
            this.initTasksUI();
            this.loadRecentActivities();
            
            // Start cooldown timers if needed
            this.startCooldownTimer('earn');
            // Start timers for each contest type
            this.startCooldownTimer('contest', 'daily');
            this.startCooldownTimer('contest', 'weekly');
            this.startCooldownTimer('contest', 'monthly');
            
            // Reset ALL bot data to zero (complete reset)
            this.resetAllBotData();
            
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }
    
    async fetchRealUserStats() {
        try {
            // Try Firebase first
            if (this.firebaseInitialized && this.database && this.user) {
                const userId = this.user.id;
                const userRef = this.database.ref(`users/${userId}`);
                const snapshot = await userRef.once('value');
                const firebaseData = snapshot.val();
                
                if (firebaseData) {
                    this.userStats = {
                        totalPoints: firebaseData.points || 0,
                        totalBalance: firebaseData.balance || 0,
                        vipStatus: firebaseData.vip_status || 'FREE',
                        adsWatched: firebaseData.ads_watched || 0,
                        contestAdsWatched: (firebaseData.contest_ads?.daily || 0) + (firebaseData.contest_ads?.weekly || 0) + (firebaseData.contest_ads?.monthly || 0),
                        contestsJoined: firebaseData.contests_joined || 0,
                        referrals: firebaseData.referrals || 0
                    };
                    console.log('✅ Real user stats fetched from Firebase');
                    return;
                }
            }
            
            // Fallback to API
            const response = await fetch(`https://navigiu.netlify.app/.netlify/functions/user-stats?user_id=${this.user.id}`, {
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.userStats = {
                    totalPoints: data.total_points || 0,
                    totalBalance: data.total_balance || 0,
                    vipStatus: data.vip_status || 'FREE',
                    adsWatched: data.ads_watched || 0,
                    contestAdsWatched: data.contest_ads_watched || 0,
                    contestsJoined: data.contests_joined || 0,
                    referrals: data.referrals || 0
                };
                console.log('📡 Real user stats fetched from API');
            }
        } catch (error) {
            console.error('Failed to fetch real user stats:', error);
        }
    }

    setupRealtimeListeners() {
        if (!this.firebaseInitialized || !this.database || !this.user) {
            console.log('⚠️ Firebase not available - skipping real-time listeners');
            return;
        }
        
        try {
            const userId = this.user.id;
            const userRef = this.database.ref(`users/${userId}`);
            
            // Listen for real-time updates to user data
            userRef.on('value', (snapshot) => {
                const firebaseData = snapshot.val();
                if (firebaseData) {
                    // Update local stats if they changed
                    const newStats = {
                        totalPoints: firebaseData.points || 0,
                        totalBalance: firebaseData.balance || 0,
                        vipStatus: firebaseData.vip_status || 'FREE',
                        adsWatched: firebaseData.ads_watched || 0,
                        contestAdsWatched: (firebaseData.contest_ads?.daily || 0) + (firebaseData.contest_ads?.weekly || 0) + (firebaseData.contest_ads?.monthly || 0),
                        contestsJoined: firebaseData.contests_joined || 0,
                        referrals: firebaseData.referrals || 0
                    };
                    
                    // Check if data actually changed
                    if (JSON.stringify(newStats) !== JSON.stringify(this.userStats)) {
                        this.userStats = newStats;
                        this.updateStatsDisplay();
                        this.saveUserProgress(); // Save to localStorage as backup
                        console.log('🔄 Real-time update received from Firebase');
                        
                        // Show notification for significant changes
                        if (newStats.totalPoints > this.userStats.totalPoints) {
                            this.showNotification(`🎉 Points updated: +${(newStats.totalPoints - this.userStats.totalPoints).toFixed(1)}`);
                        }
                        if (newStats.vipStatus !== this.userStats.vipStatus) {
                            this.showNotification(`👑 VIP Status updated: ${newStats.vipStatus}`);
                        }
                    }
                }
            });
            
            // Listen for contest progress updates
            const contestRef = this.database.ref(`users/${userId}/contest_ads`);
            contestRef.on('value', (snapshot) => {
                const contestData = snapshot.val();
                if (contestData) {
                    this.updateContestProgress(contestData);
                }
            });
            
            console.log('👂 Firebase real-time listeners set up successfully');
        } catch (error) {
            console.error('❌ Failed to set up Firebase listeners:', error);
        }
    }

    async syncUserDataToFirebase() {
        if (!this.firebaseInitialized || !this.database || !this.user) return false;
        
        try {
            const userId = this.user.id;
            const userRef = this.database.ref(`users/${userId}`);
            
            const updates = {
                points: this.userStats.totalPoints,
                balance: this.userStats.totalBalance,
                ads_watched: this.userStats.adsWatched,
                vip_status: this.userStats.vipStatus,
                contests_joined: this.userStats.contestsJoined,
                referrals: this.userStats.referrals,
                updated_at: firebase.database.ServerValue.TIMESTAMP
            };
            
            await userRef.update(updates);
            console.log('✅ User data synced to Firebase');
            return true;
        } catch (error) {
            console.error('❌ Failed to sync to Firebase:', error);
            return false;
        }
    }

    updateStatsDisplay() {
        // Update main stats
        document.getElementById('totalPoints').textContent = this.userStats.totalPoints.toLocaleString();
        document.getElementById('totalBalance').textContent = `$${this.userStats.totalBalance.toFixed(2)}`;
        document.getElementById('vipStatus').textContent = this.userStats.vipStatus;
        
        // Update profile stats
        document.getElementById('totalEarned').textContent = this.userStats.totalPoints.toLocaleString();
        document.getElementById('adsWatched').textContent = this.userStats.adsWatched.toLocaleString();
        document.getElementById('contestsJoined').textContent = this.userStats.contestsJoined;
        document.getElementById('referrals').textContent = this.userStats.referrals;
        
        // Update member since date
        document.getElementById('memberSince').textContent = new Date().toLocaleDateString();
    }

    initMonetag() {
        // Initialize Monetag ads
        try {
            // Create Monetag SDK script element
            const adsScript = document.createElement('script');
            adsScript.src = '//libtl.com/sdk.js';
            adsScript.setAttribute('data-zone', '9656288');
            adsScript.setAttribute('data-sdk', 'show_9656288');
            adsScript.async = true;
            document.head.appendChild(adsScript);
            
            console.log('Monetag ads initialized');
        } catch (error) {
            console.error('Failed to initialize Monetag:', error);
        }
    }

    // Show Monetag Rewarded Interstitial (2x15s ads OR 1x30s ad)
    async showMontagRewardedAds() {
        return new Promise((resolve, reject) => {
            try {
                console.log('Starting Monetag Rewarded Interstitial ads...');
                
                // Random choice: 2x15s ads OR 1x30s ad
                const adChoice = Math.random() < 0.7 ? 'double' : 'single';
                
                if (adChoice === 'double') {
                    // Show 2x15s Rewarded Interstitial ads with 1s interval
                    this.showDoubleRewardedAds().then(() => {
                        console.log('Both 15s Rewarded ads completed');
                        resolve(true);
                    }).catch(reject);
                } else {
                    // Show single 30s Rewarded Interstitial
                    show_9656288().then(() => {
                        console.log('30s Rewarded ad completed');
                        resolve(true);
                    }).catch(reject);
                }
            } catch (error) {
                console.error('Failed to show Monetag Rewarded ads:', error);
                reject(error);
            }
        });
    }

    // Show 2x15s Rewarded Interstitial ads with 1s interval
    async showDoubleRewardedAds() {
        return new Promise((resolve, reject) => {
            try {
                // First 15s ad
                show_9656288().then(() => {
                    console.log('First 15s ad completed, waiting 1s...');
                    
                    // Wait 1 second between ads
                    setTimeout(() => {
                        // Second 15s ad
                        show_9656288().then(() => {
                            console.log('Second 15s ad completed');
                            resolve(true);
                        }).catch(reject);
                    }, 1000); // 1 second interval
                }).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            app.style.display = 'flex';
        }, 2000); // Show loading for 2 seconds
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Update Telegram main button based on tab
        this.updateMainButton(tabName);
        
        // Send haptic feedback
        this.tg.HapticFeedback.impactOccurred('light');
    }

    updateMainButton(tabName) {
        switch (tabName) {
            case 'earn':
                this.tg.MainButton.setText('Watch Ad & Earn');
                this.tg.MainButton.show();
                break;
            case 'vip':
                this.tg.MainButton.setText('Upgrade to VIP');
                this.tg.MainButton.show();
                break;
            case 'contests':
                this.tg.MainButton.setText('Join Contest');
                this.tg.MainButton.show();
                break;
            default:
                this.tg.MainButton.hide();
        }
    }

        async watchAd() {
        // Check daily ad limit
        const dailyAdLimit = this.getDailyAdLimit();
        const todayAdsWatched = this.getTodayAdsWatched();
        
        if (todayAdsWatched >= dailyAdLimit) {
            const resetTime = this.getNextDayReset();
            const hoursUntilReset = Math.ceil((resetTime - Date.now()) / (60 * 60 * 1000));
            this.showToast(`📺 Daily ad limit reached (${dailyAdLimit} ads). Reset in ${hoursUntilReset}h`, 'info');
            return;
        }
        
        // Check cooldown - 7 minutes for ALL users (earning ads)
        const cooldownTime = 7 * 60 * 1000; // 7 minutes in milliseconds
        const lastAdTime = localStorage.getItem('lastAdTime');
        
        if (lastAdTime && Date.now() - parseInt(lastAdTime) < cooldownTime) {
            const remainingMs = cooldownTime - (Date.now() - parseInt(lastAdTime));
            const remainingMinutes = Math.floor(remainingMs / (60 * 1000));
            const remainingSeconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
            this.showToast(`⏰ Next ad in: ${remainingMinutes}m ${remainingSeconds}s`, 'info');
            
            // Start cooldown timer display
            this.startCooldownTimer('earn');
            return;
        }

        try {
            // Show loading state
            const watchBtn = document.getElementById('watchAdBtn');
            watchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading 2x15s Ads...';
            watchBtn.disabled = true;
            
            // Show Monetag In-App Interstitial (2 ads automatically)
            if (typeof show_9656288 === 'function') {
                try {
                                         // Show ad progress (2x15s OR 1x30s)
                    let adWatchTime = 0;
                    const totalAdDuration = 32; // 2x15s + 1s interval OR 1x30s
                    
                    // Show ad progress
                    const progressInterval = setInterval(() => {
                        adWatchTime++;
                        if (adWatchTime <= 15) {
                            watchBtn.innerHTML = `<i class="fas fa-eye"></i> Ad 1: ${adWatchTime}/15s`;
                        } else if (adWatchTime <= 16) {
                            watchBtn.innerHTML = `<i class="fas fa-clock"></i> Next ad in 1s...`;
                        } else if (adWatchTime <= 31) {
                            watchBtn.innerHTML = `<i class="fas fa-eye"></i> Ad 2: ${adWatchTime - 16}/15s`;
                        } else {
                            watchBtn.innerHTML = `<i class="fas fa-check"></i> Ads completed!`;
                        }
                        
                        if (adWatchTime >= totalAdDuration) {
                            clearInterval(progressInterval);
                        }
                    }, 1000);
                    
                    // Show Monetag Rewarded Interstitial (2x15s OR 1x30s)
                    await this.showMontagRewardedAds();
                    
                                         // Ensure minimum watch time (32 seconds for 2x15s + 1s interval)
                    if (adWatchTime < totalAdDuration) {
                        const remainingTime = totalAdDuration - adWatchTime;
                        await new Promise(resolve => setTimeout(resolve, remainingTime * 1000));
                    }
                    
                    clearInterval(progressInterval);
                    
                    // Award points after successful completion of BOTH ads - 1.1 points total
                    this.userStats.totalPoints += 1.1;
                    this.userStats.totalBalance += 0.011;
                    this.userStats.adsWatched += 1;
                    
                    // Update today's ads count
                    this.incrementTodayAdsWatched();
                    
                    // Update display
                    this.updateStatsDisplay();
                    this.updateDailyProgress();
                    
                    // Show success message
                    this.showToast('🎉 You earned 1.1 points for watching 2x15s ads!', 'success');
                    
                    // Send haptic feedback
                    this.tg.HapticFeedback.notificationOccurred('success');
                    
                    // Add to activity log
                    this.addActivity('Watched 2x15s Ads', '+1.1 points', 'earn');
                    
                    // Save user progress
                    this.saveUserProgress();
                    
                    // Send data to backend
                    await this.sendAdWatchToBackend();
                    
                    // Set cooldown
                    localStorage.setItem('lastAdTime', Date.now().toString());
                    
                    // Start cooldown timer
                    this.startCooldownTimer('earn');
                    
                } catch (adError) {
                    console.error('Ad watch error:', adError);
                    this.showToast('❌ Ad not available right now. Try again later.', 'error');
                }
            } else {
                // Fallback if Monetag not loaded
                this.showToast('❌ Ads are loading. Please wait and try again.', 'error');
            }
            
            // Show next ad availability
            const nextAdTime = isVIP ? '1 minute' : '3 minutes';
            watchBtn.innerHTML = `<i class="fas fa-clock"></i> Next ad in ${nextAdTime}`;
            
            // Reset button after cooldown
            setTimeout(() => {
                watchBtn.innerHTML = '<i class="fas fa-play"></i> Watch Ads';
                watchBtn.disabled = false;
            }, cooldownTime);
            
        } catch (error) {
            console.error('Failed to watch ad:', error);
            this.showToast('❌ Failed to load ad. Please try again.', 'error');
            
            // Reset button
            const watchBtn = document.getElementById('watchAdBtn');
            watchBtn.innerHTML = '<i class="fas fa-play"></i> Watch Ads';
            watchBtn.disabled = false;
        }
    }

    async sendAdWatchToBackend() {
        try {
            const response = await fetch('https://navigiu.netlify.app/.netlify/functions/ad-watch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    points_earned: 5,
                    timestamp: Date.now(),
                    ad_type: 'monetag_rewarded'
                })
            });
            
            if (response.ok) {
                console.log('Ad watch sent to backend successfully');
            }
        } catch (error) {
            console.error('Failed to send ad watch to backend:', error);
        }
    }

    addActivity(title, points, type) {
        // Create activity object with real data
        const activity = {
            id: Date.now(),
            title,
            points,
            type,
            timestamp: Date.now(),
            date: new Date().toLocaleString(),
            user_id: this.user?.id,
            username: this.user?.username
        };
        
        // Store in localStorage for persistence
        const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        activities.unshift(activity);
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(50);
        }
        
        localStorage.setItem('recentActivities', JSON.stringify(activities));
        
        // Send to backend for real-time tracking
        this.sendActivityToBackend(activity);
        
        // Update UI
        const activityList = document.getElementById('activityList');
        if (activityList) {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            
            const iconClass = type === 'earn' ? 'earn' : type === 'contest' ? 'contest' : type === 'vip' ? 'vip' : type === 'task' ? 'task' : 'earn';
            const icon = type === 'contest' ? '🏆' : type === 'vip' ? '💎' : type === 'task' ? '✅' : type === 'daily' ? '📅' : '+';
            
            activityItem.innerHTML = `
                <div class="activity-icon ${iconClass}">${icon}</div>
                <div class="activity-info">
                    <div class="activity-title">${title}</div>
                    <div class="activity-time">${this.formatTimeAgo(activity.timestamp)}</div>
                </div>
                <div class="activity-points">${points}</div>
            `;
            
            // Add to top of list
            activityList.insertBefore(activityItem, activityList.firstChild);
            
            // Remove last item if more than 10 items
            if (activityList.children.length > 10) {
                activityList.removeChild(activityList.lastChild);
            }
        }
        
        console.log('📝 Real activity logged:', activity);
    }

    // Send activity to backend for real-time tracking
    async sendActivityToBackend(activity) {
        try {
            await fetch('https://navigiu.netlify.app/.netlify/functions/user-activity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...activity,
                    platform: 'telegram_bot'
                })
            });
        } catch (error) {
            console.error('Failed to send activity to backend:', error);
        }
    }

    // Format time ago
    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (60 * 1000));
        const hours = Math.floor(diff / (60 * 60 * 1000));
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    // Load recent activities on app start
    loadRecentActivities() {
        const activities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
        const activityList = document.getElementById('activityList');
        
        if (activityList && activities.length > 0) {
            activityList.innerHTML = ''; // Clear existing
            
            activities.slice(0, 10).forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                
                const iconClass = activity.type === 'earn' ? 'earn' : activity.type === 'contest' ? 'contest' : activity.type === 'vip' ? 'vip' : activity.type === 'task' ? 'task' : 'earn';
                const icon = activity.type === 'contest' ? '🏆' : activity.type === 'vip' ? '💎' : activity.type === 'task' ? '✅' : activity.type === 'daily' ? '📅' : '+';
                
                activityItem.innerHTML = `
                    <div class="activity-icon ${iconClass}">${icon}</div>
                    <div class="activity-info">
                        <div class="activity-title">${activity.title}</div>
                        <div class="activity-time">${this.formatTimeAgo(activity.timestamp)}</div>
                    </div>
                    <div class="activity-points">${activity.points}</div>
                `;
                
                activityList.appendChild(activityItem);
            });
        }
    }

    joinContest(contestType) {
        const contestRequirements = {
            daily: 10,
            weekly: 30,
            monthly: 200
        };
        
        const required = contestRequirements[contestType];
        const watched = this.getContestAdsWatched(contestType);
        
        if (watched >= required) {
            // User can join the contest
            this.userStats.contestsJoined += 1;
            this.updateStatsDisplay();
            this.showToast(`🏆 Successfully joined the ${contestType} contest!`, 'success');
            this.addActivity(`${contestType.charAt(0).toUpperCase() + contestType.slice(1)} Contest`, 'Joined', 'contest');
            this.tg.HapticFeedback.notificationOccurred('success');
            
            // Update button state
            const btn = document.getElementById(`${contestType}JoinBtn`);
            btn.textContent = 'Joined ✓';
            btn.disabled = true;
            btn.style.backgroundColor = '#27ae60';
            
            // Send to backend
            this.sendContestJoinToBackend(contestType, 0);
        } else {
            // User needs to watch more contest ads
            this.watchContestAd(contestType);
        }
    }
    
    async watchContestAd(contestType) {
        // Different cooldowns for each contest type
        const cooldowns = {
            daily: 3 * 60 * 1000,   // 3 minutes
            weekly: 15 * 60 * 1000, // 15 minutes
            monthly: 30 * 60 * 1000 // 30 minutes
        };
        
        const lastContestAdTimeKey = `lastContestAdTime_${contestType}`;
        const lastContestAdTime = localStorage.getItem(lastContestAdTimeKey);
        const contestCooldown = cooldowns[contestType] || 3 * 60 * 1000;
        
        if (lastContestAdTime && Date.now() - parseInt(lastContestAdTime) < contestCooldown) {
            const remainingMs = contestCooldown - (Date.now() - parseInt(lastContestAdTime));
            const remainingMinutes = Math.floor(remainingMs / (60 * 1000));
            const remainingSeconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
            this.showToast(`⏰ Contest ad cooldown: ${remainingMinutes}m ${remainingSeconds}s`, 'info');
            
            // Start cooldown timer display for specific contest type
            this.startCooldownTimer('contest', contestType);
            return;
        }

        try {
            // Show single 15s Monetag Rewarded Interstitial for contest participation (no points earned)
            if (typeof show_9656288 === 'function') {
                const contestBtn = document.getElementById(`${contestType}JoinBtn`);
                const originalText = contestBtn.textContent;
                
                // Show progress for single 15s contest ad
                let contestAdTime = 0;
                const contestAdDuration = 15; // Single 15s ad
                
                const contestInterval = setInterval(() => {
                    contestAdTime++;
                    contestBtn.textContent = `Contest Ad: ${contestAdTime}/15s`;
                    
                    if (contestAdTime >= contestAdDuration) {
                        clearInterval(contestInterval);
                    }
                }, 1000);
                
                // Show single Monetag Rewarded Interstitial (15s for contest)
                await show_9656288();
                
                // Ensure user watched full 15 seconds
                if (contestAdTime < contestAdDuration) {
                    const remainingTime = contestAdDuration - contestAdTime;
                    await new Promise(resolve => setTimeout(resolve, remainingTime * 1000));
                }
                
                clearInterval(contestInterval);
                
                // Only count if watched full 15s ad
                this.incrementContestAds(contestType);
                
                // Update contest eligibility
                this.updateContestEligibility();
                
                // Set contest ad cooldown for specific contest type
                localStorage.setItem(lastContestAdTimeKey, Date.now().toString());
                
                // Save user progress
                this.saveUserProgress();
                
                this.showToast('📺 Contest 15s ad watched! Contest progress +1', 'info');
                this.tg.HapticFeedback.impactOccurred('light');
                
                // Send to backend
                await this.sendContestAdToBackend(contestType);
                
                // Start cooldown timer for specific contest type
                this.startCooldownTimer('contest', contestType);
                
                // Reset button text
                contestBtn.textContent = originalText;
            }
        } catch (error) {
            console.error('Contest ad error:', error);
            this.showToast('❌ Contest ad not available right now', 'error');
        }
    }
    
    getContestAdsWatched(contestType) {
        const key = `contestAds_${contestType}`;
        return parseInt(localStorage.getItem(key) || '0');
    }
    
    incrementContestAds(contestType) {
        const key = `contestAds_${contestType}`;
        const current = this.getContestAdsWatched(contestType);
        const newCount = current + 1;
        localStorage.setItem(key, newCount.toString());
        
        // Send to dashboard
        this.sendContestProgressToBackend(contestType, newCount);
        
        // Force update contest eligibility display
        this.updateContestEligibility();
        
        console.log(`✅ Contest ${contestType} ads incremented: ${current} → ${newCount}`);
        this.showToast(`📊 ${contestType.toUpperCase()} contest progress: ${newCount}`, 'info');
    }

    // Send contest progress to backend
    async sendContestProgressToBackend(contestType, adsWatched) {
        try {
            await fetch('https://navigiu.netlify.app/.netlify/functions/contest-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    username: this.user?.username,
                    contest_type: contestType,
                    ads_watched: adsWatched,
                    platform: 'telegram_bot',
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.error('Failed to send contest progress:', error);
        }
    }
    
    updateContestEligibility() {
        const contests = ['daily', 'weekly', 'monthly', 'vip'];
        const requirements = { daily: 10, weekly: 30, monthly: 200, vip: 50 };
        
        // Check VIP status for VIP contest
        const isVip = this.userStats.vipStatus !== 'FREE';
        
        contests.forEach(contest => {
            const watched = this.getContestAdsWatched(contest);
            const required = requirements[contest];
            const card = document.getElementById(`${contest}Contest`);
            const progress = document.getElementById(`${contest}Progress`);
            const btn = document.getElementById(`${contest}JoinBtn`);
            
            // Special handling for VIP contest
            if (contest === 'vip' && !isVip) {
                progress.textContent = 'VIP Required';
                card.style.borderColor = '#666';
                card.style.backgroundColor = 'rgba(102, 102, 102, 0.1)';
                btn.textContent = 'VIP Required';
                btn.disabled = true;
                btn.style.backgroundColor = '#666';
                return;
            }
            
            // Update progress display
            progress.textContent = `${watched}/${required}`;
            
            if (watched >= required) {
                // Eligible - Green
                card.style.borderColor = '#27ae60';
                card.style.backgroundColor = 'rgba(39, 174, 96, 0.1)';
                btn.textContent = `Join ${contest.charAt(0).toUpperCase() + contest.slice(1)} Contest`;
                btn.disabled = false;
                btn.style.backgroundColor = '#27ae60';
            } else {
                // Need more ads - Blue
                card.style.borderColor = '#3498db';
                card.style.backgroundColor = 'rgba(52, 152, 219, 0.05)';
                btn.textContent = `Watch Contest Ads (${watched}/${required})`;
                btn.disabled = false;
                btn.style.backgroundColor = '#3498db';
            }
        });
    }
    
    async sendContestAdToBackend(contestType) {
        try {
            await fetch('https://navigiu.netlify.app/.netlify/functions/contest-ad-watch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    contest_type: contestType,
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.error('Contest ad backend error:', error);
        }
    }
    
    async sendContestJoinToBackend(contestType, cost) {
        try {
            await fetch('https://navigi-bot.netlify.app/.netlify/functions/contest-join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    contest_type: contestType,
                    entry_cost: cost,
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.error('Contest join error:', error);
        }
    }
    
    claimDailyLogin() {
        // Check if already claimed (24h timer)
        const lastClaim = parseInt(this.lastDailyLogin);
        const now = Date.now();
        const timeSinceLastClaim = now - lastClaim;
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (timeSinceLastClaim < twentyFourHours) {
            const remainingTime = twentyFourHours - timeSinceLastClaim;
            const hoursLeft = Math.floor(remainingTime / (60 * 60 * 1000));
            const minutesLeft = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
            this.showToast(`⏰ Next daily login in: ${hoursLeft}h ${minutesLeft}m`, 'info');
            return;
        }
        
        // Add daily login reward
        this.userStats.totalPoints += 1;
        this.userStats.totalBalance += 0.01;
        
        // Update last claim time
        this.lastDailyLogin = now.toString();
        localStorage.setItem('lastDailyLogin', this.lastDailyLogin);
        this.dailyLoginClaimed = true;
        
        // Update display
        this.updateStatsDisplay();
        this.updateDailyLoginUI();
        
        // Show success message
        this.showToast('🎉 Daily login reward claimed! +1 point', 'success');
        this.addActivity('Daily Login', '+1 point', 'daily');
        
        // Save progress
        this.saveUserProgress();
        
        // Send to backend
        this.sendDailyLoginToBackend();
    }

    // Update daily login UI with timer
    updateDailyLoginUI() {
        const lastClaim = parseInt(this.lastDailyLogin);
        const now = Date.now();
        const timeSinceLastClaim = now - lastClaim;
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        const taskBtn = document.querySelector('#dailyLoginTask .task-btn');
        if (!taskBtn) return;
        
        if (timeSinceLastClaim < twentyFourHours) {
            const remainingTime = twentyFourHours - timeSinceLastClaim;
            const hoursLeft = Math.floor(remainingTime / (60 * 60 * 1000));
            const minutesLeft = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
            
            taskBtn.innerHTML = `<i class="fas fa-clock"></i> ${hoursLeft}h ${minutesLeft}m`;
            taskBtn.disabled = true;
            taskBtn.style.opacity = '0.6';
            
            // Update timer every minute
            setTimeout(() => this.updateDailyLoginUI(), 60000);
        } else {
            taskBtn.innerHTML = '<i class="fas fa-gift"></i> Claim';
            taskBtn.disabled = false;
            taskBtn.style.opacity = '1';
        }
    }
    
    async sendDailyLoginToBackend() {
        try {
            await fetch('https://navigi-bot.netlify.app/.netlify/functions/daily-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    points_earned: 1,
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.error('Daily login error:', error);
        }
    }
    
    sendTONStars() {
        this.showModal(
            '⭐ Send TON Stars',
            `
            <div style="text-align: center;">
                <p style="margin-bottom: 20px;">Send TON Stars to boost your position in the leaderboard!</p>
                <div style="background: var(--tg-theme-secondary-bg-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 15px;">Star Packages:</h4>
                    <button class="upgrade-btn" onclick="telegramApp.sendStars(100)" style="margin-bottom: 10px;">
                        ⭐ 100 Stars - Small boost
                    </button>
                    <button class="upgrade-btn" onclick="telegramApp.sendStars(500)" style="margin-bottom: 10px;">
                        ⭐ 500 Stars - Medium boost
                    </button>
                    <button class="upgrade-btn" onclick="telegramApp.sendStars(1000)">
                        ⭐ 1000 Stars - Large boost
                    </button>
                </div>
                <p style="font-size: 12px; color: var(--tg-theme-hint-color);">
                    Stars help you rank higher in the weekly leaderboard
                </p>
            </div>
            `,
            [{ text: 'Cancel', action: () => this.closeModal() }]
        );
    }
    
    sendStars(amount) {
        // Send TON Stars to your wallet: UQBVeJflae5yTTgS6wczgpDkDcyEAnmA88bZyaiB3lYGqWw9
        try {
            // Use Telegram Stars API
            if (this.tg.showPopup) {
                this.tg.showPopup({
                    title: '⭐ Send TON Stars',
                    message: `Send ${amount} TON Stars to boost your leaderboard position?`,
                    buttons: [
                        { id: 'send', type: 'default', text: `Send ${amount} Stars` },
                        { id: 'cancel', type: 'cancel', text: 'Cancel' }
                    ]
                }, (buttonId) => {
                    if (buttonId === 'send') {
                        this.processTONStarsPayment(amount);
                    }
                });
            } else {
                // Fallback method
                this.processTONStarsPayment(amount);
            }
        } catch (error) {
            console.error('TON Stars error:', error);
            this.showToast('❌ Stars payment not available', 'error');
        }
    }
    
    async processTONStarsPayment(amount) {
        try {
            // Create payment request to your TON wallet
            const paymentData = {
                amount: amount,
                currency: 'TON_STARS',
                wallet_address: 'UQBVeJflae5yTTgS6wczgpDkDcyEAnmA88bZyaiB3lYGqWw9',
                user_id: this.user?.id,
                timestamp: Date.now()
            };
            
            // Send payment request to backend
            const response = await fetch('https://navigiu.netlify.app/.netlify/functions/ton-stars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    stars_amount: amount,
                    wallet_address: 'UQBVeJflae5yTTgS6wczgpDkDcyEAnmA88bZyaiB3lYGqWw9',
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                this.showToast(`⭐ ${amount} Stars payment initiated! Check your wallet.`, 'success');
                this.closeModal();
                
                // Add to activity log
                this.addActivity('TON Stars', `${amount} stars sent`, 'stars');
                
                // Haptic feedback
                this.tg.HapticFeedback.notificationOccurred('success');
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            console.error('TON Stars payment error:', error);
            this.showToast('❌ Payment failed. Please try again.', 'error');
        }
    }
    
    async sendStarsToBackend(amount) {
        try {
            await fetch('https://navigiu.netlify.app/.netlify/functions/ton-stars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    stars_amount: amount,
                    wallet_address: 'UQBVeJflae5yTTgS6wczgpDkDcyEAnmA88bZyaiB3lYGqWw9',
                    timestamp: Date.now()
                })
            });
        } catch (error) {
            console.error('Stars backend error:', error);
        }
    }
    
    // Double Ads System (2x15s ads)
    async showDoubleAds() {
        try {
            // First 15-second ad
            this.showToast('📺 First ad (15s) starting...', 'info');
            await show_9656288(); // Regular interstitial (15s)
            
            // Wait 2 seconds between ads
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Second 15-second ad
            this.showToast('📺 Second ad (15s) starting...', 'info');
            await show_9656288(); // Regular interstitial (15s)
            
            this.showToast('✅ Both 15-second ads completed!', 'success');
            
        } catch (error) {
            console.error('Double ads error:', error);
            throw error; // Re-throw to be handled by main watchAd function
        }
    }
    
    // Daily Ad Limit System
    getDailyAdLimit() {
        const vipLimits = {
            'FREE': 12,
            'KING': 16,
            'EMPEROR': 20,
            'LORD': 25
        };
        return vipLimits[this.userStats.vipStatus] || 12;
    }
    
    getTodayAdsWatched() {
        const today = new Date().toDateString();
        const storedData = localStorage.getItem('dailyAdsWatched');
        
        if (storedData) {
            const data = JSON.parse(storedData);
            if (data.date === today) {
                return data.count;
            }
        }
        
        // Reset if new day
        return 0;
    }
    
    incrementTodayAdsWatched() {
        const today = new Date().toDateString();
        const currentCount = this.getTodayAdsWatched();
        
        localStorage.setItem('dailyAdsWatched', JSON.stringify({
            date: today,
            count: currentCount + 1
        }));
        
        // Update display
        this.updateDailyProgress();
    }
    
    updateDailyProgress() {
        const limit = this.getDailyAdLimit();
        const watched = this.getTodayAdsWatched();
        const progressElement = document.getElementById('dailyProgress');
        
        if (progressElement) {
            progressElement.textContent = `${watched}/${limit} ads today`;
        }
        
        // Update watch ad button
        const watchBtn = document.getElementById('watchAdBtn');
        if (watchBtn && watched >= limit) {
            watchBtn.innerHTML = `<i class="fas fa-ban"></i> Daily Limit Reached`;
            watchBtn.disabled = true;
        }
    }
    
    getNextDayReset() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow.getTime();
    }
    
    initContestTimers() {
        // Get contest end times from backend or set defaults
        this.contestEndTimes = {
            daily: this.getNextDailyReset(),
            weekly: this.getNextWeeklyReset(),
            monthly: this.getNextMonthlyReset()
        };
        
        // Start countdown timers
        this.startCountdownTimers();
    }
    
    getNextDailyReset() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow.getTime();
    }
    
    getNextWeeklyReset() {
        const now = new Date();
        const nextWeek = new Date(now);
        const daysUntilSunday = 7 - now.getDay();
        nextWeek.setDate(nextWeek.getDate() + daysUntilSunday);
        nextWeek.setHours(0, 0, 0, 0);
        return nextWeek.getTime();
    }
    
    getNextMonthlyReset() {
        const now = new Date();
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return nextMonth.getTime();
    }
    
    startCountdownTimers() {
        setInterval(() => {
            this.updateCountdowns();
        }, 1000); // Update every second
        
        // Initial update
        this.updateCountdowns();
    }
    
    updateCountdowns() {
        const now = Date.now();
        
        Object.keys(this.contestEndTimes).forEach(contest => {
            const endTime = this.contestEndTimes[contest];
            const remaining = endTime - now;
            
            const countdownElement = document.getElementById(`${contest}Countdown`);
            if (countdownElement) {
                if (remaining > 0) {
                    countdownElement.textContent = this.formatCountdown(remaining);
                } else {
                    countdownElement.textContent = this.isArabic ? 'انتهت المسابقة' : 'Contest ended';
                    // Reset contest for next period
                    this.resetContest(contest);
                }
            }
        });
    }
    
    formatCountdown(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            const remainingHours = hours % 24;
            const remainingMinutes = minutes % 60;
            return this.isArabic ? 
                `${days}ي ${remainingHours}س ${remainingMinutes}د` :
                `${days}d ${remainingHours}h ${remainingMinutes}m`;
        } else if (hours > 0) {
            const remainingMinutes = minutes % 60;
            const remainingSeconds = seconds % 60;
            return this.isArabic ?
                `${hours}س ${remainingMinutes}د ${remainingSeconds}ث` :
                `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
        } else {
            const remainingMinutes = minutes % 60;
            const remainingSeconds = seconds % 60;
            return this.isArabic ?
                `${remainingMinutes}د ${remainingSeconds}ث` :
                `${remainingMinutes}m ${remainingSeconds}s`;
        }
    }
    
    resetContest(contestType) {
        // Reset contest ads counter
        localStorage.removeItem(`contestAds_${contestType}`);
        
        // Update end time for next period
        switch(contestType) {
            case 'daily':
                this.contestEndTimes.daily = this.getNextDailyReset();
                break;
            case 'weekly':
                this.contestEndTimes.weekly = this.getNextWeeklyReset();
                break;
            case 'monthly':
                this.contestEndTimes.monthly = this.getNextMonthlyReset();
                break;
        }
        
        // Update eligibility display
        this.updateContestEligibility();
    }

    showVipRequired() {
        this.showModal(
            '👑 VIP Required',
            'This contest is only available for VIP members. Upgrade your account to access exclusive contests and higher rewards!',
            [
                { text: 'Upgrade to VIP', action: () => { this.switchTab('vip'); this.closeModal(); } },
                { text: 'Cancel', action: () => this.closeModal() }
            ]
        );
    }

    upgradeVip(tier) {
        const prices = {
            king: 2.50,
            emperor: 9.00,
            lord: 25.00
        };
        
        const tierNames = {
            king: 'KING TIER',
            emperor: 'EMPEROR TIER', 
            lord: 'LORD TIER'
        };
        
        // Show payment modal with Telegram payment integration
        this.showVipPaymentModal(tierNames[tier], prices[tier], tier);
    }

    showVipPaymentModal(tierName, price, tier) {
        const modalBody = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 15px;">👑</div>
                <h3 style="margin-bottom: 10px;">${tierName}</h3>
                <p style="font-size: 24px; font-weight: bold; color: var(--primary-color); margin-bottom: 20px;">$${price.toFixed(2)}/month</p>
                
                <div style="background: var(--tg-theme-secondary-bg-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 15px;">Payment Methods:</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <button class="upgrade-btn" onclick="telegramApp.payWithTON('${tier}', ${price})">
                            💎 Pay with TON Wallet
                        </button>
                        <button class="upgrade-btn" onclick="telegramApp.payWithTRC20('${tier}', ${price})">
                            💰 Pay with USDT (TRC20)
                        </button>
                    </div>
                </div>
                
                <p style="font-size: 12px; color: var(--tg-theme-hint-color);">
                    Secure crypto payments - Choose your preferred method
                </p>
            </div>
        `;
        
        this.showModal('Upgrade to VIP', modalBody, [
            { text: 'Cancel', action: () => this.closeModal() }
        ]);
    }

    payWithTON(tier, price) {
        // TON Wallet payment - 1 TON = 3.6 USDT
        const tonAmount = (price / 3.6).toFixed(2);
        
        this.showModal(
            '💎 TON Wallet Payment',
            `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 15px;">💎</div>
                <h3 style="margin-bottom: 15px;">${tier.toUpperCase()} VIP</h3>
                <p style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">Amount: ${tonAmount} TON</p>
                
                <div style="background: var(--tg-theme-secondary-bg-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin-bottom: 10px;"><strong>TON Wallet Address:</strong></p>
                                         <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 15px; word-break: break-all; color: black; font-family: monospace;">
                         UQBVeJflae5yTTgS6wczgpDkDcyEAnmA88bZyaiB3lYGqWw9
                     </div>
                    <button class="copy-btn" onclick="telegramApp.copyTONAddress()" style="width: 100%; margin-bottom: 15px;">
                        📋 Copy TON Address
                    </button>
                    <input type="text" id="tonTxHash" placeholder="Enter transaction hash after payment" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--tg-theme-secondary-bg-color); margin-bottom: 15px;">
                </div>
                
                <p style="font-size: 12px; color: var(--tg-theme-hint-color); margin-bottom: 20px;">
                    Send exactly ${tonAmount} TON to the address above, then enter the transaction hash
                </p>
            </div>
            `,
            [
                { text: 'Submit Payment', action: () => this.submitTONPayment(tier, price) },
                { text: 'Cancel', action: () => this.closeModal() }
            ]
        );
    }

    payWithTRC20(tier, price) {
        // TRC20 USDT payment
        this.showModal(
            '💰 USDT (TRC20) Payment',
            `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 48px; margin-bottom: 15px;">💰</div>
                <h3 style="margin-bottom: 15px;">${tier.toUpperCase()} VIP</h3>
                <p style="font-size: 20px; font-weight: bold; margin-bottom: 20px;">Amount: $${price.toFixed(2)} USDT</p>
                
                <div style="background: var(--tg-theme-secondary-bg-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin-bottom: 10px;"><strong>TRC20 USDT Address:</strong></p>
                    <div style="background: white; padding: 10px; border-radius: 8px; margin-bottom: 15px; word-break: break-all; color: black; font-family: monospace;">
                        TLDsutnxpdLZaRxhGWBJismwsjY3WITHWX
                    </div>
                    <button class="copy-btn" onclick="telegramApp.copyTRC20Address()" style="width: 100%; margin-bottom: 15px;">
                        📋 Copy USDT Address
                    </button>
                    <input type="text" id="usdtTxHash" placeholder="Enter transaction hash after payment" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--tg-theme-secondary-bg-color); margin-bottom: 15px;">
                </div>
                
                <p style="font-size: 12px; color: var(--tg-theme-hint-color); margin-bottom: 20px;">
                    Send exactly $${price.toFixed(2)} USDT (TRC20) to the address above, then enter the transaction hash
                </p>
            </div>
            `,
            [
                { text: 'Submit Payment', action: () => this.submitTRC20Payment(tier, price) },
                { text: 'Cancel', action: () => this.closeModal() }
            ]
        );
    }

    copyTONAddress() {
        const address = 'UQBVeJflae5yTTgS6wczgpDkDcyEAnmA88bZyaiB3lYGqWw9';
        navigator.clipboard.writeText(address).then(() => {
            this.showToast('📋 TON address copied!', 'success');
        });
    }

    copyTRC20Address() {
        const address = 'TLDsutnxpdLZaRxhGWBJismwsjY3WITHWX';
        navigator.clipboard.writeText(address).then(() => {
            this.showToast('📋 USDT address copied!', 'success');
        });
    }

    async submitTONPayment(tier, price) {
        const txHash = document.getElementById('tonTxHash').value.trim();
        const appId = document.getElementById('appId')?.value.trim() || this.user?.id;
        
        if (!txHash) {
            this.showToast('❌ Please enter transaction hash', 'error');
            return;
        }

        try {
            const response = await fetch('https://navigiu.netlify.app/.netlify/functions/vip-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    username: this.user?.username || `@user${this.user?.id}`,
                    telegram_user: this.user,
                    vip_tier: tier,
                    price: price,
                    payment_method: 'TON',
                    transaction_hash: txHash,
                    app_id: appId,
                    platform: 'telegram_bot',
                    status: 'pending',
                    timestamp: Date.now()
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Notify admin bot about new VIP request
                await this.notifyAdminBot('vip_request', {
                    user_id: this.user?.id,
                    username: this.user?.username,
                    vip_tier: tier,
                    payment_method: 'TON',
                    amount: price,
                    transaction_hash: txHash,
                    app_id: appId
                });

                this.showToast('✅ Payment submitted to admin dashboard!', 'success');
                this.showToast('📧 You will get notification when approved (within 6h)', 'info');
                this.closeModal();
                
                // Add to activity log
                this.addActivity('VIP Payment', `${tier} - Pending approval`, 'vip');
            } else {
                this.showToast('❌ Failed to submit payment. Try again.', 'error');
            }
        } catch (error) {
            console.error('Payment submission error:', error);
            this.showToast('❌ Network error. Please try again.', 'error');
        }
    }

    async submitTRC20Payment(tier, price) {
        const txHash = document.getElementById('usdtTxHash').value.trim();
        const appId = document.getElementById('appId')?.value.trim() || this.user?.id;
        
        if (!txHash) {
            this.showToast('❌ Please enter transaction hash', 'error');
            return;
        }

        try {
            const response = await fetch('https://navigiu.netlify.app/.netlify/functions/vip-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    username: this.user?.username || `@user${this.user?.id}`,
                    telegram_user: this.user,
                    vip_tier: tier,
                    price: price,
                    payment_method: 'TRC20_USDT',
                    transaction_hash: txHash,
                    app_id: appId,
                    platform: 'telegram_bot',
                    status: 'pending',
                    timestamp: Date.now()
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Notify admin bot about new VIP request
                await this.notifyAdminBot('vip_request', {
                    user_id: this.user?.id,
                    username: this.user?.username,
                    vip_tier: tier,
                    payment_method: 'TRC20',
                    amount: `${price} USDT`,
                    transaction_hash: txHash,
                    app_id: appId
                });

                this.showToast('✅ Payment submitted to admin dashboard!', 'success');
                this.showToast('📧 You will get notification when approved (within 6h)', 'info');
                this.closeModal();
                
                // Add to activity log
                this.addActivity('VIP Payment', `${tier} - Pending approval`, 'vip');
            } else {
                this.showToast('❌ Failed to submit payment. Try again.', 'error');
            }
        } catch (error) {
            console.error('Payment submission error:', error);
            this.showToast('❌ Network error. Please try again.', 'error');
        }
    }

    processVipUpgrade(tier) {
        this.userStats.vipStatus = tier.toUpperCase();
        this.updateStatsDisplay();
        this.showToast(`🎉 Successfully upgraded to ${tier.toUpperCase()} VIP!`, 'success');
        this.tg.HapticFeedback.notificationOccurred('success');
        
        // Send data to backend (in real app)
        this.sendVipUpgradeToBackend(tier);
    }

    async sendVipUpgradeToBackend(tier) {
        try {
            // In real app, send to your backend
            const response = await fetch('/api/vip/upgrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    tier: tier,
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                console.log('VIP upgrade sent to backend successfully');
            }
        } catch (error) {
            console.error('Failed to send VIP upgrade to backend:', error);
        }
    }

    showWithdraw() {
        this.showModal(
            '💰 Withdraw Earnings',
            `
            <div style="text-align: center;">
                <p style="margin-bottom: 20px;">Available Balance: <strong>$${this.userStats.totalBalance.toFixed(2)}</strong></p>
                <div style="background: var(--tg-theme-secondary-bg-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 15px;">Withdrawal Methods:</h4>
                    
                    <button class="upgrade-btn" onclick="telegramApp.withdrawTo('usdt')" style="margin-bottom: 10px;">
                        💰 USDT (TRC20) - Min: $3.00
                    </button>
                    
                    <button class="upgrade-btn" onclick="telegramApp.withdrawTo('binance')" style="margin-bottom: 10px;">
                        🟡 Binance Pay - Min: $2.00
                    </button>
                    
                    <button class="upgrade-btn" onclick="telegramApp.withdrawTo('ton')">
                        💎 TON Wallet - Min: 1 TON ($3.60)
                    </button>
                </div>
                <p style="font-size: 12px; color: var(--tg-theme-hint-color);">
                    Processing time: 24-48 hours
                </p>
            </div>
            `,
            [{ text: 'Cancel', action: () => this.closeModal() }]
        );
    }

    withdrawTo(method) {
        const minAmounts = {
            usdt: 3.00,
            binance: 2.00,
            ton: 3.60 // 1 TON = $3.60
        };
        
        if (this.userStats.totalBalance < minAmounts[method]) {
            this.showToast(`❌ Minimum withdrawal is $${minAmounts[method].toFixed(2)}`, 'error');
            return;
        }
        
        let methodName = '';
        let inputPlaceholder = '';
        
        switch(method) {
            case 'usdt':
                methodName = 'USDT (TRC20)';
                inputPlaceholder = 'Enter your TRC20 USDT wallet address';
                break;
            case 'binance':
                methodName = 'Binance Pay';
                inputPlaceholder = 'Enter your Binance Pay ID';
                break;
            case 'ton':
                methodName = 'TON Wallet';
                inputPlaceholder = 'Enter your TON wallet address';
                break;
        }
        
        this.showModal(
            `💸 Withdraw via ${methodName}`,
            `
            <div style="text-align: center;">
                <p style="margin-bottom: 15px;">Withdrawal Amount: <strong>$${this.userStats.totalBalance.toFixed(2)}</strong></p>
                <input type="text" id="withdrawAddress" placeholder="${inputPlaceholder}" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid var(--tg-theme-secondary-bg-color); margin-bottom: 15px;">
                <p style="font-size: 12px; color: var(--tg-theme-hint-color);">
                    Processing time: 24-48 hours
                </p>
            </div>
            `,
            [
                { text: 'Submit Request', action: () => this.submitWithdrawal(method) },
                { text: 'Cancel', action: () => this.closeModal() }
            ]
        );
    }
    
    async submitWithdrawal(method) {
        const address = document.getElementById('withdrawAddress').value.trim();
        if (!address) {
            this.showToast('❌ Please enter withdrawal address/ID', 'error');
            return;
        }
        
        try {
            const response = await fetch('https://navigi-bot.netlify.app/.netlify/functions/withdrawal-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    method: method,
                    amount: this.userStats.totalBalance,
                    address: address,
                    timestamp: Date.now()
                })
            });
            
            if (response.ok) {
                this.showToast('✅ Withdrawal request submitted!', 'success');
                this.closeModal();
            } else {
                this.showToast('❌ Failed to submit request. Try again.', 'error');
            }
        } catch (error) {
            console.error('Withdrawal error:', error);
            this.showToast('❌ Network error. Please try again.', 'error');
        }
    }

    copyReferralCode() {
        const referralCode = document.getElementById('referralCode').textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(referralCode).then(() => {
                this.showToast('📋 Referral code copied!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = referralCode;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('📋 Referral code copied!', 'success');
        }
        
        this.tg.HapticFeedback.impactOccurred('light');
    }

    shareReferral() {
        const referralCode = document.getElementById('referralCode').textContent;
        const shareText = `🚀 Join me on NAVIGI SBARO and earn money by watching ads! Use my referral code: ${referralCode}`;
        const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/your_bot_username')}&text=${encodeURIComponent(shareText)}`;
        
        this.tg.openTelegramLink(shareUrl);
    }

    toggleLanguage() {
        this.isArabic = !this.isArabic;
        localStorage.setItem('isArabic', this.isArabic.toString());
        
        const langBtn = document.getElementById('languageBtn');
        langBtn.innerHTML = this.isArabic ? '🇸🇦' : '🇺🇸';
        
        // Apply language changes
        this.applyLanguage();
        this.showToast(this.isArabic ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English', 'success');
    }
    
    applyLanguage() {
        // Apply RTL/LTR direction
        document.body.dir = this.isArabic ? 'rtl' : 'ltr';
        document.body.classList.toggle('arabic', this.isArabic);
        
        // Update key UI elements
        const welcomeText = document.getElementById('welcomeText');
        if (welcomeText) {
            welcomeText.textContent = this.isArabic ? 'مرحباً بعودتك!' : 'Welcome back!';
        }
        
        // Update navigation labels
        const navItems = document.querySelectorAll('.nav-item span');
        const navLabels = this.isArabic ? 
            ['الرئيسية', 'اربح', 'المسابقات', 'في آي بي', 'الملف الشخصي'] :
            ['Home', 'Earn', 'Contests', 'VIP', 'Profile'];
        
        navItems.forEach((item, index) => {
            if (navLabels[index]) {
                item.textContent = navLabels[index];
            }
        });
        
        // Update stat labels
        const statLabels = document.querySelectorAll('.stat-label');
        const statTexts = this.isArabic ? 
            ['إجمالي النقاط', 'الرصيد', 'حالة في آي بي'] :
            ['Total Points', 'Balance', 'VIP Status'];
        
        statLabels.forEach((label, index) => {
            if (statTexts[index]) {
                label.textContent = statTexts[index];
            }
        });
        
        // Update contest eligibility text
        const adsRequirements = document.querySelectorAll('.ads-requirement');
        adsRequirements.forEach(req => {
            const currentText = req.textContent;
            if (currentText.includes('Need') || currentText.includes('تحتاج')) {
                const number = currentText.match(/\d+/)[0];
                req.textContent = this.isArabic ? 
                    `تحتاج ${number} إعلان مسابقة` : 
                    `Need ${number} contest ads`;
            }
        });
        
        // Update language setting display
        const langSetting = document.querySelector('.setting-item .setting-value');
        if (langSetting) {
            langSetting.textContent = this.isArabic ? 'العربية' : 'English';
        }
    }

    toggleNotifications() {
        const toggleIcon = document.querySelector('.toggle-icon');
        const isEnabled = toggleIcon.classList.contains('fa-toggle-on');
        
        if (isEnabled) {
            toggleIcon.classList.remove('fa-toggle-on');
            toggleIcon.classList.add('fa-toggle-off');
            toggleIcon.style.color = 'var(--tg-theme-hint-color)';
            this.showToast('🔕 Notifications disabled', 'info');
        } else {
            toggleIcon.classList.remove('fa-toggle-off');
            toggleIcon.classList.add('fa-toggle-on');
            toggleIcon.style.color = 'var(--success-color)';
            this.showToast('🔔 Notifications enabled', 'success');
        }
    }

    showNotifications() {
        this.showModal(
            '🔔 Notifications',
            `
            <div class="activity-list">
                <div class="activity-item">
                    <div class="activity-icon earn">📢</div>
                    <div class="activity-info">
                        <div class="activity-title">Welcome to NAVIGI SBARO!</div>
                        <div class="activity-time">Today</div>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon contest">🏆</div>
                    <div class="activity-info">
                        <div class="activity-title">New contest available</div>
                        <div class="activity-time">2 hours ago</div>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon earn">💰</div>
                    <div class="activity-info">
                        <div class="activity-title">Daily bonus available</div>
                        <div class="activity-time">Yesterday</div>
                    </div>
                </div>
            </div>
            `,
            [{ text: 'Close', action: () => this.closeModal() }]
        );
    }

    showSupport() {
        this.showModal(
            '❓ Support',
            `
            <div style="text-align: center;">
                <p style="margin-bottom: 20px;">Need help? Contact our support team:</p>
                <div style="background: var(--tg-theme-secondary-bg-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <p style="margin-bottom: 10px;"><strong>📧 Email:</strong> support@navigi-sbaro.com</p>
                    <p style="margin-bottom: 10px;"><strong>💬 Telegram:</strong> @SbaroSupport</p>
                    <p><strong>⏰ Hours:</strong> 24/7</p>
                </div>
                <p style="font-size: 12px; color: var(--tg-theme-hint-color);">
                    We typically respond within 2-4 hours
                </p>
            </div>
            `,
            [{ text: 'Close', action: () => this.closeModal() }]
        );
    }

    showModal(title, body, actions = []) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalActions = document.getElementById('modalActions');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = body;
        
        // Clear and add actions
        modalActions.innerHTML = '';
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.text;
            button.className = 'upgrade-btn';
            button.style.margin = '0 5px';
            button.onclick = action.action;
            modalActions.appendChild(button);
        });
        
        modal.classList.add('show');
        modal.style.display = 'flex';
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('show');
        modal.style.display = 'none';
    }

    showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--accent-color)' : 'var(--primary-color)'};
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-weight: 500;
            z-index: 10000;
            animation: slideDown 0.3s ease;
        `;
        toast.textContent = message;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => {
                document.body.removeChild(toast);
                document.head.removeChild(style);
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showToast(`❌ ${message}`, 'error');
    }
    // Save user progress to localStorage
    saveUserProgress() {
        const progressData = {
            userStats: this.userStats,
            lastSaved: Date.now(),
            todayAdsWatched: localStorage.getItem('todayAdsWatched') || '0',
            lastAdTime: localStorage.getItem('lastAdTime') || '0',
            contestAdsWatched: localStorage.getItem('contestAdsWatched') || JSON.stringify({daily: 0, weekly: 0, monthly: 0}),
            lastContestAdTime: localStorage.getItem('lastContestAdTime') || '0'
        };
        
        localStorage.setItem('userProgress', JSON.stringify(progressData));
        console.log('User progress saved:', progressData);
    }

    // Load user progress from localStorage
    loadUserProgress() {
        try {
            const savedProgress = localStorage.getItem('userProgress');
            if (savedProgress) {
                const progressData = JSON.parse(savedProgress);
                
                // Restore user stats
                this.userStats = { ...this.userStats, ...progressData.userStats };
                
                console.log('User progress loaded:', progressData);
                return true;
            }
        } catch (error) {
            console.error('Failed to load user progress:', error);
        }
        return false;
    }

    // Start cooldown timer display
    startCooldownTimer(type = 'earn', contestType = null) {
        let cooldownTime, lastTimeKey;
        
        if (type === 'earn') {
            cooldownTime = 7 * 60 * 1000; // 7 minutes for earning ads
            lastTimeKey = 'lastAdTime';
        } else {
            // Different cooldowns for each contest type
            const contestCooldowns = {
                daily: 3 * 60 * 1000,   // 3 minutes
                weekly: 15 * 60 * 1000, // 15 minutes
                monthly: 30 * 60 * 1000 // 30 minutes
            };
            cooldownTime = contestCooldowns[contestType] || 3 * 60 * 1000;
            lastTimeKey = `lastContestAdTime_${contestType}`;
        }
        const lastTime = localStorage.getItem(lastTimeKey);
        
        if (!lastTime) return;
        
        const updateTimer = () => {
            const remainingMs = cooldownTime - (Date.now() - parseInt(lastTime));
            
            if (remainingMs <= 0) {
                // Cooldown finished
                if (type === 'earn') {
                    const watchBtn = document.getElementById('watchAdBtn');
                    if (watchBtn) {
                        watchBtn.innerHTML = '<i class="fas fa-play"></i> Watch Ads';
                        watchBtn.disabled = false;
                    }
                }
                return;
            }
            
            const minutes = Math.floor(remainingMs / (60 * 1000));
            const seconds = Math.floor((remainingMs % (60 * 1000)) / 1000);
            
            // Update button text with countdown
            if (type === 'earn') {
                const watchBtn = document.getElementById('watchAdBtn');
                if (watchBtn) {
                    watchBtn.innerHTML = `<i class="fas fa-clock"></i> Next ad in ${minutes}m ${seconds}s`;
                    watchBtn.disabled = true;
                }
            }
            
            // Continue timer
            setTimeout(updateTimer, 1000);
        };
        
        updateTimer();
    }

    // Task system functions
    async completeChannelTask() {
        if (this.tasks.channelSubscription) {
            this.showToast('✅ Channel subscription task already completed!', 'info');
            return;
        }
        
        // Open Telegram channel
        this.tg.openTelegramLink('https://t.me/NAVIGI_E');
        
        // Wait a bit then mark as completed
        setTimeout(() => {
            this.tasks.channelSubscription = true;
            localStorage.setItem('task_channel', 'true');
            
            // Award points
            this.userStats.totalPoints += 1;
            this.userStats.totalBalance += 0.01;
            this.updateStatsDisplay();
            
            this.showToast('🎉 Channel subscription completed! +1 point', 'success');
            this.addActivity('Channel Subscription', '+1 point', 'task');
            this.saveUserProgress();
            
            // Update UI
            this.updateTaskUI('channel');
        }, 3000);
    }

    async completeBot1Task() {
        if (this.tasks.visitBot1) {
            this.showToast('✅ Bot 1 visit task already completed!', 'info');
            return;
        }
        
        // Open bot 1
        this.tg.openTelegramLink('https://t.me/steamgiftcard_robot?start=_tgr_ZXq4pyM4ZmI0');
        
        // Wait a bit then mark as completed
        setTimeout(() => {
            this.tasks.visitBot1 = true;
            localStorage.setItem('task_bot1', 'true');
            
            // Award points
            this.userStats.totalPoints += 1;
            this.userStats.totalBalance += 0.01;
            this.updateStatsDisplay();
            
            this.showToast('🎉 Bot 1 visit completed! +1 point', 'success');
            this.addActivity('Bot Visit 1', '+1 point', 'task');
            this.saveUserProgress();
            
            // Update UI
            this.updateTaskUI('bot1');
        }, 3000);
    }

    async completeBot2Task() {
        if (this.tasks.visitBot2) {
            this.showToast('✅ Bot 2 visit task already completed!', 'info');
            return;
        }
        
        // Open bot 2
        this.tg.openTelegramLink('https://t.me/rollszvazdbot?start=_tgr_8dXyXXVhZDA0');
        
        // Wait a bit then mark as completed
        setTimeout(() => {
            this.tasks.visitBot2 = true;
            localStorage.setItem('task_bot2', 'true');
            
            // Award points
            this.userStats.totalPoints += 1;
            this.userStats.totalBalance += 0.01;
            this.updateStatsDisplay();
            
            this.showToast('🎉 Bot 2 visit completed! +1 point', 'success');
            this.addActivity('Bot Visit 2', '+1 point', 'task');
            this.saveUserProgress();
            
            // Update UI
            this.updateTaskUI('bot2');
        }, 3000);
    }

    async completeWebsiteTask() {
        if (this.tasks.visitWebsite) {
            this.showToast('✅ Website visit task already completed!', 'info');
            return;
        }
        
        // Open website
        this.tg.openLink('https://www.profitableratecpm.com/wzun0hab?key=d618b444e85c92f5cff5b3be66d62941');
        
        // Wait a bit then mark as completed
        setTimeout(() => {
            this.tasks.visitWebsite = true;
            localStorage.setItem('task_website', 'true');
            
            // Award points
            this.userStats.totalPoints += 1;
            this.userStats.totalBalance += 0.01;
            this.updateStatsDisplay();
            
            this.showToast('🎉 Website visit completed! +1 point', 'success');
            this.addActivity('Website Visit', '+1 point', 'task');
            this.saveUserProgress();
            
            // Update UI
            this.updateTaskUI('website');
        }, 3000);
    }

    // Update task UI
    updateTaskUI(taskType) {
        const taskMap = {
            'channel': '#channelTask',
            'bot1': '#bot1Task', 
            'bot2': '#bot2Task',
            'website': '#websiteTask'
        };
        
        const taskElement = document.querySelector(taskMap[taskType]);
        if (taskElement) {
            const taskBtn = taskElement.querySelector('.task-btn');
            if (taskBtn) {
                taskBtn.innerHTML = '<i class="fas fa-check"></i> Completed';
                taskBtn.disabled = true;
                taskBtn.style.opacity = '0.6';
                taskBtn.style.background = '#28a745';
            }
        }
    }

    // VIP Mining System
    async claimVipMining() {
        const vipLevel = this.userStats.vipStatus.toLowerCase();
        if (vipLevel === 'free') {
            this.showToast('❌ VIP Mining is only for VIP members!', 'error');
            return;
        }
        
        const miningData = this.vipMining[vipLevel];
        if (!miningData) return;
        
        const now = Date.now();
        const lastClaim = parseInt(miningData.lastClaim);
        const timeSinceClaim = now - lastClaim;
        const oneDay = 24 * 60 * 60 * 1000;
        
        // Reset daily mining if new day
        if (timeSinceClaim >= oneDay) {
            miningData.minedToday = 0;
            localStorage.setItem(`vip_${vipLevel}_mined`, '0');
        }
        
        // Check if can mine more
        if (miningData.minedToday >= miningData.dailyPoints) {
            const timeUntilReset = oneDay - (timeSinceClaim % oneDay);
            const hoursLeft = Math.floor(timeUntilReset / (60 * 60 * 1000));
            this.showToast(`⏰ VIP mining resets in ${hoursLeft}h`, 'info');
            return;
        }
        
        // Mine points (can claim 1-10 points at a time)
        const pointsToMine = Math.min(
            miningData.dailyPoints - miningData.minedToday,
            Math.floor(Math.random() * 10) + 1
        );
        
        // Award mined points
        this.userStats.totalPoints += pointsToMine;
        this.userStats.totalBalance += pointsToMine * 0.01;
        
        // Update mining data
        miningData.minedToday += pointsToMine;
        miningData.lastClaim = now.toString();
        
        // Save to localStorage
        localStorage.setItem(`vip_${vipLevel}_mined`, miningData.minedToday.toString());
        localStorage.setItem(`vip_${vipLevel}_last_claim`, miningData.lastClaim);
        
        // Update display
        this.updateStatsDisplay();
        this.updateVipMiningUI();
        
        this.showToast(`⛏️ VIP Mining: +${pointsToMine} points! (${miningData.minedToday}/${miningData.dailyPoints} today)`, 'success');
        this.addActivity('VIP Mining', `+${pointsToMine} points`, 'vip');
        this.saveUserProgress();
    }

    // Update VIP mining UI
    updateVipMiningUI() {
        const vipLevel = this.userStats.vipStatus.toLowerCase();
        if (vipLevel === 'free') return;
        
        const miningData = this.vipMining[vipLevel];
        const miningBtn = document.getElementById('vipMiningBtn');
        
        if (miningBtn && miningData) {
            const remaining = miningData.dailyPoints - miningData.minedToday;
            if (remaining > 0) {
                miningBtn.innerHTML = `<i class="fas fa-pickaxe"></i> Mine Points (${remaining} left)`;
                miningBtn.disabled = false;
                miningBtn.style.opacity = '1';
            } else {
                miningBtn.innerHTML = `<i class="fas fa-clock"></i> Mining Reset in 24h`;
                miningBtn.disabled = true;
                miningBtn.style.opacity = '0.6';
            }
                 }
     }

    // Initialize tasks UI
    initTasksUI() {
        // Update task buttons based on completion status
        if (this.tasks.channelSubscription) this.updateTaskUI('channel');
        if (this.tasks.visitBot1) this.updateTaskUI('bot1');
        if (this.tasks.visitBot2) this.updateTaskUI('bot2');
        if (this.tasks.visitWebsite) this.updateTaskUI('website');
    }

    // Reset referral leaderboard to zero
    resetReferralLeaderboard() {
        // Clear all referral data
        localStorage.removeItem('referralLeaderboard');
        localStorage.removeItem('weeklyReferrals');
        localStorage.removeItem('totalReferrals');
        
        // Reset user referral count
        this.userStats.referrals = 0;
        
        console.log('Referral leaderboard reset to zero');
    }

    // Reset today's progress
    resetTodayProgress() {
        // Reset daily ad count
        localStorage.setItem('todayAdsWatched', '0');
        
        // Reset contest ads for each type separately
        localStorage.setItem('contestAds_daily', '0');
        localStorage.setItem('contestAds_weekly', '0');
        localStorage.setItem('contestAds_monthly', '0');
        
        // Reset contest cooldowns for each type
        localStorage.removeItem('lastContestAdTime_daily');
        localStorage.removeItem('lastContestAdTime_weekly');
        localStorage.removeItem('lastContestAdTime_monthly');
        
        // Update display
        this.updateDailyProgress();
        this.updateContestEligibility();
        
        console.log('Today progress reset to zero');
    }

    // Reset all bot data completely
    resetAllBotData() {
        // Clear all localStorage data
        const keysToKeep = ['telegram_user_id', 'telegram_username']; // Keep user identity
        const allKeys = Object.keys(localStorage);
        
        allKeys.forEach(key => {
            if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
            }
        });
        
        // Reset user stats to zero
        this.userStats = {
            totalPoints: 0,
            totalBalance: 0,
            totalEarned: 0,
            vipStatus: 'FREE',
            vipExpiry: null,
            referrals: 0,
            level: 1,
            rank: 'Beginner',
            joinDate: new Date().toISOString().split('T')[0]
        };
        
        // Reset all progress
        this.todayAdsWatched = 0;
        this.lastAdTime = '0';
        this.lastDailyLogin = '0';
        
        // Reset VIP mining
        this.vipMining = {
            king: { dailyPoints: 10, minedToday: 0, lastClaim: '0' },
            emperor: { dailyPoints: 15, minedToday: 0, lastClaim: '0' },
            lord: { dailyPoints: 20, minedToday: 0, lastClaim: '0' }
        };
        
        // Reset tasks
        this.tasks = {
            channelSubscription: false,
            visitBot1: false,
            visitBot2: false,
            visitWebsite: false
        };

        // Reset activity log and notifications
        localStorage.removeItem('activityLog');
        localStorage.removeItem('notifications');
        localStorage.removeItem('unreadNotifications');
        
        // Update all UI elements
        this.updateUI();
        this.updateDailyProgress();
        this.updateContestEligibility();
        this.updateDailyLoginUI();
        this.updateVipMiningUI();
        this.initTasksUI();
        
        console.log('All bot data reset to zero');
        this.showToast('🔄 All data reset to zero!', 'success');
    }

    // Notify admin bot about important events
    async notifyAdminBot(eventType, data) {
        try {
            await fetch('https://navigiu.netlify.app/.netlify/functions/admin-bot-notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: eventType,
                    data: data,
                    timestamp: Date.now(),
                    source: 'main_bot'
                })
            });
        } catch (error) {
            console.error('Failed to notify admin bot:', error);
        }
    }

}

// Global functions for HTML onclick handlers
let telegramApp;

function switchTab(tabName) {
    telegramApp.switchTab(tabName);
}

function watchAd() {
    telegramApp.watchAd();
}

function joinContest(contestType) {
    telegramApp.joinContest(contestType);
}

function showVipRequired() {
    telegramApp.showVipRequired();
}

function upgradeVip(tier) {
    telegramApp.upgradeVip(tier);
}

function showWithdraw() {
    telegramApp.showWithdraw();
}

function copyReferralCode() {
    telegramApp.copyReferralCode();
}

function shareReferral() {
    telegramApp.shareReferral();
}

function toggleNotifications() {
    telegramApp.toggleNotifications();
}

function toggleLanguage() {
    telegramApp.toggleLanguage();
}

function showSupport() {
    telegramApp.showSupport();
}

function closeModal() {
    telegramApp.closeModal();
}

function claimDailyLogin() {
    telegramApp.claimDailyLogin();
}

function sendTONStars() {
    telegramApp.sendTONStars();
}

// New task functions
function completeChannelTask() {
    telegramApp.completeChannelTask();
}

function completeBot1Task() {
    telegramApp.completeBot1Task();
}

function completeBot2Task() {
    telegramApp.completeBot2Task();
}

function completeWebsiteTask() {
    telegramApp.completeWebsiteTask();
}

// VIP Mining function
function claimVipMining() {
    telegramApp.claimVipMining();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    telegramApp = new TelegramSbaroApp();
});

// Handle Telegram WebApp events
window.addEventListener('load', () => {
    if (window.Telegram?.WebApp) {
        console.log('Telegram WebApp detected');
    } else {
        console.log('Running outside Telegram - some features may be limited');
    }
});