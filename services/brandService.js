const { Models } = require('../models/dbModel');
const { NotFoundError } = require('../adapters/errorAdapter');

/**
 * Brand Service for business logic and DB operations
 */
const BrandService = {
  /**
   * Create a new brand
   * @param {Object} brandData - Data for the new brand
   */
  createBrand: async (userData) => {
    const { brands } = await Models();
    return await brands.create(userData);
  },

  /**
   * Get all brands
   * @param {Object} filter - Optional filters
   */
  getAllBrands: async (filter = {}) => {
    const { brands } = await Models();
    return await brands.findAll({ where: filter });
  },

  /**
   * Get brand by ID
   * @param {String} id - Brand ID
   */
  getBrandById: async (id) => {
    const { brands } = await Models();
    const foundBrand = await brands.findByPk(id);
    if (!foundBrand) {
      throw new NotFoundError('Brand not found');
    }
    return foundBrand;
  },

  /**
   * Update brand
   * @param {String} id - Brand ID
   * @param {Object} updateData - Data to update
   */
  updateBrand: async (id, updateData) => {
    const brand = await BrandService.getBrandById(id);
    return await brand.update(updateData);
  },

  /**
   * Delete brand
   * @param {String} id - Brand ID
   */
  deleteBrand: async (id) => {
    const brand = await BrandService.getBrandById(id);
    return await brand.destroy();
  }
};

module.exports = BrandService;
