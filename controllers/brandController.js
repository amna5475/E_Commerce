const BrandService = require('../services/brandService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Brand Controller for request handling logic
 */
const BrandController = {
  /**
   * Create a new brand
   */
  create: async (req, res, next) => {
    try {
      const brand = await BrandService.createBrand(req.body);
      return ResponseHelper.success(res, 'Brand created successfully', brand, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all brands
   */
  getAll: async (req, res, next) => {
    try {
      const brands = await BrandService.getAllBrands(req.query);
      return ResponseHelper.success(res, 'Brands retrieved successfully', brands);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get brand by ID
   */
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const brand = await BrandService.getBrandById(id);
      return ResponseHelper.success(res, 'Brand retrieved successfully', brand);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update brand
   */
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const brand = await BrandService.updateBrand(id, req.body);
      return ResponseHelper.success(res, 'Brand updated successfully', brand);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete brand
   */
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      await BrandService.deleteBrand(id);
      return ResponseHelper.success(res, 'Brand deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = BrandController;
