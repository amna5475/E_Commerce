const ReviewService = require('../services/reviewService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Review Controller for handling review requests
 */
const ReviewController = {
  /**
   * Submit a review
   */
  create: async (req, res, next) => {
    try {
      const review = await ReviewService.createReview(req.user.id, req.body);
      return ResponseHelper.success(res, 'Review submitted successfully', review, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get product reviews
   */
  getProductReviews: async (req, res, next) => {
    try {
      const { productId } = req.params;
      const reviews = await ReviewService.getProductReviews(productId);
      return ResponseHelper.success(res, 'Reviews retrieved successfully', reviews);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ReviewController;
