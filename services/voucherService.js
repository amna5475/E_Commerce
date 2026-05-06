const { Models } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Voucher Service for promo codes
 */
const VoucherService = {
  /**
   * Create a voucher
   */
  createVoucher: async (voucherData) => {
    const { vouchers } = await Models();
    return await vouchers.create(voucherData);
  },

  /**
   * Validate and get voucher
   */
  validateVoucher: async (code, orderValue) => {
    const { vouchers } = await Models();
    const voucher = await vouchers.findOne({ where: { code, is_active: true } });
    
    if (!voucher) throw NotFoundError('Invalid or expired voucher code');
    
    const now = new Date();
    if (voucher.valid_from && now < voucher.valid_from) throw BadRequestError('Voucher is not yet active');
    if (voucher.valid_until && now > voucher.valid_until) throw BadRequestError('Voucher has expired');
    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) throw BadRequestError('Voucher usage limit reached');
    if (voucher.min_order_value && orderValue < voucher.min_order_value) throw BadRequestError(`Minimum order value of ${voucher.min_order_value} required`);

    return voucher;
  }
};

module.exports = VoucherService;
