const ProductService = require('../services/productService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Product Controller for request handling logic
 */
const ProductController = {
  /**
   * Create a new product
   */
  create: async (req, res, next) => {
    try {
      const { variants, images, ...productData } = req.body;
      productData.seller_id = req.user.seller_id;
      const product = await ProductService.createProduct(productData, variants, images);
      return ResponseHelper.success(res, 'Product created successfully', product, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all products
   */
  getAll: async (req, res, next) => {
    try {
      const products = await ProductService.getAllProducts(req.query);
      return ResponseHelper.success(res, 'Products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get product by ID
   */
  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      return ResponseHelper.success(res, 'Product retrieved successfully', product);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update product
   */
  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const sellerId = req.user.seller_id;
      const product = await ProductService.updateProduct(id, sellerId, req.body);
      return ResponseHelper.success(res, 'Product updated successfully', product);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete product
   */
  delete: async (req, res, next) => {
    try {
      const { id } = req.params;
      const sellerId = req.user.seller_id;
      await ProductService.deleteProduct(id, sellerId);
      return ResponseHelper.success(res, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get my products (for sellers)
   */
  getMyProducts: async (req, res, next) => {
    try {
      const sellerId = req.user.seller_id;
      const products = await ProductService.getProductsBySeller(sellerId);
      return ResponseHelper.success(res, 'Seller products retrieved successfully', products);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Ask a question about a product
   */
  askQuestion: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { question } = req.body;
      const result = await ProductService.askQuestion(id, req.user.id, question);
      return ResponseHelper.success(res, 'Question submitted successfully', result, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Answer a product question
   */
  answerQuestion: async (req, res, next) => {
    try {
      const { questionId } = req.params;
      const { answer } = req.body;
      const result = await ProductService.answerQuestion(questionId, req.user.id, answer);
      return ResponseHelper.success(res, 'Answer submitted successfully', result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = ProductController;
