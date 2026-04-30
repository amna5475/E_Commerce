const AuthService = require('../services/authService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Auth Controller for request handling logic
 */
class AuthController {
  /**
   * Register a new user
   */
  static async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      return ResponseHelper.success(res, 'Registration successful', user, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const sessionInfo = {
        device_info: req.headers['user-agent'],
        ip_address: req.ip
      };
      const result = await AuthService.login(email, password, sessionInfo);
      return ResponseHelper.success(res, 'Login successful', result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
