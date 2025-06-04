const mongoose = require('mongoose');

// Schema for customization options (like size, toppings, etc.)
const customizationOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  options: [
    {
      name: {
        type: String,
        required: true,
        trim: true
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  required: {
    type: Boolean,
    default: false
  },
  multiple: {
    type: Boolean,
    default: false
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 1
  }
});

// Schema for nutritional information
const nutritionalInfoSchema = new mongoose.Schema({
  calories: {
    type: Number,
    min: 0
  },
  protein: {
    type: Number,
    min: 0
  },
  carbs: {
    type: Number,
    min: 0
  },
  fat: {
    type: Number,
    min: 0
  },
  fiber: {
    type: Number,
    min: 0
  },
  sugar: {
    type: Number,
    min: 0
  },
  sodium: {
    type: Number,
    min: 0
  }
});

// Schema for ratings
const ratingsSchema = new mongoose.Schema({
  average: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  count: {
    type: Number,
    default: 0,
    min: 0
  }
});

// Menu Item Schema
const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  image: {
    type: String
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isSpicy: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15,
    min: 0
  },
  customizationOptions: [customizationOptionSchema],
  nutritionalInfo: nutritionalInfoSchema,
  allergens: [String],
  ratings: {
    type: ratingsSchema,
    default: () => ({})
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

// Add text index for search functionality
menuItemSchema.index({ 
  name: 'text', 
  description: 'text', 
  category: 'text',
  tags: 'text'
});

// Virtual for discount percentage
menuItemSchema.virtual('discountPercentage').get(function() {
  if (this.discountPrice && this.price > this.discountPrice) {
    return Math.round((1 - (this.discountPrice / this.price)) * 100);
  }
  return 0;
});

// Method to check if item is on sale
menuItemSchema.methods.isOnSale = function() {
  return this.discountPrice && this.price > this.discountPrice;
};

// Pre-save hook to ensure discountPrice is not higher than price
menuItemSchema.pre('save', function(next) {
  if (this.discountPrice && this.discountPrice > this.price) {
    this.discountPrice = this.price;
  }
  next();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
