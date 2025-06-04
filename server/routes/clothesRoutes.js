// const express = require('express');
// const router = express.Router();
// const clothesController = require('../controllers/clothesController');
// const { protect, vendor } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

// // Public routes
// router.get('/', clothesController.getAllClothes);
// router.get('/filters', clothesController.getClothesFilters);
// router.get('/:id', clothesController.getClothesById);

// // Vendor routes
// router.use('/vendor', protect, vendor);
// router.get('/vendor/items', clothesController.getVendorClothes);
// router.post(
//   '/vendor/create',
//   upload.array('images', 5),
//   clothesController.createClothes
// );
// router.put(
//   '/vendor/:id',
//   upload.array('images', 5),
//   clothesController.updateClothes
// );
// router.delete('/vendor/:id', clothesController.deleteClothes);
// router.put('/vendor/:id/remove-image', clothesController.removeClothesImage);

// module.exports = router;
const express = require('express');
const router = express.Router();
const clothesController = require('../controllers/clothesController');
const { protect, admin } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', clothesController.getAllClothes);
// Add other public routes...

// Admin routes
router.post(
  '/',
  protect,
  admin,
  uploadMiddleware.uploadMultiple('clothesImages', 5),
  uploadMiddleware.handleUploadError,
  uploadMiddleware.cleanupOnError,
  clothesController.createClothes
);
// Add other admin routes...

module.exports = router;
