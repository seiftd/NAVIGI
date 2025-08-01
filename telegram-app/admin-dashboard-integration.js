// NAVIGI SBARO - Admin Dashboard Integration
// Real-time data management for Telegram Bot and Mobile App

class AdminDashboardAPI {
    constructor() {
        this.baseURL = 'https://navigiu.netlify.app/.netlify/functions';
        this.adminToken = null; // Set by admin login
        this.platform = 'telegram_bot'; // or 'mobile_app'
    }

    // Authentication
    async adminLogin(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/admin-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            if (data.success) {
                this.adminToken = data.token;
                localStorage.setItem('adminToken', data.token);
                return { success: true, admin: data.admin };
            }
            return { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Platform Management
    setPlatform(platform) {
        this.platform = platform; // 'telegram_bot' or 'mobile_app'
        localStorage.setItem('currentPlatform', platform);
    }

    // Real User Management
    async getUsers(platform = null, page = 1, limit = 50) {
        try {
            const response = await fetch(`${this.baseURL}/admin-users?platform=${platform || this.platform}&page=${page}&limit=${limit}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get users error:', error);
            return { success: false, error: error.message };
        }
    }

    async getUserDetails(userId, platform = null) {
        try {
            const response = await fetch(`${this.baseURL}/admin-user-details?user_id=${userId}&platform=${platform || this.platform}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get user details error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateUserPoints(userId, points, reason) {
        try {
            const response = await fetch(`${this.baseURL}/admin-update-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    points: points,
                    reason: reason,
                    platform: this.platform,
                    admin_action: true
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Update points error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateUserVIP(userId, vipTier, duration) {
        try {
            const response = await fetch(`${this.baseURL}/admin-update-vip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    vip_tier: vipTier,
                    duration: duration,
                    platform: this.platform,
                    admin_action: true
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Update VIP error:', error);
            return { success: false, error: error.message };
        }
    }

    // Financial Transactions Management
    async getTransactions(type = 'all', status = 'all', page = 1) {
        try {
            const response = await fetch(`${this.baseURL}/admin-transactions?type=${type}&status=${status}&page=${page}&platform=${this.platform}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get transactions error:', error);
            return { success: false, error: error.message };
        }
    }

    async approveVIPPayment(transactionId, approve = true) {
        try {
            const response = await fetch(`${this.baseURL}/admin-approve-vip`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    transaction_id: transactionId,
                    approved: approve,
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Approve VIP error:', error);
            return { success: false, error: error.message };
        }
    }

    async processWithdrawal(withdrawalId, approve = true, txHash = null) {
        try {
            const response = await fetch(`${this.baseURL}/admin-process-withdrawal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    withdrawal_id: withdrawalId,
                    approved: approve,
                    transaction_hash: txHash,
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Process withdrawal error:', error);
            return { success: false, error: error.message };
        }
    }

    // Real-time Analytics
    async getDashboardStats() {
        try {
            const response = await fetch(`${this.baseURL}/admin-dashboard-stats?platform=${this.platform}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            return { success: false, error: error.message };
        }
    }

    async getRevenueData(period = '7d') {
        try {
            const response = await fetch(`${this.baseURL}/admin-revenue?period=${period}&platform=${this.platform}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get revenue data error:', error);
            return { success: false, error: error.message };
        }
    }

    // Contest Management
    async getContests() {
        try {
            const response = await fetch(`${this.baseURL}/admin-contests?platform=${this.platform}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get contests error:', error);
            return { success: false, error: error.message };
        }
    }

    async createContest(contestData) {
        try {
            const response = await fetch(`${this.baseURL}/admin-create-contest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    ...contestData,
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Create contest error:', error);
            return { success: false, error: error.message };
        }
    }

    async endContest(contestId, winners) {
        try {
            const response = await fetch(`${this.baseURL}/admin-end-contest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    contest_id: contestId,
                    winners: winners,
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('End contest error:', error);
            return { success: false, error: error.message };
        }
    }

    // Referral Management
    async getReferralLeaderboard(period = 'weekly') {
        try {
            const response = await fetch(`${this.baseURL}/admin-referral-leaderboard?period=${period}&platform=${this.platform}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get referral leaderboard error:', error);
            return { success: false, error: error.message };
        }
    }

    async processReferralRewards() {
        try {
            const response = await fetch(`${this.baseURL}/admin-process-referral-rewards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Process referral rewards error:', error);
            return { success: false, error: error.message };
        }
    }

    // Notification Management
    async sendNotification(userIds, message, type = 'general') {
        try {
            const response = await fetch(`${this.baseURL}/admin-send-notification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    user_ids: userIds,
                    message: message,
                    type: type,
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Send notification error:', error);
            return { success: false, error: error.message };
        }
    }

    async broadcastMessage(message, targetGroup = 'all') {
        try {
            const response = await fetch(`${this.baseURL}/admin-broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    message: message,
                    target_group: targetGroup, // 'all', 'vip', 'free'
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Broadcast message error:', error);
            return { success: false, error: error.message };
        }
    }

    // System Management
    async updateSystemSettings(settings) {
        try {
            const response = await fetch(`${this.baseURL}/admin-update-settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.adminToken}`
                },
                body: JSON.stringify({
                    settings: settings,
                    platform: this.platform
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Update settings error:', error);
            return { success: false, error: error.message };
        }
    }

    async getSystemLogs(level = 'all', page = 1) {
        try {
            const response = await fetch(`${this.baseURL}/admin-logs?level=${level}&page=${page}&platform=${this.platform}`, {
                headers: { 'Authorization': `Bearer ${this.adminToken}` }
            });
            return await response.json();
        } catch (error) {
            console.error('Get logs error:', error);
            return { success: false, error: error.message };
        }
    }

    // Real-time WebSocket Connection
    initWebSocket() {
        if (typeof WebSocket === 'undefined') return;
        
        this.ws = new WebSocket(`wss://navigi-bot.netlify.app/.netlify/functions/admin-websocket`);
        
        this.ws.onopen = () => {
            console.log('Admin WebSocket connected');
            this.ws.send(JSON.stringify({
                type: 'auth',
                token: this.adminToken,
                platform: this.platform
            }));
        };
        
        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleRealTimeUpdate(data);
        };
        
        this.ws.onclose = () => {
            console.log('Admin WebSocket disconnected');
            // Reconnect after 5 seconds
            setTimeout(() => this.initWebSocket(), 5000);
        };
    }

    handleRealTimeUpdate(data) {
        // Emit custom events for real-time updates
        const event = new CustomEvent('adminUpdate', { detail: data });
        document.dispatchEvent(event);
        
        switch (data.type) {
            case 'new_user':
                console.log('New user registered:', data.user);
                break;
            case 'new_transaction':
                console.log('New transaction:', data.transaction);
                break;
            case 'vip_payment':
                console.log('New VIP payment:', data.payment);
                break;
            case 'withdrawal_request':
                console.log('New withdrawal request:', data.withdrawal);
                break;
            case 'user_activity':
                console.log('User activity:', data.activity);
                break;
        }
    }
}

// Export for use in admin dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboardAPI;
} else if (typeof window !== 'undefined') {
    window.AdminDashboardAPI = AdminDashboardAPI;
}

// Usage Example:
/*
const adminAPI = new AdminDashboardAPI();

// Login
const loginResult = await adminAPI.adminLogin('admin', 'password');
if (loginResult.success) {
    // Switch between platforms
    adminAPI.setPlatform('telegram_bot'); // or 'mobile_app'
    
    // Get real user data
    const users = await adminAPI.getUsers();
    
    // Get financial transactions
    const transactions = await adminAPI.getTransactions('vip_payment', 'pending');
    
    // Approve VIP payment
    await adminAPI.approveVIPPayment('transaction_id_123', true);
    
    // Get dashboard stats
    const stats = await adminAPI.getDashboardStats();
    
    // Send notification to users
    await adminAPI.sendNotification([123456, 789012], 'Welcome to NAVIGI SBARO!');
    
    // Initialize real-time updates
    adminAPI.initWebSocket();
}
*/