// const Restaurant = require('../models/RestaurantModel');
// const Review = require('../models/ReviewModel');
// const Order = require('../models/OrderModel');
// const User = require('../models/UserModel');
// const cloudinary = require('../config/cloudinaryConfig');
// const fs = require('fs');
// const mongoose = require('mongoose');

// // Get all restaurants with filtering, sorting, and pagination
// exports.getAllRestaurants = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       sort = 'ratings.average',
//       order = 'desc',
//       cuisine,
//       priceRange,
//       isOpen,
//       search,
//       minRating,
//       deliveryTime,
//       location
//     } = req.query;

//     // Build filter object
//     const filter = {};

//     // Search by name or description
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { description: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Filter by cuisine
//     if (cuisine) {
//       filter.cuisines = { $in: cuisine.split(',') };
//     }

//     // Filter by price range
//     if (priceRange) {
//       filter.priceRange = { $in: priceRange.split(',') };
//     }

//     // Filter by open status
//     if (isOpen === 'true') {
//       filter.isOpen = true;
//     }

//     // Filter by minimum rating
//     if (minRating) {
//       filter['ratings.average'] = { $gte: Number(minRating) };
//     }

//     // Filter by delivery time
//     if (deliveryTime) {
//       filter.deliveryTime = { $lte: Number(deliveryTime) };
//     }

//     // Filter by location (city)
//     if (location) {
//       filter['address.city'] = { $regex: location, $options: 'i' };
//     }

//     // Calculate pagination
//     const skip = (Number(page) - 1) * Number(limit);

//     // Determine sort order
//     const sortOptions = {};
//     sortOptions[sort] = order === 'asc' ? 1 : -1;

//     // Get restaurants
//     const restaurants = await Restaurant.find(filter)
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(Number(limit))
//       .select('-menu.customizationOptions -menu.nutritionalInfo -openingHours');

//     // Get total count
//     const totalRestaurants = await Restaurant.countDocuments(filter);

//     res.json({
//       restaurants,
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalRestaurants / Number(limit)),
//       totalRestaurants
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get restaurant by ID
// exports.getRestaurantById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Get restaurant reviews
//     const reviews = await Review.find({ 
//       item: restaurant._id,
//       itemType: 'restaurant'
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'name profileImage');

//     // Get popular menu items (based on orders)
//     const popularMenuItems = await Order.aggregate([
//       // Match orders with items from this restaurant
//       { $match: { 'items.restaurantId': mongoose.Types.ObjectId(id) } },
//       // Unwind items array
//       { $unwind: '$items' },
//       // Match only items from this restaurant
//       { $match: { 'items.restaurantId': mongoose.Types.ObjectId(id) } },
//       // Group by menu item ID
//       { 
//         $group: { 
//           _id: '$items.itemId', 
//           count: { $sum: '$items.quantity' },
//           name: { $first: '$items.name' },
//           price: { $first: '$items.price' },
//           image: { $first: '$items.image' }
//         } 
//       },
//       // Sort by count
//       { $sort: { count: -1 } },
//       // Limit to top 5
//       { $limit: 5 }
//     ]);

//     // Combine restaurant data with reviews and popular items
//     const restaurantData = {
//       ...restaurant.toObject(),
//       reviews,
//       popularItems: popularMenuItems
//     };

//     res.json(restaurantData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get restaurant menu
// exports.getRestaurantMenu = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category } = req.query;

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Filter menu by category if provided
//     let menu = restaurant.menu;
//     if (category) {
//       menu = menu.filter(item => item.category === category);
//     }

//     // Group menu items by category
//     const menuByCategory = {};
//     menu.forEach(item => {
//       if (!menuByCategory[item.category]) {
//         menuByCategory[item.category] = [];
//       }
//       menuByCategory[item.category].push(item);
//     });

//     // Get all categories
//     const categories = restaurant.menuCategories;

//     res.json({
//       restaurantId: restaurant._id,
//       restaurantName: restaurant.name,
//       menuByCategory,
//       categories
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get menu item by ID
// exports.getMenuItemById = async (req, res) => {
//   try {
//     const { id, itemId } = req.params;

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     const menuItem = restaurant.menu.id(itemId);

//     if (!menuItem) {
//       return res.status(404).json({ message: 'Menu item not found' });
//     }

//     // Get menu item reviews
//     const reviews = await Review.find({ 
//       item: itemId,
//       itemType: 'menuItem'
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'name profileImage');

//     // Combine menu item data with reviews
//     const menuItemData = {
//       ...menuItem.toObject(),
//       restaurantId: restaurant._id,
//       restaurantName: restaurant.name,
//       reviews
//     };

//     res.json(menuItemData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get restaurant reviews
// exports.getRestaurantReviews = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;

//     // Verify restaurant exists
//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Calculate pagination
//     const skip = (Number(page) - 1) * Number(limit);

//     // Determine sort order
//     const sortOptions = {};
//     sortOptions[sort] = order === 'asc' ? 1 : -1;

//     // Get reviews
//     const reviews = await Review.find({ 
//       item: restaurant._id,
//       itemType: 'restaurant'
//     })
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(Number(limit))
//       .populate('user', 'name profileImage');

//     // Get total count
//     const totalReviews = await Review.countDocuments({ 
//       item: restaurant._id,
//       itemType: 'restaurant'
//     });

//     // Group ratings by star count
//     const ratingCounts = {
//       1: await Review.countDocuments({ item: restaurant._id, itemType: 'restaurant', rating: 1 }),
//       2: await Review.countDocuments({ item: restaurant._id, itemType: 'restaurant', rating: 2 }),
//       3: await Review.countDocuments({ item: restaurant._id, itemType: 'restaurant', rating: 3 }),
//       4: await Review.countDocuments({ item: restaurant._id, itemType: 'restaurant', rating: 4 }),
//       5: await Review.countDocuments({ item: restaurant._id, itemType: 'restaurant', rating: 5 })
//     };

//     res.json({
//       reviews,
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalReviews / Number(limit)),
//       totalReviews,
//       averageRating: restaurant.ratings.average,
//       ratingCounts
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create restaurant review
// exports.createRestaurantReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { rating, comment } = req.body;
//     const userId = req.user.id;

//     // Verify restaurant exists
//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Check if user has ordered from this restaurant
//     const hasOrdered = await Order.exists({
//       user: userId,
//       'items.restaurantId': id,
//       orderStatus: 'delivered'
//     });

//     if (!hasOrdered && process.env.NODE_ENV === 'production') {
//       return res.status(403).json({ 
//         message: 'You can only review restaurants you have ordered from' 
//       });
//     }

//     // Check if user has already reviewed this restaurant
//     const existingReview = await Review.findOne({
//       user: userId,
//       item: restaurant._id,
//       itemType: 'restaurant'
//     });

//     if (existingReview) {
//       return res.status(400).json({ 
//         message: 'You have already reviewed this restaurant' 
//       });
//     }

//     // Upload images if provided
//     let imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path, {
//           folder: 'reviews'
//         });
//         imageUrls.push(result.secure_url);
//         fs.unlinkSync(file.path);
//       }
//     }

//     // Create review
//     const review = new Review({
//       user: userId,
//       item: restaurant._id,
//       itemType: 'restaurant',
//       rating: Number(rating),
//       comment,
//       images: imageUrls
//     });

//     await review.save();

//     // Update restaurant rating
//     const allReviews = await Review.find({ 
//       item: restaurant._id,
//       itemType: 'restaurant'
//     });

//     const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
//     const reviewCount = allReviews.length;

//     restaurant.ratings = {
//       average: averageRating,
//       count: reviewCount
//     };

//     await restaurant.save();

//     // Populate user data
//     await review.populate('user', 'name profileImage');

//     res.status(201).json(review);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create menu item review
// exports.createMenuItemReview = async (req, res) => {
//   try {
//     const { id, itemId } = req.params;
//     const { rating, comment } = req.body;
//     const userId = req.user.id;

//     // Verify restaurant and menu item exist
//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     const menuItem = restaurant.menu.id(itemId);

//     if (!menuItem) {
//       return res.status(404).json({ message: 'Menu item not found' });
//     }

//     // Check if user has ordered this menu item
//     const hasOrdered = await Order.exists({
//       user: userId,
//       'items.itemId': itemId,
//       orderStatus: 'delivered'
//     });

//     if (!hasOrdered && process.env.NODE_ENV === 'production') {
//       return res.status(403).json({ 
//         message: 'You can only review menu items you have ordered' 
//       });
//     }

//     // Check if user has already reviewed this menu item
//     const existingReview = await Review.findOne({
//       user: userId,
//       item: itemId,
//       itemType: 'menuItem'
//     });

//     if (existingReview) {
//       return res.status(400).json({ 
//         message: 'You have already reviewed this menu item' 
//       });
//     }

//     // Upload images if provided
//     let imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const result = await cloudinary.uploader.upload(file.path, {
//           folder: 'reviews'
//         });
//         imageUrls.push(result.secure_url);
//         fs.unlinkSync(file.path);
//       }
//     }

//     // Create review
//     const review = new Review({
//       user: userId,
//       item: itemId,
//       itemType: 'menuItem',
//       rating: Number(rating),
//       comment,
//       images: imageUrls
//     });

//     await review.save();

//     // Update menu item rating
//     const allReviews = await Review.find({ 
//       item: itemId,
//       itemType: 'menuItem'
//     });

//     const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
//     const reviewCount = allReviews.length;

//     menuItem.ratings = {
//       average: averageRating,
//       count: reviewCount
//     };

//     await restaurant.save();

//     // Populate user data
//     await review.populate('user', 'name profileImage');

//     res.status(201).json(review);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get nearby restaurants
// exports.getNearbyRestaurants = async (req, res) => {
//   try {
//     const { latitude, longitude, radius = 5 } = req.query; // radius in kilometers

//     if (!latitude || !longitude) {
//       return res.status(400).json({ message: 'Latitude and longitude are required' });
//     }

//     // Find restaurants with geospatial query
//     const restaurants = await Restaurant.find({
//       'location': {
//         $near: {
//           $geometry: {
//             type: 'Point',
//             coordinates: [parseFloat(longitude), parseFloat(latitude)]
//           },
//           $maxDistance: parseInt(radius) * 1000 // convert km to meters
//         }
//       }
//     })
//     .limit(10)
//     .select('name address location ratings logo coverImage cuisines priceRange deliveryTime');

//     res.json(restaurants);
//   } catch (error) {
//         res.status(500).json({ message: error.message });
//   }
// };

// // Get featured restaurants
// exports.getFeaturedRestaurants = async (req, res) => {
//   try {
//     // Get restaurants with high ratings and review count
//     const featuredRestaurants = await Restaurant.find({
//       'ratings.average': { $gte: 4.0 },
//       'ratings.count': { $gte: 10 },
//       isOpen: true
//     })
//     .sort({ 'ratings.average': -1 })
//     .limit(6)
//     .select('name address ratings logo coverImage cuisines priceRange deliveryTime');

//     res.json(featuredRestaurants);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get popular cuisines
// exports.getPopularCuisines = async (req, res) => {
//   try {
//     // Aggregate restaurants by cuisine and count
//     const cuisines = await Restaurant.aggregate([
//       // Unwind cuisines array
//       { $unwind: '$cuisines' },
//       // Group by cuisine and count restaurants
//       { 
//         $group: { 
//           _id: '$cuisines', 
//           count: { $sum: 1 },
//           averageRating: { $avg: '$ratings.average' }
//         } 
//       },
//       // Filter cuisines with at least 2 restaurants
//       { $match: { count: { $gte: 2 } } },
//       // Sort by count and rating
//       { $sort: { count: -1, averageRating: -1 } },
//       // Limit to top 10
//       { $limit: 10 },
//       // Project final fields
//       { 
//         $project: { 
//           _id: 0,
//           name: '$_id',
//           count: 1,
//           averageRating: 1
//         } 
//       }
//     ]);

//     res.json(cuisines);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Search restaurants
// exports.searchRestaurants = async (req, res) => {
//   try {
//     const { query, page = 1, limit = 10 } = req.query;

//     if (!query) {
//       return res.status(400).json({ message: 'Search query is required' });
//     }

//     // Calculate pagination
//     const skip = (Number(page) - 1) * Number(limit);

//     // Search restaurants by name, description, or cuisines
//     const restaurants = await Restaurant.find({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//         { cuisines: { $regex: query, $options: 'i' } }
//       ]
//     })
//     .sort({ 'ratings.average': -1 })
//     .skip(skip)
//     .limit(Number(limit))
//     .select('name address ratings logo coverImage cuisines priceRange deliveryTime');

//     // Search menu items
//     const restaurantsWithMatchingItems = await Restaurant.find({
//       'menu.name': { $regex: query, $options: 'i' }
//     })
//     .select('name address ratings logo coverImage cuisines priceRange deliveryTime menu.$');

//     // Filter out duplicates
//     const allRestaurantIds = new Set(restaurants.map(r => r._id.toString()));
//     const uniqueRestaurantsWithItems = restaurantsWithMatchingItems.filter(
//       r => !allRestaurantIds.has(r._id.toString())
//     );

//     // Combine results
//     const combinedResults = [
//       ...restaurants,
//       ...uniqueRestaurantsWithItems
//     ];

//     // Get total count
//     const totalRestaurants = await Restaurant.countDocuments({
//       $or: [
//         { name: { $regex: query, $options: 'i' } },
//         { description: { $regex: query, $options: 'i' } },
//         { cuisines: { $regex: query, $options: 'i' } },
//         { 'menu.name': { $regex: query, $options: 'i' } }
//       ]
//     });

//     res.json({
//       restaurants: combinedResults,
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalRestaurants / Number(limit)),
//       totalResults: totalRestaurants
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get restaurant by slug
// exports.getRestaurantBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const restaurant = await Restaurant.findOne({ slug });

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Get restaurant reviews
//     const reviews = await Review.find({ 
//       item: restaurant._id,
//       itemType: 'restaurant'
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate('user', 'name profileImage');

//     // Combine restaurant data with reviews
//     const restaurantData = {
//       ...restaurant.toObject(),
//       reviews
//     };

//     res.json(restaurantData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Check if restaurant is open
// exports.checkRestaurantOpen = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Check if restaurant is marked as open
//     if (!restaurant.isOpen) {
//       return res.json({ isOpen: false, message: 'Restaurant is currently closed' });
//     }

//     // Check opening hours
//     const now = new Date();
//     const dayOfWeek = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
//     const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes since midnight

//     const todayHours = restaurant.openingHours[dayOfWeek];

//     if (!todayHours || !todayHours.open) {
//       return res.json({ isOpen: false, message: 'Restaurant is closed today' });
//     }

//     // Parse opening and closing times
//     const [openHour, openMinute] = todayHours.openTime.split(':').map(Number);
//     const [closeHour, closeMinute] = todayHours.closeTime.split(':').map(Number);

//     const openingTime = openHour * 60 + openMinute;
//     const closingTime = closeHour * 60 + closeMinute;

//     const isOpen = currentTime >= openingTime && currentTime <= closingTime;

//     if (isOpen) {
//       return res.json({ 
//         isOpen: true, 
//         message: 'Restaurant is open',
//         closesAt: todayHours.closeTime
//       });
//     } else {
//       // Calculate next opening time
//       let nextOpenDay = dayOfWeek;
//       let nextOpeningHours = todayHours;
//       let daysChecked = 0;

//       // If we're past closing time, find the next open day
//       if (currentTime > closingTime) {
//         const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//         const currentDayIndex = daysOfWeek.indexOf(dayOfWeek);

//         let nextDayIndex = (currentDayIndex + 1) % 7;
//         while (daysChecked < 7) {
//           nextOpenDay = daysOfWeek[nextDayIndex];
//           nextOpeningHours = restaurant.openingHours[nextOpenDay];

//           if (nextOpeningHours && nextOpeningHours.open) {
//             break;
//           }

//           nextDayIndex = (nextDayIndex + 1) % 7;
//           daysChecked++;
//         }
//       }

//       return res.json({ 
//         isOpen: false, 
//         message: 'Restaurant is currently closed',
//         nextOpenDay: nextOpenDay,
//         nextOpenTime: nextOpeningHours.openTime
//       });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get restaurant menu categories
// exports.getRestaurantMenuCategories = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Get all categories
//     const categories = restaurant.menuCategories;

//     // Count items in each category
//     const categoriesWithCount = categories.map(category => {
//       const count = restaurant.menu.filter(item => item.category === category.name).length;
//       return {
//         ...category.toObject(),
//         itemCount: count
//       };
//     });

//     res.json(categoriesWithCount);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get restaurants by cuisine
// exports.getRestaurantsByCuisine = async (req, res) => {
//   try {
//     const { cuisine } = req.params;
//     const { page = 1, limit = 10 } = req.query;

//     // Calculate pagination
//     const skip = (Number(page) - 1) * Number(limit);

//     // Find restaurants with the specified cuisine
//     const restaurants = await Restaurant.find({
//       cuisines: { $regex: new RegExp(cuisine, 'i') }
//     })
//     .sort({ 'ratings.average': -1 })
//     .skip(skip)
//     .limit(Number(limit))
//     .select('name address ratings logo coverImage cuisines priceRange deliveryTime');

//     // Get total count
//     const totalRestaurants = await Restaurant.countDocuments({
//       cuisines: { $regex: new RegExp(cuisine, 'i') }
//     });

//     res.json({
//       restaurants,
//       cuisine,
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalRestaurants / Number(limit)),
//       totalRestaurants
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get top-rated restaurants
// exports.getTopRatedRestaurants = async (req, res) => {
//   try {
//     const { limit = 5 } = req.query;

//     // Get top-rated restaurants
//     const restaurants = await Restaurant.find({
//       'ratings.count': { $gte: 5 } // At least 5 reviews
//     })
//     .sort({ 'ratings.average': -1 })
//     .limit(Number(limit))
//     .select('name address ratings logo coverImage cuisines priceRange deliveryTime');

//     res.json(restaurants);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get new restaurants
// exports.getNewRestaurants = async (req, res) => {
//   try {
//     const { limit = 5 } = req.query;
    
//     // Get restaurants created in the last 30 days
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const restaurants = await Restaurant.find({
//       createdAt: { $gte: thirtyDaysAgo }
//     })
//     .sort({ createdAt: -1 })
//     .limit(Number(limit))
//     .select('name address ratings logo coverImage cuisines priceRange deliveryTime createdAt');

//     res.json(restaurants);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get restaurant special offers
// exports.getRestaurantOffers = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Get menu items with discounts
//     const discountedItems = restaurant.menu.filter(item => 
//       item.discountPrice && item.discountPrice < item.price
//     );

//     // Calculate discount percentage
//     const itemsWithDiscountPercentage = discountedItems.map(item => {
//       const discountPercentage = Math.round((1 - (item.discountPrice / item.price)) * 100);
//       return {
//         ...item.toObject(),
//         discountPercentage
//       };
//     });

//     // Sort by discount percentage
//     const sortedItems = itemsWithDiscountPercentage.sort((a, b) => 
//       b.discountPercentage - a.discountPercentage
//     );

//     res.json(sortedItems);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get similar restaurants
// exports.getSimilarRestaurants = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { limit = 4 } = req.query;

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ message: 'Restaurant not found' });
//     }

//     // Find restaurants with similar cuisines
//     const similarRestaurants = await Restaurant.find({
//       _id: { $ne: id }, // Exclude current restaurant
//       cuisines: { $in: restaurant.cuisines }
//     })
//     .sort({ 'ratings.average': -1 })
//     .limit(Number(limit))
//     .select('name address ratings logo coverImage cuisines priceRange deliveryTime');

//     res.json(similarRestaurants);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = exports;

const Restaurant = require('../models/RestaurantModel');
const Review = require('../models/ReviewModel');
const Order = require('../models/OrderModel');
const User = require('../models/UserModel');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItemModel'); // Make sure MenuItem model is required too

// Get all restaurants with filters
const getAllRestaurants = async (req, res) => {
  try {
    const {
      cuisine,
      priceRange,
      location,
      deliveryTime,
      isOpen,
      minRating,
      sort,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (cuisine) query.cuisines = { $in: [cuisine] };
    if (priceRange) query.priceRange = priceRange;
    if (location) query['address.city'] = location;
    if (deliveryTime) query.deliveryTime = { $lte: deliveryTime };
    if (isOpen !== undefined) query.isOpen = isOpen === 'true';
    if (minRating) query['ratings.average'] = { $gte: minRating };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find(query)
      .sort(sort ? sort : '-ratings.average')
      .skip(skip)
      .limit(parseInt(limit))
      .select('-menu -reviews');

    res.json({ total: restaurants.length, restaurants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get restaurant details by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const reviews = await Review.find({ item: req.params.id, itemType: 'restaurant' })
      .populate('user', 'name profilePic')
      .sort('-createdAt')
      .limit(5);

    const popularItems = await MenuItem.find({ restaurant: req.params.id })
      .sort('-orderCount')
      .limit(5);

    res.json({ ...restaurant.toObject(), topReviews: reviews, popularItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get menu of restaurant (optionally by category)
const getRestaurantMenu = async (req, res) => {
  try {
    const category = req.query.category;
    const match = { restaurant: req.params.id };
    if (category) match.category = category;

    const menu = await MenuItem.find(match).sort('category name');

    const grouped = {};
    menu.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get specific menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });

    const reviews = await Review.find({ item: req.params.itemId, itemType: 'menuItem' })
      .populate('user', 'name profilePic')
      .sort('-createdAt')
      .limit(5);

    res.json({ ...item.toObject(), reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get reviews of a restaurant with pagination and stats
const getRestaurantReviews = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ item: req.params.id, itemType: 'restaurant' })
      .populate('user', 'name profilePic')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ item: req.params.id, itemType: 'restaurant' });

    const all = await Review.find({ item: req.params.id, itemType: 'restaurant' });
    const stars = [0, 0, 0, 0, 0];
    all.forEach((r) => {
      stars[r.rating - 1]++;
    });

    const average = all.reduce((sum, r) => sum + r.rating, 0) / (all.length || 1);

    res.json({ reviews, total, average, stars: stars.reverse() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new review for restaurant
const createRestaurantReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const existingReview = await Review.findOne({
      item: req.params.id,
      user: req.user._id,
      itemType: 'restaurant'
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this restaurant' });
    }

    const hasOrdered = await Order.findOne({
      user: req.user._id,
      'items.restaurant': req.params.id
    });

    if (!hasOrdered) {
      return res.status(403).json({ message: 'You can only review restaurants you have ordered from' });
    }

    let imageUrl = null;
    // if (req.file) {
    //   const result = await cloudinary.v2.uploader.upload(req.file.path, {
    //     folder: 'reviews'
    //   });
    //   imageUrl = result.secure_url;
    // }

    const review = new Review({
      item: req.params.id,
      user: req.user._id,
      rating,
      comment,
      image: imageUrl,
      itemType: 'restaurant'
    });

    await review.save();

    // Update restaurant's average rating
    const allReviews = await Review.find({ item: restaurant._id, itemType: 'restaurant' });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    restaurant.ratings.average = avgRating;
    restaurant.ratings.count = allReviews.length;
    await restaurant.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Get distinct cuisines from restaurants collection
const getCuisines = async (req, res) => {
  try {
    const cuisines = await Restaurant.distinct('cuisines');
    res.json(cuisines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantMenu,
  getMenuItemById,
  getRestaurantReviews,
  createRestaurantReview,
   getCuisines,
};
