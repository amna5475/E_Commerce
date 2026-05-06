/**
 * Quick Seeder Script to populate essential data for testing
 * Run this with: node scripts/seed.js
 */
const { Models } = require('../models/dbModel');

const seed = async () => {
  try {
    const { categories, brands } = await Models();

    console.log('Seeding Categories...');
    await categories.bulkCreate([
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Fashion', slug: 'fashion' },
      { name: 'Home & Living', slug: 'home-living' }
    ], { ignoreDuplicates: true });

    console.log('Seeding Brands...');
    await brands.bulkCreate([
      { name: 'Samsung', slug: 'samsung' },
      { name: 'Apple', slug: 'apple' },
      { name: 'Nike', slug: 'nike' }
    ], { ignoreDuplicates: true });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
