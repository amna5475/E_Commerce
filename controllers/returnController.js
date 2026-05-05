const ReturnService = require('../services/returnService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Return Controller for handling return requests
 */
const ReturnController = {
  /**
   * Submit return request
   */
  create: async (req, res, next) => {
    try {
      const returnReq = await ReturnService.requestReturn(req.user.id, req.body);
      return ResponseHelper.success(res, 'Return request submitted successfully', returnReq, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Process return (Admin)
   */
  process: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, resolution, refund_amount } = req.body;
      const result = await ReturnService.processReturn(id, status, resolution, refund_amount);
      return ResponseHelper.success(res, 'Return processed successfully', result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ReturnController;
