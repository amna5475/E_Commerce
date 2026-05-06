const { Models } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Payment Service for business logic and DB operations
 */
const PaymentService = {
  /**
   * Initialize a new payment
   * @param {String} orderId - Order ID
   */
  initializePayment: async (orderId) => {
    const { orders, payments } = await Models();
    
    const order = await orders.findByPk(orderId);
    if (!order) {
      throw NotFoundError('Order not found');
    }

    if (order.payment_status === 'paid') {
      throw BadRequestError('Order is already paid');
    }

    const payment = await payments.create({
      order_id: orderId,
      method: order.payment_method,
      gateway: 'placeholder_gateway',
      transaction_id: `TXN-${Date.now()}`,
      amount: order.total_amount,
      currency: 'PKR',
      status: 'pending',
      created_at: new Date()
    });

    return payment;
  },

  /**
   * Process payment status update
   * @param {String} transactionId - Gateway transaction ID
   * @param {String} status - New payment status
   */
  processPayment: async (transactionId, status) => {
    const { payments, orders } = await Models();

    const payment = await payments.findOne({ where: { transaction_id: transactionId } });
    if (!payment) {
      throw NotFoundError('Payment record not found');
    }

    const order = await orders.findByPk(payment.order_id);

    if (status === 'success') {
      await payment.update({
        status: 'completed',
        paid_at: new Date()
      });
      await order.update({ payment_status: 'paid' });
    } else {
      await payment.update({
        status: 'failed',
        failure_reason: 'Gateway error'
      });
      await order.update({ payment_status: 'failed' });
    }

    return payment;
  },

  /**
   * Get payment by order ID
   * @param {String} orderId - Order ID
   */
  getPaymentByOrderId: async (orderId) => {
    const { payments } = await Models();
    return await payments.findOne({ where: { order_id: orderId } });
  }
};

module.exports = PaymentService;
