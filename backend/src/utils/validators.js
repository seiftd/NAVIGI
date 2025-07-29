const joi = require('joi');

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone number validation regex (international format)
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

/**
 * Strong password regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
function isValidPhone(phone) {
  return PHONE_REGEX.test(phone);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid
 */
function isValidPassword(password) {
  return PASSWORD_REGEX.test(password);
}

/**
 * Validate referral code format
 * @param {string} code - Referral code to validate
 * @returns {boolean} True if valid
 */
function isValidReferralCode(code) {
  return /^SBARO-[A-Z0-9]{4}$/.test(code);
}

/**
 * User registration validation schema
 */
const userRegistrationSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().pattern(PASSWORD_REGEX).required(),
  displayName: joi.string().min(2).max(50).required(),
  phoneNumber: joi.string().pattern(PHONE_REGEX).optional(),
  referralCode: joi.string().pattern(/^SBARO-[A-Z0-9]{4}$/).optional()
});

/**
 * User login validation schema
 */
const userLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

/**
 * Withdrawal request validation schema
 */
const withdrawalSchema = joi.object({
  method: joi.string().valid('BINANCE_PAY', 'BARIDIMOB', 'GOOGLE_PLAY', 'FLEXY').required(),
  amount: joi.number().min(1).required(),
  paymentDetails: joi.object().required()
});

/**
 * Admin login validation schema
 */
const adminLoginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  totpCode: joi.string().length(6).pattern(/^\d+$/).optional()
});

/**
 * Contest creation validation schema
 */
const contestSchema = joi.object({
  type: joi.string().valid('DAILY', 'WEEKLY', 'MONTHLY').required(),
  title: joi.string().min(5).max(100).required(),
  description: joi.string().max(500).required(),
  requirement: joi.number().min(1).required(),
  startDate: joi.date().required(),
  endDate: joi.date().greater(joi.ref('startDate')).required(),
  totalPrizePool: joi.number().min(0).required()
});

/**
 * Validate request body using schema
 * @param {object} data - Data to validate
 * @param {object} schema - Joi schema
 * @returns {object} Validation result
 */
function validateData(data, schema) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { isValid: false, errors };
  }
  
  return { isValid: true, data: value };
}

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Validate points amount
 * @param {number} points - Points to validate
 * @returns {boolean} True if valid
 */
function isValidPointsAmount(points) {
  return Number.isInteger(points) && points >= 0 && points <= 1000000;
}

/**
 * Validate withdrawal amount based on method
 * @param {string} method - Withdrawal method
 * @param {number} amount - Amount in points
 * @returns {object} Validation result
 */
function validateWithdrawalAmount(method, amount) {
  const minimums = {
    'BINANCE_PAY': 20,     // $2 minimum
    'BARIDIMOB': 55,       // $5.5 minimum
    'GOOGLE_PLAY': 10,     // $1 minimum
    'FLEXY': 10            // $1 minimum
  };
  
  const minimum = minimums[method];
  if (!minimum) {
    return { isValid: false, message: 'Invalid withdrawal method' };
  }
  
  if (amount < minimum) {
    return { 
      isValid: false, 
      message: `Minimum withdrawal for ${method} is ${minimum} points` 
    };
  }
  
  return { isValid: true };
}

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidPassword,
  isValidReferralCode,
  isValidPointsAmount,
  validateWithdrawalAmount,
  validateData,
  sanitizeInput,
  schemas: {
    userRegistrationSchema,
    userLoginSchema,
    withdrawalSchema,
    adminLoginSchema,
    contestSchema
  }
};