const crypto = require('crypto');

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const SALT_LENGTH = 64; // 512 bits
const TAG_LENGTH = 16; // 128 bits

/**
 * Generate a random encryption key
 * @returns {string} Base64 encoded key
 */
function generateKey() {
  return crypto.randomBytes(KEY_LENGTH).toString('base64');
}

/**
 * Derive key from password using PBKDF2
 * @param {string} password - The password to derive from
 * @param {string} salt - The salt (base64 encoded)
 * @returns {Buffer} The derived key
 */
function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 100000, KEY_LENGTH, 'sha512');
}

/**
 * Encrypt data using AES-256-GCM
 * @param {string} text - The text to encrypt
 * @param {string} password - The password to use for encryption
 * @returns {object} Object containing encrypted data, salt, iv, and tag
 */
function encrypt(text, password = process.env.ENCRYPTION_KEY) {
  try {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = deriveKey(password, salt.toString('base64'));
    const iv = crypto.randomBytes(IV_LENGTH);
    
    const cipher = crypto.createCipher(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      tag: tag.toString('base64')
    };
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * Decrypt data using AES-256-GCM
 * @param {object} encryptedData - Object containing encrypted data, salt, iv, and tag
 * @param {string} password - The password used for encryption
 * @returns {string} The decrypted text
 */
function decrypt(encryptedData, password = process.env.ENCRYPTION_KEY) {
  try {
    const { encrypted, salt, iv, tag } = encryptedData;
    const key = deriveKey(password, salt);
    
    const decipher = crypto.createDecipher(ALGORITHM, key, Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}

/**
 * Hash data using SHA-256
 * @param {string} data - The data to hash
 * @returns {string} The hash in hex format
 */
function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate a secure random token
 * @param {number} length - The length of the token in bytes
 * @returns {string} Random token in hex format
 */
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure random code (numeric)
 * @param {number} length - The length of the code
 * @returns {string} Random numeric code
 */
function generateCode(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }
  return code;
}

module.exports = {
  generateKey,
  encrypt,
  decrypt,
  hash,
  generateToken,
  generateCode
};