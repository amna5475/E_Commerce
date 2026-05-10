const { Models, sequelize } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

// Threshold for low stock alert
const LOW_STOCK_THRESHOLD = 5;

/**
 * Inventory Service for business logic and DB operations
 */
const InventoryService = {
  /**
   * Get inventory change history for a specific variant
   * @param {String} variantId - Product variant ID
   */
  getVariantHistory: async (variantId) => {
    const { inventory, product_variants } = await Models();

    const variant = await product_variants.findByPk(variantId);
    if (!variant) throw NotFoundError('Product variant not found');

    return await inventory.findAll({
      where: { variant_id: variantId },
      order: [['created_at', 'DESC']]
    });
  },

  /**
   * Manually adjust stock for a variant and log the change
   * @param {String} variantId - Product variant ID
   * @param {Number} quantityChange - Positive to add, negative to subtract
   * @param {String} action - e.g. 'MANUAL_ADJUST', 'RESTOCK', 'CORRECTION'
   * @param {String} referenceType - Optional reference type
   * @param {String} actorId - User performing the adjustment
   */
  adjustStock: async (variantId, quantityChange, action, referenceType = 'manual', actorId = null) => {
    const { inventory, product_variants } = await Models();

    const variant = await product_variants.findByPk(variantId);
    if (!variant) throw NotFoundError('Product variant not found');

    const newQty = variant.stock_qty + quantityChange;
    if (newQty < 0) {
      throw BadRequestError(`Adjustment would result in negative stock. Current stock: ${variant.stock_qty}`);
    }

    const transaction = await sequelize.transaction();
    try {
      // Update the variant's stock
      await variant.update({ stock_qty: newQty }, { transaction });

      // Log the change in inventory
      const log = await inventory.create({
        variant_id: variantId,
        action,
        quantity_change: quantityChange,
        qty_after: newQty,
        reference_type: referenceType,
        reference_id: actorId,
        created_at: new Date()
      }, { transaction });

      await transaction.commit();
      return {
        variant_id: variantId,
        previous_qty: variant.stock_qty,
        quantity_change: quantityChange,
        new_qty: newQty,
        action,
        log
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Get all variants with low stock for a seller
   * @param {String} sellerId - Seller ID
   */
  getLowStockVariants: async (sellerId) => {
    const { product_variants, products } = await Models();
    const { Op } = require('sequelize');

    return await product_variants.findAll({
      where: {
        stock_qty: { [Op.lte]: LOW_STOCK_THRESHOLD },
        is_active: true
      },
      include: [{
        model: products,
        where: { seller_id: sellerId },
        attributes: ['id', 'title', 'seller_id']
      }],
      order: [['stock_qty', 'ASC']]
    });
  }
};

module.exports = InventoryService;
