const NotificationService = require('../services/notificationService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Notification Controller for handling notification requests
 */
const NotificationController = {
  /**
   * Get my notifications
   */
  getMine: async (req, res, next) => {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user.id);
      return ResponseHelper.success(res, 'Notifications retrieved successfully', notifications);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Mark notification as read
   */
  read: async (req, res, next) => {
    try {
      const { id } = req.params;
      await NotificationService.markAsRead(id);
      return ResponseHelper.success(res, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = NotificationController;
