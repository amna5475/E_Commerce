const { Models } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Return Service for order returns
 */
const ReturnService = {
  /**
   * Request a return
   */
  requestReturn: async (userId, returnData) => {
    const { returns, order_items, orders } = await Models();
    
    // Check ownership
    const orderItem = await order_items.findOne({
      where: { id: returnData.order_item_id },
      include: [{ model: orders, where: { user_id: userId } }]
    });

    if (!orderItem) throw BadRequestError('Invalid order item for return');

    return await returns.create({
      order_id: returnData.order_id,
      order_item_id: returnData.order_item_id,
      user_id: userId,
      reason: returnData.reason,
      description: returnData.description,
      status: 'pending',
      requested_at: new Date()
    });
  },

  /**
   * Process return (Admin/Seller)
   */
  processReturn: async (returnId, status, resolution, refundAmount = 0) => {
    const { returns } = await Models();
    const returnRecord = await returns.findByPk(returnId);
    if (!returnRecord) throw NotFoundError('Return request not found');

    return await returnRecord.update({
      status,
      resolution,
      refund_amount: refundAmount,
      resolved_at: new Date()
    });
  }
};

module.exports = ReturnService;
