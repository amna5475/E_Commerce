const express = require('express');
const router = express.Router();
const apiRoutes = require('./ApiRoutes');

/* Root Route */
router.get('/', (req, res) => {
  res.render('index', { title: 'E-commerce API' });
});

/* API Routes */
router.use('/api', apiRoutes);

module.exports = router;
