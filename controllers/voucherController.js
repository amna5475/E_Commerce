const VoucherService = require('../services/voucherService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Voucher Controller for handling voucher requests
 */
const VoucherController = {
  /**
   * Create voucher (Admin/Seller)
   */
  create: async (req, res, next) => {
    try {
      const voucher = await VoucherService.createVoucher(req.body);
      return ResponseHelper.success(res, 'Voucher created successfully', voucher, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Validate voucher
   */
  validate: async (req, res, next) => {
    try {
      const { code, orderValue } = req.body;
      const voucher = await VoucherService.validateVoucher(code, orderValue);
      return ResponseHelper.success(res, 'Voucher is valid', voucher);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = VoucherController;
