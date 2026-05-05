const { Models } = require('../models/dbModel');

/**
 * Notification Service for system notifications
 */
const NotificationService = {
  /**
   * Create and send a notification
   */
  notify: async (userId, data) => {
    const { notifications } = await Models();
    return await notifications.create({
      user_id: userId,
      type: data.type,
      title: data.title,
      body: data.body,
      reference_type: data.reference_type,
      reference_id: data.reference_id,
      sent_at: new Date()
    });
  },

  /**
   * Get user notifications
   */
  getUserNotifications: async (userId) => {
    const { notifications } = await Models();
    return await notifications.findAll({
      where: { user_id: userId },
      order: [['sent_at', 'DESC']]
    });
  },

  /**
   * Mark as read
   */
  markAsRead: async (notificationId) => {
    const { notifications } = await Models();
    return await notifications.update({ is_read: true }, { where: { id: notificationId } });
  }
};

module.exports = NotificationService;
