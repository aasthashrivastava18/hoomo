// const Product = require('../models/ProductModel');
// const User = require('../models/UserModel');
// const mongoose = require('mongoose');
// const cloudinary = require('../config/cloudinaryConfig');

// // Get all products with filtering, sorting, and pagination
// exports.getAllProducts = async (req, res) => {
//   try {
//     const {
//       category,
//       subCategory,
//       brand,
//       minPrice,
//       maxPrice,
//       isVegetarian,
//       inStock,
//       search,
//       sortBy,
//       page = 1,
//       limit = 10
//     } = req.query;

//     // Build filter object
//     const filter = {};

//     if (category) filter.category = category;
//     if (subCategory) filter.subCategory = subCategory;
//     if (brand) filter.brand = brand;
//     if (isVegetarian !== undefined) filter.isVegetarian = isVegetarian === 'true';
//     if (inStock === 'true') filter.stock = { $gt: 0 };
    
//     // Price range
//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }

//     // Search functionality
//     if (search) {
//       filter.$text = { $search: search };
//     }

//     // Only show available products
//     filter.isAvailable = true;

//     // Build sort object
//     let sort = {};
//     if (sortBy) {
//       switch (sortBy) {
//         case 'priceAsc':
//           sort = { price: 1 };
//           break;
//         case 'priceDesc':
//           sort = { price: -1 };
//           break;
//         case 'newest':
//           sort = { createdAt: -1 };
//           break;
//         case 'rating':
//           sort = { 'ratings.average': -1 };
//           break;
//         default:
//           sort = { createdAt: -1 };
//       }
//     } else {
//       // Default sort by newest
//       sort = { createdAt: -1 };
//     }

//     // Calculate pagination
//     const skip = (Number(page) - 1) * Number(limit);

//     // Execute query with pagination
//     const products = await Product.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(Number(limit))
//       .populate('vendor', 'name');

//     // Get total count for pagination
//     const totalProducts = await Product.countDocuments(filter);

//     res.json({
//       products,
//       currentPage: Number(page),
//       totalPages: Math.ceil(totalProducts / Number(limit)),
//       totalProducts
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get product categories
// exports.getProductCategories = async (req, res) => {
//   try {
//     const categories = await Product.distinct('category');
    
//     // Get subcategories for each category
//     const categoriesWithSub = await Promise.all(
//       categories.map(async (category) => {
//         const subCategories = await Product.distinct('subCategory', { category });
//         return {
//           name: category,
//           subCategories
//         };
//       })
//     );
    
//     res.json(categoriesWithSub);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get product by ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)
//       .populate('vendor', 'name address contactPhone');
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get vendor products
// exports.getVendorProducts = async (req, res) => {
//   try {
//     const products = await Product.find({ vendor: req.user.id })
//       .sort({ createdAt: -1 });
    
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create new product
// exports.createProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       discountPrice,
//       category,
//       subCategory,
//       brand,
//       unit,
//       quantity,
//       stock,
//       stockThreshold,
//       isVegetarian,
//       nutritionalInfo,
//       expiryDate,
//       manufacturingDate,
//       countryOfOrigin,
//       tags
//     } = req.body;

//     // Upload image to cloudinary if provided
//     let imageUrl = '';
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: 'products'
//       });
//       imageUrl = result.secure_url;
//     }

//     // Create new product
//     const product = new Product({
//       name,
//       description,
//       price,
//       discountPrice: discountPrice || price,
//       category,
//       subCategory,
//       brand,
//       unit,
//       quantity,
//       stock,
//       stockThreshold: stockThreshold || 5,
//       image: imageUrl,
//       isVegetarian: isVegetarian === 'true',
//       nutritionalInfo: nutritionalInfo ? JSON.parse(nutritionalInfo) : {},
//       expiryDate,
//       manufacturingDate,
//       countryOfOrigin,
//       tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
//       vendor: req.user.id
//     });

//     await product.save();
    
//     res.status(201).json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update product
// exports.updateProduct = async (req, res) => {
//   try {
//     const {
//       name,
//       description,
//       price,
//       discountPrice,
//       category,
//       subCategory,
//       brand,
//       unit,
//       quantity,
//       stock,
//       stockThreshold,
//       isVegetarian,
//       nutritionalInfo,
//       expiryDate,
//       manufacturingDate,
//       countryOfOrigin,
//       tags,
//       isAvailable
//     } = req.body;

//     // Find product
//     const product = await Product.findById(req.params.id);
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     // Check if product belongs to vendor
//     if (product.vendor.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     // Upload new image if provided
//     let imageUrl = product.image;
//     if (req.file) {
//       // Delete old image if exists
//       if (product.image) {
//         const publicId = product.image.split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(`products/${publicId}`);
//       }
      
//       // Upload new image
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: 'products'
//       });
//       imageUrl = result.secure_url;
//     }

//     // Update product
//     product.name = name || product.name;
//     product.description = description || product.description;
//     product.price = price || product.price;
//     product.discountPrice = discountPrice || product.discountPrice;
//     product.category = category || product.category;
//     product.subCategory = subCategory || product.subCategory;
//     product.brand = brand || product.brand;
//     product.unit = unit || product.unit;
//     product.quantity = quantity || product.quantity;
//     product.stock = stock !== undefined ? stock : product.stock;
//     product.stockThreshold = stockThreshold || product.stockThreshold;
//     product.image = imageUrl;
//     product.isVegetarian = isVegetarian !== undefined ? isVegetarian === 'true' : product.isVegetarian;
//     product.nutritionalInfo = nutritionalInfo ? JSON.parse(nutritionalInfo) : product.nutritionalInfo;
//     product.expiryDate = expiryDate || product.expiryDate;
//     product.manufacturingDate = manufacturingDate || product.manufacturingDate;
//     product.countryOfOrigin = countryOfOrigin || product.countryOfOrigin;
//     product.tags = tags ? tags.split(',').map(tag => tag.trim()) : product.tags;
//     product.isAvailable = isAvailable !== undefined ? isAvailable === 'true' : product.isAvailable;

//     await product.save();
    
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// // Get featured products
// exports.getFeaturedProducts = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;
    
//     const products = await Product.find({
//       isAvailable: true,
//       stock: { $gt: 0 }
//     })
//     .sort({ createdAt: -1 })
//     .limit(Number(limit))
//     .populate('vendor', 'name');
    
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get trending products
// exports.getTrendingProducts = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;
    
//     const products = await Product.find({
//       isAvailable: true,
//       stock: { $gt: 0 }
//     })
//     .sort({ createdAt: -1 })
//     .limit(Number(limit))
//     .populate('vendor', 'name');
    
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get popular products
// exports.getPopularProducts = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;
    
//     const products = await Product.find({
//       isAvailable: true,
//       stock: { $gt: 0 }
//     })
//     .sort({ createdAt: -1 })
//     .limit(Number(limit))
//     .populate('vendor', 'name');
    
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     // Check if product belongs to vendor
//     if (product.vendor.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     // Delete image from cloudinary if exists
//     if (product.image) {
//       const publicId = product.image.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(`products/${publicId}`);
//     }

//     await Product.findByIdAndDelete(req.params.id);
    
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get low stock products (admin)
// exports.getLowStockProducts = async (req, res) => {
//   try {
//     const products = await Product.find({
//       $expr: { $lte: ["$stock", "$stockThreshold"] }
//     }).populate('vendor', 'name');
    
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // Move these functions to the VERY END of file (after getLowStockProducts)

// // Delete product
// exports.deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
        
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
        
//     // Check if product belongs to vendor
//     if (product.vendor.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     // Delete image from cloudinary if exists
//     if (product.image) {
//       const publicId = product.image.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(`products/${publicId}`);
//     }
//     await Product.findByIdAndDelete(req.params.id);
        
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get low stock products (admin)
// exports.getLowStockProducts = async (req, res) => {
//   try {
//     const products = await Product.find({
//       $expr: { $lte: ["$stock", "$stockThreshold"] }
//     }).populate('vendor', 'name');
        
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ADD THESE AT THE VERY END:
// // Get featured products
// exports.getFeaturedProducts = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;
        
//     const products = await Product.find({
//       isAvailable: true,
//       stock: { $gt: 0 }
//     })
//     .sort({ createdAt: -1 })
//     .limit(Number(limit))
//     .populate('vendor', 'name');
        
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get trending products
// exports.getTrendingProducts = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;
        
//     const products = await Product.find({
//       isAvailable: true,
//       stock: { $gt: 0 }
//     })
//     .sort({ createdAt: -1 })
//     .limit(Number(limit))
//     .populate('vendor', 'name');
        
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get popular products
// exports.getPopularProducts = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;
        
//     const products = await Product.find({
//       isAvailable: true,
//       stock: { $gt: 0 }
//     })
//     .sort({ createdAt: -1 })
//     .limit(Number(limit))
//     .populate('vendor', 'name');
        
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinaryConfig');

// Get all products with filtering, sorting, and pagination
exports.getAllProducts = async (req, res) => {
  try {
    const {
      category,
      subCategory,
      brand,
      minPrice,
      maxPrice,
      isVegetarian,
      inStock,
      search,
      sortBy,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (brand) filter.brand = brand;
    if (isVegetarian !== undefined) filter.isVegetarian = isVegetarian === 'true';
    if (inStock === 'true') filter.stock = { $gt: 0 };
        
    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Only show available products
    filter.isAvailable = true;

    // Build sort object
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'priceAsc':
          sort = { price: 1 };
          break;
        case 'priceDesc':
          sort = { price: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'rating':
          sort = { 'ratings.average': -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('vendor', 'name');

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);

    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product categories
exports.getProductCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
        
    const categoriesWithSub = await Promise.all(
      categories.map(async (category) => {
        const subCategories = await Product.distinct('subCategory', { category });
        return {
          name: category,
          subCategories
        };
      })
    );
        
    res.json(categoriesWithSub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
        
    const products = await Product.find({
      isAvailable: true,
      stock: { $gt: 0 }
    })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('vendor', 'name');
        
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
        
    const products = await Product.find({
      isAvailable: true,
      stock: { $gt: 0 }
    })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('vendor', 'name');
        
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular products
exports.getPopularProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
        
    const products = await Product.find({
      isAvailable: true,
      stock: { $gt: 0 }
    })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .populate('vendor', 'name');
        
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name address contactPhone');
        
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
        
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor products
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id })
      .sort({ createdAt: -1 });
        
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      brand,
      unit,
      quantity,
      stock,
      stockThreshold,
      isVegetarian,
      nutritionalInfo,
      expiryDate,
      manufacturingDate,
      countryOfOrigin,
      tags
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products'
      });
      imageUrl = result.secure_url;
    }

    const product = new Product({
      name,
      description,
      price,
      discountPrice: discountPrice || price,
      category,
      subCategory,
      brand,
      unit,
      quantity,
      stock,
      stockThreshold: stockThreshold || 5,
      image: imageUrl,
      isVegetarian: isVegetarian === 'true',
      nutritionalInfo: nutritionalInfo ? JSON.parse(nutritionalInfo) : {},
      expiryDate,
      manufacturingDate,
      countryOfOrigin,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      vendor: req.user.id
    });

    await product.save();
        
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      brand,
      unit,
      quantity,
      stock,
      stockThreshold,
      isVegetarian,
      nutritionalInfo,
      expiryDate,
      manufacturingDate,
      countryOfOrigin,
      tags,
      isAvailable
    } = req.body;

    const product = await Product.findById(req.params.id);
        
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
        
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let imageUrl = product.image;
    if (req.file) {
      if (product.image) {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
            
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products'
      });
      imageUrl = result.secure_url;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.category = category || product.category;
    product.subCategory = subCategory || product.subCategory;
    product.brand = brand || product.brand;
    product.unit = unit || product.unit;
    product.quantity = quantity || product.quantity;
    product.stock = stock !== undefined ? stock : product.stock;
    product.stockThreshold = stockThreshold || product.stockThreshold;
    product.image = imageUrl;
    product.isVegetarian = isVegetarian !== undefined ? isVegetarian === 'true' : product.isVegetarian;
    product.nutritionalInfo = nutritionalInfo ? JSON.parse(nutritionalInfo) : product.nutritionalInfo;
    product.expiryDate = expiryDate || product.expiryDate;
    product.manufacturingDate = manufacturingDate || product.manufacturingDate;
    product.countryOfOrigin = countryOfOrigin || product.countryOfOrigin;
    product.tags = tags ? tags.split(',').map(tag => tag.trim()) : product.tags;
    product.isAvailable = isAvailable !== undefined ? isAvailable === 'true' : product.isAvailable;

    await product.save();
        
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
        
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
        
    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(req.params.id);
        
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock products (admin)
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$stock", "$stockThreshold"] }
    }).populate('vendor', 'name');
        
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
