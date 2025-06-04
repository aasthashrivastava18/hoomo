const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const Restaurant = require('../models/RestaurantModel');
const Clothes = require('../models/ClothesModel');

// Get user cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalAmount: 0
      });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { itemType, itemId, quantity, size, color } = req.body;
    
    // Validate item exists and has stock
    let item;
    let imageUrl;
    let name;
    let price;
    let restaurantId;
    
    if (itemType === 'grocery') {
      item = await Product.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      if (item.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      
      imageUrl = item.imageUrl;
      name = item.name;
      price = item.price;
    } 
    else if (itemType === 'restaurant') {
      const [restId, menuItemId] = itemId.split('_');
      restaurantId = restId;
      
      const restaurant = await Restaurant.findById(restId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
      
      const menuItem = restaurant.menu.id(menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
      
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: 'This menu item is not available' });
      }
      
      imageUrl = menuItem.imageUrl;
      name = menuItem.name;
      price = menuItem.price;
      item = menuItem;
    } 
    else if (itemType === 'clothes') {
      item = await Clothes.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: 'Clothes item not found' });
      }
      
      if (item.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      
      if (!item.size.includes(size)) {
        return res.status(400).json({ message: 'Selected size not available' });
      }
      
      if (!item.color.includes(color)) {
        return res.status(400).json({ message: 'Selected color not available' });
      }
      
      imageUrl = item.imageUrls[0];
      name = item.name;
      price = item.price;
    } 
    else {
      return res.status(400).json({ message: 'Invalid item type' });
    }
    
    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalAmount: 0
      });
    }
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      i => i.itemId.toString() === itemId && 
           i.itemType === itemType && 
           (i.size === size || !size) && 
           (i.color === color || !color)
    );
    
    if (existingItemIndex > -1) {
      // Update existing item quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        itemType,
        itemId,
        name,
        price,
        quantity,
        imageUrl,
        size,
        color,
        restaurantId
      });
    }
    
    // Calculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
    
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    const cartItem = cart.items[itemIndex];
    
    // Check stock availability for the new quantity
    if (cartItem.itemType === 'grocery') {
      const product = await Product.findById(cartItem.itemId);
      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
    } 
    else if (cartItem.itemType === 'clothes') {
      const clothes = await Clothes.findById(cartItem.itemId);
      if (!clothes || clothes.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
    
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    // Recalculate total amount
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + (item.price * item.quantity), 
      0
    );
    
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Clear cart items
    cart.items = [];
    cart.totalAmount = 0;
    
    await cart.save();
    
    res.json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Validate cart items (check stock availability)
exports.validateCart = async (req, res) => {
  try {
    // Find cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const invalidItems = [];
    
    // Check each item's availability
    for (const item of cart.items) {
      if (item.itemType === 'grocery') {
        const product = await Product.findById(item.itemId);
        if (!product || !product.isAvailable || product.stock < item.quantity) {
          invalidItems.push({
            id: item._id,
            name: item.name,
            reason: !product ? 'Product not found' : 
                   !product.isAvailable ? 'Product not available' : 
                   'Not enough stock'
          });
        }
      } 
      else if (item.itemType === 'restaurant') {
        const [restId, menuItemId] = item.itemId.split('_');
        const restaurant = await Restaurant.findById(restId);
        
        if (!restaurant || !restaurant.isOpen) {
          invalidItems.push({
            id: item._id,
            name: item.name,
            reason: !restaurant ? 'Restaurant not found' : 'Restaurant is closed'
          });
          continue;
        }
        
        const menuItem = restaurant.menu.id(menuItemId);
        if (!menuItem || !menuItem.isAvailable) {
          invalidItems.push({
            id: item._id,
            name: item.name,
            reason: !menuItem ? 'Menu item not found' : 'Menu item not available'
          });
        }
      } 
      else if (item.itemType === 'clothes') {
        const clothes = await Clothes.findById(item.itemId);
        if (!clothes || !clothes.isAvailable || clothes.stock < item.quantity) {
          invalidItems.push({
            id: item._id,
            name: item.name,
            reason: !clothes ? 'Clothes item not found' : 
                   !clothes.isAvailable ? 'Clothes item not available' : 
                   'Not enough stock'
          });
        }
      }
    }
    
    if (invalidItems.length > 0) {
      return res.status(400).json({
        valid: false,
        invalidItems
      });
    }
    
    res.json({
      valid: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart count (number of items)
exports.getCartCount = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.json({ count: 0 });
    }
    
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    
    res.json({ count: itemCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
