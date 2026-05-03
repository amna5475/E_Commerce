const { Models } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Wallet Service for user wallet operations
 */
const WalletService = {
  /**
   * Get wallet by user ID
   */
  getWallet: async (userId) => {
    const { wallets } = await Models();
    let wallet = await wallets.findOne({ where: { user_id: userId } });
    
    // Create wallet if it doesn't exist (lazy creation)
    if (!wallet) {
      wallet = await wallets.create({ user_id: userId, balance: 0 });
    }
    return wallet;
  },

  /**
   * Get wallet transactions
   */
  getTransactions: async (userId) => {
    const { wallets, wallet_transactions } = await Models();
    const wallet = await WalletService.getWallet(userId);
    
    return await wallet_transactions.findAll({
      where: { wallet_id: wallet.id },
      order: [['created_at', 'DESC']]
    });
  },

  /**
   * Add funds to wallet (Credit)
   */
  addFunds: async (userId, amount, purpose = 'DEPOSIT', reference = {}) => {
    const { wallets, wallet_transactions, sequelize } = await Models();
    const wallet = await WalletService.getWallet(userId);

    const transaction = await sequelize.transaction();
    try {
      await wallet.update({ balance: wallet.balance + amount }, { transaction });
      
      const log = await wallet_transactions.create({
        wallet_id: wallet.id,
        type: 'CREDIT',
        amount,
        purpose,
        reference_type: reference.type,
        reference_id: reference.id,
        status: 'COMPLETED'
      }, { transaction });

      await transaction.commit();
      return { wallet, log };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = WalletService;
