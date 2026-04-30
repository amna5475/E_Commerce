const CategoryService = require('../services/categoryService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Category Controller for request handling logic
 */
class CategoryController {
  /**
   * Create a new category
   */
  static async create(req, res, next) {
    try {
      const category = await CategoryService.createCategory(req.body);
      return ResponseHelper.success(res, 'Category created successfully', category, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all categories
   */
  static async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories(req.query);
      return ResponseHelper.success(res, 'Categories retrieved successfully', categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get category by ID
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getCategoryById(id);
      return ResponseHelper.success(res, 'Category retrieved successfully', category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update category
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryService.updateCategory(id, req.body);
      return ResponseHelper.success(res, 'Category updated successfully', category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete category
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await CategoryService.deleteCategory(id);
      return ResponseHelper.success(res, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
