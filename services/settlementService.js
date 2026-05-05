const { Models } = require('../models/dbModel');
const { NotFoundError } = require('../adapters/errorAdapter');

/**
 * Settlement Service for seller payments
 */
const SettlementService = {
  /**
   * Create a new settlement record
   */
  createSettlement: async (settlementData) => {
    const { seller_settlements } = await Models();
    return await seller_settlements.create(settlementData);
  },

  /**
   * Get settlements for a seller
   */
  getSellerSettlements: async (sellerId) => {
    const { seller_settlements } = await Models();
    return await seller_settlements.findAll({
      where: { seller_id: sellerId },
      order: [['period_end', 'DESC']]
    });
  }
};

module.exports = SettlementService;
