const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin, vendor, deliveryAgent } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, orderController.createOrder);
router.get('/user', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/cancel', protect, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', protect, admin, orderController.getAllOrders);

// Vendor routes
router.get('/vendor/items', protect, vendor, orderController.getVendorOrders);

// Admin and delivery agent routes
const adminOrDelivery = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'delivery') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized' });
  }
};

router.put('/:id/status', protect, adminOrDelivery, orderController.updateOrderStatus);
router.put('/:id/try-at-home', protect, adminOrDelivery, orderController.updateTryAtHomeStatus);

module.exports = router;
