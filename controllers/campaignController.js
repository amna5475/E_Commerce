const CampaignService = require('../services/campaignService');
const ResponseHelper = require('../helpers/responseHelper');

/**
 * Campaign Controller for handling campaign requests
 */
const CampaignController = {
  /**
   * Create a new campaign (Admin)
   */
  create: async (req, res, next) => {
    try {
      const campaign = await CampaignService.createCampaign(req.body);
      return ResponseHelper.success(res, 'Campaign created successfully', campaign, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add products to campaign (Admin)
   */
  addProducts: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await CampaignService.addProductsToCampaign(id, req.body.products);
      return ResponseHelper.success(res, 'Products added to campaign successfully', result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all active campaigns
   */
  getActive: async (req, res, next) => {
    try {
      const campaigns = await CampaignService.getActiveCampaigns();
      return ResponseHelper.success(res, 'Campaigns retrieved successfully', campaigns);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get campaign by slug
   */
  getBySlug: async (req, res, next) => {
    try {
      const { slug } = req.params;
      const campaign = await CampaignService.getCampaignDetails(slug);
      return ResponseHelper.success(res, 'Campaign details retrieved successfully', campaign);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = CampaignController;
