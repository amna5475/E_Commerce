/**
 * Centralized Response Helper for consistent API outputs
 */
const ResponseHelper = {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {String} message - Success message
   * @param {Object|Array} data - Data to send back
   * @param {Number} statusCode - HTTP status code
   */
  success: (res, message, data = null, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  },

  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {String} message - Error message
   * @param {Number} statusCode - HTTP status code
   * @param {Array|Object} errors - Detailed errors
   */
  error: (res, message, statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
};

module.exports = ResponseHelper;
