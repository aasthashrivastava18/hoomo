const User = require('../models/UserModel');
const Product = require('../models/ProductModel');
const Clothes = require('../models/ClothesModel');
const Restaurant = require('../models/RestaurantModel');
const Order = require('../models/OrderModel');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');

// Get vendor dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    // Get today's orders
    const todayOrders = await Order.find({
      'items.vendor': vendorId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    // Get pending orders
    const pendingOrders = await Order.find({
      'items.vendor': vendorId,
      orderStatus: { $in: ['placed', 'confirmed', 'preparing'] }
    }).sort({ createdAt: -1 }).limit(10);
    
    // Calculate revenue
    const allOrders = await Order.find({ 'items.vendor': vendorId });
    let totalRevenue = 0;
    let todayRevenue = 0;
    
    // Calculate total and today's revenue
    allOrders.forEach(order => {
      const vendorItems = order.items.filter(item => 
        item.vendor && item.vendor.toString() === vendorId
      );
      
      const orderRevenue = vendorItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      totalRevenue += orderRevenue;
      
      if (order.createdAt >= startOfDay && order.createdAt <= endOfDay) {
        todayRevenue += orderRevenue;
      }
    });
    
    // Get product counts
    const groceryCount = await Product.countDocuments({ vendor: vendorId });
    const clothesCount = await Clothes.countDocuments({ vendor: vendorId });
    
    // Get restaurant data if vendor has a restaurant
    let restaurantData = null;
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    if (restaurant) {
      const menuItemCount = restaurant.menu.length;
      restaurantData = {
        id: restaurant._id,
        name: restaurant.name,
        menuItemCount,
        ratings: restaurant.ratings
      };
    }
    
    // Get low stock products
    const lowStockProducts = await Product.find({
      vendor: vendorId,
      $expr: { $lte: ["$stock", "$stockThreshold"] }
    }).limit(5);
    
    const lowStockClothes = await Clothes.find({
      vendor: vendorId,
      $expr: { $lte: ["$stock", "$stockThreshold"] }
    }).limit(5);
    
    // Get recent orders
    const recentOrders = await Order.find({ 'items.vendor': vendorId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');
    
    res.json({
      orderStats: {
        todayOrders: todayOrders.length,
        pendingOrders: pendingOrders.length,
        totalOrders: allOrders.length
      },
      revenue: {
        today: todayRevenue,
        total: totalRevenue
      },
      productStats: {
        groceryCount,
        clothesCount,
        restaurantData
      },
      lowStock: {
        products: lowStockProducts,
        clothes: lowStockClothes
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor profile
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.user.id).select('-password');
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update vendor profile
exports.updateVendorProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      contactPhone,
      address,
      businessName,
      businessDescription,
      businessCategory,
      taxId,
      bankDetails
    } = req.body;
    
    // Find vendor
    const vendor = await User.findById(req.user.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    // Upload profile image if provided
    let profileImageUrl = vendor.profileImage;
    if (req.file) {
      // Delete old image if exists
      if (vendor.profileImage) {
        const publicId = vendor.profileImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`profiles/${publicId}`);
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profiles'
      });
      profileImageUrl = result.secure_url;
      
      // Delete local file
      fs.unlinkSync(req.file.path);
    }
    
    // Update vendor
    vendor.name = name || vendor.name;
    vendor.email = email || vendor.email;
    vendor.contactPhone = contactPhone || vendor.contactPhone;
    vendor.profileImage = profileImageUrl;
    
    // Update address if provided
    if (address) {
      vendor.address = {
        street: address.street || vendor.address?.street,
        city: address.city || vendor.address?.city,
        state: address.state || vendor.address?.state,
        postalCode: address.postalCode || vendor.address?.postalCode,
        country: address.country || vendor.address?.country
      };
    }
    
    // Update business details if provided
    if (!vendor.businessDetails) {
      vendor.businessDetails = {};
    }
    
    vendor.businessDetails.name = businessName || vendor.businessDetails.name;
    vendor.businessDetails.description = businessDescription || vendor.businessDetails.description;
    vendor.businessDetails.category = businessCategory || vendor.businessDetails.category;
    vendor.businessDetails.taxId = taxId || vendor.businessDetails.taxId;
    
    // Update bank details if provided
    if (bankDetails) {
      if (!vendor.bankDetails) {
        vendor.bankDetails = {};
      }
      
      vendor.bankDetails.accountName = bankDetails.accountName || vendor.bankDetails.accountName;
      vendor.bankDetails.accountNumber = bankDetails.accountNumber || vendor.bankDetails.accountNumber;
      vendor.bankDetails.bankName = bankDetails.bankName || vendor.bankDetails.bankName;
      vendor.bankDetails.ifscCode = bankDetails.ifscCode || vendor.bankDetails.ifscCode;
    }
    
    await vendor.save();
    
    // Remove password from response
    const vendorResponse = vendor.toObject();
    delete vendorResponse.password;
    
    res.json(vendorResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor orders
exports.getVendorOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const vendorId = req.user.id;
    
    // Build filter
    const filter = { 'items.vendor': vendorId };
    
    if (status) {
      filter.orderStatus = status;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get orders
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name email contactPhone')
      .populate('deliveryAgent', 'name contactPhone');
    
    // Get total count
    const totalOrders = await Order.countDocuments(filter);
    
    // Filter items in each order to only show vendor's items
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(item => 
        item.vendor && item.vendor.toString() === vendorId
      );
      return orderObj;
    });
    
    res.json({
      orders: filteredOrders,
      currentPage: Number(page),
      totalPages: Math.ceil(totalOrders / Number(limit)),
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const vendorId = req.user.id;
    
    // Validate status
    const validStatuses = ['confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Find order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if vendor has items in this order
    const hasVendorItems = order.items.some(item => 
      item.vendor && item.vendor.toString() === vendorId
    );
    
    if (!hasVendorItems) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Update order status
    order.orderStatus = status;
    
    // If cancelled, add reason
    if (status === 'cancelled') {
      const { cancellationReason } = req.body;
      if (!cancellationReason) {
        return res.status(400).json({ message: 'Cancellation reason is required' });
      }
      order.cancellationReason = cancellationReason;
    }
    
    await order.save();
    
    // Emit socket event for order status update
    // This will be handled by your socket implementation
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor sales report
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, period } = req.query;
    const vendorId = req.user.id;
    
    // Set default date range if not provided
    let start = startDate ? new Date(startDate) : new Date();
    let end = endDate ? new Date(endDate) : new Date();
    
    // If period is provided, calculate date range
    if (period) {
      end = new Date();
      start = new Date();
      
      switch (period) {
        case 'week':
          start.setDate(end.getDate() - 7);
          break;
        case 'month':
          start.setMonth(end.getMonth() - 1);
          break;
        case 'year':
          start.setFullYear(end.getFullYear() - 1);
          break;
        default:
          start.setDate(end.getDate() - 30); // Default to 30 days
      }
    }
    
    // Set time to start and end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    // Get orders in date range
    const orders = await Order.find({
      'items.vendor': vendorId,
      createdAt: { $gte: start, $lte: end },
      orderStatus: { $nin: ['cancelled'] }
    });
    
    // Calculate sales data
    let totalSales = 0;
    let totalOrders = orders.length;
    let productsSold = 0;
    
    // Sales by category
    const salesByCategory = {};
    // Sales by date
    const salesByDate = {};
    
    orders.forEach(order => {
      // Filter items for this vendor
      const vendorItems = order.items.filter(item => 
        item.vendor && item.vendor.toString() === vendorId
      );
      
      // Calculate order total for this vendor
      const orderTotal = vendorItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      totalSales += orderTotal;
      productsSold += vendorItems.reduce((sum, item) => sum + item.quantity, 0);
      
      // Group by category
      vendorItems.forEach(item => {
        const category = item.itemType;
        if (!salesByCategory[category]) {
          salesByCategory[category] = 0;
        }
        salesByCategory[category] += item.price * item.quantity;
      });
      
      // Group by date
      const orderDate = order.createdAt.toISOString().split('T')[0];
      if (!salesByDate[orderDate]) {
        salesByDate[orderDate] = 0;
      }
      salesByDate[orderDate] += orderTotal;
    });
    
    // Convert to arrays for charts
    const categoriesData = Object.keys(salesByCategory).map(key => ({
      category: key,
      amount: salesByCategory[key]
    }));
    
    const dateData = Object.keys(salesByDate).sort().map(key => ({
      date: key,
      amount: salesByDate[key]
    }));
    
    res.json({
      summary: {
        totalSales,
        totalOrders,
        productsSold,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0
      },
      salesByCategory: categoriesData,
      salesByDate: dateData,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor inventory status
exports.getInventoryStatus = async (req, res) => {
  try {
    const vendorId = req.user.id;
    
    // Get grocery products
    const products = await Product.find({ vendor: vendorId });
    
    // Get clothes items
    const clothes = await Clothes.find({ vendor: vendorId });
    
    // Calculate inventory stats
    const groceryStats = {
      total: products.length,
      lowStock: products.filter(p => p.stock <= p.stockThreshold).length,
      outOfStock: products.filter(p => p.stock === 0).length
    };
    
    const clothesStats = {
      total: clothes.length,
      lowStock: clothes.filter(c => c.stock <= c.stockThreshold).length,
      outOfStock: clothes.filter(c => c.stock === 0).length
    
    };
    
    // Get inventory value
    const groceryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const clothesValue = clothes.reduce((sum, c) => sum + (c.price * c.stock), 0);
    
    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      // Match orders with this vendor's items
      { $match: { 'items.vendor': mongoose.Types.ObjectId(vendorId) } },
      // Unwind items array
      { $unwind: '$items' },
      // Match only this vendor's items
      { $match: { 'items.vendor': mongoose.Types.ObjectId(vendorId) } },
      // Group by item ID and sum quantities
      { 
        $group: { 
          _id: { 
            itemId: '$items.itemId',
            itemType: '$items.itemType'
          }, 
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          name: { $first: '$items.name' }
        } 
      },
      // Sort by total sold
      { $sort: { totalSold: -1 } },
      // Limit to top 5
      { $limit: 5 }
    ]);
    
    res.json({
      groceryStats,
      clothesStats,
      inventoryValue: {
        grocery: groceryValue,
        clothes: clothesValue,
        total: groceryValue + clothesValue
      },
      topSellingProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor restaurant
exports.getVendorRestaurant = async (req, res) => {
  try {
    const vendorId = req.user.id;
    
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const vendorId = req.user.id;
    
    // Check if vendor already has a restaurant
    const existingRestaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (existingRestaurant) {
      return res.status(400).json({ message: 'You already have a restaurant' });
    }
    
    const {
      name,
      description,
      address,
      cuisines,
      openingHours,
      contactPhone,
      contactEmail,
      priceRange,
      deliveryTime,
      deliveryFee,
      minimumOrder
    } = req.body;
    
    // Upload images if provided
    let logoUrl = '';
    let coverImageUrl = '';
    let imagesUrls = [];
    
    if (req.files) {
      // Upload logo
      if (req.files.logo) {
        const logoResult = await cloudinary.uploader.upload(req.files.logo[0].path, {
          folder: 'restaurants/logos'
        });
        logoUrl = logoResult.secure_url;
        fs.unlinkSync(req.files.logo[0].path);
      }
      
      // Upload cover image
      if (req.files.coverImage) {
        const coverResult = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
          folder: 'restaurants/covers'
        });
        coverImageUrl = coverResult.secure_url;
        fs.unlinkSync(req.files.coverImage[0].path);
      }
      
      // Upload gallery images
      if (req.files.images) {
        for (const image of req.files.images) {
          const result = await cloudinary.uploader.upload(image.path, {
            folder: 'restaurants/gallery'
          });
          imagesUrls.push(result.secure_url);
          fs.unlinkSync(image.path);
        }
      }
    }
    
    // Parse opening hours
    let parsedOpeningHours = {};
    if (openingHours) {
      parsedOpeningHours = JSON.parse(openingHours);
    }
    
    // Parse cuisines
    let parsedCuisines = [];
    if (cuisines) {
      parsedCuisines = cuisines.split(',').map(cuisine => cuisine.trim());
    }
    
    // Parse address
    let parsedAddress = {};
    if (address) {
      parsedAddress = JSON.parse(address);
    }
    
    // Create restaurant
    const restaurant = new Restaurant({
      name,
      description,
      address: parsedAddress,
      cuisines: parsedCuisines,
      openingHours: parsedOpeningHours,
      contactPhone,
      contactEmail,
      logo: logoUrl,
      coverImage: coverImageUrl,
      images: imagesUrls,
      priceRange: priceRange || '$$',
      deliveryTime: deliveryTime || 30,
      deliveryFee: deliveryFee || 0,
      minimumOrder: minimumOrder || 0,
      owner: vendorId
    });
    
    await restaurant.save();
    
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const vendorId = req.user.id;
    
    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    const {
      name,
      description,
      address,
      cuisines,
      openingHours,
      contactPhone,
      contactEmail,
      priceRange,
      deliveryTime,
      deliveryFee,
      minimumOrder,
      isOpen
    } = req.body;
    
    // Upload images if provided
    let logoUrl = restaurant.logo;
    let coverImageUrl = restaurant.coverImage;
    let imagesUrls = restaurant.images || [];
    
    if (req.files) {
      // Upload logo
      if (req.files.logo) {
        // Delete old logo if exists
        if (restaurant.logo) {
          const publicId = restaurant.logo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`restaurants/logos/${publicId}`);
        }
        
        const logoResult = await cloudinary.uploader.upload(req.files.logo[0].path, {
          folder: 'restaurants/logos'
        });
        logoUrl = logoResult.secure_url;
        fs.unlinkSync(req.files.logo[0].path);
      }
      
      // Upload cover image
      if (req.files.coverImage) {
        // Delete old cover if exists
        if (restaurant.coverImage) {
          const publicId = restaurant.coverImage.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`restaurants/covers/${publicId}`);
        }
        
        const coverResult = await cloudinary.uploader.upload(req.files.coverImage[0].path, {
          folder: 'restaurants/covers'
        });
        coverImageUrl = coverResult.secure_url;
        fs.unlinkSync(req.files.coverImage[0].path);
      }
      
      // Upload gallery images
      if (req.files.images) {
        for (const image of req.files.images) {
          const result = await cloudinary.uploader.upload(image.path, {
            folder: 'restaurants/gallery'
          });
          imagesUrls.push(result.secure_url);
          fs.unlinkSync(image.path);
        }
      }
    }
    
    // Parse opening hours
    let parsedOpeningHours = restaurant.openingHours;
    if (openingHours) {
      parsedOpeningHours = JSON.parse(openingHours);
    }
    
    // Parse cuisines
    let parsedCuisines = restaurant.cuisines;
    if (cuisines) {
      parsedCuisines = cuisines.split(',').map(cuisine => cuisine.trim());
    }
    
    // Parse address
    let parsedAddress = restaurant.address;
    if (address) {
      parsedAddress = JSON.parse(address);
    }
    
    // Update restaurant
    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.address = parsedAddress;
    restaurant.cuisines = parsedCuisines;
    restaurant.openingHours = parsedOpeningHours;
    restaurant.contactPhone = contactPhone || restaurant.contactPhone;
    restaurant.contactEmail = contactEmail || restaurant.contactEmail;
    restaurant.logo = logoUrl;
    restaurant.coverImage = coverImageUrl;
    restaurant.images = imagesUrls;
    restaurant.priceRange = priceRange || restaurant.priceRange;
    restaurant.deliveryTime = deliveryTime || restaurant.deliveryTime;
    restaurant.deliveryFee = deliveryFee !== undefined ? deliveryFee : restaurant.deliveryFee;
    restaurant.minimumOrder = minimumOrder !== undefined ? minimumOrder : restaurant.minimumOrder;
    restaurant.isOpen = isOpen !== undefined ? isOpen === 'true' : restaurant.isOpen;
    
    await restaurant.save();
    
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add menu item
exports.addMenuItem = async (req, res) => {
  try {
    const vendorId = req.user.id;
    
    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      isVegetarian,
      isSpicy,
      preparationTime,
      customizationOptions,
      nutritionalInfo,
      allergens
    } = req.body;
    
    // Upload image if provided
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'restaurants/menu'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    
    // Parse customization options
    let parsedCustomizationOptions = [];
    if (customizationOptions) {
      parsedCustomizationOptions = JSON.parse(customizationOptions);
    }
    
    // Parse nutritional info
    let parsedNutritionalInfo = {};
    if (nutritionalInfo) {
      parsedNutritionalInfo = JSON.parse(nutritionalInfo);
    }
    
    // Parse allergens
    let parsedAllergens = [];
    if (allergens) {
      parsedAllergens = allergens.split(',').map(allergen => allergen.trim());
    }
    
    // Create menu item
    const menuItem = {
      name,
      description,
      price,
      discountPrice: discountPrice || price,
      category,
      image: imageUrl,
      isVegetarian: isVegetarian === 'true',
      isSpicy: isSpicy === 'true',
      preparationTime: preparationTime || 15,
      customizationOptions: parsedCustomizationOptions,
      nutritionalInfo: parsedNutritionalInfo,
      allergens: parsedAllergens
    };
    
    // Add to restaurant menu
    restaurant.menu.push(menuItem);
    await restaurant.save();
    
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { menuItemId } = req.params;
    
    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Find menu item
    const menuItem = restaurant.menu.id(menuItemId);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      isVegetarian,
      isSpicy,
      isAvailable,
      preparationTime,
      customizationOptions,
      nutritionalInfo,
      allergens
    } = req.body;
    
    // Upload image if provided
    let imageUrl = menuItem.image;
    if (req.file) {
      // Delete old image if exists
      if (menuItem.image) {
        const publicId = menuItem.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`restaurants/menu/${publicId}`);
      }
      
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'restaurants/menu'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }
    
    // Parse customization options
    let parsedCustomizationOptions = menuItem.customizationOptions;
    if (customizationOptions) {
      parsedCustomizationOptions = JSON.parse(customizationOptions);
    }
    
    // Parse nutritional info
    let parsedNutritionalInfo = menuItem.nutritionalInfo;
    if (nutritionalInfo) {
      parsedNutritionalInfo = JSON.parse(nutritionalInfo);
    }
    
    // Parse allergens
    let parsedAllergens = menuItem.allergens;
    if (allergens) {
      parsedAllergens = allergens.split(',').map(allergen => allergen.trim());
    }
    
    // Update menu item
    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.discountPrice = discountPrice || menuItem.discountPrice;
    menuItem.category = category || menuItem.category;
    menuItem.image = imageUrl;
    menuItem.isVegetarian = isVegetarian !== undefined ? isVegetarian === 'true' : menuItem.isVegetarian;
    menuItem.isSpicy = isSpicy !== undefined ? isSpicy === 'true' : menuItem.isSpicy;
    menuItem.isAvailable = isAvailable !== undefined ? isAvailable === 'true' : menuItem.isAvailable;
    menuItem.preparationTime = preparationTime || menuItem.preparationTime;
    menuItem.customizationOptions = parsedCustomizationOptions;
    menuItem.nutritionalInfo = parsedNutritionalInfo;
    menuItem.allergens = parsedAllergens;
    
    await restaurant.save();
    
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { menuItemId } = req.params;
    
    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Find menu item
    const menuItem = restaurant.menu.id(menuItemId);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    // Delete image from cloudinary if exists
    if (menuItem.image) {
      const publicId = menuItem.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`restaurants/menu/${publicId}`);
    }
    
    // Remove menu item
    restaurant.menu.pull(menuItemId);
    await restaurant.save();
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create menu category
exports.createMenuCategory = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { name, description } = req.body;
    
    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Check if category already exists
    const categoryExists = restaurant.menuCategories.some(
      category => category.name.toLowerCase() === name.toLowerCase()
    );
    
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Create category
    const category = {
      name,
      description: description || ''
    };
    
    // Add to restaurant menu categories
    restaurant.menuCategories.push(category);
    await restaurant.save();
    
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update menu category
exports.updateMenuCategory = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { categoryId } = req.params;
    const { name, description } = req.body;
    
    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Find category
    const category = restaurant.menuCategories.id(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Update category
    category.name = name || category.name;
    category.description = description || category.description;
    
    await restaurant.save();
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete menu category
exports.deleteMenuCategory = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { categoryId } = req.params;
    
    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: vendorId });
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    // Find category
    const category = restaurant.menuCategories.id(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Check if category is in use
    const categoryInUse = restaurant.menu.some(
      item => item.category === category.name
    );
    
    if (categoryInUse) {
      return res.status(400).json({ 
        message: 'Cannot delete category that is in use by menu items' 
      });
    }
    
    // Remove category
    restaurant.menuCategories.pull(categoryId);
    await restaurant.save();
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor earnings
exports.getVendorEarnings = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { period } = req.query;
    
    // Set date range based on period
    const end = new Date();
    let start = new Date();
    
    switch (period) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        start.setDate(end.getDate() - 30); // Default to 30 days
    }
    
    // Set time to start and end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    // Get completed orders in date range
    const orders = await Order.find({
      'items.vendor': vendorId,
      orderStatus: 'delivered',
      createdAt: { $gte: start, $lte: end }
    });
    
    // Calculate earnings
    let totalEarnings = 0;
    let totalCommission = 0;
    let netEarnings = 0;
    
    // Earnings by date
    const earningsByDate = {};
    
    orders.forEach(order => {
      // Filter items for this vendor
      const vendorItems = order.items.filter(item => 
        item.vendor && item.vendor.toString() === vendorId
      );
      
      // Calculate order total for this vendor
      const orderTotal = vendorItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      // Calculate commission (assuming 10% commission rate)
      const commission = orderTotal * 0.1;
      
      totalEarnings += orderTotal;
      totalCommission += commission;
      netEarnings += (orderTotal - commission);
      
      // Group by date
      const orderDate = order.createdAt.toISOString().split('T')[0];
      if (!earningsByDate[orderDate]) {
        earningsByDate[orderDate] = {
          total: 0,
          commission: 0,
          net: 0
        };
      }
      
      earningsByDate[orderDate].total += orderTotal;
      earningsByDate[orderDate].commission += commission;
      earningsByDate[orderDate].net += (orderTotal - commission);
    });
    
    // Convert to array for charts
    const earningsData = Object.keys(earningsByDate).sort().map(key => ({
      date: key,
      total: earningsByDate[key].total,
      commission: earningsByDate[key].commission,
      net: earningsByDate[key].net
    }));
    
    res.json({
      summary: {
        totalEarnings,
        totalCommission,
        netEarnings,
        orderCount: orders.length
      },
      earningsByDate: earningsData,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor reviews
exports.getVendorReviews = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get products, clothes, and restaurant owned by vendor
    const products = await Product.find({ vendor: vendorId }).select('_id');
    const clothes = await Clothes.find({ vendor: vendorId }).select('_id');
    const restaurant = await Restaurant.findOne({ owner: vendorId }).select('_id');
    
    // Build item IDs array
    const itemIds = [
      ...products.map(p => p._id),
      ...clothes.map(c => c._id)
    ];
    
    if (restaurant) {
      itemIds.push(restaurant._id);
    }
    
    // Get reviews for all vendor items
    const reviews = await Review.find({ item: { $in: itemIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'name profileImage')
      .populate('item', 'name');
    
    // Get total count
    const totalReviews = await Review.countDocuments({ item: { $in: itemIds } });
    
    // Calculate average rating
    const allReviews = await Review.find({ item: { $in: itemIds } });
    const averageRating = allReviews.length > 0 
      ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
      : 0;
    
    // Group ratings by star count
    const ratingCounts = {
      1: allReviews.filter(r => r.rating === 1).length,
      2: allReviews.filter(r => r.rating === 2).length,
      3: allReviews.filter(r => r.rating === 3).length,
      4: allReviews.filter(r => r.rating === 4).length,
      5: allReviews.filter(r => r.rating === 5).length
    };
    
    res.json({
      reviews,
      currentPage: Number(page),
      totalPages: Math.ceil(totalReviews / Number(limit)),
      totalReviews,
      averageRating,
      ratingCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Respond to review
exports.respondToReview = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const { reviewId } = req.params;
    const { response } = req.body;
    
    // Find review
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if vendor owns the item
    const item = await getItemByTypeAndId(review.itemType, review.item);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Check if vendor owns the item
    const isOwner = checkIfVendorOwnsItem(item, vendorId, review.itemType);
    
    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to respond to this review' });
    }
    
    // Add vendor response
    review.vendorResponse = {
      text: response,
      createdAt: new Date()
    };
    
    await review.save();
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get item by type and ID
async function getItemByTypeAndId(itemType, itemId) {
  switch (itemType) {
    case 'product':
      return await Product.findById(itemId);
    case 'clothes':
      return await Clothes.findById(itemId);
    case 'restaurant':
      return await Restaurant.findById(itemId);
    case 'menuItem':
      const restaurant = await Restaurant.findOne({ 'menu._id': itemId });
      return restaurant ? restaurant.menu.id(itemId) : null;
    default:
      return null;
  }
}

// Helper function to check if vendor owns item
function checkIfVendorOwnsItem(item, vendorId, itemType) {
  if (!item) return false;
  
  switch (itemType) {
    case 'product':
    case 'clothes':
      return item.vendor && item.vendor.toString() === vendorId;
    case 'restaurant':
      return item.owner && item.owner.toString() === vendorId;
    case 'menuItem':
      // For menu items, we already verified the restaurant ownership in getItemByTypeAndId
      return true;
    default:
      return false;
  }
}

module.exports = exports;

// const Vendor = require('../models/VendorModel');
// const Order = require('../models/OrderModel');
// const Product = require('../models/ProductModel');

// // Admin controllers
// exports.getAllVendors = async (req, res) => {
//   try {
//     const vendors = await Vendor.find({}).select('-password');
//     res.json(vendors);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.verifyVendor = async (req, res) => {
//   try {
//     const vendor = await Vendor.findByIdAndUpdate(
//       req.params.id,
//       { isVerified: true, verifiedAt: Date.now() },
//       { new: true }
//     );
    
//     if (!vendor) {
//       return res.status(404).json({ message: 'Vendor not found' });
//     }
    
//     res.json({ message: 'Vendor verified successfully', vendor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.blockVendor = async (req, res) => {
//   try {
//     const vendor = await Vendor.findByIdAndUpdate(
//       req.params.id,
//       { isBlocked: req.body.block },
//       { new: true }
//     );
    
//     if (!vendor) {
//       return res.status(404).json({ message: 'Vendor not found' });
//     }
    
//     const message = req.body.block 
//       ? 'Vendor blocked successfully' 
//       : 'Vendor unblocked successfully';
    
//     res.json({ message, vendor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Vendor dashboard controllers
// exports.getDashboardStats = async (req, res) => {
//   try {
//     const vendorId = req.user._id;
    
//     // Get total orders
//     const totalOrders = await Order.countDocuments({ vendor: vendorId });
    
//     // Get total products
//     const totalProducts = await Product.countDocuments({ vendor: vendorId });
    
//     // Get total revenue
//     const orders = await Order.find({ vendor: vendorId, status: 'delivered' });
//     const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
//     // Get recent orders
//     const recentOrders = await Order.find({ vendor: vendorId })
//       .sort({ createdAt: -1 })
//       .limit(5);
    
//     res.json({
//       totalOrders,
//       totalProducts,
//       totalRevenue,
//       recentOrders
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getSalesAnalytics = async (req, res) => {
//   try {
//     const vendorId = req.user._id;
//     const { period = 'week' } = req.query;
    
//     let dateFilter = {};
//     const now = new Date();
    
//     if (period === 'week') {
//       const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       dateFilter = { createdAt: { $gte: weekAgo } };
//     } else if (period === 'month') {
//       const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       dateFilter = { createdAt: { $gte: monthAgo } };
//     } else if (period === 'year') {
//       const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       dateFilter = { createdAt: { $gte: yearAgo } };
//     }
    
//     const orders = await Order.find({ 
//       vendor: vendorId,
//       status: 'delivered',
//       ...dateFilter
//     });
    
//     // Process data for charts
//     // This is a simplified example - you would need to aggregate by day/week/month
//     const salesData = orders.map(order => ({
//       date: order.createdAt,
//       amount: order.totalAmount
//     }));
    
//     res.json(salesData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getInventoryStatus = async (req, res) => {
//   try {
//     const vendorId = req.user._id;
    
//     const products = await Product.find({ vendor: vendorId })
//       .select('name price stock category');
    
//     // Get low stock products
//     const lowStockProducts = products.filter(product => product.stock < 10);
    
//     // Get out of stock products
//     const outOfStockProducts = products.filter(product => product.stock === 0);
    
//     // Get products by category
//     const productsByCategory = {};
//     products.forEach(product => {
//       if (!productsByCategory[product.category]) {
//         productsByCategory[product.category] = [];
//       }
//       productsByCategory[product.category].push(product);
//     });
    
//     res.json({
//       totalProducts: products.length,
//       lowStockProducts,
//       outOfStockProducts,
//       productsByCategory
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getRecentOrders = async (req, res) => {
//   try {
//     const vendorId = req.user._id;
//     const { status, limit = 10, page = 1 } = req.query;
    
//     const query = { vendor: vendorId };
//     if (status) query.status = status;
    
//     const skip = (page - 1) * limit;
    
//     const orders = await Order.find(query)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .populate('user', 'name email');
    
//     const total = await Order.countDocuments(query);
    
//     res.json({
//       orders,
//       total,
//       pages: Math.ceil(total / limit),
//       currentPage: page
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Vendor profile controllers
// exports.getVendorProfile = async (req, res) => {
//   try {
//     const vendor = await Vendor.findById(req.user._id).select('-password');
    
//     if (!vendor) {
//       return res.status(404).json({ message: 'Vendor not found' });
//     }
    
//     res.json(vendor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.updateVendorProfile = async (req, res) => {
//   try {
//     const { name, email, phone, address } = req.body;
    
//     const vendor = await Vendor.findById(req.user._id);
    
//     if (!vendor) {
//       return res.status(404).json({ message: 'Vendor not found' });
//     }
    
//     // Update fields
//     if (name) vendor.name = name;
//     if (email) vendor.email = email;
//     if (phone) vendor.phone = phone;
//     if (address) vendor.address = address;
    
//     await vendor.save();
    
//     res.json({ message: 'Profile updated successfully', vendor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.updateBusinessDetails = async (req, res) => {
//   try {
//     const { 
//       businessName, 
//       businessDescription, 
//       businessCategory,
//       taxId,
//       bankDetails
//     } = req.body;
    
//     const vendor = await Vendor.findById(req.user._id);
    
//     if (!vendor) {
//       return res.status(404).json({ message: 'Vendor not found' });
//     }
    
//     // Update business fields
//     if (businessName) vendor.businessName = businessName;
//     if (businessDescription) vendor.businessDescription = businessDescription;
//     if (businessCategory) vendor.businessCategory = businessCategory;
//     if (taxId) vendor.taxId = taxId;
//     if (bankDetails) vendor.bankDetails = bankDetails;
    
//     await vendor.save();
    
//     res.json({ message: 'Business details updated successfully', vendor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = exports;
