const SellerService = require('../services/sellerService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Seller Controller for request handling logic
 */
const SellerController = {
  /**
   * Register as a seller
   */
  register: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const seller = await SellerService.registerSeller(userId, req.body);
      return ResponseHelper.success(res, 'Seller application submitted successfully', seller, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Approve a seller application (Admin only)
   */
  approve: async (req, res, next) => {
    try {
      const { id } = req.params;
      const seller = await SellerService.approveSeller(id);
      return ResponseHelper.success(res, 'Seller approved successfully', seller);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reject a seller application (Admin only)
   */
  reject: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const seller = await SellerService.rejectSeller(id, reason);
      return ResponseHelper.success(res, 'Seller rejected successfully', seller);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add a sub-user/staff member (Seller only)
   */
  addSubUser: async (req, res, next) => {
    try {
      const sellerId = req.user.seller_id;
      const user = await SellerService.addSubUser(sellerId, req.body);
      return ResponseHelper.success(res, 'Staff member added successfully', user, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all staff members for the current shop
   */
  getMyStaff: async (req, res, next) => {
    try {
      const sellerId = req.user.seller_id;
      const staff = await SellerService.getSellerStaff(sellerId);
      return ResponseHelper.success(res, 'Staff list retrieved successfully', staff);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get current user's seller profile
   */
  getMyProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const seller = await SellerService.getSellerByUserId(userId);
      return ResponseHelper.success(res, 'Seller profile retrieved successfully', seller);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all sellers (Admin review)
   */
  getAll: async (req, res, next) => {
    try {
      const sellers = await SellerService.getAllSellers(req.query);
      return ResponseHelper.success(res, 'Sellers list retrieved successfully', sellers);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get seller by ID
   */
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const seller = await SellerService.getSellerById(id);
      return ResponseHelper.success(res, 'Seller retrieved successfully', seller);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Follow a shop
   */
  follow: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await SellerService.followShop(id, req.user.id);
      return ResponseHelper.success(res, 'Shop followed successfully', result, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Unfollow a shop
   */
  unfollow: async (req, res, next) => {
    try {
      const { id } = req.params;
      await SellerService.unfollowShop(id, req.user.id);
      return ResponseHelper.success(res, 'Shop unfollowed successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = SellerController;
