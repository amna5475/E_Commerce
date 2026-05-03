const { Models, sequelize } = require('../models/dbModel');
const { NotFoundError, ForbiddenError } = require('../adapters/errorAdapter');

/**
 * Product Service for business logic and DB operations
 */
const ProductService = {
  /**
   * Create a new product with variants and images
   * @param {Object} productData - Data for the new product
   * @param {Array} variants - Array of product variants
   * @param {Array} images - Array of product image URLs
   */
  createProduct: async (productData, variants = [], images = []) => {
    const { products, product_variants, product_images } = await Models();
    
    const transaction = await sequelize.transaction();
    try {
      const product = await products.create(productData, { transaction });

      if (variants && variants.length > 0) {
        const variantsWithProductId = variants.map(v => ({ ...v, product_id: product.id }));
        await product_variants.bulkCreate(variantsWithProductId, { transaction });
      }

      if (images && images.length > 0) {
        const imagesWithProductId = images.map(img => ({ ...img, product_id: product.id }));
        await product_images.bulkCreate(imagesWithProductId, { transaction });
      }

      await transaction.commit();
      return await ProductService.getProductById(product.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Get all products
   * @param {Object} filter - Optional filters
   */
  getAllProducts: async (filter = {}) => {
    const { products, product_variants, product_images, brands, categories } = await Models();
    return await products.findAll({ 
      where: filter,
      include: [
        { model: product_variants },
        { model: product_images },
        { model: brands },
        { model: categories }
      ]
    });
  },

  /**
   * Get product by ID
   * @param {String} id - Product ID
   */
  getProductById: async (id) => {
    const { products, product_variants, product_images, brands, categories } = await Models();
    const foundProduct = await products.findByPk(id, {
      include: [
        { model: product_variants },
        { model: product_images },
        { model: brands },
        { model: categories }
      ]
    });
    if (!foundProduct) {
      throw new NotFoundError('Product not found');
    }
    return foundProduct;
  },

  /**
   * Update product with variants and images
   * @param {String} id - Product ID
   * @param {String} sellerId - Seller ID (for ownership check)
   * @param {Object} updateData - Data to update
   */
  updateProduct: async (id, sellerId, updateData) => {
    const { product_variants, product_images } = await Models();
    const product = await ProductService.getProductById(id);

    if (product.seller_id !== sellerId) {
      throw new ForbiddenError('You do not have permission to update this product');
    }

    const transaction = await sequelize.transaction();
    try {
      const { variants, images, ...productFields } = updateData;

      await product.update(productFields, { transaction });

      if (variants) {
        await product_variants.destroy({ where: { product_id: id }, transaction });
        const variantsWithProductId = variants.map(v => ({ ...v, product_id: id }));
        await product_variants.bulkCreate(variantsWithProductId, { transaction });
      }

      if (images) {
        await product_images.destroy({ where: { product_id: id }, transaction });
        const imagesWithProductId = images.map(img => ({ ...img, product_id: id }));
        await product_images.bulkCreate(imagesWithProductId, { transaction });
      }

      await transaction.commit();
      return await ProductService.getProductById(id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Delete product
   * @param {String} id - Product ID
   * @param {String} sellerId - Seller ID (for ownership check)
   */
  deleteProduct: async (id, sellerId) => {
    const product = await ProductService.getProductById(id);
    if (product.seller_id !== sellerId) {
      throw new ForbiddenError('You do not have permission to delete this product');
    }
    return await product.destroy();
  },

  /**
   * Get products by seller
   * @param {String} sellerId - Seller ID
   */
  getProductsBySeller: async (sellerId) => {
    return await ProductService.getAllProducts({ seller_id: sellerId });
  },

  /**
   * Ask a question about a product
   */
  askQuestion: async (productId, userId, question) => {
    const { product_questions } = await Models();
    return await product_questions.create({
      product_id: productId,
      user_id: userId,
      question
    });
  },

  /**
   * Answer a product question
   */
  answerQuestion: async (questionId, sellerUserId, answer) => {
    const { product_questions } = await Models();
    const question = await product_questions.findByPk(questionId);
    if (!question) throw new NotFoundError('Question not found');
    
    return await question.update({
      answer,
      answered_by: sellerUserId,
      answered_at: new Date()
    });
  }
};

module.exports = ProductService;
