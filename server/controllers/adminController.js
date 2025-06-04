const Product = require('../models/ProductModel');
const Restaurant = require('../models/RestaurantModel');
const Clothes = require('../models/ClothesModel');
const User = require('../models/UserModel');
const Order = require('../models/OrderModel');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendors = await User.countDocuments({ role: 'vendor' });
    const totalProducts = await Product.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalClothes = await Clothes.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    // Get orders from the last 7 days
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: lastWeekDate }
    });
    
    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      stock: { $lte: 5 }
    });
    
    const lowStockClothes = await Clothes.countDocuments({
      stock: { $lte: 5 }
    });
    
    res.json({
      totalUsers,
      totalVendors,
      totalProducts,
      totalRestaurants,
      totalClothes,
      totalOrders,
      recentOrders,
      lowStockProducts,
      lowStockClothes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending vendor requests
exports.getVendorRequests = async (req, res) => {
  try {
    const pendingVendors = await User.find({
      role: 'vendor',
      isVerified: false
    });
    
    res.json(pendingVendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve vendor request
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json({ message: 'Vendor approved successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject vendor request
exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndDelete(req.params.id);
    
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    
    res.json({ message: 'Vendor rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products with low stock
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 }
    }).populate('vendor', 'name email');
    
    const lowStockClothes = await Clothes.find({
      stock: { $lte: 5 }
    }).populate('vendor', 'name email');
    
    res.json({
      groceryProducts: lowStockProducts,
      clothesProducts: lowStockClothes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product stock
exports.updateProductStock = async (req, res) => {
  try {
    const { productId, productType, newStock } = req.body;
    
    let product;
    
    if (productType === 'grocery') {
      product = await Product.findByIdAndUpdate(
        productId,
        { stock: newStock },
        { new: true }
      );
    } else if (productType === 'clothes') {
      product = await Clothes.findByIdAndUpdate(
        productId,
        { stock: newStock },
        { new: true }
      );
    } else {
      return res.status(400).json({ message: 'Invalid product type' });
    }
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get sales analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    // Daily orders for the last 30 days
    const dailyOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Orders by category
    const ordersByCategory = await Order.aggregate([
      {
        $unwind: "$items"
      },
      {
        $group: {
          _id: "$items.itemType",
          count: { $sum: 1 },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      }
    ]);
    
    res.json({
      dailyOrders,
      ordersByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
