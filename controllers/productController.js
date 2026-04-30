const ProductService = require('../services/productService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Product Controller for request handling logic
 */
class ProductController {
  /**
   * Create a new product
   */
  static async create(req, res, next) {
    try {
      const { variants, images, ...productData } = req.body;
      productData.seller_id = req.user.seller_id;
      const product = await ProductService.createProduct(productData, variants, images);
      return ResponseHelper.success(res, 'Product created successfully', product, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all products
   */
  static async getAll(req, res, next) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      return ResponseHelper.success(res, 'Products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get product by ID
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      return ResponseHelper.success(res, 'Product retrieved successfully', product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const sellerId = req.user.seller_id;
      const product = await ProductService.updateProduct(id, sellerId, req.body);
      return ResponseHelper.success(res, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const sellerId = req.user.seller_id;
      await ProductService.deleteProduct(id, sellerId);
      return ResponseHelper.success(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get my products (for sellers)
   */
  static async getMyProducts(req, res, next) {
    try {
      const sellerId = req.user.seller_id;
      const products = await ProductService.getProductsBySeller(sellerId);
      return ResponseHelper.success(res, 'Seller products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
