const ShipmentService = require('../services/shipmentService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Shipment Controller for request handling logic
 */
const ShipmentController = {
  /**
   * Create a new shipment
   */
  create: async (req, res, next) => {
    try {
      const { orderId } = req.body;
      const sellerId = req.user.seller_id;
      const shipment = await ShipmentService.createShipment(orderId, sellerId);
      return ResponseHelper.success(res, 'Shipment created successfully', shipment, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update shipment status
   */
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const shipment = await ShipmentService.updateShipmentStatus(id, status);
      return ResponseHelper.success(res, 'Shipment status updated successfully', shipment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get shipment by order ID
   */
  getByOrderId: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const shipment = await ShipmentService.getShipmentByOrderId(orderId);
      return ResponseHelper.success(res, 'Shipment retrieved successfully', shipment);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get shipment events
   */
  getEvents: async (req, res, next) => {
    try {
      const { id } = req.params;
      const events = await ShipmentService.getShipmentEvents(id);
      return ResponseHelper.success(res, 'Shipment events retrieved successfully', events);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ShipmentController;
