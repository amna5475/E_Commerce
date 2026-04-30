const { Models } = require('../models/dbModel');
const { NotFoundError } = require('../adapters/errorAdapter');

/**
 * Category Service for business logic and DB operations
 */
class CategoryService {
  /**
   * Create a new category
   * @param {Object} categoryData - Data for the new category
   */
  static async createCategory(categoryData) {
    const { categories } = await Models();
    return await categories.create(categoryData);
  }

  /**
   * Get all categories
   * @param {Object} filter - Optional filters
   */
  static async getAllCategories(filter = {}) {
    const { categories } = await Models();
    return await categories.findAll({ where: filter });
  }

  /**
   * Get category by ID
   * @param {String} id - Category ID
   */
  static async getCategoryById(id) {
    const { categories } = await Models();
    const foundCategory = await categories.findByPk(id, {
        include: [{ model: categories, as: 'SubCategories' }]
    });
    if (!foundCategory) {
      throw new NotFoundError('Category not found');
    }
    return foundCategory;
  }

  /**
   * Update category
   * @param {String} id - Category ID
   * @param {Object} updateData - Data to update
   */
  static async updateCategory(id, updateData) {
    const category = await this.getCategoryById(id);
    return await category.update(updateData);
  }

  /**
   * Delete category
   * @param {String} id - Category ID
   */
  static async deleteCategory(id) {
    const category = await this.getCategoryById(id);
    return await category.destroy();
  }
}

module.exports = CategoryService;
