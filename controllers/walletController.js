const WalletService = require('../services/walletService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Wallet Controller for handling wallet requests
 */
const WalletController = {
  /**
   * Get current user's wallet
   */
  getMine: async (req, res, next) => {
    try {
      const wallet = await WalletService.getWallet(req.user.id);
      return ResponseHelper.success(res, 'Wallet retrieved successfully', wallet);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user's wallet transactions
   */
  getTransactions: async (req, res, next) => {
    try {
      const transactions = await WalletService.getTransactions(req.user.id);
      return ResponseHelper.success(res, 'Transactions retrieved successfully', transactions);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = WalletController;
