const ResponseHelper = require('../helpers/responseHelper');

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // If the error has a statusCode property, it's one of our custom errors
  if (err.statusCode) {
    return ResponseHelper.error(res, err.message, err.statusCode, err.errors);
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return ResponseHelper.error(res, 'Validation Error', 400, errors);
  }

  // Default to internal server error
  return ResponseHelper.error(res, 'Internal Server Error', 500);
};

module.exports = errorHandler;
