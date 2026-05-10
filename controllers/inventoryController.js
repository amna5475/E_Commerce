const InventoryService = require('../services/inventoryService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Inventory Controller for request handling logic
 */
const InventoryController = {
  /**
   * Get inventory change history for a variant
   */
  getHistory: async (req, res, next) => {
    try {
      const { variantId } = req.params;
      const history = await InventoryService.getVariantHistory(variantId);
      return ResponseHelper.success(res, 'Inventory history retrieved successfully', history);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Manually adjust stock for a variant
   */
  adjust: async (req, res, next) => {
    try {
      const { variant_id, quantity_change, action, reference_type } = req.body;
      const result = await InventoryService.adjustStock(
        variant_id,
        quantity_change,
        action || 'MANUAL_ADJUST',
        reference_type || 'manual',
        req.user.id
      );
      return ResponseHelper.success(res, 'Stock adjusted successfully', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all low-stock variants for the current seller
   */
  getLowStock: async (req, res, next) => {
    try {
      const sellerId = req.user.seller_id;
      const variants = await InventoryService.getLowStockVariants(sellerId);
      return ResponseHelper.success(res, 'Low stock variants retrieved successfully', variants);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = InventoryController;
