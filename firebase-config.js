const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

// Firebase configuration with actual credentials
const firebaseConfig = {
    type: "service_account",
    project_id: "navigi-sbaro-bot",
    private_key_id: "2cd76e607b9ac1e25adb85950d1cd8d0aa3838ff",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqN0JXFFz7FgaS\nCAro/hyX1xdVoDz8Lqzpb+xhXFAuotkixzqG0IEKc4YCniNhxnRR8YIF+561UQEh\ng6/GSz3unuPqYEvsA91vvvjFjNSYKq53Zd4myL6AfHSef01mljdHXSMB1uDekSB5\nr81XiI6FbS+ca3i6tXkcVkxPy2xfnDJZSeQOaxgfFX2WeKkt0hRoa7KWETI9Co0G\nbIx//bmKB9P5wcc6jvUQmVT9qkBn0cyYZfGSx3sFLGOUcCUR/InZqAb4V25PuV/Z\nnlKvUywd85chpBvPrhSDulQNI0oSWK61jhiwUHckC8BTath4uQNG+yEMOAA7zZ0w\nGlEd0T4RAgMBAAECggEAAT6mtErQlEB4u1QmOkZzcJPQ1p41m/V+a7WXEa4yYujr\ndBLnZWl8bBZkrju4UAR6wMemlwMcScCmJLfZDvbpZMeSLJpYK8lqcuD/YjhxrIwx\nWuuqiHeS1w8x7h/Jsdya2mF+ukp3OgFvLpyfwIpd2nFuNfNePmVJ1bB23eWDrR5M\n9my4fIoSrxiGZnbQpLuIbuhc0RZjVb0fXcCri3QVlryoWonhIRRezaX3wN3os6WW\nN5ROPCJNGrldlQwfZZ24a81MUHmJncKUl3ZEPK1dIGncZ1OMyhCh/BTYbmQU3dYG\nZeK4DrcrJ7l66O8IBkkPUR5J/BdRXgM5h9u8D9QbbQKBgQDugtUk6yV/rvtDG13j\nl+nJokzqhvkh8Jzn3wSRXp7MFAf2liDBNw7Aj7cXpMZk0UYowFt+CNI80vsDCe0I\nHQYYp9TAx+JoRWN9zf6WwoZyEOnOOXFXukWslm7ZzLYuNf5rEhoUYOH4D6I/kT62\nO30BrsHTWvWGarJPfTqHtgw75QKBgQC2sm9z0JPdhcIXxAl8x5/S4opL5EBNID+m\njlj/vQMHMkurEpP685wLXNDugyLaWzt0NtfwKnTIIaZUb21gInAUPMrMhTOsRlMG\nNm7ijHZL3Tyg4L6n+nlW2koAd/kOjPP6xbYEWGRIYnZATcFSi7ZGrJlmD6VRthUB\nAFIB/lCOvQKBgH+YVlZtxZ3NCnYYCd5bwqIvxV4h3t2dTxNsZ5EtQV6DyM7N+a/j\nuGyjdZucdtYwbowWe9us9Gu9orM5eCjC/iPqhRKs3B5UIKmIrg4Q+sPC8JF2gYAh\nEm0F/T9fGIcYM4csI++K9Ngz5OSE2zu6D2H7D432Nys1oTaNE+bOKTVRAoGAbA0M\nLYrmaNV6/WNL2SiXNboV4NyVywePnYoCyP2YlOECL6NFMd5yI6Y5S1bzfgEHIKxu\n+fOiLdr47GcaYQj9EHsD1gHRlcnhwILhAcvhCu1FtkA1glN5AA0KR0ytWBW1FlNo\nWxmL9eOF3HIgLBnFK/dYoiwOskzmDzmJRvSJ4GECgYEAgn93FQKP6smVxd7iO61X\nhCst4R9nhMMJNRs9ybOQyGFfClxJChsIggY8oroS8PixiDpVkHqT/BkQtTHWO9EB\nU+82sQNllrTrWFGAwKavmFzziZYdhq3JmWvIkdfEVnXFxk1caQmEnRQQeVl81Geg\n9RuZuXk9GJUWev4Kl+rJBWY=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@navigi-sbaro-bot.iam.gserviceaccount.com",
    client_id: "117901818637830270085",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40navigi-sbaro-bot.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

// Initialize Firebase Admin SDK
let isInitialized = false;

function initializeFirebase() {
    if (!isInitialized) {
        try {
            admin.initializeApp({
                credential: admin.credential.cert(firebaseConfig),
                databaseURL: "https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/"
            });
            isInitialized = true;
            console.log('🔥 Firebase Admin SDK initialized successfully!');
            console.log('📍 Database URL: https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/');
        } catch (error) {
            console.error('❌ Firebase initialization error:', error);
            // For development, continue without Firebase
            console.log('⚠️ Continuing without Firebase (development mode)');
        }
    }
}

// Get database reference
function getDatabase() {
    if (!isInitialized) {
        initializeFirebase();
    }
    return admin.database();
}

// Real-time database functions
class FirebaseManager {
    constructor() {
        this.db = null;
        this.isConnected = false;
        this.init();
    }

    init() {
        try {
            initializeFirebase();
            this.db = getDatabase();
            this.isConnected = true;
            console.log('🔥 Firebase Manager initialized successfully!');
            console.log('🌍 Region: Europe West 1');
        } catch (error) {
            console.error('❌ Firebase Manager initialization failed:', error);
            this.isConnected = false;
        }
    }

    // User management
    async createUser(userId, userData) {
        if (!this.isConnected) return null;
        try {
            const userRef = this.db.ref(`users/${userId}`);
            const newUser = {
                id: userId,
                username: userData.username || null,
                first_name: userData.first_name || null,
                points: 0,
                balance: 0.00,
                ads_watched: 0,
                daily_ads_watched: 0,
                last_ad_reset: new Date().toDateString(),
                contest_ads: { daily: 0, weekly: 0, monthly: 0 },
                contests_joined: 0,
                referrals: 0,
                vip_status: 'FREE',
                vip_expires: null,
                referred_by: null,
                join_date: new Date().toISOString(),
                created_at: admin.database.ServerValue.TIMESTAMP,
                updated_at: admin.database.ServerValue.TIMESTAMP
            };
            await userRef.set(newUser);
            console.log(`✅ User ${userId} created in Firebase`);
            return newUser;
        } catch (error) {
            console.error('❌ Error creating user:', error);
            return null;
        }
    }

    async getUser(userId) {
        if (!this.isConnected) return null;
        try {
            const userRef = this.db.ref(`users/${userId}`);
            const snapshot = await userRef.once('value');
            return snapshot.val();
        } catch (error) {
            console.error('❌ Error getting user:', error);
            return null;
        }
    }

    async updateUser(userId, updates) {
        if (!this.isConnected) return false;
        try {
            const userRef = this.db.ref(`users/${userId}`);
            await userRef.update({
                ...updates,
                updated_at: admin.database.ServerValue.TIMESTAMP
            });
            console.log(`✅ User ${userId} updated in Firebase`);
            return true;
        } catch (error) {
            console.error('❌ Error updating user:', error);
            return false;
        }
    }

    async getAllUsers() {
        if (!this.isConnected) return [];
        try {
            const usersRef = this.db.ref('users');
            const snapshot = await usersRef.once('value');
            const users = snapshot.val() || {};
            return Object.values(users);
        } catch (error) {
            console.error('❌ Error getting all users:', error);
            return [];
        }
    }

    // Contest management
    async updateContestProgress(userId, contestType) {
        if (!this.isConnected) return false;
        try {
            const userRef = this.db.ref(`users/${userId}/contest_ads/${contestType}`);
            await userRef.transaction((currentValue) => {
                return (currentValue || 0) + 1;
            });
            
            // Log activity
            await this.logActivity(userId, 'contest_ad', {
                contest_type: contestType,
                timestamp: new Date().toISOString()
            });
            
            console.log(`✅ Contest progress updated for user ${userId}: ${contestType}`);
            return true;
        } catch (error) {
            console.error('❌ Error updating contest progress:', error);
            return false;
        }
    }

    async getContestProgress(userId) {
        if (!this.isConnected) return { daily: 0, weekly: 0, monthly: 0 };
        try {
            const contestRef = this.db.ref(`users/${userId}/contest_ads`);
            const snapshot = await contestRef.once('value');
            return snapshot.val() || { daily: 0, weekly: 0, monthly: 0 };
        } catch (error) {
            console.error('❌ Error getting contest progress:', error);
            return { daily: 0, weekly: 0, monthly: 0 };
        }
    }

    // Activity logging
    async logActivity(userId, activityType, data = {}) {
        if (!this.isConnected) return false;
        try {
            const activityId = uuidv4();
            const activityRef = this.db.ref(`activities/${activityId}`);
            
            const activity = {
                id: activityId,
                user_id: userId,
                type: activityType,
                data: data,
                timestamp: admin.database.ServerValue.TIMESTAMP,
                created_at: new Date().toISOString()
            };
            
            await activityRef.set(activity);
            
            // Also add to user's activity list
            const userActivityRef = this.db.ref(`users/${userId}/activities/${activityId}`);
            await userActivityRef.set({
                type: activityType,
                timestamp: admin.database.ServerValue.TIMESTAMP
            });
            
            console.log(`✅ Activity logged: ${activityType} for user ${userId}`);
            return true;
        } catch (error) {
            console.error('❌ Error logging activity:', error);
            return false;
        }
    }

    async getRecentActivities(limit = 50) {
        if (!this.isConnected) return [];
        try {
            const activitiesRef = this.db.ref('activities').orderByChild('timestamp').limitToLast(limit);
            const snapshot = await activitiesRef.once('value');
            const activities = snapshot.val() || {};
            return Object.values(activities).reverse(); // Most recent first
        } catch (error) {
            console.error('❌ Error getting recent activities:', error);
            return [];
        }
    }

    // VIP management
    async sendVipNotification(userId, userData, requestType = 'request') {
        if (!this.isConnected) return false;
        try {
            const notificationId = uuidv4();
            const notificationRef = this.db.ref(`vip_notifications/${notificationId}`);
            
            const notification = {
                id: notificationId,
                user_id: userId,
                username: userData.username,
                first_name: userData.first_name,
                type: requestType,
                status: 'pending',
                timestamp: admin.database.ServerValue.TIMESTAMP,
                created_at: new Date().toISOString()
            };
            
            await notificationRef.set(notification);
            console.log(`✅ VIP notification sent for user ${userId}`);
            return notificationId;
        } catch (error) {
            console.error('❌ Error sending VIP notification:', error);
            return false;
        }
    }

    async updateVipNotification(notificationId, status, adminResponse = null) {
        if (!this.isConnected) return false;
        try {
            const notificationRef = this.db.ref(`vip_notifications/${notificationId}`);
            await notificationRef.update({
                status: status,
                admin_response: adminResponse,
                processed_at: admin.database.ServerValue.TIMESTAMP
            });
            console.log(`✅ VIP notification ${notificationId} updated: ${status}`);
            return true;
        } catch (error) {
            console.error('❌ Error updating VIP notification:', error);
            return false;
        }
    }

    // Broadcast messaging
    async queueBroadcastMessage(message, adminId) {
        if (!this.isConnected) return false;
        try {
            const messageId = uuidv4();
            const messageRef = this.db.ref(`broadcast_queue/${messageId}`);
            
            const broadcastMessage = {
                id: messageId,
                message: message,
                admin_id: adminId,
                status: 'queued',
                created_at: admin.database.ServerValue.TIMESTAMP,
                timestamp: new Date().toISOString()
            };
            
            await messageRef.set(broadcastMessage);
            console.log(`✅ Broadcast message queued: ${messageId}`);
            return messageId;
        } catch (error) {
            console.error('❌ Error queuing broadcast message:', error);
            return false;
        }
    }

    async getBroadcastQueue() {
        if (!this.isConnected) return [];
        try {
            const queueRef = this.db.ref('broadcast_queue').orderByChild('status').equalTo('queued');
            const snapshot = await queueRef.once('value');
            const messages = snapshot.val() || {};
            return Object.values(messages);
        } catch (error) {
            console.error('❌ Error getting broadcast queue:', error);
            return [];
        }
    }

    async markBroadcastSent(messageId) {
        if (!this.isConnected) return false;
        try {
            const messageRef = this.db.ref(`broadcast_queue/${messageId}`);
            await messageRef.update({
                status: 'sent',
                sent_at: admin.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('❌ Error marking broadcast as sent:', error);
            return false;
        }
    }

    // System management
    async clearTestData() {
        if (!this.isConnected) return false;
        try {
            console.log('🧹 Clearing test data from Firebase...');
            
            // Clear all data (for fresh start)
            const rootRef = this.db.ref('/');
            await rootRef.set({
                users: {},
                activities: {},
                vip_notifications: {},
                broadcast_queue: {},
                system: {
                    initialized: true,
                    last_reset: admin.database.ServerValue.TIMESTAMP,
                    version: '1.0.0',
                    database_url: 'https://navigi-sbaro-bot-default-rtdb.europe-west1.firebasedatabase.app/',
                    admin_dashboard: 'https://navigiu.netlify.app/admin-dashboard'
                }
            });
            
            console.log('✅ Test data cleared successfully!');
            console.log('🌐 Admin Dashboard: https://navigiu.netlify.app/admin-dashboard');
            return true;
        } catch (error) {
            console.error('❌ Error clearing test data:', error);
            return false;
        }
    }

    async getSystemStats() {
        if (!this.isConnected) return {};
        try {
            const [usersSnapshot, activitiesSnapshot] = await Promise.all([
                this.db.ref('users').once('value'),
                this.db.ref('activities').once('value')
            ]);
            
            const users = usersSnapshot.val() || {};
            const activities = activitiesSnapshot.val() || {};
            
            return {
                total_users: Object.keys(users).length,
                total_activities: Object.keys(activities).length,
                active_today: Object.values(users).filter(u => 
                    u.last_ad_reset === new Date().toDateString()
                ).length,
                total_points: Object.values(users).reduce((sum, u) => sum + (u.points || 0), 0),
                total_ads: Object.values(users).reduce((sum, u) => sum + (u.ads_watched || 0), 0),
                admin_dashboard: 'https://navigiu.netlify.app/admin-dashboard'
            };
        } catch (error) {
            console.error('❌ Error getting system stats:', error);
            return {};
        }
    }

    // Real-time listeners
    onVipNotification(callback) {
        if (!this.isConnected) return null;
        try {
            const notificationsRef = this.db.ref('vip_notifications').orderByChild('status').equalTo('pending');
            return notificationsRef.on('child_added', (snapshot) => {
                const notification = snapshot.val();
                callback(notification);
            });
        } catch (error) {
            console.error('❌ Error setting up VIP notification listener:', error);
            return null;
        }
    }

    onBroadcastQueue(callback) {
        if (!this.isConnected) return null;
        try {
            const queueRef = this.db.ref('broadcast_queue').orderByChild('status').equalTo('queued');
            return queueRef.on('child_added', (snapshot) => {
                const message = snapshot.val();
                callback(message);
            });
        } catch (error) {
            console.error('❌ Error setting up broadcast queue listener:', error);
            return null;
        }
    }
}

module.exports = {
    FirebaseManager,
    initializeFirebase,
    getDatabase,
    admin
};