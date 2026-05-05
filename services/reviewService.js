const { Models } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Review Service for customer reviews
 */
const ReviewService = {
  /**
   * Create a new product review
   */
  createReview: async (userId, reviewData) => {
    const { reviews, review_images, order_items, orders } = await Models();
    
    // Check if user actually bought the product
    const orderItem = await order_items.findOne({
      where: { id: reviewData.order_item_id },
      include: [{ model: orders, where: { user_id: userId } }]
    });

    const review = await reviews.create({
      user_id: userId,
      product_id: reviewData.product_id,
      order_item_id: reviewData.order_item_id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      is_verified_purchase: !!orderItem
    });

    if (reviewData.images && reviewData.images.length > 0) {
      const images = reviewData.images.map(url => ({ review_id: review.id, url }));
      await review_images.bulkCreate(images);
    }

    return review;
  },

  /**
   * Get reviews for a product
   */
  getProductReviews: async (productId) => {
    const { reviews, review_images, users } = await Models();
    return await reviews.findAll({
      where: { product_id: productId },
      include: [
        { model: review_images },
        { model: users, attributes: ['full_name'] }
      ],
      order: [['created_at', 'DESC']]
    });
  }
};

module.exports = ReviewService;
