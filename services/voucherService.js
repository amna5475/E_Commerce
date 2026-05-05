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
    
    if (!voucher) throw new NotFoundError('Invalid or expired voucher code');
    
    const now = new Date();
    if (voucher.valid_from && now < voucher.valid_from) throw new BadRequestError('Voucher is not yet active');
    if (voucher.valid_until && now > voucher.valid_until) throw new BadRequestError('Voucher has expired');
    if (voucher.usage_limit && voucher.used_count >= voucher.usage_limit) throw new BadRequestError('Voucher usage limit reached');
    if (voucher.min_order_value && orderValue < voucher.min_order_value) throw new BadRequestError(`Minimum order value of ${voucher.min_order_value} required`);

    return voucher;
  }
};

module.exports = VoucherService;
