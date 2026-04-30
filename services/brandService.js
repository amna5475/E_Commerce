const { Models } = require('../models/dbModel');
const { NotFoundError } = require('../adapters/errorAdapter');

/**
 * Brand Service for business logic and DB operations
 */
class BrandService {
  /**
   * Create a new brand
   * @param {Object} brandData - Data for the new brand
   */
  static async createBrand(brandData) {
    const { brands } = await Models();
    return await brands.create(brandData);
  }

  /**
   * Get all brands
   * @param {Object} filter - Optional filters
   */
  static async getAllBrands(filter = {}) {
    const { brands } = await Models();
    return await brands.findAll({ where: filter });
  }

  /**
   * Get brand by ID
   * @param {String} id - Brand ID
   */
  static async getBrandById(id) {
    const { brands } = await Models();
    const foundBrand = await brands.findByPk(id);
    if (!foundBrand) {
      throw new NotFoundError('Brand not found');
    }
    return foundBrand;
  }

  /**
   * Update brand
   * @param {String} id - Brand ID
   * @param {Object} updateData - Data to update
   */
  static async updateBrand(id, updateData) {
    const brand = await this.getBrandById(id);
    return await brand.update(updateData);
  }

  /**
   * Delete brand
   * @param {String} id - Brand ID
   */
  static async deleteBrand(id) {
    const brand = await this.getBrandById(id);
    return await brand.destroy();
  }
}

module.exports = BrandService;
