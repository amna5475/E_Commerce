const AddressService = require('../services/addressService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Address Controller for request handling logic
 */
const AddressController = {
  /**
   * Create a new address
   */
  create: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const address = await AddressService.createAddress(userId, req.body);
      return ResponseHelper.success(res, 'Address created successfully', address, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all addresses for the current user
   */
  getAll: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const addresses = await AddressService.getUserAddresses(userId);
      return ResponseHelper.success(res, 'Addresses retrieved successfully', addresses);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a specific address by ID
   */
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const address = await AddressService.getAddressById(id, req.user.id);
      return ResponseHelper.success(res, 'Address retrieved successfully', address);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update an address
   */
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const address = await AddressService.updateAddress(id, req.user.id, req.body);
      return ResponseHelper.success(res, 'Address updated successfully', address);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete an address
   */
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await AddressService.deleteAddress(id, req.user.id);
      return ResponseHelper.success(res, 'Address deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Set an address as the default
   */
  setDefault: async (req, res, next) => {
    try {
      const { id } = req.params;
      const address = await AddressService.setDefault(id, req.user.id);
      return ResponseHelper.success(res, 'Default address updated successfully', address);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = AddressController;
