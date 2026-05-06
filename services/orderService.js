const { Models, sequelize } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Order Service for business logic and DB operations
 */
const OrderService = {
  /**
   * Place an order
   * @param {String} userId - User ID
   * @param {Object} orderData - Order data (address_id, payment_method, notes, items)
   */
  placeOrder: async (userId, orderData) => {
    const { orders, order_items, product_variants, products } = await Models();
    const { items } = orderData;
    
    if (!items || items.length === 0) {
      throw BadRequestError('Order items are required');
    }

    const transaction = await sequelize.transaction();
    try {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const variant = await product_variants.findByPk(item.variant_id, { transaction });
        if (!variant || variant.stock_qty < item.quantity) {
          throw BadRequestError(`Insufficient stock for product variant ${item.variant_id}`);
        }

        const product = await products.findByPk(variant.product_id, { transaction });
        
        const itemSubtotal = item.quantity * item.unit_price;
        subtotal += itemSubtotal;

        orderItemsData.push({
          variant_id: item.variant_id,
          seller_id: product.seller_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: itemSubtotal,
          status: 'pending'
        });

        // Update stock
        await variant.update({
          stock_qty: variant.stock_qty - item.quantity
        }, { transaction });
      }

      const shippingFee = 200; // Placeholder
      const totalAmount = subtotal + shippingFee;

      const order = await orders.create({
        user_id: userId,
        address_id: orderData.address_id,
        order_number: `ORD-${Date.now()}`,
        status: 'pending',
        subtotal,
        discount_amount: 0,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        payment_method: orderData.payment_method,
        payment_status: 'pending',
        notes: orderData.notes,
        placed_at: new Date()
      }, { transaction });

      const orderItemsWithOrderId = orderItemsData.map(item => ({ ...item, order_id: order.id }));
      await order_items.bulkCreate(orderItemsWithOrderId, { transaction });

      await transaction.commit();
      return await OrderService.getOrderById(order.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Get order by ID
   * @param {String} id - Order ID
   */
  getOrderById: async (id) => {
    const { orders, order_items, product_variants, products } = await Models();
    const order = await orders.findByPk(id, {
      include: [{
        model: order_items,
        include: [{
          model: product_variants,
          include: [{ model: products }]
        }]
      }]
    });
    if (!order) {
      throw NotFoundError('Order not found');
    }
    return order;
  },

  /**
   * Get all orders for a user
   * @param {String} userId - User ID
   */
  getUserOrders: async (userId) => {
    const { orders } = await Models();
    return await orders.findAll({ where: { user_id: userId } });
  },

  /**
   * Get all orders for a seller
   * @param {String} sellerId - Seller ID
   */
  getSellerOrders: async (sellerId) => {
    const { order_items, orders } = await Models();
    return await orders.findAll({
      include: [{
        model: order_items,
        where: { seller_id: sellerId }
      }]
    });
  },

  /**
   * Update order status
   * @param {String} id - Order ID
   * @param {String} status - New status
   */
  updateOrderStatus: async (id, status) => {
    const order = await OrderService.getOrderById(id);
    return await order.update({ status });
  }
};

module.exports = OrderService;
