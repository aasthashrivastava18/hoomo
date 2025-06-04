// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const { protect, vendor, admin } = require('../middleware/authMiddleware');
// const { uploadSingle } = require('../middleware/uploadMiddleware');


// // Public routes
// router.get('/', productController.getAllProducts);
// router.get('/categories', productController.getProductCategories);
// router.get('/:id', productController.getProductById);
// // Public routes
// router.get('/', productController.getAllProducts);
// router.get('/categories', productController.getProductCategories);

// // ADD THESE 3 LINES AFTER LINE 8:
// router.get('/featured', productController.getFeaturedProducts);
// router.get('/trending', productController.getTrendingProducts);
// router.get('/popular', productController.getPopularProducts);

// // Dynamic route should come LAST
// router.get('/:id', productController.getProductById);
// // Vendor routes
// router.use('/vendor', protect, vendor);
// router.get('/vendor/items', productController.getVendorProducts);
// router.post(
//   '/vendor/create',
//   uploadSingle('image'),
//   productController.createProduct
// );
// router.put(
//   '/vendor/:id',
//   uploadSingle('image'),
//   productController.updateProduct
// );
// router.delete('/vendor/:id', productController.deleteProduct);

// // Admin routes
// router.get('/admin/low-stock', protect, admin, productController.getLowStockProducts);

// module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, vendor, admin } = require('../middleware/authMiddleware');
const { uploadSingle } = require('../middleware/uploadMiddleware');

// SPECIFIC ROUTES FIRST (ORDER MATTERS!)
router.get('/featured', productController.getFeaturedProducts);
router.get('/trending', productController.getTrendingProducts);
router.get('/popular', productController.getPopularProducts);
router.get('/categories', productController.getProductCategories);

// GENERAL ROUTES
router.get('/', productController.getAllProducts);

// DYNAMIC ROUTE MUST BE LAST
router.get('/:id', productController.getProductById);

// Vendor routes
router.use('/vendor', protect, vendor);
router.get('/vendor/items', productController.getVendorProducts);
router.post(
  '/vendor/create',
  uploadSingle('image'),
  productController.createProduct
);
router.put(
  '/vendor/:id',
  uploadSingle('image'),
  productController.updateProduct
);
router.delete('/vendor/:id', productController.deleteProduct);

// Admin routes
router.get('/admin/low-stock', protect, admin, productController.getLowStockProducts);

module.exports = router;
