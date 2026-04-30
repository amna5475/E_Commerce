const PaymentService = require('../services/paymentService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Payment Controller for request handling logic
 */
class PaymentController {
  /**
   * Initialize a new payment
   */
  static async initialize(req, res, next) {
    try {
      const { orderId } = req.body;
      const payment = await PaymentService.initializePayment(orderId);
      return ResponseHelper.success(res, 'Payment initialized successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Process payment status update
   */
  static async process(req, res, next) {
    try {
      const { transactionId, status } = req.body;
      const payment = await PaymentService.processPayment(transactionId, status);
      return ResponseHelper.success(res, 'Payment processed successfully', payment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get payment by order ID
   */
  static async getByOrderId(req, res, next) {
    try {
      const { orderId } = req.params;
      const payment = await PaymentService.getPaymentByOrderId(orderId);
      return ResponseHelper.success(res, 'Payment retrieved successfully', payment);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
