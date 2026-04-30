const { Models } = require('../models/dbModel');
const { NotFoundError } = require('../adapters/errorAdapter');

/**
 * Shipment Service for business logic and DB operations
 */
class ShipmentService {
  /**
   * Create a new shipment
   * @param {String} orderId - Order ID
   * @param {String} sellerId - Seller ID
   */
  static async createShipment(orderId, sellerId) {
    const { shipments, orders } = await Models();
    
    const order = await orders.findByPk(orderId);
    if (!order) {
      throw new NotFoundError('Order not found');
    }

    return await shipments.create({
      order_id: orderId,
      seller_id: sellerId,
      courier_name: 'Placeholder Courier',
      tracking_number: `TRK-${Date.now()}`,
      status: 'pending',
      pickup_at: new Date()
    });
  }

  /**
   * Update shipment status and log event
   * @param {String} id - Shipment ID
   * @param {String} status - New status
   */
  static async updateShipmentStatus(id, status) {
    const { shipments, shipment_events } = await Models();

    const shipment = await shipments.findByPk(id);
    if (!shipment) {
      throw new NotFoundError('Shipment record not found');
    }

    const updateData = { status };
    if (status === 'dispatched') updateData.dispatched_at = new Date();
    if (status === 'delivered') updateData.delivered_at = new Date();

    await shipment.update(updateData);

    // Create event log
    await shipment_events.create({
      shipment_id: shipment.id,
      event_type: status,
      location: 'Warehouse',
      description: `Shipment status updated to ${status}`,
      occurred_at: new Date()
    });

    return shipment;
  }

  /**
   * Get shipment by order ID
   * @param {String} orderId - Order ID
   */
  static async getShipmentByOrderId(orderId) {
    const { shipments, shipment_events } = await Models();
    return await shipments.findOne({
      where: { order_id: orderId },
      include: [{ model: shipment_events }]
    });
  }

  /**
   * Get shipment events
   * @param {String} shipmentId - Shipment ID
   */
  static async getShipmentEvents(shipmentId) {
    const { shipment_events } = await Models();
    return await shipment_events.findAll({ where: { shipment_id: shipmentId } });
  }
}

module.exports = ShipmentService;
