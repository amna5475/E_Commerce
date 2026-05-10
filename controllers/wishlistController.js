const WishlistService = require('../services/wishlistService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Wishlist Controller for request handling logic
 */
const WishlistController = {
  /**
   * Add a product to the wishlist
   */
  add: async (req, res, next) => {
    try {
      const { product_id } = req.body;
      const item = await WishlistService.addToWishlist(req.user.id, product_id);
      return ResponseHelper.success(res, 'Product added to wishlist', item, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get the current user's full wishlist
   */
  getAll: async (req, res, next) => {
    try {
      const items = await WishlistService.getWishlist(req.user.id);
      return ResponseHelper.success(res, 'Wishlist retrieved successfully', items);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove a specific product from the wishlist
   */
  remove: async (req, res, next) => {
    try {
      const { productId } = req.params;
      await WishlistService.removeFromWishlist(req.user.id, productId);
      return ResponseHelper.success(res, 'Product removed from wishlist');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Clear the entire wishlist
   */
  clear: async (req, res, next) => {
    try {
      const result = await WishlistService.clearWishlist(req.user.id);
      return ResponseHelper.success(res, 'Wishlist cleared successfully', result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = WishlistController;
