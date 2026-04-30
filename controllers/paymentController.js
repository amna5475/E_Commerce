const PaymentService = require('../services/paymentService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Payment Controller for request handling logic
 */
const PaymentController = {
  /**
   * Initialize a new payment
   */
  initialize: async (req, res, next) => {
    try {
      const { orderId } = req.body;
      const payment = await PaymentService.initializePayment(orderId);
      return ResponseHelper.success(res, 'Payment initialized successfully', payment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Process payment status update
   */
  process: async (req, res, next) => {
    try {
      const { transactionId, status } = req.body;
      const payment = await PaymentService.processPayment(transactionId, status);
      return ResponseHelper.success(res, 'Payment processed successfully', payment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get payment by order ID
   */
  getByOrderId: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const payment = await PaymentService.getPaymentByOrderId(orderId);
      return ResponseHelper.success(res, 'Payment retrieved successfully', payment);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = PaymentController;
