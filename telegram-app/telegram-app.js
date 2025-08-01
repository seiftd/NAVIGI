// Telegram Mini App - NAVIGI SBARO
class TelegramSbaroApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.userStats = {
            totalPoints: 1250,
            totalBalance: 12.50,
            vipStatus: 'FREE',
            adsWatched: 156,
            contestsJoined: 8,
            referrals: 3
        };
        this.currentTab = 'home';
        this.isArabic = false;
        
        this.init();
    }

    async init() {
        try {
            // Initialize Telegram WebApp
            this.initTelegramWebApp();
            
            // Initialize UI
            this.initUI();
            
            // Load user data
            await this.loadUserData();
            
            // Initialize Monetag
            this.initMonetag();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log('NAVIGI SBARO Telegram Mini App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to initialize app. Please try again.');
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
            // In a real app, this would fetch from your backend
            // For now, we'll use the Telegram user data and mock stats
            
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
            }
            
            // Update stats display
            this.updateStatsDisplay();
            
            // Generate referral code based on user ID
            if (this.user) {
                const referralCode = `SBARO-${this.user.id.toString().slice(-6).toUpperCase()}`;
                document.getElementById('referralCode').textContent = referralCode;
            }
            
        } catch (error) {
            console.error('Failed to load user data:', error);
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
        try {
            // Show loading state
            const watchBtn = document.getElementById('watchAdBtn');
            const originalText = watchBtn.innerHTML;
            watchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading Ad...';
            watchBtn.disabled = true;
            
            // Show Monetag rewarded ad
            if (typeof show_9656288 === 'function') {
                try {
                    await show_9656288();
                    
                                         // Award points after successful ad view - 1.1 points per ad
                    this.userStats.totalPoints += 1.1;
                    this.userStats.totalBalance += 0.011;
                    this.userStats.adsWatched += 1;
                    
                    // Update display
                    this.updateStatsDisplay();
                    
                    // Show success message
                    this.showToast('🎉 You earned 1.1 points!', 'success');
                    
                    // Send haptic feedback
                    this.tg.HapticFeedback.notificationOccurred('success');
                    
                    // Add to activity log
                    this.addActivity('Watched Ad', '+1.1 points', 'earn');
                    
                    // Send data to backend
                    await this.sendAdWatchToBackend();
                    
                } catch (adError) {
                    console.error('Ad watch error:', adError);
                    this.showToast('❌ Ad not available right now. Try again later.', 'error');
                }
            } else {
                // Fallback if Monetag not loaded
                this.showToast('❌ Ads are loading. Please wait and try again.', 'error');
            }
            
            // Reset button
            watchBtn.innerHTML = originalText;
            watchBtn.disabled = false;
            
        } catch (error) {
            console.error('Failed to watch ad:', error);
            this.showToast('❌ Failed to load ad. Please try again.', 'error');
            
            // Reset button
            const watchBtn = document.getElementById('watchAdBtn');
            watchBtn.innerHTML = '<i class="fas fa-play"></i> Watch Ad';
            watchBtn.disabled = false;
        }
    }

    async sendAdWatchToBackend() {
        try {
            const response = await fetch('https://navigi-bot.netlify.app/.netlify/functions/ad-watch', {
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
        const activityList = document.getElementById('activityList');
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        const iconClass = type === 'earn' ? 'earn' : type === 'contest' ? 'contest' : 'earn';
        const icon = type === 'contest' ? '🏆' : '+';
        
        activityItem.innerHTML = `
            <div class="activity-icon ${iconClass}">${icon}</div>
            <div class="activity-info">
                <div class="activity-title">${title}</div>
                <div class="activity-time">Just now</div>
            </div>
            <div class="activity-points">${points}</div>
        `;
        
        // Add to top of list
        activityList.insertBefore(activityItem, activityList.firstChild);
        
        // Remove last item if more than 5 items
        if (activityList.children.length > 5) {
            activityList.removeChild(activityList.lastChild);
        }
    }

    joinContest(contestType) {
        const contestCosts = {
            daily: 5,
            weekly: 10,
            monthly: 25
        };
        
        const cost = contestCosts[contestType];
        if (!cost) return;
        
        if (this.userStats.totalPoints >= cost) {
            this.userStats.totalPoints -= cost;
            this.userStats.contestsJoined += 1;
            this.updateStatsDisplay();
            this.showToast(`🏆 Successfully joined the ${contestType} contest!`, 'success');
            this.addActivity(`${contestType.charAt(0).toUpperCase() + contestType.slice(1)} Contest`, `-${cost} points`, 'contest');
            this.tg.HapticFeedback.notificationOccurred('success');
            
            // Send to backend
            this.sendContestJoinToBackend(contestType, cost);
        } else {
            this.showToast(`❌ Need ${cost} points to join ${contestType} contest`, 'error');
            this.tg.HapticFeedback.notificationOccurred('error');
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
        const lastLogin = localStorage.getItem('lastDailyLogin');
        const today = new Date().toDateString();
        
        if (lastLogin === today) {
            this.showToast('✅ Daily login already claimed today!', 'info');
            return;
        }
        
        this.userStats.totalPoints += 1;
        this.userStats.totalBalance += 0.01;
        this.updateStatsDisplay();
        
        localStorage.setItem('lastDailyLogin', today);
        
        this.showToast('🎉 Daily login claimed! +1 point', 'success');
        this.addActivity('Daily Login', '+1 point', 'earn');
        
        // Update task button
        const taskBtn = document.querySelector('#dailyLoginTask .task-btn');
        taskBtn.textContent = 'Claimed';
        taskBtn.disabled = true;
        taskBtn.style.opacity = '0.5';
        
        // Send to backend
        this.sendDailyLoginToBackend();
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
        if (this.tg.openInvoice) {
            const invoice = {
                title: 'NAVIGI SBARO - TON Stars',
                description: `Send ${amount} TON Stars for leaderboard boost`,
                payload: `stars_${amount}_${Date.now()}`,
                provider_token: '',
                currency: 'XTR',
                prices: [{ label: `${amount} TON Stars`, amount: amount }]
            };
            
            this.tg.openInvoice(invoice, (status) => {
                if (status === 'paid') {
                    this.showToast(`⭐ ${amount} Stars sent! Leaderboard boosted!`, 'success');
                    this.closeModal();
                }
            });
        } else {
            this.showToast('❌ Stars payment not available', 'error');
        }
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
        if (!txHash) {
            this.showToast('❌ Please enter transaction hash', 'error');
            return;
        }

        try {
            const response = await fetch('https://navigi-bot.netlify.app/.netlify/functions/vip-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    tier: tier,
                    price: price,
                    payment_method: 'TON',
                    transaction_hash: txHash,
                    timestamp: Date.now()
                })
            });

            if (response.ok) {
                this.showToast('✅ Payment submitted! Processing within 6 hours.', 'success');
                this.closeModal();
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
        if (!txHash) {
            this.showToast('❌ Please enter transaction hash', 'error');
            return;
        }

        try {
            const response = await fetch('https://navigi-bot.netlify.app/.netlify/functions/vip-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: this.user?.id,
                    telegram_user: this.user,
                    tier: tier,
                    price: price,
                    payment_method: 'TRC20_USDT',
                    transaction_hash: txHash,
                    timestamp: Date.now()
                })
            });

            if (response.ok) {
                this.showToast('✅ Payment submitted! Processing within 6 hours.', 'success');
                this.closeModal();
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
        const langBtn = document.getElementById('languageBtn');
        langBtn.innerHTML = this.isArabic ? '🇸🇦' : '🇺🇸';
        
        // In a real app, you would translate the interface
        this.showToast(this.isArabic ? 'تم تغيير اللغة إلى العربية' : 'Language changed to English', 'success');
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