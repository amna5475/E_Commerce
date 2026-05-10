const { Models, sequelize } = require('../models/dbModel');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../adapters/errorAdapter');

/**
 * Address Service for business logic and DB operations
 */
const AddressService = {
  /**
   * Create a new address for a user
   * @param {String} userId - User ID
   * @param {Object} data - Address fields
   */
  createAddress: async (userId, data) => {
    const { addresses } = await Models();

    const transaction = await sequelize.transaction();
    try {
      // If this is marked as default, unset all existing defaults first
      if (data.is_default) {
        await addresses.update(
          { is_default: false },
          { where: { user_id: userId }, transaction }
        );
      }

      const address = await addresses.create(
        { ...data, user_id: userId },
        { transaction }
      );

      await transaction.commit();
      return address;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Get all addresses for a user
   * @param {String} userId - User ID
   */
  getUserAddresses: async (userId) => {
    const { addresses } = await Models();
    return await addresses.findAll({
      where: { user_id: userId },
      order: [['is_default', 'DESC']]
    });
  },

  /**
   * Get a specific address by ID (with ownership check)
   * @param {String} id - Address ID
   * @param {String} userId - User ID
   */
  getAddressById: async (id, userId) => {
    const { addresses } = await Models();
    const address = await addresses.findByPk(id);
    if (!address) throw NotFoundError('Address not found');
    if (address.user_id !== userId) throw ForbiddenError('Access denied to this address');
    return address;
  },

  /**
   * Update an address (with ownership check)
   * @param {String} id - Address ID
   * @param {String} userId - User ID
   * @param {Object} data - Fields to update
   */
  updateAddress: async (id, userId, data) => {
    const address = await AddressService.getAddressById(id, userId);

    const transaction = await sequelize.transaction();
    try {
      // If setting as default, unset all others first
      if (data.is_default) {
        const { addresses } = await Models();
        await addresses.update(
          { is_default: false },
          { where: { user_id: userId }, transaction }
        );
      }

      await address.update(data, { transaction });
      await transaction.commit();
      return address;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  /**
   * Delete an address (with ownership check)
   * @param {String} id - Address ID
   * @param {String} userId - User ID
   */
  deleteAddress: async (id, userId) => {
    const address = await AddressService.getAddressById(id, userId);
    await address.destroy();
  },

  /**
   * Set an address as the default for the user
   * @param {String} id - Address ID
   * @param {String} userId - User ID
   */
  setDefault: async (id, userId) => {
    const { addresses } = await Models();
    const address = await AddressService.getAddressById(id, userId);

    const transaction = await sequelize.transaction();
    try {
      // Unset all existing defaults
      await addresses.update(
        { is_default: false },
        { where: { user_id: userId }, transaction }
      );

      // Set the chosen address as default
      await address.update({ is_default: true }, { transaction });

      await transaction.commit();
      return address;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};

module.exports = AddressService;
