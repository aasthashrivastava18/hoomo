import api from './api';
import { handleApiError } from '../utils/errorHandler';

class ClothesService {
  // Get clothes with filters
  async getClothes(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        brand,
        size,
        color,
        material,
        gender,
        ageGroup,
        minPrice,
        maxPrice,
        season,
        occasion,
        style,
        sortBy = 'name',
        sortOrder = 'asc',
        isOnSale,
        inStock = true
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
        inStock: inStock.toString()
      });

      // Add optional filters
      if (category) queryParams.append('category', category);
      if (brand) queryParams.append('brand', brand);
      if (size) queryParams.append('size', size);
      if (color) queryParams.append('color', color);
      if (material) queryParams.append('material', material);
      if (gender) queryParams.append('gender', gender);
      if (ageGroup) queryParams.append('ageGroup', ageGroup);
      if (minPrice) queryParams.append('minPrice', minPrice.toString());
      if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
      if (season) queryParams.append('season', season);
      if (occasion) queryParams.append('occasion', occasion);
      if (style) queryParams.append('style', style);
      if (isOnSale !== undefined) queryParams.append('isOnSale', isOnSale.toString());

      const response = await api.get(`/clothes?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get clothing item by ID
  async getClothingById(clothingId) {
    try {
      const response = await api.get(`/clothes/${clothingId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get clothing categories
  async getClothingCategories() {
    try {
      const response = await api.get('/clothes/categories');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get clothing brands
  async getClothingBrands() {
    try {
      const response = await api.get('/clothes/brands');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get available sizes for a clothing item
  async getAvailableSizes(clothingId) {
    try {
      const response = await api.get(`/clothes/${clothingId}/sizes`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get available colors for a clothing item
  async getAvailableColors(clothingId) {
    try {
      const response = await api.get(`/clothes/${clothingId}/colors`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get size chart for a brand/category
  async getSizeChart(brand, category) {
    try {
      const response = await api.get(`/clothes/size-chart?brand=${brand}&category=${category}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get clothing by brand
  async getClothesByBrand(brandId, params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        gender,
        sortBy = 'name',
        sortOrder = 'asc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (category) queryParams.append('category', category);
      if (gender) queryParams.append('gender', gender);

      const response = await api.get(`/brands/${brandId}/clothes?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get trending clothes
  async getTrendingClothes(limit = 10) {
    try {
      const response = await api.get(`/clothes/trending?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get new arrivals
  async getNewArrivals(limit = 20) {
    try {
      const response = await api.get(`/clothes/new-arrivals?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get sale items
  async getSaleClothes(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        minDiscount = 10,
        sortBy = 'discount',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        minDiscount: minDiscount.toString(),
        sortBy,
        sortOrder
      });

      const response = await api.get(`/clothes/sale?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get clothing recommendations
  async getClothingRecommendations(userId, limit = 10) {
    try {
      const response = await api.get(`/clothes/recommendations?userId=${userId}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get similar clothing items
  async getSimilarClothes(clothingId, limit = 8) {
    try {
      const response = await api.get(`/clothes/${clothingId}/similar?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get complete the look suggestions
  async getCompleteTheLook(clothingId, limit = 5) {
    try {
      const response = await api.get(`/clothes/${clothingId}/complete-look?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add new clothing item (Admin function)
  async addClothingItem(clothingData) {
    try {
      const response = await api.post('/clothes', clothingData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update clothing item (Admin function)
  async updateClothingItem(clothingId, updateData) {
    try {
      const response = await api.put(`/clothes/${clothingId}`, updateData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete clothing item (Admin function)
  async deleteClothingItem(clothingId) {
    try {
      const response = await api.delete(`/clothes/${clothingId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Check stock availability
  async checkStockAvailability(clothingId, size, color) {
    try {
      const response = await api.get(`/clothes/${clothingId}/stock?size=${size}&color=${color}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get clothing reviews
  async getClothingReviews(clothingId, params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        rating,
        size
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (rating) queryParams.append('rating', rating.toString());
      if (size) queryParams.append('size', size);

      const response = await api.get(`/clothes/${clothingId}/reviews?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add clothing review
  async addClothingReview(clothingId, reviewData) {
    try {
      const response = await api.post(`/clothes/${clothingId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get clothing filters
  async getClothingFilters() {
    try {
      const response = await api.get('/clothes/filters');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get wishlist
  async getWishlist(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      const response = await api.get(`/clothes/wishlist?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add to wishlist
  async addToWishlist(clothingId) {
    try {
      const response = await api.post(`/clothes/${clothingId}/wishlist`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
  // Add this method after line 344 (after getPriceHistory method)
async getStock() {
  try {
    const response = await api.get('/clothes/stock');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}


  // Remove from wishlist
  async removeFromWishlist(clothingId) {
    try {
      const response = await api.delete(`/clothes/${clothingId}/wishlist`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get outfit suggestions
  async getOutfitSuggestions(occasion, weather, limit = 5) {
    try {
      const response = await api.get(`/clothes/outfits?occasion=${occasion}&weather=${weather}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Virtual try-on
  async virtualTryOn(clothingId, userImage) {
    try {
      const formData = new FormData();
      formData.append('userImage', userImage);
      const response = await api.post(`/clothes/${clothingId}/virtual-try-on`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get care instructions
  async getCareInstructions(clothingId) {
    try {
      const response = await api.get(`/clothes/${clothingId}/care-instructions`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Track price changes
  async trackPriceChanges(clothingId) {
    try {
      const response = await api.post(`/clothes/${clothingId}/track-price`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get price history
  async getPriceHistory(clothingId) {
    try {
      const response = await api.get(`/clothes/${clothingId}/price-history`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Helper functions for clothing
export const clothingHelpers = {
  // Convert size to standard format
  standardizeSize: (size, sizeSystem = 'US') => {
    const sizeConversions = {
      'XS': { US: 'XS', EU: '32', UK: '4' },
      'S': { US: 'S', EU: '34-36', UK: '6-8' },
      'M': { US: 'M', EU: '38-40', UK: '10-12' },
      'L': { US: 'L', EU: '42-44', UK: '14-16' },
      'XL': { US: 'XL', EU: '46-48', UK: '18-20' }
    };
    return sizeConversions[size]?.[sizeSystem] || size;
  },

  // Get size recommendations
  getSizeRecommendation: (measurements, sizeChart) => {
    const { chest, waist, hips } = measurements;
    
    for (const size of sizeChart) {
      if (chest >= size.chestMin && chest <= size.chestMax &&
          waist >= size.waistMin && waist <= size.waistMax &&
          hips >= size.hipsMin && hips <= size.hipsMax) {
        return size.size;
      }
    }
    
    return null;
  },

  // Format clothing attributes
  formatClothingAttributes: (clothing) => {
    return {
      ...clothing,
      formattedPrice: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(clothing.price),
      isOnSale: clothing.discountPercentage > 0,
      discountedPrice: clothing.price - (clothing.price * clothing.discountPercentage / 100),
      availableSizes: clothing.variants?.map(v => v.size).filter(Boolean) || [],
      availableColors: clothing.variants?.map(v => v.color).filter(Boolean) || []
    };
  },

  // Filter by body type
  filterByBodyType: (clothes, bodyType) => {
    const bodyTypeRecommendations = {
      'pear': ['A-line', 'empire waist', 'bootcut'],
      'apple': ['empire waist', 'wrap', 'straight'],
      'hourglass': ['fitted', 'wrap', 'bodycon'],
      'rectangle': ['peplum', 'ruffles', 'belted']
    };
    const recommendedStyles = bodyTypeRecommendations[bodyType] || [];
    
    return clothes.filter(item =>
      recommendedStyles.some(style =>
        item.style?.toLowerCase().includes(style.toLowerCase())
      )
    );
  },

    // Get seasonal recommendations
  getSeasonalRecommendations: (season) => {
    const seasonalItems = {
      'spring': ['light jackets', 'cardigans', 'jeans', 'sneakers'],
      'summer': ['t-shirts', 'shorts', 'sandals', 'sundresses'],
      'fall': ['sweaters', 'boots', 'jackets', 'scarves'],
      'winter': ['coats', 'boots', 'sweaters', 'gloves']
    };
    return seasonalItems[season] || [];
  },

  // Calculate outfit total
  calculateOutfitTotal: (items) => {
    return items.reduce((total, item) => {
      const price = item.discountPercentage > 0 
        ? item.price - (item.price * item.discountPercentage / 100)
        : item.price;
      return total + price;
    }, 0);
  }
};

const clothesService = new ClothesService();
export default clothesService;

// Fixed named exports with proper commas
export const {
  getClothes,
  getClothingById,
  getClothingCategories,
  getClothingBrands,
  getAvailableSizes,
  getAvailableColors,
  getSizeChart,
  getClothesByBrand,
  getTrendingClothes,
  getNewArrivals,
  getSaleClothes,
  getClothingRecommendations,
  getSimilarClothes,
  getCompleteTheLook,
  checkStockAvailability,
  getClothingReviews,
  addClothingReview,
  getClothingFilters,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getOutfitSuggestions,
  virtualTryOn,
  getCareInstructions,
  trackPriceChanges,
  getPriceHistory,
  getStock,  
  addClothingItem,        // Fixed: Added comma
  updateClothingItem,     // Fixed: Added comma
  deleteClothingItem      // Fixed: Added comma
} = clothesService;

