// Admin Dashboard JavaScript
let isAdminArabic = false;
let currentTab = 'overview';

// Sample VIP Payment Data
const sampleVipPayments = [
    {
        id: 'PAY_1704123456_ABC123',
        userId: 'USR001',
        userEmail: 'user1@example.com',
        tier: 'king',
        amount: '2.50',
        currency: 'USDT',
        network: 'TRC20',
        transactionHash: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t...123456',
        screenshotUrl: 'https://example.com/screenshots/payment1.jpg',
        additionalNotes: 'Payment completed via TronLink wallet',
        status: 'pending',
        submittedAt: new Date('2024-01-15T10:30:00'),
        tronAddress: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX'
    },
    {
        id: 'PAY_1704123789_DEF456',
        userId: 'USR045',
        userEmail: 'vipuser@example.com',
        tier: 'emperor',
        amount: '9.00',
        currency: 'USDT',
        network: 'TRC20',
        transactionHash: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t...789012',
        screenshotUrl: 'https://example.com/screenshots/payment2.jpg',
        additionalNotes: '',
        status: 'pending',
        submittedAt: new Date('2024-01-15T14:20:00'),
        tronAddress: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX'
    },
    {
        id: 'PAY_1704124012_GHI789',
        userId: 'USR078',
        userEmail: 'lorduser@example.com',
        tier: 'lord',
        amount: '25.00',
        currency: 'USDT',
        network: 'TRC20',
        transactionHash: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t...345678',
        screenshotUrl: 'https://example.com/screenshots/payment3.jpg',
        additionalNotes: 'Upgrading from Emperor to Lord tier',
        status: 'pending',
        submittedAt: new Date('2024-01-15T16:45:00'),
        tronAddress: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX'
    },
    {
        id: 'PAY_1704120000_JKL012',
        userId: 'USR123',
        userEmail: 'approved@example.com',
        tier: 'king',
        amount: '2.50',
        currency: 'USDT',
        network: 'TRC20',
        transactionHash: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t...901234',
        screenshotUrl: 'https://example.com/screenshots/payment4.jpg',
        additionalNotes: '',
        status: 'approved',
        submittedAt: new Date('2024-01-15T08:15:00'),
        approvedAt: new Date('2024-01-15T09:30:00'),
        tronAddress: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX'
    },
    {
        id: 'PAY_1704118800_MNO345',
        userId: 'USR156',
        userEmail: 'rejected@example.com',
        tier: 'emperor',
        amount: '9.00',
        currency: 'USDT',
        network: 'TRC20',
        transactionHash: 'INVALID_HASH_123',
        screenshotUrl: 'https://example.com/screenshots/payment5.jpg',
        additionalNotes: 'Suspicious transaction',
        status: 'rejected',
        submittedAt: new Date('2024-01-15T06:00:00'),
        rejectedAt: new Date('2024-01-15T07:15:00'),
        rejectionReason: 'Invalid transaction hash provided',
        tronAddress: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX'
    }
];
let charts = {};

// Demo Credentials
const ADMIN_CREDENTIALS = {
    email: 'seiftouatllol@gmail.com',
    password: 'seif0662',
    twofa: '112023'
};

// Sample Data
const sampleVipUsers = [
    {
        id: 'USR001',
        email: 'user1@example.com',
        tier: 'king',
        startDate: '2024-01-15',
        expiryDate: '2024-02-15',
        revenue: 2.50,
        daysLeft: 12
    },
    {
        id: 'USR002',
        email: 'user2@example.com',
        tier: 'emperor',
        startDate: '2024-01-10',
        expiryDate: '2024-02-10',
        revenue: 9.00,
        daysLeft: 7
    },
    {
        id: 'USR003',
        email: 'user3@example.com',
        tier: 'lord',
        startDate: '2024-01-20',
        expiryDate: '2024-02-20',
        revenue: 25.00,
        daysLeft: 17
    },
    {
        id: 'USR004',
        email: 'ahmed.hassan@example.com',
        tier: 'king',
        startDate: '2024-01-12',
        expiryDate: '2024-02-12',
        revenue: 2.50,
        daysLeft: 9
    },
    {
        id: 'USR005',
        email: 'fatima.ali@example.com',
        tier: 'emperor',
        startDate: '2024-01-18',
        expiryDate: '2024-02-18',
        revenue: 9.00,
        daysLeft: 15
    }
];

const sampleUsers = [
    {
        id: 'USR001',
        email: 'user1@example.com',
        points: 2547,
        adsWatched: 156,
        referrals: 3,
        joinDate: '2024-01-15',
        status: 'active'
    },
    {
        id: 'USR002',
        email: 'user2@example.com',
        points: 1823,
        adsWatched: 98,
        referrals: 1,
        joinDate: '2024-01-10',
        status: 'active'
    },
    {
        id: 'USR003',
        email: 'user3@example.com',
        points: 4561,
        adsWatched: 267,
        referrals: 8,
        joinDate: '2024-01-05',
        status: 'vip'
    }
];

const sampleWithdrawals = [
    {
        id: 'WD001',
        userEmail: 'user1@example.com',
        method: 'Binance Pay',
        amount: '$5.20',
        points: 520,
        requestDate: '2024-01-25',
        status: 'pending'
    },
    {
        id: 'WD002',
        userEmail: 'user2@example.com',
        method: 'BaridiMob',
        amount: '$12.80',
        points: 1280,
        requestDate: '2024-01-24',
        status: 'approved'
    },
    {
        id: 'WD003',
        userEmail: 'user3@example.com',
        method: 'Google Play',
        amount: '$25.00',
        points: 2500,
        requestDate: '2024-01-23',
        status: 'pending'
    }
];

const recentActivities = [
    {
        type: 'user',
        title: 'New User Registration',
        description: 'user456@example.com joined NAVIGI',
        time: '2 minutes ago',
        icon: '👤'
    },
    {
        type: 'vip',
        title: 'VIP Upgrade',
        description: 'ahmed.hassan@example.com upgraded to Emperor Tier',
        time: '15 minutes ago',
        icon: '👑'
    },
    {
        type: 'withdrawal',
        title: 'Withdrawal Request',
        description: 'fatima.ali@example.com requested $15.50 via Binance Pay',
        time: '32 minutes ago',
        icon: '💰'
    },
    {
        type: 'contest',
        title: 'Contest Winner',
        description: 'Daily contest winner: user789@example.com (Prize: $146.30)',
        time: '1 hour ago',
        icon: '🏆'
    }
];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', handleTabChange);
    });

    // Initialize charts if dashboard is visible
    if (document.getElementById('dashboardMain').style.display !== 'none') {
        initializeDashboard();
    }

    // Mobile menu toggle
    initializeMobileMenu();
});

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();
    const twofa = document.getElementById('twofa').value.trim();
    
    // Debug logging
    console.log('Login attempt:', { email, password, twofa });
    console.log('Expected:', { 
        email: ADMIN_CREDENTIALS.email.toLowerCase(), 
        password: ADMIN_CREDENTIALS.password 
    });

    // Validate credentials (case-insensitive email, optional 2FA)
    const isEmailValid = email === ADMIN_CREDENTIALS.email.toLowerCase();
    const isPasswordValid = password === ADMIN_CREDENTIALS.password;
    const is2FAValid = !twofa || twofa === ADMIN_CREDENTIALS.twofa;
    
    if (isEmailValid && isPasswordValid && is2FAValid) {
        // Hide login screen and show dashboard
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboardMain').style.display = 'flex';
        
        // Initialize dashboard
        initializeDashboard();
        
        showNotification('Login successful! Welcome to NAVIGI Admin Dashboard.', 'success');
    } else {
        console.error('Login failed - credentials mismatch');
        showNotification('Invalid credentials. Please try again.', 'error');
        
        // Show expected credentials in console for debugging
        console.log('Use these credentials:');
        console.log('Email: seiftouatllol@gmail.com');
        console.log('Password: seif0662');
    }
}

// Quick Login Function for Demo
function quickLogin() {
    document.getElementById('email').value = 'seiftouatllol@gmail.com';
    document.getElementById('password').value = 'seif0662';
    document.getElementById('twofa').value = '112023';
    
    // Trigger login
    const loginEvent = new Event('submit');
    document.getElementById('loginForm').dispatchEvent(loginEvent);
}

// Initialize Dashboard
function initializeDashboard() {
    initializeCharts();
    populateVipUsersTable();
    populateUsersTable();
    populateWithdrawalsTable();
    populateVipPaymentsTable();
    populateRecentActivity();
    startCountdownTimers();
}

// Tab Change Handler
function handleTabChange(e) {
    e.preventDefault();
    
    const tabName = e.currentTarget.getAttribute('data-tab');
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update page title
    updatePageTitle(tabName);
    
    currentTab = tabName;
}

// Update Page Title
function updatePageTitle(tabName) {
    const titles = {
        'overview': isAdminArabic ? 'نظرة عامة على لوحة التحكم' : 'Dashboard Overview',
        'vip-management': isAdminArabic ? 'إدارة مستخدمي VIP' : 'VIP Users Management',
        'users': isAdminArabic ? 'إدارة المستخدمين' : 'User Management',
        'contests': isAdminArabic ? 'إدارة المسابقات' : 'Contest Management',
        'withdrawals': isAdminArabic ? 'طلبات السحب' : 'Withdrawal Requests',
        'vip-payments': isAdminArabic ? 'موافقات مدفوعات VIP' : 'VIP Payment Approvals',
        'ads': isAdminArabic ? 'إدارة أرباح الإعلانات' : 'Ad Revenue Management',
        'notifications': isAdminArabic ? 'إرسال الإشعارات' : 'Send Notifications'
    };
    
    document.getElementById('pageTitle').textContent = titles[tabName] || titles['overview'];
}

// Initialize Charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        charts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Total Revenue ($)',
                    data: [12000, 15500, 18200, 16800, 21300, 24562, 23100],
                    borderColor: '#3498DB',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'VIP Revenue ($)',
                    data: [3000, 4200, 5800, 6200, 7100, 8200, 8500],
                    borderColor: '#9B59B6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // User Growth Chart
    const userCtx = document.getElementById('userChart');
    if (userCtx) {
        charts.users = new Chart(userCtx, {
            type: 'bar',
            data: {
                labels: ['Free Users', 'King VIP', 'Emperor VIP', 'Lord VIP'],
                datasets: [{
                    label: 'User Count',
                    data: [11591, 342, 398, 107],
                    backgroundColor: [
                        '#3498DB',
                        '#3498DB',
                        '#9B59B6',
                        '#E74C3C'
                    ],
                    borderColor: [
                        '#2980B9',
                        '#2980B9',
                        '#8E44AD',
                        '#C0392B'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Populate VIP Users Table
function populateVipUsersTable() {
    const tbody = document.getElementById('vipUsersBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    sampleVipUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td><span class="tier-badge ${user.tier}">👑 ${user.tier.toUpperCase()}</span></td>
            <td>${formatDate(user.startDate)}</td>
            <td>${formatDate(user.expiryDate)}</td>
            <td class="${user.daysLeft <= 7 ? 'text-danger' : user.daysLeft <= 14 ? 'text-warning' : 'text-success'}">
                ${user.daysLeft} days
            </td>
            <td class="text-success font-weight-bold">$${user.revenue.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="extendVip('${user.id}')">
                    <i class="fas fa-plus"></i> Extend
                </button>
                <button class="btn btn-sm btn-secondary" onclick="viewVipDetails('${user.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Populate Users Table
function populateUsersTable() {
    const tbody = document.getElementById('usersBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    sampleUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td><span class="font-weight-bold text-primary">${user.points.toLocaleString()}</span></td>
            <td>${user.adsWatched}</td>
            <td>${user.referrals}</td>
            <td>${formatDate(user.joinDate)}</td>
            <td><span class="status-badge ${user.status}">${user.status.toUpperCase()}</span></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editUser('${user.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="blockUser('${user.id}')">
                    <i class="fas fa-ban"></i> Block
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Populate Withdrawals Table
function populateWithdrawalsTable() {
    const tbody = document.getElementById('withdrawalsBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    sampleWithdrawals.forEach(withdrawal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${withdrawal.id}</td>
            <td>${withdrawal.userEmail}</td>
            <td>${withdrawal.method}</td>
            <td class="text-success font-weight-bold">${withdrawal.amount}</td>
            <td>${withdrawal.points.toLocaleString()}</td>
            <td>${formatDate(withdrawal.requestDate)}</td>
            <td><span class="status-badge ${withdrawal.status}">${withdrawal.status.toUpperCase()}</span></td>
            <td>
                ${withdrawal.status === 'pending' ? `
                    <button class="btn btn-sm btn-success" onclick="approveWithdrawal('${withdrawal.id}')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="rejectWithdrawal('${withdrawal.id}')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                ` : `
                    <button class="btn btn-sm btn-secondary" onclick="viewWithdrawal('${withdrawal.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                `}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Populate Recent Activity
function populateRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;

    activityList.innerHTML = '';
    
    recentActivities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon ${activity.type}">
                ${activity.icon}
            </div>
            <div class="activity-content">
                <h4>${activity.title}</h4>
                <p>${activity.description}</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        `;
        activityList.appendChild(activityItem);
    });
}

// Countdown Timers
function startCountdownTimers() {
    const timers = ['dailyCountdown', 'weeklyCountdown', 'monthlyCountdown'];
    
    timers.forEach(timerId => {
        const element = document.getElementById(timerId);
        if (element) {
            updateCountdown(timerId);
            setInterval(() => updateCountdown(timerId), 1000);
        }
    });
}

function updateCountdown(timerId) {
    const element = document.getElementById(timerId);
    if (!element) return;

    // Sample countdown logic
    const now = new Date().getTime();
    let endTime;
    
    switch(timerId) {
        case 'dailyCountdown':
            endTime = new Date().setHours(23, 59, 59, 999);
            break;
        case 'weeklyCountdown':
            endTime = now + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000);
            break;
        case 'monthlyCountdown':
            endTime = now + (18 * 24 * 60 * 60 * 1000) + (7 * 60 * 60 * 1000);
            break;
    }
    
    const distance = endTime - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (days > 0) {
            element.textContent = `${days}d ${hours}h ${minutes}m`;
        } else {
            element.textContent = `${hours}h ${minutes}m ${seconds}s`;
        }
    } else {
        element.textContent = "EXPIRED";
    }
}

// Language Toggle
function toggleAdminLanguage() {
    isAdminArabic = !isAdminArabic;
    const html = document.documentElement;
    const langToggle = document.getElementById('adminLangText');
    
    if (isAdminArabic) {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        langToggle.textContent = 'English';
        updateAdminTexts('ar');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        langToggle.textContent = 'العربية';
        updateAdminTexts('en');
    }
    
    updatePageTitle(currentTab);
}

function updateAdminTexts(lang) {
    const elements = document.querySelectorAll('[data-en][data-ar]');
    elements.forEach(element => {
        if (lang === 'ar') {
            element.textContent = element.getAttribute('data-ar');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
}

// VIP Management Functions
function extendVip(userId) {
    showNotification(`VIP subscription extended for user ${userId}`, 'success');
    // Refresh VIP table
    populateVipUsersTable();
}

function viewVipDetails(userId) {
    const user = sampleVipUsers.find(u => u.id === userId);
    if (user) {
        showModal('VIP User Details', `
            <div class="vip-details-modal">
                <h4>👑 ${user.tier.toUpperCase()} TIER</h4>
                <p><strong>User ID:</strong> ${user.id}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Start Date:</strong> ${formatDate(user.startDate)}</p>
                <p><strong>Expiry Date:</strong> ${formatDate(user.expiryDate)}</p>
                <p><strong>Days Remaining:</strong> ${user.daysLeft} days</p>
                <p><strong>Monthly Revenue:</strong> $${user.revenue.toFixed(2)}</p>
                <p><strong>Total Revenue:</strong> $${(user.revenue * 3).toFixed(2)}</p>
            </div>
        `);
    }
}

function exportVipData() {
    // Create CSV data
    const headers = ['User ID', 'Email', 'VIP Tier', 'Start Date', 'Expiry Date', 'Days Left', 'Revenue'];
    const csvData = [headers];
    
    sampleVipUsers.forEach(user => {
        csvData.push([
            user.id,
            user.email,
            user.tier.toUpperCase(),
            user.startDate,
            user.expiryDate,
            user.daysLeft,
            user.revenue
        ]);
    });
    
    // Convert to CSV string
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vip-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('VIP data exported successfully!', 'success');
}

function refreshVipData() {
    showNotification('Refreshing VIP data...', 'info');
    setTimeout(() => {
        populateVipUsersTable();
        showNotification('VIP data refreshed!', 'success');
    }, 1000);
}

// User Management Functions
function addUser() {
    showModal('Add New User', `
        <form id="addUserForm">
            <div class="form-group">
                <label>Email Address</label>
                <input type="email" id="newUserEmail" required>
            </div>
            <div class="form-group">
                <label>Initial Points</label>
                <input type="number" id="newUserPoints" value="0" min="0">
            </div>
            <div class="form-group">
                <label>Status</label>
                <select id="newUserStatus">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Add User</button>
        </form>
    `);
}

function editUser(userId) {
    const user = sampleUsers.find(u => u.id === userId);
    if (user) {
        showModal('Edit User', `
            <form id="editUserForm">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" value="${user.email}" readonly>
                </div>
                <div class="form-group">
                    <label>Points</label>
                    <input type="number" id="editUserPoints" value="${user.points}" min="0">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="editUserStatus">
                        <option value="active" ${user.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="inactive" ${user.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                        <option value="vip" ${user.status === 'vip' ? 'selected' : ''}>VIP</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Update User</button>
            </form>
        `);
    }
}

function blockUser(userId) {
    if (confirm('Are you sure you want to block this user?')) {
        showNotification(`User ${userId} has been blocked`, 'warning');
        populateUsersTable();
    }
}

// Withdrawal Management Functions
function approveWithdrawal(withdrawalId) {
    const withdrawal = sampleWithdrawals.find(w => w.id === withdrawalId);
    if (withdrawal) {
        withdrawal.status = 'approved';
        showNotification(`Withdrawal ${withdrawalId} approved! Payment of ${withdrawal.amount} sent to ${withdrawal.userEmail}`, 'success');
        populateWithdrawalsTable();
    }
}

function rejectWithdrawal(withdrawalId) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
        const withdrawal = sampleWithdrawals.find(w => w.id === withdrawalId);
        if (withdrawal) {
            withdrawal.status = 'rejected';
            showNotification(`Withdrawal ${withdrawalId} rejected. Reason: ${reason}`, 'warning');
            populateWithdrawalsTable();
        }
    }
}

function viewWithdrawal(withdrawalId) {
    const withdrawal = sampleWithdrawals.find(w => w.id === withdrawalId);
    if (withdrawal) {
        showModal('Withdrawal Details', `
            <div class="withdrawal-details">
                <p><strong>Request ID:</strong> ${withdrawal.id}</p>
                <p><strong>User:</strong> ${withdrawal.userEmail}</p>
                <p><strong>Method:</strong> ${withdrawal.method}</p>
                <p><strong>Amount:</strong> ${withdrawal.amount}</p>
                <p><strong>Points:</strong> ${withdrawal.points.toLocaleString()}</p>
                <p><strong>Request Date:</strong> ${formatDate(withdrawal.requestDate)}</p>
                <p><strong>Status:</strong> <span class="status-badge ${withdrawal.status}">${withdrawal.status.toUpperCase()}</span></p>
            </div>
        `);
    }
}

function approveAll() {
    if (confirm('Are you sure you want to approve all pending withdrawals?')) {
        const pendingCount = sampleWithdrawals.filter(w => w.status === 'pending').length;
        sampleWithdrawals.forEach(w => {
            if (w.status === 'pending') {
                w.status = 'approved';
            }
        });
        showNotification(`${pendingCount} withdrawals approved successfully!`, 'success');
        populateWithdrawalsTable();
    }
}

// Contest Management Functions
function createContest() {
    showModal('Create New Contest', `
        <form id="createContestForm">
            <div class="form-group">
                <label>Contest Type</label>
                <select id="contestType">
                    <option value="daily">Daily Contest</option>
                    <option value="weekly">Weekly Contest</option>
                    <option value="monthly">Monthly Contest</option>
                    <option value="special">Special Contest</option>
                </select>
            </div>
            <div class="form-group">
                <label>Prize Pool ($)</label>
                <input type="number" id="contestPrize" value="100" min="10" step="0.01">
            </div>
            <div class="form-group">
                <label>Required Ads</label>
                <input type="number" id="contestAds" value="10" min="1">
            </div>
            <div class="form-group">
                <label>Duration (hours)</label>
                <input type="number" id="contestDuration" value="24" min="1">
            </div>
            <button type="submit" class="btn btn-primary">Create Contest</button>
        </form>
    `);
}

function viewContestDetails(contestType) {
    const contestData = {
        daily: { participants: 2847, prize: 486.30, required: 10 },
        weekly: { participants: 8234, prize: 1247.80, required: 25 },
        monthly: { participants: 15672, prize: 3842.90, required: 120 }
    };
    
    const contest = contestData[contestType];
    if (contest) {
        showModal(`${contestType.charAt(0).toUpperCase() + contestType.slice(1)} Contest Details`, `
            <div class="contest-details">
                <h4>🏆 ${contestType.toUpperCase()} CONTEST</h4>
                <p><strong>Participants:</strong> ${contest.participants.toLocaleString()}</p>
                <p><strong>Prize Pool:</strong> $${contest.prize.toFixed(2)}</p>
                <p><strong>Required Ads:</strong> ${contest.required}</p>
                <p><strong>Status:</strong> <span class="status-badge active">ACTIVE</span></p>
                <hr>
                <h5>Top Participants:</h5>
                <ul>
                    <li>user123@example.com - ${contest.required} ads</li>
                    <li>ahmed.hassan@example.com - ${contest.required - 1} ads</li>
                    <li>fatima.ali@example.com - ${contest.required - 2} ads</li>
                </ul>
            </div>
        `);
    }
}

function endContest(contestType) {
    if (confirm(`Are you sure you want to end the ${contestType} contest early?`)) {
        showNotification(`${contestType.charAt(0).toUpperCase() + contestType.slice(1)} contest ended. Winners will be announced shortly.`, 'info');
    }
}

// Notification Functions
function sendNotification() {
    const type = document.getElementById('notificationType').value;
    const audience = document.getElementById('targetAudience').value;
    const titleEn = document.getElementById('titleEn').value;
    const titleAr = document.getElementById('titleAr').value;
    const messageEn = document.getElementById('messageEn').value;
    const messageAr = document.getElementById('messageAr').value;
    
    if (!titleEn || !messageEn) {
        showNotification('Please fill in at least the English title and message.', 'error');
        return;
    }
    
    // Simulate sending notification
    setTimeout(() => {
        showNotification(`Notification sent successfully to ${audience} users!`, 'success');
        
        // Clear form
        document.getElementById('titleEn').value = '';
        document.getElementById('titleAr').value = '';
        document.getElementById('messageEn').value = '';
        document.getElementById('messageAr').value = '';
    }, 1000);
    
    showNotification('Sending notification...', 'info');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#27AE60';
        case 'error': return '#E74C3C';
        case 'warning': return '#F39C12';
        case 'info': return '#3498DB';
        default: return '#3498DB';
    }
}

function showModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.admin-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div class="admin-modal-content" style="
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <button class="modal-close" style="
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            ">&times;</button>
            <h3 style="margin-bottom: 20px; color: #2C3E50;">${title}</h3>
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-close')) {
            modal.remove();
        }
    });
    
    // Handle form submissions in modals
    const forms = modal.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission based on form ID
            handleModalFormSubmission(form);
            modal.remove();
        });
    });
}

function handleModalFormSubmission(form) {
    const formId = form.id;
    
    switch(formId) {
        case 'addUserForm':
            const email = form.querySelector('#newUserEmail').value;
            const points = form.querySelector('#newUserPoints').value;
            const status = form.querySelector('#newUserStatus').value;
            showNotification(`User ${email} added successfully with ${points} points!`, 'success');
            break;
            
        case 'editUserForm':
            showNotification('User updated successfully!', 'success');
            break;
            
        case 'createContestForm':
            const contestType = form.querySelector('#contestType').value;
            const prize = form.querySelector('#contestPrize').value;
            showNotification(`${contestType} contest created with $${prize} prize pool!`, 'success');
            break;
    }
}

function initializeMobileMenu() {
    // Add mobile menu functionality if needed
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
}

function logout() {
    if (confirm(isAdminArabic ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?')) {
        document.getElementById('dashboardMain').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        
        // Reset form
        document.getElementById('loginForm').reset();
        
        showNotification(isAdminArabic ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully', 'info');
    }
}

// Export functions for global use
window.toggleAdminLanguage = toggleAdminLanguage;
window.logout = logout;
window.sendNotification = sendNotification;
window.extendVip = extendVip;
window.viewVipDetails = viewVipDetails;
window.exportVipData = exportVipData;
window.refreshVipData = refreshVipData;
window.addUser = addUser;
window.editUser = editUser;
window.blockUser = blockUser;
window.approveWithdrawal = approveWithdrawal;
window.rejectWithdrawal = rejectWithdrawal;
window.viewWithdrawal = viewWithdrawal;
window.approveAll = approveAll;
window.createContest = createContest;
window.viewContestDetails = viewContestDetails;
window.endContest = endContest;
window.sendNotification = sendNotification;
window.logout = logout;

// VIP Payment Management Functions
function populateVipPaymentsTable() {
    const tbody = document.getElementById('vipPaymentsBody');
    if (!tbody) return;
    
    const rows = sampleVipPayments.map(payment => {
        const tierColors = {
            'king': '#3498DB',
            'emperor': '#9B59B6', 
            'lord': '#E74C3C'
        };
        
        const statusColors = {
            'pending': '#F39C12',
            'approved': '#27AE60',
            'rejected': '#E74C3C'
        };
        
        return `
            <tr>
                <td>
                    <span class="payment-id" title="${payment.id}">${payment.id.substring(0, 12)}...</span>
                </td>
                <td>
                    <div class="user-info">
                        <strong>${payment.userId}</strong>
                        <small>${payment.userEmail}</small>
                    </div>
                </td>
                <td>
                    <span class="tier-badge" style="background: ${tierColors[payment.tier]}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                        👑 ${payment.tier.toUpperCase()}
                    </span>
                </td>
                <td>
                    <strong>$${payment.amount}</strong>
                    <small>USDT (${payment.network})</small>
                </td>
                <td>
                    <span class="transaction-hash" title="${payment.transactionHash}">
                        ${payment.transactionHash.substring(0, 20)}...
                    </span>
                </td>
                <td>
                    <button onclick="viewScreenshot('${payment.screenshotUrl}')" class="btn btn-sm btn-secondary">
                        <i class="fas fa-image"></i>
                        View
                    </button>
                </td>
                <td>${formatDate(payment.submittedAt)}</td>
                <td>
                    <span class="status-badge" style="background: ${statusColors[payment.status]}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8rem;">
                        ${payment.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${payment.status === 'pending' ? `
                            <button onclick="approveVipPayment('${payment.id}')" class="btn btn-sm btn-success" title="Approve">
                                <i class="fas fa-check"></i>
                            </button>
                            <button onclick="rejectVipPayment('${payment.id}')" class="btn btn-sm btn-danger" title="Reject">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : `
                            <button onclick="viewVipPaymentDetails('${payment.id}')" class="btn btn-sm btn-info" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        `}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = rows;
    updateVipPaymentStats();
}

function updateVipPaymentStats() {
    const pending = sampleVipPayments.filter(p => p.status === 'pending').length;
    const approved = sampleVipPayments.filter(p => p.status === 'approved' && isToday(p.approvedAt)).length;
    const rejected = sampleVipPayments.filter(p => p.status === 'rejected' && isToday(p.rejectedAt)).length;
    const totalValue = sampleVipPayments
        .filter(p => p.status === 'approved' && isToday(p.approvedAt))
        .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    document.getElementById('pendingPaymentsCount').textContent = pending;
    document.getElementById('approvedPaymentsCount').textContent = approved;
    document.getElementById('rejectedPaymentsCount').textContent = rejected;
    document.getElementById('totalPaymentValue').textContent = `$${totalValue.toFixed(2)}`;
}

function isToday(date) {
    if (!date) return false;
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
}

async function approveVipPayment(paymentId) {
    const payment = sampleVipPayments.find(p => p.id === paymentId);
    if (!payment) return;
    
    if (confirm(`Approve VIP payment for ${payment.userEmail}?\n\nThis will:\n- Activate ${payment.tier.toUpperCase()} VIP status\n- Update user's app immediately\n- Send confirmation notification`)) {
        try {
            payment.status = 'approved';
            payment.approvedAt = new Date();
            
            await updateUserVipStatus(payment.userId, payment.tier, 30);
            await sendVipActivationNotification(payment);
            
            populateVipPaymentsTable();
            showNotification(`VIP payment approved! ${payment.userEmail} is now ${payment.tier.toUpperCase()} VIP`, 'success');
            
        } catch (error) {
            console.error('Approval error:', error);
            showNotification('Failed to approve payment. Please try again.', 'error');
        }
    }
}

async function rejectVipPayment(paymentId) {
    const reason = prompt('Please enter rejection reason:');
    if (!reason) return;
    
    const payment = sampleVipPayments.find(p => p.id === paymentId);
    if (!payment) return;
    
    try {
        payment.status = 'rejected';
        payment.rejectedAt = new Date();
        payment.rejectionReason = reason;
        
        await sendVipRejectionNotification(payment, reason);
        populateVipPaymentsTable();
        showNotification(`Payment rejected for ${payment.userEmail}`, 'warning');
        
    } catch (error) {
        console.error('Rejection error:', error);
        showNotification('Failed to reject payment. Please try again.', 'error');
    }
}

async function updateUserVipStatus(userId, tier, days) {
    console.log(`Updating user ${userId} to ${tier} VIP for ${days} days`);
    await new Promise(resolve => setTimeout(resolve, 1000));
}

async function sendVipActivationNotification(payment) {
    console.log(`Sending VIP activation notification to ${payment.userEmail}`);
}

async function sendVipRejectionNotification(payment, reason) {
    console.log(`Sending VIP rejection notification to ${payment.userEmail}: ${reason}`);
}

function viewScreenshot(url) {
    showModal('Payment Screenshot', `
        <div class="screenshot-viewer">
            <img src="${url}" alt="Payment Screenshot" style="max-width: 100%; height: auto; border-radius: 8px;" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwNSAxNTAgMjEwIDE0NSAyMTAgMTQwQzIxMCAxMzUgMjA1IDEzMCAyMDAgMTMwQzE5NSAxMzAgMTkwIDEzNSAxOTAgMTQwQzE5MCAxNDUgMTk1IDE1MCAyMDAgMTUwWiIgZmlsbD0iIzZCNzI4MCIvPgo8L3N2Zz4K'; this.onerror=null;"
                 />
            <p style="margin-top: 10px; color: #666; font-size: 0.9rem;">
                <i class="fas fa-info-circle"></i>
                Screenshot submitted by user as payment proof
            </p>
        </div>
    `);
}

function viewVipPaymentDetails(paymentId) {
    const payment = sampleVipPayments.find(p => p.id === paymentId);
    if (!payment) return;
    
    const statusColor = {
        'pending': '#F39C12',
        'approved': '#27AE60',
        'rejected': '#E74C3C'
    }[payment.status];
    
    showModal('VIP Payment Details', `
        <div class="payment-details">
            <div class="detail-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>${payment.id}</h3>
                <span class="status-badge" style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 16px;">
                    ${payment.status.toUpperCase()}
                </span>
            </div>
            
            <div class="detail-grid" style="display: grid; gap: 15px;">
                <div><strong>User:</strong> ${payment.userEmail} (${payment.userId})</div>
                <div><strong>VIP Tier:</strong> 👑 ${payment.tier.toUpperCase()}</div>
                <div><strong>Amount:</strong> $${payment.amount} USDT (${payment.network})</div>
                <div><strong>Transaction:</strong> <code style="font-size: 0.9rem; word-break: break-all;">${payment.transactionHash}</code></div>
                <div><strong>Submitted:</strong> ${formatDate(payment.submittedAt)}</div>
                ${payment.approvedAt ? `<div><strong>Approved:</strong> ${formatDate(payment.approvedAt)}</div>` : ''}
                ${payment.rejectedAt ? `<div><strong>Rejected:</strong> ${formatDate(payment.rejectedAt)}<br><em style="color: #E74C3C;">${payment.rejectionReason}</em></div>` : ''}
                ${payment.additionalNotes ? `<div><strong>Notes:</strong> ${payment.additionalNotes}</div>` : ''}
            </div>
        </div>
    `);
}

function refreshVipPayments() {
    populateVipPaymentsTable();
    showNotification('VIP payments refreshed', 'success');
}

function approveAllVipPayments() {
    const pendingPayments = sampleVipPayments.filter(p => p.status === 'pending');
    
    if (pendingPayments.length === 0) {
        showNotification('No pending payments to approve', 'info');
        return;
    }
    
    if (confirm(`Approve all ${pendingPayments.length} pending VIP payments?`)) {
        pendingPayments.forEach(async payment => {
            payment.status = 'approved';
            payment.approvedAt = new Date();
            await updateUserVipStatus(payment.userId, payment.tier, 30);
            await sendVipActivationNotification(payment);
        });
        
        populateVipPaymentsTable();
        showNotification(`${pendingPayments.length} VIP payments approved!`, 'success');
    }
}

// Export VIP payment functions
window.populateVipPaymentsTable = populateVipPaymentsTable;
window.approveVipPayment = approveVipPayment;
window.rejectVipPayment = rejectVipPayment;
window.viewVipPaymentDetails = viewVipPaymentDetails;
window.viewScreenshot = viewScreenshot;
window.refreshVipPayments = refreshVipPayments;
window.approveAllVipPayments = approveAllVipPayments;
window.quickLogin = quickLogin;