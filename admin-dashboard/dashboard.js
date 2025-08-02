// ================================
// NAVIGI SBARO ADMIN DASHBOARD
// Real-time Firebase Integration
// ================================

// Firebase Configuration - Your Credentials
const firebaseConfig = {
    apiKey: "AIzaSyCfrl9jNATQFJJDZSWoh9sb4DDtil4aHpY",
    authDomain: "navigi-sbaro-bot.firebaseapp.com",
    databaseURL: "https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "navigi-sbaro-bot",
    storageBucket: "navigi-sbaro-bot.appspot.com",
    messagingSenderId: "22015997314",
    appId: "1:22015997314:web:6b19b809bfb996a2ea8b9b"
};

// Global Variables
let database = null;
let isFirebaseInitialized = false;
let currentTab = 'overview';

// Real-time data storage
let realTimeData = {
    users: {},
    activities: {},
    vipNotifications: {},
    payments: {},
    systemStats: {},
    lastUpdate: new Date()
};

// ================================
// FIREBASE INITIALIZATION
// ================================

function initializeFirebase() {
    try {
        console.log('🔄 Initializing Firebase Admin Dashboard...');
        addStatusMessage('Initializing Firebase...', 'info');
        
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            
            database = firebase.database();
            isFirebaseInitialized = true;
            
            console.log('✅ Firebase initialized successfully');
            addStatusMessage('Firebase initialized successfully', 'success');
            updateConnectionStatus('online', 'Connected');
            
            // Test connection
            testFirebaseConnection();
            
            // Setup real-time listeners
            setupRealtimeListeners();
            
            return true;
        } else {
            throw new Error('Firebase SDK not loaded');
        }
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        addStatusMessage('Firebase initialization failed: ' + error.message, 'error');
        updateConnectionStatus('offline', 'Connection Failed');
        return false;
    }
}

// Test Firebase connection
async function testFirebaseConnection() {
    try {
        console.log('🧪 Testing Firebase connection...');
        addStatusMessage('Testing connection...', 'info');
        
        // Test basic connection
        const connectedRef = database.ref('.info/connected');
        connectedRef.on('value', (snapshot) => {
            if (snapshot.val() === true) {
                console.log('✅ Firebase connection: ONLINE');
                addStatusMessage('Connection test: ONLINE', 'success');
                updateConnectionStatus('online', 'Online');
            } else {
                console.log('❌ Firebase connection: OFFLINE');
                addStatusMessage('Connection test: OFFLINE', 'warning');
                updateConnectionStatus('offline', 'Offline');
            }
        });
        
        // Test write/read
        const testRef = database.ref('dashboard_test');
        await testRef.set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            source: 'admin_dashboard',
            test: true
        });
        
        console.log('✅ Firebase write test successful');
        addStatusMessage('Write test successful', 'success');
        
        // Clean up after 5 seconds
        setTimeout(() => {
            testRef.remove();
        }, 5000);
        
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error);
        addStatusMessage('Connection test failed: ' + error.message, 'error');
        updateConnectionStatus('offline', 'Test Failed');
    }
}

// Setup real-time listeners
function setupRealtimeListeners() {
    if (!isFirebaseInitialized || !database) {
        console.log('⚠️ Firebase not available');
        addStatusMessage('Firebase not available - no real-time data', 'warning');
        return;
    }

    console.log('🔄 Setting up real-time listeners...');
    addStatusMessage('Setting up real-time listeners...', 'info');

    try {
        // Listen to users data
        database.ref('users').on('value', (snapshot) => {
            try {
                const users = snapshot.val() || {};
                realTimeData.users = users;
                console.log('👥 Users data updated:', Object.keys(users).length, 'users');
                addStatusMessage(`Users updated: ${Object.keys(users).length} users`, 'success');
                
                if (currentTab === 'users' || currentTab === 'overview') {
                    renderCurrentTab();
                }
            } catch (error) {
                console.error('❌ Error processing users data:', error);
                addStatusMessage('Error processing users data', 'error');
            }
        }, (error) => {
            console.error('❌ Users listener error:', error);
            addStatusMessage('Users data connection failed', 'error');
        });

        // Listen to activities data
        database.ref('activities').orderByChild('created_at').limitToLast(50).on('value', (snapshot) => {
            try {
                const activities = snapshot.val() || {};
                realTimeData.activities = activities;
                console.log('📊 Activities updated:', Object.keys(activities).length, 'activities');
                addStatusMessage(`Activities updated: ${Object.keys(activities).length} activities`, 'success');
                
                if (currentTab === 'activities' || currentTab === 'overview') {
                    renderCurrentTab();
                }
            } catch (error) {
                console.error('❌ Error processing activities data:', error);
                addStatusMessage('Error processing activities data', 'error');
            }
        }, (error) => {
            console.error('❌ Activities listener error:', error);
            addStatusMessage('Activities data connection failed', 'error');
        });

        // Listen to VIP notifications
        database.ref('vip_notifications').orderByChild('status').equalTo('pending').on('value', (snapshot) => {
            try {
                const notifications = snapshot.val() || {};
                realTimeData.vipNotifications = notifications;
                const count = Object.keys(notifications).length;
                console.log('📞 VIP notifications updated:', count, 'pending');
                addStatusMessage(`VIP requests: ${count} pending`, count > 0 ? 'warning' : 'success');
                
                if (currentTab === 'vip' || currentTab === 'overview') {
                    renderCurrentTab();
                }
            } catch (error) {
                console.error('❌ Error processing VIP notifications:', error);
                addStatusMessage('Error processing VIP notifications', 'error');
            }
        }, (error) => {
            console.error('❌ VIP notifications listener error:', error);
            addStatusMessage('VIP notifications connection failed', 'error');
        });

        // Listen to payments data
        database.ref('payments').orderByChild('created_at').limitToLast(100).on('value', (snapshot) => {
            try {
                const payments = snapshot.val() || {};
                realTimeData.payments = payments;
                console.log('💳 Payments updated:', Object.keys(payments).length, 'payments');
                addStatusMessage(`Payments updated: ${Object.keys(payments).length} payments`, 'success');
                
                if (currentTab === 'payments' || currentTab === 'overview') {
                    renderCurrentTab();
                }
            } catch (error) {
                console.error('❌ Error processing payments data:', error);
                addStatusMessage('Error processing payments data', 'error');
            }
        }, (error) => {
            console.error('❌ Payments listener error:', error);
            addStatusMessage('Payments data connection failed', 'error');
        });

        console.log('✅ Real-time listeners setup complete');
        addStatusMessage('Real-time listeners active', 'success');
        
    } catch (error) {
        console.error('❌ Error setting up Firebase listeners:', error);
        addStatusMessage('Failed to setup listeners: ' + error.message, 'error');
    }
}

// ================================
// UI HELPER FUNCTIONS
// ================================

// Add status message
function addStatusMessage(message, type) {
    const statusLog = document.getElementById('statusLog');
    if (!statusLog) return;
    
    const statusItem = document.createElement('div');
    statusItem.className = `status-item ${type}`;
    statusItem.innerHTML = `
        <span class="status-time">${new Date().toLocaleTimeString()}</span>
        <span class="status-message">${message}</span>
    `;
    
    statusLog.appendChild(statusItem);
    
    // Keep only last 20 messages
    while (statusLog.children.length > 20) {
        statusLog.removeChild(statusLog.firstChild);
    }
    
    // Auto scroll to bottom
    statusLog.scrollTop = statusLog.scrollHeight;
}

// Update connection status
function updateConnectionStatus(status, text) {
    const dot = document.getElementById('connectionDot');
    const textElement = document.getElementById('connectionText');
    
    if (dot) {
        dot.className = `indicator-dot ${status}`;
    }
    
    if (textElement) {
        textElement.textContent = text;
    }
}

// ================================
// TAB MANAGEMENT
// ================================

// Switch tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });

    // Render tab content
    renderCurrentTab();
}

// Render current tab
function renderCurrentTab() {
    switch (currentTab) {
        case 'overview':
            renderOverviewTab();
            break;
        case 'users':
            renderUsersTab();
            break;
        case 'activities':
            renderActivitiesTab();
            break;
        case 'vip':
            renderVipTab();
            break;
        case 'payments':
            renderPaymentsTab();
            break;
        default:
            renderOverviewTab();
    }
}

// ================================
// TAB RENDERERS
// ================================

// Render Overview Tab
function renderOverviewTab() {
    const content = document.getElementById('mainContent');
    const users = Object.values(realTimeData.users || {});
    const activities = Object.values(realTimeData.activities || {});
    const vipRequests = Object.values(realTimeData.vipNotifications || {});
    const payments = Object.values(realTimeData.payments || {});
    
    // Calculate stats
    const totalUsers = users.length;
    const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalActivities = activities.length;
    const pendingVipRequests = vipRequests.length;
    
    content.innerHTML = `
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Users</span>
                    <span class="stat-icon">👥</span>
                </div>
                <div class="stat-value">${totalUsers}</div>
                <div class="stat-change">+${totalUsers} registered</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Revenue</span>
                    <span class="stat-icon">💰</span>
                </div>
                <div class="stat-value">$${totalRevenue.toFixed(2)}</div>
                <div class="stat-change">From VIP purchases</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Activities</span>
                    <span class="stat-icon">📊</span>
                </div>
                <div class="stat-value">${totalActivities}</div>
                <div class="stat-change">User actions logged</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">VIP Requests</span>
                    <span class="stat-icon">👑</span>
                </div>
                <div class="stat-value">${pendingVipRequests}</div>
                <div class="stat-change">Pending approval</div>
            </div>
        </div>

        <!-- Recent Activities -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Recent Activities</h2>
                <button class="btn btn-primary" onclick="switchTab('activities')">View All</button>
            </div>
            <div class="data-table-container">
                ${renderRecentActivities(activities.slice(-10).reverse())}
            </div>
        </div>

        <!-- Recent VIP Requests -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">VIP Requests</h2>
                <button class="btn btn-primary" onclick="switchTab('vip')">Manage All</button>
            </div>
            <div class="data-table-container">
                ${renderVipRequests(vipRequests.slice(0, 5))}
            </div>
        </div>
    `;
}

// Render Users Tab
function renderUsersTab() {
    const content = document.getElementById('mainContent');
    const users = Object.values(realTimeData.users || {});
    
    content.innerHTML = `
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">User Management</h2>
                <div>
                    <input type="text" id="userSearch" placeholder="Search users..." onkeyup="filterUsers()" style="margin-right: 1rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    <button class="btn btn-primary" onclick="exportUsers()">Export CSV</button>
                </div>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Points</th>
                        <th>Balance</th>
                        <th>VIP Status</th>
                        <th>Ads Watched</th>
                        <th>Referrals</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                    ${renderUsersTable(users)}
                </tbody>
            </table>
        </div>
    `;
}

// Render Activities Tab
function renderActivitiesTab() {
    const content = document.getElementById('mainContent');
    const activities = Object.values(realTimeData.activities || {})
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    content.innerHTML = `
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">User Activities</h2>
                <div>
                    <input type="text" id="activitySearch" placeholder="Search activities..." onkeyup="filterActivities()" style="margin-right: 1rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    <button class="btn btn-primary" onclick="exportActivities()">Export CSV</button>
                </div>
            </div>
            
            <div id="activitiesContainer">
                ${renderActivitiesList(activities)}
            </div>
        </div>
    `;
}

// Render VIP Tab
function renderVipTab() {
    const content = document.getElementById('mainContent');
    const vipRequests = Object.values(realTimeData.vipNotifications || {});
    
    content.innerHTML = `
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">VIP Request Management</h2>
                <button class="btn btn-success" onclick="approveAllVipRequests()">Approve All</button>
            </div>
            
            <div id="vipRequestsContainer">
                ${renderVipRequestsList(vipRequests)}
            </div>
        </div>
    `;
}

// Render Payments Tab
function renderPaymentsTab() {
    const content = document.getElementById('mainContent');
    const payments = Object.values(realTimeData.payments || {})
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const thisMonth = payments.filter(p => {
        const paymentDate = new Date(p.timestamp);
        const now = new Date();
        return paymentDate.getMonth() === now.getMonth() && 
               paymentDate.getFullYear() === now.getFullYear();
    });
    
    const monthlyRevenue = thisMonth
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    content.innerHTML = `
        <!-- Payment Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Revenue</span>
                    <span class="stat-icon">💰</span>
                </div>
                <div class="stat-value">$${totalRevenue.toFixed(2)}</div>
                <div class="stat-change">All time</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">This Month</span>
                    <span class="stat-icon">📅</span>
                </div>
                <div class="stat-value">$${monthlyRevenue.toFixed(2)}</div>
                <div class="stat-change">${thisMonth.length} payments</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Payments</span>
                    <span class="stat-icon">📊</span>
                </div>
                <div class="stat-value">${payments.length}</div>
                <div class="stat-change">All transactions</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Success Rate</span>
                    <span class="stat-icon">✅</span>
                </div>
                <div class="stat-value">${payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%</div>
                <div class="stat-change">Completion rate</div>
            </div>
        </div>

        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Payment History</h2>
                <div>
                    <input type="text" id="paymentSearch" placeholder="Search payments..." onkeyup="filterPayments()" style="margin-right: 1rem; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                    <button class="btn btn-primary" onclick="exportPayments()">Export CSV</button>
                </div>
            </div>
            
            <div id="paymentsContainer">
                ${renderPaymentsList(payments)}
            </div>
        </div>
    `;
}

// ================================
// RENDER HELPER FUNCTIONS
// ================================

// Render recent activities
function renderRecentActivities(activities) {
    if (!activities || activities.length === 0) {
        return '<div class="empty-state">📊 No recent activities<br><small>Activities will appear here when users interact with the bot</small></div>';
    }

    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Activity</th>
                    <th>Details</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                ${activities.map(activity => {
                    const user = realTimeData.users[activity.user_id];
                    const userName = user ? (user.first_name || user.username || `User ${activity.user_id}`) : `User ${activity.user_id}`;
                    const activityText = getActivityText(activity.type);
                    const details = getActivityDetails(activity);
                    const time = formatTimeAgo(new Date(activity.timestamp));
                    
                    return `
                        <tr>
                            <td>${userName}</td>
                            <td>${getActivityIcon(activity.type)} ${activityText}</td>
                            <td>${details}</td>
                            <td>${time}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Render users table
function renderUsersTable(users) {
    if (!users || users.length === 0) {
        return '<tr><td colspan="7" class="empty-state">No users found</td></tr>';
    }

    return users.map(user => {
        const joinDate = new Date(user.join_date).toLocaleDateString();
        const vipStatus = user.vip_status || 'FREE';
        const vipClass = vipStatus === 'FREE' ? 'status' : 'status approved';
        
        return `
            <tr>
                <td>
                    <div>
                        <strong>${user.first_name || user.username || `User ${user.id}`}</strong>
                        <br><small>ID: ${user.id}</small>
                    </div>
                </td>
                <td>${user.points || 0}</td>
                <td>$${(user.balance || 0).toFixed(2)}</td>
                <td><span class="${vipClass}">${vipStatus}</span></td>
                <td>${user.ads_watched || 0}</td>
                <td>${user.referrals || 0}</td>
                <td>${joinDate}</td>
            </tr>
        `;
    }).join('');
}

// Render activities list
function renderActivitiesList(activities) {
    if (!activities || activities.length === 0) {
        return '<div class="empty-state">📋 No activities found<br><small>User activities will appear here</small></div>';
    }

    return `
        <div style="max-height: 600px; overflow-y: auto;">
            ${activities.map(activity => {
                const user = realTimeData.users[activity.user_id];
                const userName = user ? (user.first_name || user.username || `User ${activity.user_id}`) : `User ${activity.user_id}`;
                const time = formatTimeAgo(new Date(activity.timestamp));
                const details = getActivityDetails(activity);
                
                return `
                    <div style="padding: 1rem; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 600;">${getActivityIcon(activity.type)} ${getActivityText(activity.type)}</div>
                            <div style="color: #666; font-size: 0.9rem;">by ${userName}</div>
                            ${details ? `<div style="color: #888; font-size: 0.85rem;">${details}</div>` : ''}
                        </div>
                        <div style="text-align: right; color: #666; font-size: 0.85rem;">
                            ${time}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render VIP requests list
function renderVipRequestsList(vipRequests) {
    if (!vipRequests || vipRequests.length === 0) {
        return '<div class="empty-state">👑 No pending VIP requests<br><small>VIP upgrade requests will appear here</small></div>';
    }

    return `
        <div style="display: grid; gap: 1rem;">
            ${vipRequests.map(request => {
                const user = realTimeData.users[request.user_id];
                const userName = user ? (user.first_name || user.username || `User ${request.user_id}`) : `User ${request.user_id}`;
                const requestTime = formatTimeAgo(new Date(request.request_timestamp));
                const stats = request.user_stats || {};
                
                return `
                    <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; border-left: 4px solid #ffc107;">
                        <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 1rem;">
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 0.5rem 0;">${userName}</h4>
                                <div style="color: #666; font-size: 0.9rem;">
                                    ID: ${request.user_id} • Requested ${requestTime}
                                </div>
                            </div>
                            <span class="status pending">Pending</span>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <div style="font-size: 0.8rem; color: #666;">Points</div>
                                <div style="font-weight: 600;">${stats.points || 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; color: #666;">Ads Watched</div>
                                <div style="font-weight: 600;">${stats.ads_watched || 0}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; color: #666;">Balance</div>
                                <div style="font-weight: 600;">$${(stats.balance || 0).toFixed(2)}</div>
                            </div>
                            <div>
                                <div style="font-size: 0.8rem; color: #666;">Referrals</div>
                                <div style="font-weight: 600;">${stats.referrals || 0}</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-success btn-sm" onclick="approveVipRequest('${request.id}', '${request.user_id}')">
                                Approve
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="rejectVipRequest('${request.id}', '${request.user_id}')">
                                Reject
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render payments list
function renderPaymentsList(payments) {
    if (!payments || payments.length === 0) {
        return '<div class="empty-state">💳 No payments found<br><small>Payment transactions will appear here</small></div>';
    }

    return `
        <div style="max-height: 600px; overflow-y: auto;">
            ${payments.map(payment => {
                const user = payment.user_info || {};
                const userName = user.first_name || user.username || `User ${payment.user_id}`;
                const date = new Date(payment.timestamp).toLocaleDateString();
                const time = new Date(payment.timestamp).toLocaleTimeString();
                const statusClass = payment.status === 'completed' ? 'status completed' : 
                                   payment.status === 'pending' ? 'status pending' : 'status rejected';
                
                return `
                    <div style="padding: 1rem; border-bottom: 1px solid #e9ecef; display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <div style="font-weight: 600;">👑 ${payment.tier || payment.type}</div>
                            <div style="color: #666; font-size: 0.9rem;">by ${userName}</div>
                            <div style="color: #888; font-size: 0.85rem;">
                                ${payment.payment_method || 'Unknown method'} • ${date} ${time}
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 600; font-size: 1.1rem;">$${payment.amount.toFixed(2)}</div>
                            <span class="${statusClass}">${payment.status}</span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ================================
// UTILITY FUNCTIONS
// ================================

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        'ad_watched': '📺',
        'contest_ad': '🏆',
        'vip_request': '👑',
        'vip_purchased': '💳',
        'user_joined': '👋',
        'referral_earned': '👥',
        'connection_test': '🧪',
        'user_referred': '🎁'
    };
    return icons[type] || '📊';
}

// Get activity text
function getActivityText(type) {
    const texts = {
        'ad_watched': 'Watched Ad',
        'contest_ad': 'Contest Ad',
        'vip_request': 'VIP Request',
        'vip_purchased': 'VIP Purchase',
        'user_joined': 'Joined Bot',
        'referral_earned': 'Referral Bonus',
        'connection_test': 'Connection Test',
        'user_referred': 'Used Referral'
    };
    return texts[type] || 'Activity';
}

// Get activity details
function getActivityDetails(activity) {
    const data = activity.data || {};
    
    switch (activity.type) {
        case 'ad_watched':
            return `+${data.points_earned || 0} points, +$${data.balance_earned || 0}`;
        case 'contest_ad':
            return `${data.contest_type || 'contest'} (${data.new_count || 0}/${data.total_required || 10})`;
        case 'vip_purchased':
            return `${data.vip_tier || 'VIP'} - $${data.amount || 0}`;
        case 'referral_earned':
            return `+${data.bonus_points || 0} points (${data.new_referral_count || 0} total)`;
        default:
            return '';
    }
}

// Format time ago
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// ================================
// ACTION FUNCTIONS
// ================================

// Approve VIP request
async function approveVipRequest(notificationId, userId) {
    if (!isFirebaseInitialized) return;
    
    try {
        // Update notification status
        await database.ref(`vip_notifications/${notificationId}`).update({
            status: 'approved',
            processed_at: firebase.database.ServerValue.TIMESTAMP
        });
        
        // Update user VIP status
        const vipExpires = new Date();
        vipExpires.setMonth(vipExpires.getMonth() + 1);
        
        await database.ref(`users/${userId}`).update({
            vip_status: 'KING',
            vip_expires: vipExpires.toISOString(),
            updated_at: firebase.database.ServerValue.TIMESTAMP
        });
        
        addStatusMessage(`VIP request approved for user ${userId}`, 'success');
        
    } catch (error) {
        console.error('❌ Error approving VIP request:', error);
        addStatusMessage('Error approving VIP request', 'error');
    }
}

// Reject VIP request
async function rejectVipRequest(notificationId, userId) {
    if (!isFirebaseInitialized) return;
    
    try {
        await database.ref(`vip_notifications/${notificationId}`).update({
            status: 'rejected',
            processed_at: firebase.database.ServerValue.TIMESTAMP
        });
        
        addStatusMessage(`VIP request rejected for user ${userId}`, 'warning');
        
    } catch (error) {
        console.error('❌ Error rejecting VIP request:', error);
        addStatusMessage('Error rejecting VIP request', 'error');
    }
}

// Approve all VIP requests
async function approveAllVipRequests() {
    const vipRequests = Object.values(realTimeData.vipNotifications || {});
    
    if (vipRequests.length === 0) {
        addStatusMessage('No pending VIP requests to approve', 'info');
        return;
    }
    
    for (const request of vipRequests) {
        await approveVipRequest(request.id, request.user_id);
    }
    
    addStatusMessage(`Approved ${vipRequests.length} VIP requests`, 'success');
}

// Export functions
function exportUsers() {
    const users = Object.values(realTimeData.users || {});
    if (users.length === 0) {
        addStatusMessage('No users to export', 'warning');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," +
        "ID,Name,Username,Points,Balance,VIP Status,Ads Watched,Referrals,Join Date\n" +
        users.map(user => 
            `${user.id},"${user.first_name || ''}","${user.username || ''}",${user.points || 0},${user.balance || 0},${user.vip_status || 'FREE'},${user.ads_watched || 0},${user.referrals || 0},"${new Date(user.join_date).toLocaleDateString()}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `navigi_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addStatusMessage('Users exported successfully', 'success');
}

function exportPayments() {
    const payments = Object.values(realTimeData.payments || {});
    if (payments.length === 0) {
        addStatusMessage('No payments to export', 'warning');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," +
        "Date,User ID,User Name,Type,Tier,Amount,Currency,Method,Status\n" +
        payments.map(payment => {
            const user = payment.user_info || {};
            return `"${payment.timestamp}","${payment.user_id}","${user.first_name || user.username || ''}","${payment.type || ''}","${payment.tier || ''}",${payment.amount || 0},"${payment.currency || 'USD'}","${payment.payment_method || ''}","${payment.status || ''}"`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `navigi_payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addStatusMessage('Payments exported successfully', 'success');
}

// Filter functions
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const users = Object.values(realTimeData.users || {});
    
    const filteredUsers = users.filter(user => {
        const name = (user.first_name || user.username || '').toLowerCase();
        const id = user.id.toString();
        return name.includes(searchTerm) || id.includes(searchTerm);
    });
    
    document.getElementById('usersTableBody').innerHTML = renderUsersTable(filteredUsers);
}

function filterActivities() {
    const searchTerm = document.getElementById('activitySearch').value.toLowerCase();
    const activities = Object.values(realTimeData.activities || {});
    
    const filteredActivities = activities.filter(activity => {
        const user = realTimeData.users[activity.user_id];
        const userName = user ? (user.first_name || user.username || '').toLowerCase() : '';
        const activityType = activity.type.toLowerCase();
        return userName.includes(searchTerm) || activityType.includes(searchTerm);
    });
    
    document.getElementById('activitiesContainer').innerHTML = renderActivitiesList(filteredActivities);
}

function filterPayments() {
    const searchTerm = document.getElementById('paymentSearch').value.toLowerCase();
    const payments = Object.values(realTimeData.payments || {});
    
    const filteredPayments = payments.filter(payment => {
        const user = payment.user_info || {};
        const userName = (user.first_name || user.username || '').toLowerCase();
        const type = (payment.type || '').toLowerCase();
        const amount = payment.amount.toString();
        return userName.includes(searchTerm) || type.includes(searchTerm) || amount.includes(searchTerm);
    });
    
    document.getElementById('paymentsContainer').innerHTML = renderPaymentsList(filteredPayments);
}

// ================================
// INITIALIZATION
// ================================

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing NAVIGI SBARO Admin Dashboard...');
    
    // Add initial status
    addStatusMessage('Dashboard initializing...', 'info');
    
    // Initialize Firebase
    initializeFirebase();
    
    // Setup navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            if (tab) {
                switchTab(tab);
            }
        });
    });
    
    // Render initial tab
    renderCurrentTab();
    
    console.log('✅ Dashboard initialization complete');
    addStatusMessage('Dashboard ready', 'success');
});

// Auto-refresh data every 30 seconds
setInterval(() => {
    if (isFirebaseInitialized) {
        realTimeData.lastUpdate = new Date();
        addStatusMessage('Data refreshed', 'info');
    }
}, 30000);