const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { Models } = require('../models/dbModel');
const { BadRequestError, UnauthorizedError } = require('../adapters/errorAdapter');

const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   */
  register: async (userData) => {
    const { users } = await Models();
    
    // Check if email already exists
    const existingUser = await users.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw BadRequestError('Email is already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(userData.password, salt);

    // Create user
    const newUser = await users.create({
      full_name: userData.full_name,
      email: userData.email,
      phone: userData.phone,
      password_hash,
      role: userData.role || 'customer',
      is_active: true,
      is_verified: false
    });

    // Remove sensitive data from response
    const userResponse = newUser.toJSON();
    delete userResponse.password_hash;

    return userResponse;
  },

  /**
   * Login user and create session
   * @param {String} email - User email
   * @param {String} password - User password
   * @param {Object} sessionInfo - Device and IP info
   */
  login: async (email, password, sessionInfo = {}) => {
    try {
      const { users, user_sessions, sellers, seller_staff } = await Models();

      // Find user
      const user = await users.findOne({ where: { email } });
      if (!user) {
        throw UnauthorizedError('Invalid email or password');
      }

      // Check if active
      if (!user.is_active) {
        throw UnauthorizedError('Your account has been deactivated');
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        throw UnauthorizedError('Invalid email or password');
      }

      // Generate JWT payload
      const payload = { id: user.id, role: user.role, email: user.email };
      
      // Include seller_id if role is seller (owner) or has entries in seller_staff
      if (user.role === 'seller') {
        const seller = await sellers.findOne({ where: { user_id: user.id } });
        if (seller) payload.seller_id = seller.id;
      } else {
        const staffRecord = await seller_staff.findOne({ where: { user_id: user.id, is_active: true } });
        if (staffRecord) {
          payload.seller_id = staffRecord.seller_id;
          payload.role = 'seller_staff'; // Upgrade role for token context
        }
      }

      const token = jwt.sign(
        payload,
        config.get('app.jwt_secret'),
        { expiresIn: config.get('app.jwt_expiration') }
      );

      // Create session record
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await user_sessions.create({
        user_id: user.id,
        token,
        device_info: sessionInfo.device_info,
        ip_address: sessionInfo.ip_address,
        expires_at: expiresAt
      });

      return {
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: payload.role, // Use role from payload
          seller_id: payload.seller_id
        },
        token
      };
    } catch (error) {
      // Re-throw custom errors
      if (error.statusCode) throw error;
      // Convert other errors to readable ones for debugging
      throw BadRequestError(`Login failed: ${error.message}`);
    }
  }
};

module.exports = AuthService;
