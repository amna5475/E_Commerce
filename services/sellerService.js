const bcrypt = require('bcryptjs');
const { Models } = require('../models/dbModel');
const { BadRequestError, NotFoundError } = require('../adapters/errorAdapter');

/**
 * Seller Service for handling seller-related business logic
 */
const SellerService = {
  /**
   * Register a new seller application
   * @param {String} userId - User ID
   * @param {Object} sellerData - Seller registration data
   */
  registerSeller: async (userId, sellerData) => {
    const { users, sellers } = await Models();

    // Check if user exists
    const user = await users.findByPk(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Check if user is already a seller or has a pending application
    const existingSeller = await sellers.findOne({ where: { user_id: userId } });
    if (existingSeller) {
      throw new BadRequestError('User already has a seller profile or pending application');
    }

    // Check if shop name is unique
    const existingShop = await sellers.findOne({ where: { shop_name: sellerData.shop_name } });
    if (existingShop) {
      throw new BadRequestError('Shop name is already taken');
    }

    // Create shop slug
    const shopSlug = sellerData.shop_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    // Create seller record (pending status)
    const seller = await sellers.create({
      user_id: userId,
      shop_name: sellerData.shop_name,
      shop_slug: shopSlug,
      description: sellerData.description,
      logo_url: sellerData.logo_url,
      ntn_number: sellerData.ntn_number,
      bank_name: sellerData.bank_name,
      bank_account: sellerData.bank_account,
      bank_iban: sellerData.bank_iban,
      ntn_doc_url: sellerData.ntn_doc_url,
      id_card_doc_url: sellerData.id_card_doc_url,
      status: 'pending',
      rating: 0
    });

    return seller;
  },

  /**
   * Approve seller application and upgrade user role
   * @param {String} sellerId - Seller ID
   */
  approveSeller: async (sellerId) => {
    const models = await Models();
    const { sellers, users } = models;

    const seller = await sellers.findByPk(sellerId);
    if (!seller) throw new NotFoundError('Seller application not found');
    if (seller.status === 'approved') throw new BadRequestError('Seller is already approved');

    const user = await users.findByPk(seller.user_id);
    if (!user) throw new NotFoundError('Associated user not found');

    await seller.update({ status: 'approved', approved_at: new Date() });
    await user.update({ role: 'seller' });

    return seller;
  },

  /**
   * Reject seller application
   * @param {String} sellerId - Seller ID
   * @param {String} reason - Reason for rejection
   */
  rejectSeller: async (sellerId, reason) => {
    const { sellers } = await Models();
    const seller = await sellers.findByPk(sellerId);
    if (!seller) throw new NotFoundError('Seller application not found');

    await seller.update({ 
      status: 'rejected', 
      description: `${seller.description} (Rejected: ${reason})` 
    });
    return seller;
  },

  /**
   * Add a sub-user (staff) to a shop
   * @param {String} sellerId - Seller ID
   * @param {Object} userData - Staff user data
   */
  addSubUser: async (sellerId, userData) => {
    const { users, seller_staff } = await Models();
    
    // Check if user already exists
    let user = await users.findOne({ where: { email: userData.email } });
    
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(userData.password, salt);
      user = await users.create({
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        password_hash,
        role: 'customer',
        is_active: true,
        is_verified: true
      });
    }

    // Check if already staff for this shop
    const existingStaff = await seller_staff.findOne({ where: { user_id: user.id, seller_id: sellerId } });
    if (existingStaff) throw new BadRequestError('User is already a staff member of this shop');

    // Link user to shop in junction table
    await seller_staff.create({
      user_id: user.id,
      seller_id: sellerId,
      role: userData.role || 'staff'
    });

    const userResponse = user.toJSON();
    delete userResponse.password_hash;
    return userResponse;
  },

  /**
   * Get all staff for a shop
   * @param {String} sellerId - Seller ID
   */
  getSellerStaff: async (sellerId) => {
    const { users, seller_staff } = await Models();
    return await users.findAll({ 
      include: [{
        model: seller_staff,
        where: { seller_id: sellerId },
        required: true
      }],
      attributes: { exclude: ['password_hash'] }
    });
  },

  /**
   * Get all sellers (for admin review)
   */
  getAllSellers: async (filter = {}) => {
    const { sellers } = await Models();
    return await sellers.findAll({ where: filter });
  },

  /**
   * Get seller profile by User ID
   * @param {String} userId - User ID
   */
  getSellerByUserId: async (userId) => {
    const { sellers } = await Models();
    const seller = await sellers.findOne({ where: { user_id: userId } });
    if (!seller) {
      throw new NotFoundError('Seller profile not found');
    }
    return seller;
  },

  /**
   * Get seller by ID
   * @param {String} id - Seller ID
   */
  getSellerById: async (id) => {
    const { sellers } = await Models();
    const seller = await sellers.findByPk(id);
    if (!seller) {
      throw new NotFoundError('Seller not found');
    }
    return seller;
  },

  /**
   * Follow a shop
   */
  followShop: async (sellerId, userId) => {
    const { shop_followers } = await Models();
    const existing = await shop_followers.findOne({ where: { seller_id: sellerId, user_id: userId } });
    if (existing) throw new BadRequestError('Already following this shop');
    
    return await shop_followers.create({
      seller_id: sellerId,
      user_id: userId
    });
  },

  /**
   * Unfollow a shop
   */
  unfollowShop: async (sellerId, userId) => {
    const { shop_followers } = await Models();
    const follower = await shop_followers.findOne({ where: { seller_id: sellerId, user_id: userId } });
    if (!follower) throw new NotFoundError('Follow record not found');
    return await follower.destroy();
  }
};

module.exports = SellerService;
