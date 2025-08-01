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
            
            // Initialize ADSTERRA
            this.initAdsterra();
            
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

    initAdsterra() {
        // Initialize ADSTERRA ads
        // Your ADSTERRA link: https://www.profitableratecpm.com/wzun0hab?key=d618b444e85c92f5cff5b3be66d62941
        
        try {
            // Create ADSTERRA script element
            const adsScript = document.createElement('script');
            adsScript.src = 'https://www.profitableratecpm.com/wzun0hab?key=d618b444e85c92f5cff5b3be66d62941';
            adsScript.async = true;
            document.head.appendChild(adsScript);
            
            console.log('ADSTERRA ads initialized');
        } catch (error) {
            console.error('Failed to initialize ADSTERRA:', error);
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
            
            // Simulate ad watching (in real app, this would show ADSTERRA ad)
            await this.simulateAdWatch();
            
            // Award points
            this.userStats.totalPoints += 5;
            this.userStats.totalBalance += 0.05;
            this.userStats.adsWatched += 1;
            
            // Update display
            this.updateStatsDisplay();
            
            // Show success message
            this.showToast('🎉 You earned 5 points!', 'success');
            
            // Send haptic feedback
            this.tg.HapticFeedback.notificationOccurred('success');
            
            // Add to activity log
            this.addActivity('Watched Ad', '+5 points', 'earn');
            
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

    simulateAdWatch() {
        return new Promise((resolve) => {
            // Simulate ad loading and watching
            setTimeout(() => {
                resolve();
            }, 3000); // 3 second simulation
        });
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
        if (contestType === 'daily') {
            if (this.userStats.totalPoints >= 10) {
                this.userStats.totalPoints -= 10;
                this.userStats.contestsJoined += 1;
                this.updateStatsDisplay();
                this.showToast('🏆 Successfully joined the contest!', 'success');
                this.addActivity('Contest Entry', '-10 points', 'contest');
                this.tg.HapticFeedback.notificationOccurred('success');
            } else {
                this.showToast('❌ Not enough points to join contest', 'error');
                this.tg.HapticFeedback.notificationOccurred('error');
            }
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
                        <button class="upgrade-btn" onclick="telegramApp.payWithTelegramStars('${tier}', ${price})">
                            ⭐ Pay with Telegram Stars
                        </button>
                        <button class="upgrade-btn" onclick="telegramApp.payWithCrypto('${tier}', ${price})">
                            💰 Pay with Crypto (USDT TRC20)
                        </button>
                    </div>
                </div>
                
                <p style="font-size: 12px; color: var(--tg-theme-hint-color);">
                    Secure payment processed through Telegram or our crypto payment system
                </p>
            </div>
        `;
        
        this.showModal('Upgrade to VIP', modalBody, [
            { text: 'Cancel', action: () => this.closeModal() }
        ]);
    }

    payWithTelegramStars(tier, price) {
        // Convert USD to Telegram Stars (approximate rate)
        const starsAmount = Math.ceil(price * 100); // $1 = ~100 stars
        
        // Use Telegram's payment system
        if (this.tg.openInvoice) {
            const invoice = {
                title: `NAVIGI SBARO - ${tier.toUpperCase()} VIP`,
                description: `Upgrade to ${tier.toUpperCase()} VIP membership`,
                payload: `vip_${tier}_${Date.now()}`,
                provider_token: '', // Telegram Stars don't need provider token
                currency: 'XTR', // Telegram Stars
                prices: [{ label: `${tier.toUpperCase()} VIP`, amount: starsAmount }]
            };
            
            this.tg.openInvoice(invoice, (status) => {
                if (status === 'paid') {
                    this.processVipUpgrade(tier);
                }
            });
        } else {
            this.showToast('❌ Payment not available in this environment', 'error');
        }
        
        this.closeModal();
    }

    payWithCrypto(tier, price) {
        // Redirect to crypto payment page
        const paymentUrl = `../website/payment.html?tier=${tier}&price=${price}&user_id=${this.user?.id || 'telegram_user'}`;
        this.tg.openLink(paymentUrl);
        this.closeModal();
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
        const minWithdraw = 10.00;
        if (this.userStats.totalBalance < minWithdraw) {
            this.showToast(`❌ Minimum withdrawal is $${minWithdraw.toFixed(2)}`, 'error');
            return;
        }
        
        this.showModal(
            '💰 Withdraw Earnings',
            `
            <div style="text-align: center;">
                <p style="margin-bottom: 20px;">Available Balance: <strong>$${this.userStats.totalBalance.toFixed(2)}</strong></p>
                <div style="background: var(--tg-theme-secondary-bg-color); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                    <h4 style="margin-bottom: 15px;">Withdrawal Methods:</h4>
                    <button class="upgrade-btn" onclick="telegramApp.withdrawTo('paypal')" style="margin-bottom: 10px;">
                        PayPal
                    </button>
                    <button class="upgrade-btn" onclick="telegramApp.withdrawTo('crypto')">
                        Crypto (USDT TRC20)
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
        this.showToast('🔄 Withdrawal request submitted!', 'success');
        this.closeModal();
        // In real app, process withdrawal
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