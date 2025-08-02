// ================================
// NAVIGI SBARO ADMIN DASHBOARD
// Real-time Firebase Integration + Bot Control
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

// Bot Configuration
const BOT_CONFIG = {
    token: '8185239716:AAGwRpHQH3pEoMLVTzWpLnE3hHTNc35AleY',
    adminUserId: 7544271642,
    webhookUrl: 'https://navigiu.netlify.app/admin-dashboard',
    statusEndpoint: '/api/bot-status'
};

// Global Variables
let database = null;
let isFirebaseInitialized = false;
let currentTab = 'overview';
let botStatus = 'unknown';
let botConnection = false;

// Real-time data storage
let realTimeData = {
    users: {},
    activities: {},
    vipNotifications: {},
    payments: {},
    systemStats: {},
    botMetrics: {
        totalUsers: 0,
        activeUsers: 0,
        messagesToday: 0,
        commandsExecuted: 0,
        lastActivity: null
    },
    lastUpdate: new Date()
};

// ================================
// BOT INTEGRATION FUNCTIONS
// ================================

// Check bot status
async function checkBotStatus() {
    try {
        const response = await fetch('/api/bot-status');
        const data = await response.json();
        botStatus = data.status;
        botConnection = data.connected;
        updateBotStatusDisplay();
        return data;
    } catch (error) {
        console.error('❌ Bot status check failed:', error);
        botStatus = 'offline';
        botConnection = false;
        updateBotStatusDisplay();
        return { status: 'offline', connected: false };
    }
}

// Send bot command
async function sendBotCommand(command, params = {}) {
    try {
        const response = await fetch('/api/bot-command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                command: command,
                params: params
            })
        });
        
        const result = await response.json();
        if (result.success) {
            showNotification(`Bot command executed: ${command}`, 'success');
            return result;
        } else {
            showNotification(`Bot command failed: ${result.error}`, 'error');
            return result;
        }
    } catch (error) {
        console.error('❌ Bot command failed:', error);
        showNotification('Bot command failed: Network error', 'error');
        return { success: false, error: error.message };
    }
}

// Update bot status display
function updateBotStatusDisplay() {
    const statusElement = document.getElementById('bot-status');
    const connectionElement = document.getElementById('bot-connection');
    
    if (statusElement) {
        statusElement.textContent = botStatus;
        statusElement.className = `status-badge ${botStatus}`;
    }
    
    if (connectionElement) {
        connectionElement.textContent = botConnection ? 'Connected' : 'Disconnected';
        connectionElement.className = `connection-badge ${botConnection ? 'connected' : 'disconnected'}`;
    }
}

// ================================
// FIREBASE INITIALIZATION
// ================================

function initializeFirebase() {
    try {
        console.log('🔄 Initializing Firebase Admin Dashboard...');
        addStatusMessage('Initializing Firebase connection...', 'info');
        
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                console.log('⚡ Creating new Firebase app...');
                firebase.initializeApp(firebaseConfig);
            } else {
                console.log('♻️ Using existing Firebase app...');
            }
            
            database = firebase.database();
            isFirebaseInitialized = true;
            
            console.log('✅ Firebase initialized successfully');
            console.log('🔗 Database URL:', firebaseConfig.databaseURL);
            console.log('🔥 Project ID:', firebaseConfig.projectId);
            
            addStatusMessage('Firebase initialized successfully', 'success');
            updateConnectionStatus('online', 'Connected & Active');
            
            // Test connection immediately
            testFirebaseConnection();
            
            // Setup real-time listeners
            setupRealtimeListeners();
            
            // Check bot status
            checkBotStatus();
            
            // Show success notification
            showNotification('Firebase connected successfully!', 'success');
            
            return true;
        } else {
            throw new Error('Firebase SDK not loaded - check internet connection');
        }
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error);
        addStatusMessage('Firebase initialization failed: ' + error.message, 'error');
        updateConnectionStatus('offline', 'Connection Failed');
        showNotification('Firebase connection failed: ' + error.message, 'error');
        return false;
    }
}

// Test Firebase connection
async function testFirebaseConnection() {
    try {
        console.log('🧪 Testing Firebase connection...');
        addStatusMessage('Running connection test...', 'info');
        
        // Test basic connection status
        const connectedRef = database.ref('.info/connected');
        connectedRef.on('value', (snapshot) => {
            if (snapshot.val() === true) {
                console.log('✅ Firebase connection: ONLINE');
                addStatusMessage('Connection status: ONLINE', 'success');
                updateConnectionStatus('online', 'Online & Syncing');
            } else {
                console.log('❌ Firebase connection: OFFLINE');
                addStatusMessage('Connection status: OFFLINE', 'warning');
                updateConnectionStatus('offline', 'Offline');
            }
        });
        
        // Test write/read capability
        const testRef = database.ref('dashboard_connection_test');
        await testRef.set({
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            source: 'admin_dashboard',
            test_id: Date.now(),
            status: 'connection_verified'
        });
        
        console.log('✅ Firebase write test successful');
        addStatusMessage('Write/Read test successful', 'success');
        
        // Clean up test data after 10 seconds
        setTimeout(() => {
            testRef.remove().catch(err => console.warn('Test cleanup failed:', err));
        }, 10000);
        
    } catch (error) {
        console.error('❌ Firebase connection test failed:', error);
        addStatusMessage('Connection test failed: ' + error.message, 'error');
        updateConnectionStatus('offline', 'Test Failed');
        showNotification('Connection test failed', 'error');
    }
}

// Setup real-time listeners
function setupRealtimeListeners() {
    if (!isFirebaseInitialized || !database) {
        console.log('⚠️ Firebase not available for listeners');
        addStatusMessage('Firebase not available - no real-time data', 'warning');
        return;
    }

    console.log('🔄 Setting up real-time listeners...');
    addStatusMessage('Setting up real-time data listeners...', 'info');

    try {
        // Listen to users data with error handling
        database.ref('users').on('value', (snapshot) => {
            try {
                const users = snapshot.val() || {};
                realTimeData.users = users;
                const userCount = Object.keys(users).length;
                console.log('👥 Users data updated:', userCount, 'users');
                addStatusMessage(`Users updated: ${userCount} total users`, 'success');
                
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
            showNotification('Users data connection failed', 'error');
        });

        // Listen to activities data
        database.ref('activities').orderByChild('created_at').limitToLast(100).on('value', (snapshot) => {
            try {
                const activities = snapshot.val() || {};
                realTimeData.activities = activities;
                const activityCount = Object.keys(activities).length;
                console.log('📊 Activities updated:', activityCount, 'activities');
                addStatusMessage(`Activities updated: ${activityCount} recent activities`, 'success');
                
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
            showNotification('Activities data connection failed', 'error');
        });

        // Listen to VIP notifications
        database.ref('vip_notifications').orderByChild('status').equalTo('pending').on('value', (snapshot) => {
            try {
                const notifications = snapshot.val() || {};
                realTimeData.vipNotifications = notifications;
                const count = Object.keys(notifications).length;
                console.log('📞 VIP notifications updated:', count, 'pending');
                addStatusMessage(`VIP requests: ${count} pending approval`, count > 0 ? 'warning' : 'success');
                
                if (currentTab === 'vip' || currentTab === 'overview') {
                    renderCurrentTab();
                }
                
                // Show notification for new VIP requests
                if (count > 0) {
                    showNotification(`${count} VIP request${count > 1 ? 's' : ''} pending approval`, 'warning');
                }
            } catch (error) {
                console.error('❌ Error processing VIP notifications:', error);
                addStatusMessage('Error processing VIP notifications', 'error');
            }
        }, (error) => {
            console.error('❌ VIP notifications listener error:', error);
            addStatusMessage('VIP notifications connection failed', 'error');
            showNotification('VIP notifications connection failed', 'error');
        });

        // Listen to payments data
        database.ref('payments').orderByChild('created_at').limitToLast(200).on('value', (snapshot) => {
            try {
                const payments = snapshot.val() || {};
                realTimeData.payments = payments;
                const paymentCount = Object.keys(payments).length;
                console.log('💳 Payments updated:', paymentCount, 'payments');
                addStatusMessage(`Payments updated: ${paymentCount} transactions`, 'success');
                
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
            showNotification('Payments data connection failed', 'error');
        });

        console.log('✅ Real-time listeners setup complete');
        addStatusMessage('All real-time listeners active', 'success');
        showNotification('Real-time data synchronization active', 'success');
        
    } catch (error) {
        console.error('❌ Error setting up Firebase listeners:', error);
        addStatusMessage('Failed to setup listeners: ' + error.message, 'error');
        showNotification('Failed to setup real-time listeners', 'error');
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
        <span class="status-message">${message}</span>
        <span class="status-time">${new Date().toLocaleTimeString()}</span>
    `;
    
    statusLog.appendChild(statusItem);
    
    // Keep only last 25 messages
    while (statusLog.children.length > 25) {
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

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// ================================
// TAB MANAGEMENT
// ================================

// Switch tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    console.log(`🔄 Switching to tab: ${tabName}`);
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        }
    });

    // Render tab content
    renderCurrentTab();
    
    // Update page title
    const titles = {
        overview: 'Dashboard Overview',
        users: 'User Management',
        activities: 'User Activities',
        vip: 'VIP Request Management',
        payments: 'Payment Management'
    };
    
    const headerTitle = document.querySelector('.header h1');
    if (headerTitle) {
        headerTitle.textContent = titles[tabName] || 'Admin Dashboard';
    }
}

// Render current tab
function renderCurrentTab() {
    const content = document.getElementById('mainContent');
    if (!content) return;
    
    // Show loading state
    content.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
    
    // Small delay for smooth transition
    setTimeout(() => {
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
            case 'bot-control':
                renderBotControlTab();
                break;
            default:
                renderOverviewTab();
        }
    }, 200);
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
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const totalActivities = activities.length;
    const pendingVipRequests = vipRequests.length;
    
    // Recent activities (last 10)
    const recentActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
    
    content.innerHTML = `
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Users</span>
                    <span class="stat-icon">👥</span>
                </div>
                <div class="stat-value">${totalUsers}</div>
                <div class="stat-change">+${totalUsers} registered users</div>
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
                    <span class="stat-title">User Activities</span>
                    <span class="stat-icon">📊</span>
                </div>
                <div class="stat-value">${totalActivities}</div>
                <div class="stat-change">Total actions logged</div>
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
                <h2 class="section-title">📊 Recent Activities</h2>
                <button class="btn btn-primary" onclick="switchTab('activities')">
                    View All Activities
                </button>
            </div>
            ${renderRecentActivities(recentActivities)}
        </div>

        <!-- VIP Requests Preview -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">👑 VIP Requests</h2>
                <button class="btn btn-primary" onclick="switchTab('vip')">
                    Manage All Requests
                </button>
            </div>
            ${renderVipRequestsPreview(vipRequests.slice(0, 3))}
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
                <h2 class="section-title">👥 User Management</h2>
                <div class="section-actions">
                    <input type="text" class="search-input" id="userSearch" placeholder="Search users by name or ID..." onkeyup="filterUsers()">
                    <button class="btn btn-primary" onclick="exportUsers()">
                        📥 Export CSV
                    </button>
                </div>
            </div>
            
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User Information</th>
                        <th>Points</th>
                        <th>Balance</th>
                        <th>VIP Status</th>
                        <th>Activity</th>
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
                <h2 class="section-title">📋 User Activities</h2>
                <div class="section-actions">
                    <input type="text" class="search-input" id="activitySearch" placeholder="Search activities..." onkeyup="filterActivities()">
                    <button class="btn btn-primary" onclick="exportActivities()">
                        📥 Export CSV
                    </button>
                </div>
            </div>
            
            <div class="content-list" id="activitiesContainer">
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
                <h2 class="section-title">👑 VIP Request Management</h2>
                <div class="section-actions">
                    ${vipRequests.length > 0 ? 
                        '<button class="btn btn-success" onclick="approveAllVipRequests()">✅ Approve All</button>' : 
                        '<span style="color: #28a745; font-weight: 600;">✅ No pending requests</span>'
                    }
                </div>
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
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    
    const thisMonth = payments.filter(p => {
        const paymentDate = new Date(p.timestamp);
        const now = new Date();
        return paymentDate.getMonth() === now.getMonth() && 
               paymentDate.getFullYear() === now.getFullYear();
    });
    
    const monthlyRevenue = thisMonth
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    
    content.innerHTML = `
        <!-- Payment Stats -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Revenue</span>
                    <span class="stat-icon">💰</span>
                </div>
                <div class="stat-value">$${totalRevenue.toFixed(2)}</div>
                <div class="stat-change">All time earnings</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">This Month</span>
                    <span class="stat-icon">📅</span>
                </div>
                <div class="stat-value">$${monthlyRevenue.toFixed(2)}</div>
                <div class="stat-change">${thisMonth.length} transactions</div>
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
                <h2 class="section-title">💳 Payment History</h2>
                <div class="section-actions">
                    <input type="text" class="search-input" id="paymentSearch" placeholder="Search payments..." onkeyup="filterPayments()">
                    <button class="btn btn-primary" onclick="exportPayments()">
                        📥 Export CSV
                    </button>
                </div>
            </div>
            
            <div class="content-list" id="paymentsContainer">
                ${renderPaymentsList(payments)}
            </div>
        </div>
    `;
}

// Render Bot Control Tab
function renderBotControlTab() {
    const content = document.getElementById('mainContent');
    const metrics = realTimeData.botMetrics;
    
    content.innerHTML = `
        <!-- Bot Status Overview -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Bot Status</span>
                    <span class="stat-icon">🤖</span>
                </div>
                <div class="stat-value" id="bot-status">${botStatus}</div>
                <div class="stat-change" id="bot-connection">${botConnection ? 'Connected' : 'Disconnected'}</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Total Users</span>
                    <span class="stat-icon">👥</span>
                </div>
                <div class="stat-value" id="total-users">${metrics.totalUsers || 0}</div>
                <div class="stat-change">Registered users</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Active Users</span>
                    <span class="stat-icon">🟢</span>
                </div>
                <div class="stat-value" id="active-users">${metrics.activeUsers || 0}</div>
                <div class="stat-change">Today's activity</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <span class="stat-title">Messages Today</span>
                    <span class="stat-icon">💬</span>
                </div>
                <div class="stat-value" id="messages-today">${metrics.messagesToday || 0}</div>
                <div class="stat-change">Total interactions</div>
            </div>
        </div>

        <!-- Bot Control Panel -->
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">🤖 Bot Control Panel</h2>
                <div class="section-actions">
                    <button class="btn btn-success" id="start-btn">
                        ▶️ Start Bot
                    </button>
                    <button class="btn btn-warning" id="stop-btn">
                        ⏹️ Stop Bot
                    </button>
                    <button class="btn btn-info" id="restart-btn">
                        🔄 Restart Bot
                    </button>
                    <button class="btn btn-primary" id="stats-btn">
                        📊 Refresh Stats
                    </button>
                </div>
            </div>
            
            <div class="control-grid">
                <!-- Broadcast Message -->
                <div class="control-card">
                    <h3>📢 Broadcast Message</h3>
                    <div class="input-group">
                        <textarea id="broadcastMessage" placeholder="Enter message to send to all users..." rows="3"></textarea>
                        <button class="btn btn-primary" id="broadcast-btn">Send Broadcast</button>
                    </div>
                </div>
                
                <!-- VIP Notification -->
                <div class="control-card">
                    <h3>👑 VIP Notification</h3>
                    <div class="input-group">
                        <input type="text" id="vipUserId" placeholder="User ID" />
                        <textarea id="vipMessage" placeholder="VIP message..." rows="3"></textarea>
                        <button class="btn btn-warning" id="vip-notify-btn">Send VIP Message</button>
                    </div>
                </div>
                
                <!-- User Management -->
                <div class="control-card">
                    <h3>👤 User Management</h3>
                    <div class="input-group">
                        <input type="text" id="resetUserId" placeholder="User ID to reset" />
                        <button class="btn btn-danger" id="reset-user-btn">Reset User Data</button>
                    </div>
                </div>
                
                <!-- Bot Configuration -->
                <div class="control-card">
                    <h3>⚙️ Bot Configuration</h3>
                    <div class="config-grid">
                        <div class="config-item">
                            <label>VIP FREE Limit:</label>
                            <input type="number" id="vipFree" value="20" />
                        </div>
                        <div class="config-item">
                            <label>VIP KING Limit:</label>
                            <input type="number" id="vipKing" value="50" />
                        </div>
                        <div class="config-item">
                            <label>VIP EMPEROR Limit:</label>
                            <input type="number" id="vipEmperor" value="100" />
                        </div>
                        <div class="config-item">
                            <label>VIP LORD Limit:</label>
                            <input type="number" id="vipLord" value="200" />
                        </div>
                        <div class="config-item">
                            <label>Ad Cooldown (seconds):</label>
                            <input type="number" id="adCooldown" value="300" />
                        </div>
                        <div class="config-item">
                            <label>Contest Cooldown (seconds):</label>
                            <input type="number" id="contestCooldown" value="300" />
                        </div>
                    </div>
                    <button class="btn btn-primary" id="update-config-btn">Update Configuration</button>
                </div>
                
                <!-- Export Logs -->
                <div class="control-card">
                    <h3>📋 System Logs</h3>
                    <div class="input-group">
                        <button class="btn btn-info" id="export-logs-btn">Export Bot Logs</button>
                    </div>
                </div>
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
        return `
            <div class="empty-state">
                <i>📊</i>
                <h3>No Recent Activities</h3>
                <p>User activities will appear here when users interact with the bot</p>
            </div>
        `;
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
                            <td>
                                <div style="font-weight: 600;">${userName}</div>
                                <div style="font-size: 0.8rem; color: #666;">ID: ${activity.user_id}</div>
                            </td>
                            <td>
                                <span style="font-size: 1.2rem;">${getActivityIcon(activity.type)}</span>
                                ${activityText}
                            </td>
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
        return '<tr><td colspan="6" class="empty-state">No users found</td></tr>';
    }

    return users.map(user => {
        const joinDate = new Date(user.join_date).toLocaleDateString();
        const vipStatus = user.vip_status || 'FREE';
        const vipClass = vipStatus === 'FREE' ? 'status pending' : 'status completed';
        
        return `
            <tr>
                <td>
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${user.first_name || user.username || `User ${user.id}`}</div>
                    <div style="font-size: 0.8rem; color: #666;">
                        ${user.username ? `@${user.username} • ` : ''}ID: ${user.id}
                    </div>
                </td>
                <td style="font-weight: 600;">${user.points || 0}</td>
                <td style="font-weight: 600;">$${(user.balance || 0).toFixed(2)}</td>
                <td><span class="${vipClass}">${vipStatus}</span></td>
                <td>
                    <div>📺 ${user.ads_watched || 0} ads</div>
                    <div style="font-size: 0.8rem; color: #666;">👥 ${user.referrals || 0} referrals</div>
                </td>
                <td>${joinDate}</td>
            </tr>
        `;
    }).join('');
}

// Render activities list
function renderActivitiesList(activities) {
    if (!activities || activities.length === 0) {
        return `
            <div class="empty-state">
                <i>📋</i>
                <h3>No Activities Found</h3>
                <p>User activities will appear here as they interact with the bot</p>
            </div>
        `;
    }

    return activities.map(activity => {
        const user = realTimeData.users[activity.user_id];
        const userName = user ? (user.first_name || user.username || `User ${activity.user_id}`) : `User ${activity.user_id}`;
        const time = formatTimeAgo(new Date(activity.timestamp));
        const details = getActivityDetails(activity);
        
        return `
            <div class="list-item">
                <div class="item-content">
                    <div class="item-title">
                        <span style="font-size: 1.3rem; margin-right: 0.5rem;">${getActivityIcon(activity.type)}</span>
                        ${getActivityText(activity.type)}
                    </div>
                    <div class="item-subtitle">by ${userName}</div>
                    ${details ? `<div class="item-details">${details}</div>` : ''}
                </div>
                <div style="text-align: right; color: #666; font-size: 0.9rem;">
                    ${time}
                </div>
            </div>
        `;
    }).join('');
}

// Render VIP requests preview
function renderVipRequestsPreview(vipRequests) {
    if (!vipRequests || vipRequests.length === 0) {
        return `
            <div class="empty-state">
                <i>👑</i>
                <h3>No VIP Requests</h3>
                <p>VIP upgrade requests will appear here when submitted</p>
            </div>
        `;
    }

    return `
        <div style="display: grid; gap: 1rem;">
            ${vipRequests.map(request => renderVipCard(request)).join('')}
        </div>
    `;
}

// Render VIP requests list
function renderVipRequestsList(vipRequests) {
    if (!vipRequests || vipRequests.length === 0) {
        return `
            <div class="empty-state">
                <i>👑</i>
                <h3>No Pending VIP Requests</h3>
                <p>VIP upgrade requests will appear here when users request upgrades</p>
            </div>
        `;
    }

    return `
        <div style="display: grid; gap: 1.5rem;">
            ${vipRequests.map(request => renderVipCard(request)).join('')}
        </div>
    `;
}

// Render VIP card
function renderVipCard(request) {
    const user = realTimeData.users[request.user_id];
    const userName = user ? (user.first_name || user.username || `User ${request.user_id}`) : `User ${request.user_id}`;
    const requestTime = formatTimeAgo(new Date(request.request_timestamp));
    const stats = request.user_stats || {};
    
    return `
        <div class="vip-card">
            <div class="vip-header">
                <div class="vip-user">
                    <div class="vip-name">${userName}</div>
                    <div class="vip-info">
                        ID: ${request.user_id} • Requested ${requestTime}
                    </div>
                </div>
                <span class="status pending">Pending</span>
            </div>
            
            <div class="vip-stats">
                <div class="vip-stat">
                    <div class="vip-stat-label">Points</div>
                    <div class="vip-stat-value">${stats.points || 0}</div>
                </div>
                <div class="vip-stat">
                    <div class="vip-stat-label">Ads Watched</div>
                    <div class="vip-stat-value">${stats.ads_watched || 0}</div>
                </div>
                <div class="vip-stat">
                    <div class="vip-stat-label">Balance</div>
                    <div class="vip-stat-value">$${(stats.balance || 0).toFixed(2)}</div>
                </div>
                <div class="vip-stat">
                    <div class="vip-stat-label">Referrals</div>
                    <div class="vip-stat-value">${stats.referrals || 0}</div>
                </div>
                <div class="vip-stat">
                    <div class="vip-stat-label">Contests</div>
                    <div class="vip-stat-value">${stats.contests_joined || 0}</div>
                </div>
            </div>
            
            <div class="item-actions">
                <button class="btn btn-success btn-sm" onclick="approveVipRequest('${request.id}', '${request.user_id}')">
                    ✅ Approve
                </button>
                <button class="btn btn-danger btn-sm" onclick="rejectVipRequest('${request.id}', '${request.user_id}')">
                    ❌ Reject
                </button>
            </div>
        </div>
    `;
}

// Render payments list
function renderPaymentsList(payments) {
    if (!payments || payments.length === 0) {
        return `
            <div class="empty-state">
                <i>💳</i>
                <h3>No Payments Found</h3>
                <p>Payment transactions will appear here when processed</p>
            </div>
        `;
    }

    return payments.map(payment => {
        const user = payment.user_info || {};
        const userName = user.first_name || user.username || `User ${payment.user_id}`;
        const date = new Date(payment.timestamp).toLocaleDateString();
        const time = new Date(payment.timestamp).toLocaleTimeString();
        const statusClass = payment.status === 'completed' ? 'status completed' : 
                           payment.status === 'pending' ? 'status pending' : 'status rejected';
        
        return `
            <div class="list-item">
                <div class="item-content">
                    <div class="item-title">
                        <span style="font-size: 1.3rem; margin-right: 0.5rem;">💳</span>
                        ${payment.tier || payment.type} VIP Purchase
                    </div>
                    <div class="item-subtitle">by ${userName}</div>
                    <div class="item-details">
                        ${payment.payment_method || 'Unknown method'} • ${date} at ${time}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; font-size: 1.2rem; margin-bottom: 0.25rem;">
                        $${parseFloat(payment.amount || 0).toFixed(2)}
                    </div>
                    <span class="${statusClass}">${payment.status}</span>
                </div>
            </div>
        `;
    }).join('');
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
        'user_referred': '🎁',
        'admin_reset_referrals': '🔄',
        'admin_reset_contests': '🏆'
    };
    return icons[type] || '📊';
}

// Get activity text
function getActivityText(type) {
    const texts = {
        'ad_watched': 'Watched Advertisement',
        'contest_ad': 'Contest Advertisement',
        'vip_request': 'VIP Upgrade Request',
        'vip_purchased': 'VIP Purchase',
        'user_joined': 'Joined Platform',
        'referral_earned': 'Referral Bonus Earned',
        'connection_test': 'System Connection Test',
        'user_referred': 'Used Referral Code',
        'admin_reset_referrals': 'Admin Reset Referrals',
        'admin_reset_contests': 'Admin Reset Contests'
    };
    return texts[type] || 'User Activity';
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
            return `${data.vip_tier || 'VIP'} tier - $${data.amount || 0}`;
        case 'referral_earned':
            return `+${data.bonus_points || 0} points (${data.new_referral_count || 0} total referrals)`;
        case 'user_joined':
            return `Platform: ${data.platform || 'telegram_bot'}`;
        case 'admin_reset_referrals':
            return `${data.users_affected || 0} users affected`;
        case 'admin_reset_contests':
            return `${data.users_affected || 0} users affected`;
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
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// ================================
// ACTION FUNCTIONS
// ================================

// Approve VIP request
async function approveVipRequest(notificationId, userId) {
    if (!isFirebaseInitialized) {
        showNotification('Firebase not connected', 'error');
        return;
    }
    
    try {
        console.log(`✅ Approving VIP request: ${notificationId} for user ${userId}`);
        
        // Update notification status
        await database.ref(`vip_notifications/${notificationId}`).update({
            status: 'approved',
            processed_at: firebase.database.ServerValue.TIMESTAMP,
            processed_by: 'admin_dashboard'
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
        showNotification(`VIP request approved for user ${userId}`, 'success');
        
    } catch (error) {
        console.error('❌ Error approving VIP request:', error);
        addStatusMessage('Error approving VIP request: ' + error.message, 'error');
        showNotification('Error approving VIP request', 'error');
    }
}

// Reject VIP request
async function rejectVipRequest(notificationId, userId) {
    if (!isFirebaseInitialized) {
        showNotification('Firebase not connected', 'error');
        return;
    }
    
    try {
        console.log(`❌ Rejecting VIP request: ${notificationId} for user ${userId}`);
        
        await database.ref(`vip_notifications/${notificationId}`).update({
            status: 'rejected',
            processed_at: firebase.database.ServerValue.TIMESTAMP,
            processed_by: 'admin_dashboard'
        });
        
        addStatusMessage(`VIP request rejected for user ${userId}`, 'warning');
        showNotification(`VIP request rejected for user ${userId}`, 'warning');
        
    } catch (error) {
        console.error('❌ Error rejecting VIP request:', error);
        addStatusMessage('Error rejecting VIP request: ' + error.message, 'error');
        showNotification('Error rejecting VIP request', 'error');
    }
}

// Approve all VIP requests
async function approveAllVipRequests() {
    const vipRequests = Object.values(realTimeData.vipNotifications || {});
    
    if (vipRequests.length === 0) {
        showNotification('No pending VIP requests to approve', 'info');
        return;
    }
    
    if (!confirm(`Are you sure you want to approve all ${vipRequests.length} VIP requests?`)) {
        return;
    }
    
    try {
        for (const request of vipRequests) {
            await approveVipRequest(request.id, request.user_id);
        }
        
        showNotification(`Successfully approved ${vipRequests.length} VIP requests`, 'success');
        
    } catch (error) {
        console.error('❌ Error approving all VIP requests:', error);
        showNotification('Error approving all VIP requests', 'error');
    }
}

// Export functions
function exportUsers() {
    const users = Object.values(realTimeData.users || {});
    if (users.length === 0) {
        showNotification('No users to export', 'warning');
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
    
    showNotification('Users exported successfully', 'success');
}

function exportPayments() {
    const payments = Object.values(realTimeData.payments || {});
    if (payments.length === 0) {
        showNotification('No payments to export', 'warning');
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
    
    showNotification('Payments exported successfully', 'success');
}

function exportActivities() {
    const activities = Object.values(realTimeData.activities || {});
    if (activities.length === 0) {
        showNotification('No activities to export', 'warning');
        return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," +
        "Date,User ID,Activity Type,Details,Timestamp\n" +
        activities.map(activity => {
            const details = getActivityDetails(activity);
            return `"${new Date(activity.timestamp).toLocaleDateString()}","${activity.user_id}","${activity.type}","${details}","${activity.timestamp}"`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `navigi_activities_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Activities exported successfully', 'success');
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
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
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
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    document.getElementById('paymentsContainer').innerHTML = renderPaymentsList(filteredPayments);
}

// ================================
// BOT CONTROL FUNCTIONS
// ================================

// Send broadcast message to all users
async function sendBroadcastMessage() {
    const message = document.getElementById('broadcastMessage').value.trim();
    if (!message) {
        showNotification('Please enter a message to broadcast', 'warning');
        return;
    }
    
    const result = await sendBotCommand('broadcast', { message: message });
    if (result.success) {
        document.getElementById('broadcastMessage').value = '';
        showNotification('Broadcast message sent successfully', 'success');
    }
}

// Restart bot
async function restartBot() {
    if (confirm('Are you sure you want to restart the bot? This will temporarily disconnect all users.')) {
        const result = await sendBotCommand('restart', {});
        if (result.success) {
            showNotification('Bot restart initiated', 'info');
            setTimeout(() => checkBotStatus(), 5000);
        }
    }
}

// Stop bot
async function stopBot() {
    if (confirm('Are you sure you want to stop the bot? This will disconnect all users.')) {
        const result = await sendBotCommand('stop', {});
        if (result.success) {
            showNotification('Bot stopped successfully', 'warning');
            setTimeout(() => checkBotStatus(), 2000);
        }
    }
}

// Start bot
async function startBot() {
    const result = await sendBotCommand('start', {});
    if (result.success) {
        showNotification('Bot started successfully', 'success');
        setTimeout(() => checkBotStatus(), 2000);
    }
}

// Get bot statistics
async function getBotStats() {
    const result = await sendBotCommand('stats', {});
    if (result.success) {
        realTimeData.botMetrics = result.data;
        updateBotMetricsDisplay();
        showNotification('Bot statistics updated', 'success');
    }
}

// Update bot metrics display
function updateBotMetricsDisplay() {
    const metrics = realTimeData.botMetrics;
    
    const elements = {
        'total-users': metrics.totalUsers || 0,
        'active-users': metrics.activeUsers || 0,
        'messages-today': metrics.messagesToday || 0,
        'commands-executed': metrics.commandsExecuted || 0,
        'last-activity': metrics.lastActivity ? formatTimeAgo(new Date(metrics.lastActivity)) : 'Never'
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = elements[id];
        }
    });
}

// Send VIP notification
async function sendVipNotification() {
    const userId = document.getElementById('vipUserId').value.trim();
    const message = document.getElementById('vipMessage').value.trim();
    
    if (!userId || !message) {
        showNotification('Please enter both user ID and message', 'warning');
        return;
    }
    
    const result = await sendBotCommand('sendVipNotification', { 
        userId: userId, 
        message: message 
    });
    
    if (result.success) {
        document.getElementById('vipUserId').value = '';
        document.getElementById('vipMessage').value = '';
        showNotification('VIP notification sent successfully', 'success');
    }
}

// Reset user data
async function resetUserData() {
    const userId = document.getElementById('resetUserId').value.trim();
    
    if (!userId) {
        showNotification('Please enter a user ID', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to reset all data for user ${userId}?`)) {
        const result = await sendBotCommand('resetUser', { userId: userId });
        if (result.success) {
            document.getElementById('resetUserId').value = '';
            showNotification('User data reset successfully', 'success');
        }
    }
}

// Export bot logs
async function exportBotLogs() {
    const result = await sendBotCommand('exportLogs', {});
    if (result.success) {
        const logs = result.data;
        const csvContent = "data:text/csv;charset=utf-8," +
            "Timestamp,Level,Message,User ID\n" +
            logs.map(log => `"${log.timestamp}","${log.level}","${log.message}","${log.userId || ''}"`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `navigi_bot_logs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Bot logs exported successfully', 'success');
    }
}

// Update bot configuration
async function updateBotConfig() {
    const config = {
        vipLimits: {
            FREE: parseInt(document.getElementById('vipFree').value) || 20,
            KING: parseInt(document.getElementById('vipKing').value) || 50,
            EMPEROR: parseInt(document.getElementById('vipEmperor').value) || 100,
            LORD: parseInt(document.getElementById('vipLord').value) || 200
        },
        cooldowns: {
            ad: parseInt(document.getElementById('adCooldown').value) || 300,
            contest: parseInt(document.getElementById('contestCooldown').value) || 300
        }
    };
    
    const result = await sendBotCommand('updateConfig', config);
    if (result.success) {
        showNotification('Bot configuration updated successfully', 'success');
    }
}

// ================================
// DASHBOARD INITIALIZATION
// ================================

// Initialize dashboard
function initializeDashboard() {
    console.log('🚀 Initializing NAVIGI Admin Dashboard...');
    
    // Initialize Firebase
    if (initializeFirebase()) {
        // Setup periodic updates
        setInterval(() => {
            checkBotStatus();
            getBotStats();
        }, 30000); // Every 30 seconds
        
        // Setup real-time updates
        setInterval(() => {
            updateBotMetricsDisplay();
        }, 10000); // Every 10 seconds
    }
    
    // Setup event listeners
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    // Bot control buttons
    const botControls = {
        'broadcast-btn': sendBroadcastMessage,
        'restart-btn': restartBot,
        'stop-btn': stopBot,
        'start-btn': startBot,
        'stats-btn': getBotStats,
        'vip-notify-btn': sendVipNotification,
        'reset-user-btn': resetUserData,
        'export-logs-btn': exportBotLogs,
        'update-config-btn': updateBotConfig
    };
    
    Object.keys(botControls).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('click', botControls[id]);
        }
    });
    
    // Auto-refresh bot status
    setInterval(checkBotStatus, 60000); // Every minute
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 NAVIGI Admin Dashboard Loading...');
    initializeDashboard();
});

// Export functions for global access
window.sendBroadcastMessage = sendBroadcastMessage;
window.restartBot = restartBot;
window.stopBot = stopBot;
window.startBot = startBot;
window.getBotStats = getBotStats;
window.sendVipNotification = sendVipNotification;
window.resetUserData = resetUserData;
window.exportBotLogs = exportBotLogs;
window.updateBotConfig = updateBotConfig;