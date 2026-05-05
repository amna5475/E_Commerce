const express = require('express');
const router = express.Router();

// Controllers
const AuthController = require('../controllers/authController');
const ProductController = require('../controllers/productController');
const CategoryController = require('../controllers/categoryController');
const BrandController = require('../controllers/brandController');
const OrderController = require('../controllers/orderController');
const PaymentController = require('../controllers/paymentController');
const ShipmentController = require('../controllers/shipmentController');
const SellerController = require('../controllers/sellerController');
const WalletController = require('../controllers/walletController');
const CampaignController = require('../controllers/campaignController');
const ReviewController = require('../controllers/reviewController');
const NotificationController = require('../controllers/notificationController');
const ReturnController = require('../controllers/returnController');
const VoucherController = require('../controllers/voucherController');
const SettlementController = require('../controllers/settlementController');

// Middleware
const validate = require('../middleware/validation');
const { authMiddleware, authorize } = require('../middleware/auth');

// Validation Rules
const registerRules = {
  full_name: 'required|string|min:3',
  email: 'required|email',
  password: 'required|string|min:6',
  phone: 'required|string',
  role: 'string|in:customer,seller,seller_staff,admin'
};

const loginRules = {
  email: 'required|email',
  password: 'required|string'
};

const productRules = {
  title: 'required|string',
  base_price: 'required|numeric',
  seller_id: 'required|string',
  category_id: 'required|string',
  brand_id: 'required|string'
};

const sellerRegisterRules = {
  shop_name: 'required|string|min:3',
  description: 'string',
  ntn_number: 'required|string',
  bank_name: 'required|string',
  bank_account: 'required|string',
  bank_iban: 'required|string',
  ntn_doc_url: 'required|string',
  id_card_doc_url: 'required|string'
};

const staffRegisterRules = {
  full_name: 'required|string|min:3',
  email: 'required|email',
  password: 'required|string|min:6',
  phone: 'required|string'
};

/**
 * Health Check
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

/**
 * Auth Routes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, email, password, phone]
 *             properties:
 *               full_name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *               role: { type: string, enum: [customer, seller] }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/auth/register', validate(registerRules), AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/auth/login', validate(loginRules), AuthController.login);

/**
 * Product Routes
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product (Seller/Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, base_price, category_id, brand_id]
 *             properties:
 *               title: { type: string }
 *               base_price: { type: number }
 *               category_id: { type: string }
 *               brand_id: { type: string }
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/products', authMiddleware, authorize(['admin', 'seller']), validate(productRules), ProductController.create);
router.get('/products', ProductController.getAll);
router.get('/products/my-products', authMiddleware, authorize(['seller', 'seller_staff']), ProductController.getMyProducts);
router.get('/products/:id', ProductController.getById);
router.post('/products/:id/ask', authMiddleware, ProductController.askQuestion);
router.post('/products/questions/:questionId/answer', authMiddleware, authorize(['seller', 'seller_staff']), ProductController.answerQuestion);
router.put('/products/:id', authMiddleware, authorize(['seller', 'admin', 'seller_staff']), ProductController.update);
router.delete('/products/:id', authMiddleware, authorize(['seller', 'admin']), ProductController.delete);

/**
 * Category Routes
 */
router.post('/categories', authMiddleware, authorize(['admin']), CategoryController.create);
router.get('/categories', CategoryController.getAll);
router.get('/categories/:id', CategoryController.getById);
router.put('/categories/:id', authMiddleware, authorize(['admin']), CategoryController.update);
router.delete('/categories/:id', authMiddleware, authorize(['admin']), CategoryController.delete);

/**
 * Brand Routes
 */
router.post('/brands', authMiddleware, authorize(['admin']), BrandController.create);
router.get('/brands', BrandController.getAll);
router.get('/brands/:id', BrandController.getById);
router.put('/brands/:id', authMiddleware, authorize(['admin']), BrandController.update);
router.delete('/brands/:id', authMiddleware, authorize(['admin']), BrandController.delete);

/**
 * Order Routes
 */
router.post('/orders', authMiddleware, OrderController.placeOrder);
router.get('/orders/my-orders', authMiddleware, OrderController.getUserOrders);
router.get('/orders/seller-orders', authMiddleware, authorize(['seller', 'seller_staff']), OrderController.getSellerOrders);
router.get('/orders/:id', authMiddleware, OrderController.getOrderById);
router.put('/orders/:id/status', authMiddleware, authorize(['seller', 'admin', 'seller_staff']), OrderController.updateStatus);

/**
 * Payment Routes
 */
router.post('/payments/initialize', authMiddleware, PaymentController.initialize);
router.post('/payments/process', PaymentController.process);
router.get('/payments/order/:orderId', authMiddleware, PaymentController.getByOrderId);

/**
 * Shipment Routes
 */
router.post('/shipments', authMiddleware, authorize(['seller', 'seller_staff']), ShipmentController.create);
router.put('/shipments/:id/status', authMiddleware, authorize(['seller', 'admin', 'seller_staff']), ShipmentController.updateStatus);
router.get('/shipments/order/:orderId', authMiddleware, ShipmentController.getByOrderId);
router.get('/shipments/:id/events', authMiddleware, ShipmentController.getEvents);

/**
 * Seller Routes
 */
router.post('/sellers/register', authMiddleware, validate(sellerRegisterRules), SellerController.register);
router.get('/sellers', authMiddleware, authorize(['admin']), SellerController.getAll);
router.get('/sellers/my-profile', authMiddleware, authorize(['seller', 'seller_staff']), SellerController.getMyProfile);
router.get('/sellers/my-staff', authMiddleware, authorize(['seller']), SellerController.getMyStaff);
router.post('/sellers/sub-users', authMiddleware, authorize(['seller']), validate(staffRegisterRules), SellerController.addSubUser);
router.post('/sellers/:id/follow', authMiddleware, SellerController.follow);
router.delete('/sellers/:id/follow', authMiddleware, SellerController.unfollow);
router.get('/sellers/:id', SellerController.getById);
router.put('/sellers/:id/approve', authMiddleware, authorize(['admin']), SellerController.approve);
router.put('/sellers/:id/reject', authMiddleware, authorize(['admin']), SellerController.reject);

/**
 * Wallet Routes
 */
router.get('/wallet/me', authMiddleware, WalletController.getMine);
router.get('/wallet/transactions', authMiddleware, WalletController.getTransactions);

/**
 * Campaign Routes
 */
router.post('/campaigns', authMiddleware, authorize(['admin']), CampaignController.create);
router.post('/campaigns/:id/products', authMiddleware, authorize(['admin']), CampaignController.addProducts);
router.get('/campaigns/active', CampaignController.getActive);
router.get('/campaigns/:slug', CampaignController.getBySlug);

/**
 * Review Routes
 */
router.post('/reviews', authMiddleware, ReviewController.create);
router.get('/reviews/product/:productId', ReviewController.getProductReviews);

/**
 * Notification Routes
 */
router.get('/notifications/me', authMiddleware, NotificationController.getMine);
router.put('/notifications/:id/read', authMiddleware, NotificationController.read);

/**
 * Return Routes
 */
router.post('/returns', authMiddleware, ReturnController.create);
router.put('/returns/:id/process', authMiddleware, authorize(['admin', 'seller']), ReturnController.process);

/**
 * Voucher Routes
 */
router.post('/vouchers', authMiddleware, authorize(['admin', 'seller']), VoucherController.create);
router.post('/vouchers/validate', authMiddleware, VoucherController.validate);

/**
 * Settlement Routes
 */
router.get('/settlements/me', authMiddleware, authorize(['seller']), SettlementController.getMine);
router.post('/settlements', authMiddleware, authorize(['admin']), SettlementController.create);

module.exports = router;
