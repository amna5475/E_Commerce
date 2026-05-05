const SettlementService = require('../services/settlementService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Settlement Controller for handling settlement requests
 */
const SettlementController = {
  /**
   * Get my settlements (Seller)
   */
  getMine: async (req, res, next) => {
    try {
      const sellerId = req.user.seller_id;
      const settlements = await SettlementService.getSellerSettlements(sellerId);
      return ResponseHelper.success(res, 'Settlements retrieved successfully', settlements);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create settlement (Admin)
   */
  create: async (req, res, next) => {
    try {
      const settlement = await SettlementService.createSettlement(req.body);
      return ResponseHelper.success(res, 'Settlement created successfully', settlement, 201);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = SettlementController;
