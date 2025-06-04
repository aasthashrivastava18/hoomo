const Clothes = require('../models/ClothesModel');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');

// Get all clothes
exports.getAllClothes = async (req, res) => {
  try {
    const { category, type, minPrice, maxPrice, size, color, sort } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (size) filter.size = { $in: [size] };
    if (color) filter.color = { $in: [color] };
    
    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Only show available items
    filter.isAvailable = true;
    
    // Build sort object
    let sortOption = {};
    
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else sortOption = { createdAt: -1 }; // Default sort
    
    const clothes = await Clothes.find(filter)
      .sort(sortOption)
      .populate('vendor', 'name');
    
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get clothes by ID
exports.getClothesById = async (req, res) => {
  try {
    const clothes = await Clothes.findById(req.params.id)
      .populate('vendor', 'name');
    
    if (!clothes) {
      return res.status(404).json({ message: 'Clothes item not found' });
    }
    
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new clothes item (vendor only)
exports.createClothes = async (req, res) => {
  try {
    const { 
      name, description, price, category, type, 
      size, color, stock, stockThreshold 
    } = req.body;
    
    // Upload images to cloudinary
    const imageUrls = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'hoomo/clothes'
        });
        
        imageUrls.push(result.secure_url);
        
        // Remove temp file
        fs.unlinkSync(file.path);
      }
    }
    
    if (imageUrls.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }
    
    const clothes = new Clothes({
      name,
      description,
      price,
      category,
      type,
      size: JSON.parse(size),
      color: JSON.parse(color),
      imageUrls,
      stock,
      stockThreshold,
      vendor: req.user.id
    });
    
    await clothes.save();
    
    res.status(201).json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update clothes item (vendor only)
exports.updateClothes = async (req, res) => {
  try {
    const { 
      name, description, price, category, type, 
      size, color, stock, stockThreshold, isAvailable 
    } = req.body;
    
    // Find clothes item
    let clothes = await Clothes.findById(req.params.id);
    
    if (!clothes) {
      return res.status(404).json({ message: 'Clothes item not found' });
    }
    
    // Check if vendor owns this item
    if (clothes.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    // Upload new images if provided
    const imageUrls = [...clothes.imageUrls];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'hoomo/clothes'
        });
        
        imageUrls.push(result.secure_url);
        
        // Remove temp file
        fs.unlinkSync(file.path);
      }
    }
    
    // Update clothes item
    clothes = await Clothes.findByIdAndUpdate(
      req.params.id,
      {
        name: name || clothes.name,
        description: description || clothes.description,
        price: price || clothes.price,
        category: category || clothes.category,
        type: type || clothes.type,
        size: size ? JSON.parse(size) : clothes.size,
        color: color ? JSON.parse(color) : clothes.color,
        imageUrls,
        stock: stock !== undefined ? stock : clothes.stock,
        stockThreshold: stockThreshold || clothes.stockThreshold,
        isAvailable: isAvailable !== undefined ? isAvailable : clothes.isAvailable
      },
      { new: true }
    );
    
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete clothes item (vendor only)
exports.deleteClothes = async (req, res) => {
  try {
    const clothes = await Clothes.findById(req.params.id);
    
    if (!clothes) {
      return res.status(404).json({ message: 'Clothes item not found' });
    }
    
    // Check if vendor owns this item
    if (clothes.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    
    await Clothes.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Clothes item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor clothes (vendor only)
exports.getVendorClothes = async (req, res) => {
  try {
    const clothes = await Clothes.find({ vendor: req.user.id });
    
    res.json(clothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove image from clothes item (vendor only)
exports.removeClothesImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    const clothes = await Clothes.findById(req.params.id);
    
    if (!clothes) {
      return res.status(404).json({ message: 'Clothes item not found' });
    }
    
    // Check if vendor owns this item
    if (clothes.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    
    // Remove image from array
    const updatedImageUrls = clothes.imageUrls.filter(url => url !== imageUrl);
    
    if (updatedImageUrls.length === 0) {
      return res.status(400).json({ message: 'Cannot remove all images. At least one image is required.' });
    }
    
    // Update clothes item
    const updatedClothes = await Clothes.findByIdAndUpdate(
      req.params.id,
      { imageUrls: updatedImageUrls },
      { new: true }
    );
    
    res.json(updatedClothes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get clothes categories and types for filtering
exports.getClothesFilters = async (req, res) => {
  try {
    const categories = await Clothes.distinct('category');
    const types = await Clothes.distinct('type');
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = await Clothes.distinct('color');
    
    res.json({
      categories,
      types,
      sizes,
      colors: colors.flat()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
