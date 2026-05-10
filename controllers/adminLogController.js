const AdminLogService = require('../services/adminLogService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Admin Log Controller for request handling logic
 */
const AdminLogController = {
  /**
   * Get paginated admin activity logs
   * Supports query params: action, target_type, admin_id, page, limit
   */
  getLogs: async (req, res, next) => {
    try {
      const result = await AdminLogService.getLogs(req.query);
      return ResponseHelper.success(res, 'Admin logs retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AdminLogController;
