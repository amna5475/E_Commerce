const Validator = require('validatorjs');
const { BadRequestError } = require('../adapters/errorAdapter');

/**
 * Request Validation Middleware using Validatorjs
 * @param {Object} rules - Validation rules
 * @param {Object} messages - Custom error messages
 */
const validate = (rules, messages = {}) => {
  return (req, res, next) => {
    const data = { ...req.body, ...req.query, ...req.params };
    const validation = new Validator(data, rules, messages);

    if (validation.fails()) {
      const errors = validation.errors.all();
      return next(new BadRequestError('Validation failed', errors));
    }

    next();
  };
};

module.exports = validate;
