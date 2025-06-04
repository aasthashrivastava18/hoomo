// const express = require('express');
// const router = express.Router();
// const vendorController = require('../controllers/vendorController');
// const { protect, vendor, admin } = require('../middleware/authMiddleware');

// // Admin routes
// router.get('/all', protect, admin, vendorController.getAllVendors);
// router.put('/:id/verify', protect, admin, vendorController.verifyVendor);
// router.put('/:id/block', protect, admin, vendorController.blockVendor);

// // Vendor routes
// router.use('/dashboard', protect, vendor);
// router.get('/dashboard/stats', vendorController.getDashboardStats);
// router.get('/dashboard/sales', vendorController.getSalesAnalytics);
// router.get('/dashboard/inventory', vendorController.getInventoryStatus);
// router.get('/dashboard/orders', vendorController.getRecentOrders);

// // Vendor profile
// router.get('/profile', protect, vendor, vendorController.getVendorProfile);
// router.put('/profile', protect, vendor, vendorController.updateVendorProfile);
// router.put('/business', protect, vendor, vendorController.updateBusinessDetails);

// module.exports = router;
const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect, vendor, admin } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Dashboard routes
router.get('/dashboard', protect, vendor, vendorController.getDashboardData);

// Profile routes
router.get('/profile', protect, vendor, vendorController.getVendorProfile);
router.put(
  '/profile', 
  protect, 
  vendor, 
  uploadMiddleware.uploadSingle('profileImage'),
  uploadMiddleware.handleUploadError,
  uploadMiddleware.cleanupOnError,
  vendorController.updateVendorProfile
);

// Order management
router.get('/orders', protect, vendor, vendorController.getVendorOrders);
router.put('/orders/:orderId/status', protect, vendor, vendorController.updateOrderStatus);

// Analytics and reports
router.get('/sales-report', protect, vendor, vendorController.getSalesReport);
router.get('/inventory', protect, vendor, vendorController.getInventoryStatus);
router.get('/earnings', protect, vendor, vendorController.getVendorEarnings);
router.get('/reviews', protect, vendor, vendorController.getVendorReviews);
router.post('/reviews/:reviewId/respond', protect, vendor, vendorController.respondToReview);

// Restaurant management
router.get('/restaurant', protect, vendor, vendorController.getVendorRestaurant);
router.post(
  '/restaurant', 
  protect, 
  vendor,
  uploadMiddleware.uploadFields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  uploadMiddleware.handleUploadError,
  uploadMiddleware.cleanupOnError,
  vendorController.createRestaurant
);
router.put(
  '/restaurant', 
  protect, 
  vendor,
  uploadMiddleware.uploadFields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  uploadMiddleware.handleUploadError,
  uploadMiddleware.cleanupOnError,
  vendorController.updateRestaurant
);

// Menu management
router.post(
  '/restaurant/menu', 
  protect, 
  vendor,
  uploadMiddleware.uploadSingle('menuItemImage'),
  uploadMiddleware.handleUploadError,
  uploadMiddleware.cleanupOnError,
  vendorController.addMenuItem
);
router.put(
  '/restaurant/menu/:menuItemId', 
  protect, 
  vendor,
  uploadMiddleware.uploadSingle('menuItemImage'),
  uploadMiddleware.handleUploadError,
  uploadMiddleware.cleanupOnError,
  vendorController.updateMenuItem
);
router.delete('/restaurant/menu/:menuItemId', protect, vendor, vendorController.deleteMenuItem);

// Menu category management
router.post('/restaurant/categories', protect, vendor, vendorController.createMenuCategory);
router.put('/restaurant/categories/:categoryId', protect, vendor, vendorController.updateMenuCategory);
router.delete('/restaurant/categories/:categoryId', protect, vendor, vendorController.deleteMenuCategory);

module.exports = router;

