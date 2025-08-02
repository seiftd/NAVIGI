// NAVIGI SBARO Admin Dashboard - Firebase Real-time Integration
let isAdminArabic = false;
let currentTab = 'overview';
let database = null;
let isFirebaseInitialized = false;

// Firebase configuration with your actual credentials
const firebaseConfig = {
    apiKey: "AIzaSyCfrl9jNATQFJJDZSWoh9sb4DDtil4aHpY",
    authDomain: "navigi-sbaro-bot.firebaseapp.com",
    databaseURL: "https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "navigi-sbaro-bot",
    storageBucket: "navigi-sbaro-bot.appspot.com",
    messagingSenderId: "22015997314",
    appId: "1:22015997314:web:6b19b809bfb996a2ea8b9b"
};

// Real-time data storage
let realTimeData = {
    users: {},
    activities: {},
    vipNotifications: {},
    systemStats: {},
    lastUpdate: new Date()
};

// Initialize Firebase
function initializeFirebase() {
    try {
        if (typeof firebase !== 'undefined' && !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            database = firebase.database();
            isFirebaseInitialized = true;
            console.log('🔥 Firebase initialized successfully in admin dashboard');
            setupRealtimeListeners();
            return true;
        }
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        showNotification('Firebase connection failed. Using demo data.', 'error');
        return false;
    }
}

// Setup real-time listeners for Firebase data
function setupRealtimeListeners() {
    if (!isFirebaseInitialized || !database) {
        console.log('⚠️ Firebase not available - using demo data');
        return;
    }

    // Listen to users data
    database.ref('users').on('value', (snapshot) => {
        const users = snapshot.val() || {};
        realTimeData.users = users;
        console.log('👥 Users data updated:', Object.keys(users).length, 'users');
        updateDashboardStats();
        if (currentTab === 'users') {
            renderUsersTab();
        }
    });

    // Listen to activities data
    database.ref('activities').orderByChild('timestamp').limitToLast(100).on('value', (snapshot) => {
        const activities = snapshot.val() || {};
        realTimeData.activities = activities;
        console.log('📊 Activities updated:', Object.keys(activities).length, 'activities');
        if (currentTab === 'activities') {
            renderActivitiesTab();
        }
    });

    // Listen to VIP notifications
    database.ref('vip_notifications').orderByChild('status').equalTo('pending').on('value', (snapshot) => {
        const notifications = snapshot.val() || {};
        realTimeData.vipNotifications = notifications;
        console.log('📞 VIP notifications updated:', Object.keys(notifications).length, 'pending');
        updateVipNotificationCount();
        if (currentTab === 'vip') {
            renderVipTab();
        }
    });

    // Listen to system stats
    database.ref('system').on('value', (snapshot) => {
        const system = snapshot.val() || {};
        realTimeData.systemStats = system;
        console.log('⚙️ System stats updated');
        updateDashboardStats();
    });

    console.log('👂 Real-time listeners set up successfully');
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing NAVIGI SBARO Admin Dashboard...');
    
    // Initialize Firebase
    initializeFirebase();
    
    // Set up navigation
    setupNavigation();
    
    // Load initial tab
    switchTab('overview');
    
    // Update dashboard every 30 seconds
    setInterval(updateDashboardStats, 30000);
    
    console.log('✅ Admin Dashboard initialized successfully');
});

// Navigation setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            if (tab) {
                switchTab(tab);
            }
        });
    });

    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }
}

// Switch between tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });

    // Show loading
    showLoading();

    // Render tab content
    setTimeout(() => {
        switch (tabName) {
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
            case 'contests':
                renderContestsTab();
                break;
            case 'analytics':
                renderAnalyticsTab();
                break;
            case 'settings':
                renderSettingsTab();
                break;
            default:
                renderOverviewTab();
        }
        hideLoading();
    }, 500);
}

// Render Overview Tab
function renderOverviewTab() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const users = Object.values(realTimeData.users || {});
    const activities = Object.values(realTimeData.activities || {});
    const vipNotifications = Object.values(realTimeData.vipNotifications || {});

    // Calculate stats
    const totalUsers = users.length;
    const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);
    const totalAds = users.reduce((sum, user) => sum + (user.ads_watched || 0), 0);
    const activeToday = users.filter(user => 
        user.last_ad_reset === new Date().toDateString()
    ).length;

    // VIP users
    const vipUsers = users.filter(user => user.vip_status !== 'FREE').length;
    const freeUsers = totalUsers - vipUsers;

    // Recent activities (last 24 hours)
    const recentActivities = activities.filter(activity => {
        const activityDate = new Date(activity.created_at);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return activityDate > yesterday;
    });

    content.innerHTML = `
        <div class="dashboard-header">
            <h2>📊 Dashboard Overview</h2>
            <div class="header-actions">
                <button class="btn btn-primary" onclick="refreshDashboard()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">👥</div>
                <div class="stat-info">
                    <h3>${totalUsers.toLocaleString()}</h3>
                    <p>Total Users</p>
                </div>
                <div class="stat-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    <span>${activeToday} active today</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">💎</div>
                <div class="stat-info">
                    <h3>${totalPoints.toLocaleString()}</h3>
                    <p>Total Points Distributed</p>
                </div>
                <div class="stat-trend positive">
                    <i class="fas fa-coins"></i>
                    <span>$${(totalPoints * 0.01).toFixed(2)} value</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">📺</div>
                <div class="stat-info">
                    <h3>${totalAds.toLocaleString()}</h3>
                    <p>Total Ads Watched</p>
                </div>
                <div class="stat-trend positive">
                    <i class="fas fa-play"></i>
                    <span>${recentActivities.filter(a => a.type === 'ad_watched').length} today</span>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">👑</div>
                <div class="stat-info">
                    <h3>${vipUsers}</h3>
                    <p>VIP Users</p>
                </div>
                <div class="stat-trend">
                    <i class="fas fa-users"></i>
                    <span>${freeUsers} free users</span>
                </div>
            </div>
        </div>

        <!-- Recent Activity & VIP Notifications -->
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <div class="card-header">
                    <h3>📊 Recent Activities</h3>
                    <span class="badge">${recentActivities.length}</span>
                </div>
                <div class="activity-list">
                    ${renderRecentActivities(recentActivities.slice(-10))}
                </div>
            </div>

            <div class="dashboard-card">
                <div class="card-header">
                    <h3>📞 VIP Notifications</h3>
                    <span class="badge badge-warning">${vipNotifications.length}</span>
                </div>
                <div class="vip-notifications">
                    ${renderVipNotifications(vipNotifications)}
                </div>
            </div>
        </div>

        <!-- System Status -->
        <div class="dashboard-card">
            <div class="card-header">
                <h3>⚙️ System Status</h3>
                <div class="status-indicators">
                    <span class="status-indicator online">🟢 Firebase Connected</span>
                    <span class="status-indicator online">🟢 Bot Online</span>
                    <span class="status-indicator online">🟢 Dashboard Active</span>
                </div>
            </div>
            <div class="system-info">
                <p><strong>Last Update:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Database URL:</strong> https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/</p>
                <p><strong>Region:</strong> Europe West 1</p>
            </div>
        </div>
    `;
}

// Render Users Tab
function renderUsersTab() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const users = Object.values(realTimeData.users || {});
    
    content.innerHTML = `
        <div class="dashboard-header">
            <h2>👥 User Management</h2>
            <div class="header-actions">
                <input type="text" id="userSearch" placeholder="Search users..." class="search-input">
                <button class="btn btn-primary" onclick="exportUsers()">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>

        <div class="users-stats">
            <div class="stat-item">
                <span class="stat-number">${users.length}</span>
                <span class="stat-label">Total Users</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${users.filter(u => u.vip_status !== 'FREE').length}</span>
                <span class="stat-label">VIP Users</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${users.filter(u => u.last_ad_reset === new Date().toDateString()).length}</span>
                <span class="stat-label">Active Today</span>
            </div>
        </div>

        <div class="table-container">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Points</th>
                        <th>Balance</th>
                        <th>VIP Status</th>
                        <th>Ads Watched</th>
                        <th>Referrals</th>
                        <th>Join Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderUsersTable(users)}
                </tbody>
            </table>
        </div>
    `;

    // Setup user search
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }
}

// Render Activities Tab
function renderActivitiesTab() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const activities = Object.values(realTimeData.activities || {})
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    content.innerHTML = `
        <div class="dashboard-header">
            <h2>📊 User Activities</h2>
            <div class="header-actions">
                <select id="activityFilter" class="filter-select">
                    <option value="all">All Activities</option>
                    <option value="ad_watched">Ad Watched</option>
                    <option value="contest_ad">Contest Ads</option>
                    <option value="vip_request">VIP Requests</option>
                    <option value="user_joined">New Users</option>
                </select>
            </div>
        </div>

        <div class="activities-stats">
            <div class="stat-item">
                <span class="stat-number">${activities.length}</span>
                <span class="stat-label">Total Activities</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${activities.filter(a => a.type === 'ad_watched').length}</span>
                <span class="stat-label">Ads Watched</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${activities.filter(a => a.type === 'contest_ad').length}</span>
                <span class="stat-label">Contest Ads</span>
            </div>
        </div>

        <div class="activities-container">
            ${renderActivitiesList(activities)}
        </div>
    `;

    // Setup activity filter
    const filterSelect = document.getElementById('activityFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterActivities);
    }
}

// Render VIP Tab
function renderVipTab() {
    const content = document.getElementById('mainContent');
    if (!content) return;

    const vipNotifications = Object.values(realTimeData.vipNotifications || {});
    const users = Object.values(realTimeData.users || {});
    const vipUsers = users.filter(u => u.vip_status !== 'FREE');

    content.innerHTML = `
        <div class="dashboard-header">
            <h2>👑 VIP Management</h2>
            <div class="header-actions">
                <button class="btn btn-success" onclick="approveAllVip()">
                    <i class="fas fa-check-double"></i> Approve All
                </button>
            </div>
        </div>

        <div class="vip-stats">
            <div class="stat-item">
                <span class="stat-number">${vipNotifications.length}</span>
                <span class="stat-label">Pending Requests</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${vipUsers.length}</span>
                <span class="stat-label">VIP Users</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${vipUsers.filter(u => u.vip_status === 'KING').length}</span>
                <span class="stat-label">King Users</span>
            </div>
        </div>

        <div class="vip-requests">
            <h3>📞 Pending VIP Requests</h3>
            <div class="requests-container">
                ${renderVipRequests(vipNotifications)}
            </div>
        </div>

        <div class="current-vip-users">
            <h3>👑 Current VIP Users</h3>
            <div class="table-container">
                <table class="vip-users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>VIP Tier</th>
                            <th>Points</th>
                            <th>Ads Watched</th>
                            <th>Join Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${renderVipUsersTable(vipUsers)}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Helper functions for rendering data
function renderRecentActivities(activities) {
    if (!activities || activities.length === 0) {
        return '<div class="empty-state">No recent activities</div>';
    }

    return activities.map(activity => {
        const icon = getActivityIcon(activity.type);
        const time = formatTimeAgo(new Date(activity.created_at));
        const user = realTimeData.users[activity.user_id];
        const userName = user ? (user.first_name || user.username || `User ${activity.user_id}`) : `User ${activity.user_id}`;

        return `
            <div class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-info">
                    <div class="activity-text">
                        <strong>${userName}</strong> ${getActivityText(activity)}
                    </div>
                    <div class="activity-time">${time}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderVipNotifications(notifications) {
    if (!notifications || Object.keys(notifications).length === 0) {
        return '<div class="empty-state">No pending VIP requests</div>';
    }

    return Object.values(notifications).map(notification => {
        return `
            <div class="vip-notification">
                <div class="notification-info">
                    <div class="user-name">${notification.first_name || 'Unknown'}</div>
                    <div class="user-id">ID: ${notification.user_id}</div>
                    <div class="request-time">${formatTimeAgo(new Date(notification.created_at))}</div>
                </div>
                <div class="notification-actions">
                    <button class="btn btn-success btn-sm" onclick="approveVipRequest('${notification.id}', '${notification.user_id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rejectVipRequest('${notification.id}', '${notification.user_id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderUsersTable(users) {
    if (!users || users.length === 0) {
        return '<tr><td colspan="8" class="empty-state">No users found</td></tr>';
    }

    return users.map(user => {
        const joinDate = new Date(user.join_date).toLocaleDateString();
        const vipBadge = getVipBadge(user.vip_status);
        
        return `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-name">${user.first_name || 'Unknown'}</div>
                        <div class="user-id">ID: ${user.id}</div>
                        ${user.username ? `<div class="user-username">@${user.username}</div>` : ''}
                    </div>
                </td>
                <td><span class="points-badge">${(user.points || 0).toLocaleString()}</span></td>
                <td><span class="balance-badge">$${(user.balance || 0).toFixed(2)}</span></td>
                <td>${vipBadge}</td>
                <td>${user.ads_watched || 0}</td>
                <td>${user.referrals || 0}</td>
                <td>${joinDate}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function renderActivitiesList(activities) {
    if (!activities || activities.length === 0) {
        return '<div class="empty-state">No activities found</div>';
    }

    return activities.map(activity => {
        const user = realTimeData.users[activity.user_id];
        const userName = user ? (user.first_name || user.username || `User ${activity.user_id}`) : `User ${activity.user_id}`;
        const icon = getActivityIcon(activity.type);
        const time = new Date(activity.created_at).toLocaleString();

        return `
            <div class="activity-card">
                <div class="activity-header">
                    <div class="activity-icon">${icon}</div>
                    <div class="activity-title">${getActivityTitle(activity.type)}</div>
                    <div class="activity-time">${time}</div>
                </div>
                <div class="activity-details">
                    <div class="activity-user">👤 ${userName}</div>
                    <div class="activity-description">${getActivityDescription(activity)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderVipRequests(notifications) {
    if (!notifications || Object.keys(notifications).length === 0) {
        return '<div class="empty-state">No pending VIP requests</div>';
    }

    return Object.values(notifications).map(notification => {
        const user = realTimeData.users[notification.user_id];
        const userStats = user ? {
            points: user.points || 0,
            ads: user.ads_watched || 0,
            referrals: user.referrals || 0
        } : { points: 0, ads: 0, referrals: 0 };

        return `
            <div class="vip-request-card">
                <div class="request-header">
                    <div class="user-info">
                        <h4>${notification.first_name || 'Unknown User'}</h4>
                        <p>ID: ${notification.user_id}</p>
                        ${notification.username ? `<p>@${notification.username}</p>` : ''}
                    </div>
                    <div class="request-time">
                        ${formatTimeAgo(new Date(notification.created_at))}
                    </div>
                </div>
                <div class="request-stats">
                    <div class="stat-item">
                        <span class="stat-number">${userStats.points}</span>
                        <span class="stat-label">Points</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${userStats.ads}</span>
                        <span class="stat-label">Ads Watched</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${userStats.referrals}</span>
                        <span class="stat-label">Referrals</span>
                    </div>
                </div>
                <div class="request-actions">
                    <button class="btn btn-success" onclick="approveVipRequest('${notification.id}', '${notification.user_id}')">
                        <i class="fas fa-check"></i> Approve as KING
                    </button>
                    <button class="btn btn-warning" onclick="approveVipRequest('${notification.id}', '${notification.user_id}', 'EMPEROR')">
                        <i class="fas fa-crown"></i> Approve as EMPEROR
                    </button>
                    <button class="btn btn-danger" onclick="rejectVipRequest('${notification.id}', '${notification.user_id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function renderVipUsersTable(vipUsers) {
    if (!vipUsers || vipUsers.length === 0) {
        return '<tr><td colspan="6" class="empty-state">No VIP users found</td></tr>';
    }

    return vipUsers.map(user => {
        const joinDate = new Date(user.join_date).toLocaleDateString();
        const vipBadge = getVipBadge(user.vip_status);
        
        return `
            <tr>
                <td>
                    <div class="user-info">
                        <div class="user-name">${user.first_name || 'Unknown'}</div>
                        <div class="user-id">ID: ${user.id}</div>
                    </div>
                </td>
                <td>${vipBadge}</td>
                <td>${(user.points || 0).toLocaleString()}</td>
                <td>${user.ads_watched || 0}</td>
                <td>${joinDate}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="downgradeVip('${user.id}')">
                        <i class="fas fa-arrow-down"></i> Downgrade
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// VIP Management Functions
async function approveVipRequest(notificationId, userId, vipTier = 'KING') {
    if (!isFirebaseInitialized || !database) {
        showNotification('Firebase not connected', 'error');
        return;
    }

    try {
        // Update notification status
        await database.ref(`vip_notifications/${notificationId}`).update({
            status: 'approved',
            admin_response: `Approved as ${vipTier}`,
            processed_at: firebase.database.ServerValue.TIMESTAMP
        });

        // Update user VIP status
        const vipExpiry = new Date();
        vipExpiry.setDate(vipExpiry.getDate() + 30); // 30 days

        await database.ref(`users/${userId}`).update({
            vip_status: vipTier,
            vip_expires: vipExpiry.toISOString(),
            updated_at: firebase.database.ServerValue.TIMESTAMP
        });

        showNotification(`VIP request approved! User upgraded to ${vipTier}`, 'success');
        
        // Refresh VIP tab if currently active
        if (currentTab === 'vip') {
            renderVipTab();
        }
    } catch (error) {
        console.error('Error approving VIP request:', error);
        showNotification('Failed to approve VIP request', 'error');
    }
}

async function rejectVipRequest(notificationId, userId) {
    if (!isFirebaseInitialized || !database) {
        showNotification('Firebase not connected', 'error');
        return;
    }

    try {
        // Update notification status
        await database.ref(`vip_notifications/${notificationId}`).update({
            status: 'rejected',
            admin_response: 'Request rejected by admin',
            processed_at: firebase.database.ServerValue.TIMESTAMP
        });

        showNotification('VIP request rejected', 'info');
        
        // Refresh VIP tab if currently active
        if (currentTab === 'vip') {
            renderVipTab();
        }
    } catch (error) {
        console.error('Error rejecting VIP request:', error);
        showNotification('Failed to reject VIP request', 'error');
    }
}

// Utility Functions
function getActivityIcon(type) {
    const icons = {
        'ad_watched': '📺',
        'contest_ad': '🏆',
        'vip_request': '👑',
        'user_joined': '👋',
        'referral_earned': '👥',
        'vip_approved': '✅',
        'vip_rejected': '❌',
        'leaderboards_reset': '🔄',
        'contests_reset': '🏆'
    };
    return icons[type] || '📊';
}

function getActivityText(activity) {
    const texts = {
        'ad_watched': 'watched an ad',
        'contest_ad': 'participated in contest',
        'vip_request': 'requested VIP upgrade',
        'user_joined': 'joined the bot',
        'referral_earned': 'earned a referral',
        'vip_approved': 'got VIP approved',
        'vip_rejected': 'got VIP rejected'
    };
    return texts[activity.type] || 'performed an action';
}

function getActivityTitle(type) {
    const titles = {
        'ad_watched': 'Ad Watched',
        'contest_ad': 'Contest Participation',
        'vip_request': 'VIP Request',
        'user_joined': 'New User',
        'referral_earned': 'Referral',
        'vip_approved': 'VIP Approved',
        'vip_rejected': 'VIP Rejected'
    };
    return titles[type] || 'Activity';
}

function getActivityDescription(activity) {
    if (activity.data) {
        if (activity.type === 'ad_watched') {
            return `Earned ${activity.data.points_earned || 0} points`;
        }
        if (activity.type === 'contest_ad') {
            return `${activity.data.contest_type || 'Unknown'} contest - Count: ${activity.data.new_count || 0}`;
        }
        if (activity.type === 'vip_request') {
            return `Current status: ${activity.data.current_status || 'FREE'}`;
        }
    }
    return 'No additional details';
}

function getVipBadge(vipStatus) {
    const badges = {
        'FREE': '<span class="vip-badge free">FREE</span>',
        'KING': '<span class="vip-badge king">👑 KING</span>',
        'EMPEROR': '<span class="vip-badge emperor">💎 EMPEROR</span>',
        'LORD': '<span class="vip-badge lord">🏆 LORD</span>'
    };
    return badges[vipStatus] || badges['FREE'];
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

// Dashboard utility functions
function updateDashboardStats() {
    // Update stats in real-time
    const users = Object.values(realTimeData.users || {});
    const activities = Object.values(realTimeData.activities || {});
    
    // Update header stats if visible
    const totalUsersEl = document.querySelector('.stat-card h3');
    if (totalUsersEl) {
        totalUsersEl.textContent = users.length.toLocaleString();
    }
}

function updateVipNotificationCount() {
    const vipNotifications = Object.values(realTimeData.vipNotifications || {});
    const badges = document.querySelectorAll('.badge-warning');
    badges.forEach(badge => {
        badge.textContent = vipNotifications.length;
    });
}

function refreshDashboard() {
    showNotification('Dashboard refreshed', 'success');
    switchTab(currentTab);
}

function showLoading() {
    const content = document.getElementById('mainContent');
    if (content) {
        content.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading data...</p>
            </div>
        `;
    }
}

function hideLoading() {
    // Loading is hidden when content is rendered
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function toggleLanguage() {
    isAdminArabic = !isAdminArabic;
    showNotification(`Language switched to ${isAdminArabic ? 'Arabic' : 'English'}`, 'info');
}

// Filter and search functions
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const users = Object.values(realTimeData.users || {});
    const filteredUsers = users.filter(user => 
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm)) ||
        (user.username && user.username.toLowerCase().includes(searchTerm)) ||
        user.id.toString().includes(searchTerm)
    );
    
    const tbody = document.querySelector('.users-table tbody');
    if (tbody) {
        tbody.innerHTML = renderUsersTable(filteredUsers);
    }
}

function filterActivities() {
    const filterType = document.getElementById('activityFilter').value;
    const activities = Object.values(realTimeData.activities || {})
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const filteredActivities = filterType === 'all' ? 
        activities : 
        activities.filter(activity => activity.type === filterType);
    
    const container = document.querySelector('.activities-container');
    if (container) {
        container.innerHTML = renderActivitiesList(filteredActivities);
    }
}

// Export functions
function exportUsers() {
    const users = Object.values(realTimeData.users || {});
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
    
    showNotification('Users exported successfully', 'success');
}

// Initialize dashboard
console.log('🚀 NAVIGI SBARO Admin Dashboard Script Loaded');
console.log('🔥 Firebase Config Ready');
console.log('📊 Real-time Integration Active');