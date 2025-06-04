const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require admin authentication
router.use(protect, admin);

// Dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// Vendor management
router.get('/vendors/requests', adminController.getVendorRequests);
router.put('/vendors/approve/:id', adminController.approveVendor);
router.delete('/vendors/reject/:id', adminController.rejectVendor);

// Stock management
router.get('/stock/low', adminController.getLowStockProducts);
router.put('/stock/update', adminController.updateProductStock);

// Analytics
router.get('/analytics/sales', adminController.getSalesAnalytics);

module.exports = router;
