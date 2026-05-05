const express = require('express');
const router = express.Router();
const apiRoutes = require('./ApiRoutes');

/* Root Route */
router.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the E-commerce Marketplace API',
    documentation: '/api-docs',
    status: 'Running'
  });
});

/* API Routes */
router.use('/api', apiRoutes);

module.exports = router;
