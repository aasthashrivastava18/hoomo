const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Protect routes - verify token and set req.user
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in Authorization header
    if (
      req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check if token exists in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        message: 'Not authorized, no token provided' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Not authorized, user not found' 
      });
    }
    
    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({ 
        message: 'Your account has been blocked. Please contact support.' 
      });
    }
    
    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token' 
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired' 
      });
    } else {
      return res.status(500).json({ 
        message: 'Server error during authentication' 
      });
    }
  }
};

// Admin middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized as admin' 
    });
  }
};

// Vendor middleware
exports.vendor = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') {
    // Check if vendor is verified
    if (!req.user.isVerified) {
      return res.status(403).json({ 
        message: 'Your vendor account is pending approval' 
      });
    }
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized as vendor' 
    });
  }
};

// Delivery agent middleware
exports.deliveryAgent = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized as delivery agent' 
    });
  }
};

// Admin or vendor middleware
exports.adminOrVendor = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'vendor')) {
    // Check if vendor is verified
    if (req.user.role === 'vendor' && !req.user.isVerified) {
      return res.status(403).json({ 
        message: 'Your vendor account is pending approval' 
      });
    }
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized' 
    });
  }
};

// Admin or delivery agent middleware
exports.adminOrDelivery = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'delivery')) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized' 
    });
  }
};
