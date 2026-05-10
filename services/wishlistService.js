const { Models } = require('../models/dbModel');
const { NotFoundError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Wishlist Service for business logic and DB operations
 */
const WishlistService = {
  /**
   * Add a product to the user's wishlist
   * @param {String} userId - User ID
   * @param {String} productId - Product ID
   */
  addToWishlist: async (userId, productId) => {
    const { wishlists, products } = await Models();

    // Verify the product exists
    const product = await products.findByPk(productId);
    if (!product) throw NotFoundError('Product not found');

    // Prevent duplicates
    const existing = await wishlists.findOne({
      where: { user_id: userId, product_id: productId }
    });
    if (existing) throw BadRequestError('Product is already in your wishlist');

    return await wishlists.create({
      user_id: userId,
      product_id: productId,
      added_at: new Date()
    });
  },

  /**
   * Get all wishlist items for a user with full product details
   * @param {String} userId - User ID
   */
  getWishlist: async (userId) => {
    const { wishlists, products, product_images, product_variants, brands, categories } = await Models();
    return await wishlists.findAll({
      where: { user_id: userId },
      include: [{
        model: products,
        include: [
          { model: product_images },
          { model: product_variants },
          { model: brands },
          { model: categories }
        ]
      }],
      order: [['added_at', 'DESC']]
    });
  },

  /**
   * Remove a specific product from the user's wishlist
   * @param {String} userId - User ID
   * @param {String} productId - Product ID
   */
  removeFromWishlist: async (userId, productId) => {
    const { wishlists } = await Models();
    const item = await wishlists.findOne({
      where: { user_id: userId, product_id: productId }
    });
    if (!item) throw NotFoundError('Product not found in your wishlist');
    await item.destroy();
  },

  /**
   * Clear all wishlist items for a user
   * @param {String} userId - User ID
   */
  clearWishlist: async (userId) => {
    const { wishlists } = await Models();
    const count = await wishlists.destroy({ where: { user_id: userId } });
    return { removed: count };
  }
};

module.exports = WishlistService;
