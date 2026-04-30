const OrderService = require('../services/orderService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Order Controller for request handling logic
 */
const OrderController = {
  /**
   * Place a new order
   */
  placeOrder: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const order = await OrderService.placeOrder(userId, req.body);
      return ResponseHelper.success(res, 'Order placed successfully', order, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all orders for the current user
   */
  getUserOrders: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const orders = await OrderService.getUserOrders(userId);
      return ResponseHelper.success(res, 'User orders retrieved successfully', orders);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all orders for the current seller
   */
  getSellerOrders: async (req, res, next) => {
    try {
      const sellerId = req.user.seller_id;
      const orders = await OrderService.getSellerOrders(sellerId);
      return ResponseHelper.success(res, 'Seller orders retrieved successfully', orders);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get order by ID
   */
  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      return ResponseHelper.success(res, 'Order retrieved successfully', order);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update order status
   */
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(id, status);
      return ResponseHelper.success(res, 'Order status updated successfully', order);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = OrderController;
