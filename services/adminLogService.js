const { Models } = require('../models/dbModel');

/**
 * Admin Log Service for auditing admin actions
 */
const AdminLogService = {
  /**
   * Write a new admin activity log entry
   * @param {String} adminId - Admin user ID
   * @param {String} action - Action code e.g. 'APPROVE_SELLER', 'REJECT_SELLER'
   * @param {String} targetType - Target table/resource e.g. 'sellers', 'products'
   * @param {String} targetId - UUID of the target record
   * @param {Object} details - Extra context (before/after states, reason, etc.)
   * @param {String} ipAddress - IP of the request
   */
  log: async (adminId, action, targetType, targetId, details = {}, ipAddress = null) => {
    try {
      const { admin_activity_logs } = await Models();
      return await admin_activity_logs.create({
        admin_id: adminId,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        ip_address: ipAddress,
        created_at: new Date()
      });
    } catch (err) {
      // Logging failure should never crash the main request
      console.error('[AdminLogService] Failed to write log:', err.message);
    }
  },

  /**
   * Retrieve admin activity logs with optional filtering
   * @param {Object} query - Filters: action, target_type, admin_id, page, limit
   */
  getLogs: async (query = {}) => {
    const { admin_activity_logs, users } = await Models();
    const { Op } = require('sequelize');

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (query.action) where.action = query.action;
    if (query.target_type) where.target_type = query.target_type;
    if (query.admin_id) where.admin_id = query.admin_id;

    const { count, rows } = await admin_activity_logs.findAndCountAll({
      where,
      include: [{
        model: users,
        as: 'admin',
        attributes: ['id', 'full_name', 'email']
      }],
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      logs: rows
    };
  }
};

module.exports = AdminLogService;
