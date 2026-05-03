const { Models } = require('../models/dbModel');
const { NotFoundError } = require('../adapters/errorAdapter');

/**
 * Campaign Service for marketing campaigns
 */
const CampaignService = {
  /**
   * Create a new campaign
   */
  createCampaign: async (campaignData) => {
    const { campaigns } = await Models();
    return await campaigns.create(campaignData);
  },

  /**
   * Add products to a campaign
   */
  addProductsToCampaign: async (campaignId, productItems) => {
    const { campaign_products } = await Models();
    const items = productItems.map(item => ({
      campaign_id: campaignId,
      product_id: item.product_id,
      discount_override: item.discount_override,
      sort_order: item.sort_order
    }));
    return await campaign_products.bulkCreate(items);
  },

  /**
   * Get active campaigns
   */
  getActiveCampaigns: async () => {
    const { campaigns } = await Models();
    const now = new Date();
    return await campaigns.findAll({
      where: {
        is_active: true,
        // start_date <= now <= end_date logic can be added here
      }
    });
  },

  /**
   * Get campaign details with products
   */
  getCampaignDetails: async (slug) => {
    const { campaigns, products } = await Models();
    const campaign = await campaigns.findOne({
      where: { slug },
      include: [{ model: products }]
    });
    if (!campaign) throw new NotFoundError('Campaign not found');
    return campaign;
  }
};

module.exports = CampaignService;
