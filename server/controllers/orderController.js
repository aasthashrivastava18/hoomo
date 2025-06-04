const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const Clothes = require('../models/ClothesModel');
const Restaurant = require('../models/RestaurantModel');
const User = require('../models/UserModel');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, isTryAtHome } = req.body;
    
    // Get user cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Validate items availability and stock
    for (const item of cart.items) {
      if (item.itemType === 'grocery') {
        const product = await Product.findById(item.itemId);
        
        if (!product || !product.isAvailable) {
          return res.status(400).json({ 
            message: `Product ${item.name} is no longer available` 
          });
        }
        
        if (product.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${item.name}. Available: ${product.stock}` 
          });
        }
        
        // Update product stock
        await Product.findByIdAndUpdate(
          item.itemId,
          { $inc: { stock: -item.quantity } }
        );
      } 
      else if (item.itemType === 'clothes') {
        const clothes = await Clothes.findById(item.itemId);
        
        if (!clothes || !clothes.isAvailable) {
          return res.status(400).json({ 
            message: `Clothes item ${item.name} is no longer available` 
          });
        }
        
        if (clothes.stock < item.quantity) {
          return res.status(400).json({ 
            message: `Not enough stock for ${item.name}. Available: ${clothes.stock}` 
          });
        }
        
        // Update clothes stock
        await Clothes.findByIdAndUpdate(
          item.itemId,
          { $inc: { stock: -item.quantity } }
        );
      }
      else if (item.itemType === 'restaurant') {
        const [restId, menuItemId] = item.itemId.split('_');
        
        const restaurant = await Restaurant.findById(restId);
        
        if (!restaurant || !restaurant.isOpen) {
          return res.status(400).json({ 
            message: `Restaurant for ${item.name} is closed or not available` 
          });
        }
        
        const menuItem = restaurant.menu.id(menuItemId);
        
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({ 
            message: `Menu item ${item.name} is no longer available` 
          });
        }
      }
    }
    
    // Create order
    const order = new Order({
      user: req.user.id,
      items: cart.items,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod,
      isTryAtHome: isTryAtHome || false,
      tryAtHomeStatus: isTryAtHome ? 'pending' : undefined,
      estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });
    
    await order.save();
    
    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    // Notify via socket if available
    const io = req.app.get('io');
    if (io) {
      io.emit('new_order', { 
        orderId: order._id,
        userId: req.user.id,
        status: 'placed'
      });
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('deliveryAgent', 'name phone');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin/delivery agent
    if (
      order.user._id.toString() !== req.user.id && 
      req.user.role !== 'admin' &&
      (req.user.role === 'delivery' && order.deliveryAgent?._id.toString() !== req.user.id)
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (admin/delivery agent only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, deliveryAgentId } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update order status
    if (orderStatus) {
      order.orderStatus = orderStatus;
      
      // If delivered, set actual delivery time
      if (orderStatus === 'delivered') {
        order.actualDeliveryTime = new Date();
      }
    }
    
    // Assign delivery agent
    if (deliveryAgentId && req.user.role === 'admin') {
      const deliveryAgent = await User.findOne({ 
        _id: deliveryAgentId,
        role: 'delivery'
      });
      
      if (!deliveryAgent) {
        return res.status(404).json({ message: 'Delivery agent not found' });
      }
      
      order.deliveryAgent = deliveryAgentId;
    }
    
    await order.save();
    
    // Notify via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(order._id.toString()).emit('order_status_updated', {
        orderId: order._id,
        status: order.orderStatus
      });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update try-at-home status (admin/delivery agent only)
exports.updateTryAtHomeStatus = async (req, res) => {
  try {
    const { tryAtHomeStatus, returnedItems } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (!order.isTryAtHome) {
      return res.status(400).json({ message: 'This order does not have try-at-home enabled' });
    }
    
    // Update try-at-home status
    order.tryAtHomeStatus = tryAtHomeStatus;
    
    // If items are returned, update stock
    if (tryAtHomeStatus === 'returned' && returnedItems && returnedItems.length > 0) {
      for (const returnItem of returnedItems) {
        const orderItem = order.items.find(item => 
          item._id.toString() === returnItem.itemId && item.itemType === 'clothes'
        );
        
        if (orderItem) {
          // Update clothes stock
          await Clothes.findByIdAndUpdate(
            orderItem.itemId,
            { $inc: { stock: returnItem.quantity } }
          );
          
          // Update order item status
          orderItem.isReturned = true;
          orderItem.returnedQuantity = returnItem.quantity;
          orderItem.returnReason = returnItem.reason;
        }
      }
    }
    
    await order.save();
    
    // Notify via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(order._id.toString()).emit('try_at_home_status_updated', {
        orderId: order._id,
        status: order.tryAtHomeStatus
      });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        message: `Order cannot be cancelled as it is already ${order.orderStatus}` 
      });
    }
    
    // Update order status
    order.orderStatus = 'cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by user';
    
    // Return items to stock
    for (const item of order.items) {
      if (item.itemType === 'grocery') {
        await Product.findByIdAndUpdate(
          item.itemId,
          { $inc: { stock: item.quantity } }
        );
      } 
      else if (item.itemType === 'clothes') {
        await Clothes.findByIdAndUpdate(
          item.itemId,
          { $inc: { stock: item.quantity } }
        );
      }
    }
    
    await order.save();
    
    // Notify via socket if available
    const io = req.app.get('io');
    if (io) {
      io.to(order._id.toString()).emit('order_status_updated', {
        orderId: order._id,
        status: 'cancelled'
      });
    }
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) filter.orderStatus = status;
    
    // Date range
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1); // Include the end date
        filter.createdAt.$lt = endDateObj;
      }
    }
    
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('deliveryAgent', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor orders (vendor only)
exports.getVendorOrders = async (req, res) => {
  try {
    // Find orders containing items from this vendor
    const orders = await Order.find({
      'items.vendor': req.user.id
    })
      .populate('user', 'name')
      .populate('deliveryAgent', 'name')
      .sort({ createdAt: -1 });
    
    // Filter items in each order to only show vendor's items
    const vendorOrders = orders.map(order => {
      const vendorItems = order.items.filter(item => 
        item.vendor && item.vendor.toString() === req.user.id
      );
      
      return {
        _id: order._id,
        user: order.user,
        items: vendorItems,
        totalAmount: vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderStatus: order.orderStatus,
        deliveryAddress: order.deliveryAddress,
        createdAt: order.createdAt,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        actualDeliveryTime: order.actualDeliveryTime
      };
    });
    
    res.json(vendorOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
