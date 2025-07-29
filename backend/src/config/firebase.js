const admin = require('firebase-admin');
const logger = require('../utils/logger');

let db = null;
let auth = null;
let messaging = null;

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase() {
  try {
    // Firebase service account configuration
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
    };

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });

    // Initialize services
    db = admin.firestore();
    auth = admin.auth();
    messaging = admin.messaging();

    // Configure Firestore settings
    db.settings({
      timestampsInSnapshots: true
    });

    logger.info('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    logger.error('❌ Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
}

/**
 * Get Firestore database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
}

/**
 * Get Firebase Auth instance
 */
function getAuth() {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
}

/**
 * Get Firebase Messaging instance
 */
function getMessaging() {
  if (!messaging) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return messaging;
}

/**
 * Verify Firebase ID token
 */
async function verifyIdToken(idToken) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Error verifying ID token:', error);
    throw error;
  }
}

/**
 * Send push notification to a single device
 */
async function sendNotificationToDevice(fcmToken, title, body, data = {}) {
  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      token: fcmToken,
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#3498DB',
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await messaging.send(message);
    logger.info(`Notification sent successfully: ${response}`);
    return response;
  } catch (error) {
    logger.error('Error sending notification:', error);
    throw error;
  }
}

/**
 * Send push notification to multiple devices
 */
async function sendNotificationToDevices(fcmTokens, title, body, data = {}) {
  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      tokens: fcmTokens,
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#3498DB',
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await messaging.sendMulticast(message);
    logger.info(`Batch notification sent: ${response.successCount} successful, ${response.failureCount} failed`);
    return response;
  } catch (error) {
    logger.error('Error sending batch notification:', error);
    throw error;
  }
}

/**
 * Send notification to topic
 */
async function sendNotificationToTopic(topic, title, body, data = {}) {
  try {
    const message = {
      notification: {
        title,
        body
      },
      data: {
        ...data,
        timestamp: new Date().toISOString()
      },
      topic,
      android: {
        notification: {
          icon: 'ic_notification',
          color: '#3498DB',
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await messaging.send(message);
    logger.info(`Topic notification sent successfully: ${response}`);
    return response;
  } catch (error) {
    logger.error('Error sending topic notification:', error);
    throw error;
  }
}

/**
 * Create a custom user in Firebase Auth
 */
async function createCustomUser(userData) {
  try {
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
      emailVerified: false,
      disabled: false
    });

    logger.info(`Successfully created user: ${userRecord.uid}`);
    return userRecord;
  } catch (error) {
    logger.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update user in Firebase Auth
 */
async function updateUser(uid, userData) {
  try {
    const userRecord = await auth.updateUser(uid, userData);
    logger.info(`Successfully updated user: ${uid}`);
    return userRecord;
  } catch (error) {
    logger.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Delete user from Firebase Auth
 */
async function deleteUser(uid) {
  try {
    await auth.deleteUser(uid);
    logger.info(`Successfully deleted user: ${uid}`);
  } catch (error) {
    logger.error('Error deleting user:', error);
    throw error;
  }
}

/**
 * Get user by email
 */
async function getUserByEmail(email) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    logger.error('Error getting user by email:', error);
    throw error;
  }
}

/**
 * Batch operations helper
 */
function getBatch() {
  return db.batch();
}

/**
 * Transaction helper
 */
function runTransaction(updateFunction) {
  return db.runTransaction(updateFunction);
}

/**
 * Generate server timestamp
 */
function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}

/**
 * Array union helper
 */
function arrayUnion(...elements) {
  return admin.firestore.FieldValue.arrayUnion(...elements);
}

/**
 * Array remove helper
 */
function arrayRemove(...elements) {
  return admin.firestore.FieldValue.arrayRemove(...elements);
}

/**
 * Increment helper
 */
function increment(value) {
  return admin.firestore.FieldValue.increment(value);
}

module.exports = {
  initializeFirebase,
  getDb,
  getAuth,
  getMessaging,
  verifyIdToken,
  sendNotificationToDevice,
  sendNotificationToDevices,
  sendNotificationToTopic,
  createCustomUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  getBatch,
  runTransaction,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  admin
};