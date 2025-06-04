const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['product', 'clothes', 'restaurant', 'menuItem'],
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String
  },
  comment: {
    type: String,
    required: true
  },
  images: [String],
  isVerified: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  },
  vendorResponse: {
    comment: String,
    createdAt: Date
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

// Compound index to ensure one review per user per item
reviewSchema.index({ user: 1, itemId: 1, itemType: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
