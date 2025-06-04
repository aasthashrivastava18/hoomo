// const express = require('express');
// const router = express.Router();
// const restaurantController = require('../controllers/restaurantController');
// const { protect } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

// // Public routes
// router.get('/', restaurantController.getAllRestaurants);
// router.get('/cuisines', restaurantController.getCuisines);

// // Individual restaurant routes
// router.get('/:id', restaurantController.getRestaurantById);
// router.get('/:id/menu', restaurantController.getRestaurantMenu);
// router.get('/:id/menu/:itemId', restaurantController.getMenuItemById);
//  router.get('/:id/reviews', restaurantController.getRestaurantReviews);

// // Protected routes (require authentication)
// // router.post('/:id/reviews', protect, upload.single('image'), restaurantController.createRestaurantReview);

// module.exports = router;


const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/cuisines', restaurantController.getCuisines);

// Individual restaurant routes
router.get('/:id', restaurantController.getRestaurantById);
router.get('/:id/menu', restaurantController.getRestaurantMenu);
router.get('/:id/menu/:itemId', restaurantController.getMenuItemById);
router.get('/:id/reviews', restaurantController.getRestaurantReviews);

// Protected routes (require authentication)
router.post(
  '/:id/reviews', 
  protect, 
  uploadMiddleware.uploadSingle('reviewImage'), 
  uploadMiddleware.handleUploadError,
  uploadMiddleware.cleanupOnError,
  restaurantController.createRestaurantReview
);

module.exports = router;
