import api from './api';
import { handleApiError } from '../utils/errorHandler';

class ProductService {
  // Get all products with filters
  async getProducts(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        minPrice,
        maxPrice,
        sortBy = 'name',
        sortOrder = 'asc',
        search,
        inStock = true,
        featured,
        onSale
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
      if (minPrice) queryParams.append('minPrice', minPrice.toString());
      if (maxPrice) queryParams.append('maxPrice', maxPrice.toString());
      if (search) queryParams.append('search', search);
      if (featured !== undefined) queryParams.append('featured', featured.toString());
      if (onSale !== undefined) queryParams.append('onSale', onSale.toString());

      const response = await api.get(`/products?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product by ID
  async getProductById(productId) {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Search products
  async searchProducts(query, params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        category,
        sortBy = 'relevance',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams({
        q: query,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (category) queryParams.append('category', category);

      const response = await api.get(`/products/search?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get products by category
  async getProductsByCategory(categoryId, params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sortBy = 'name',
        sortOrder = 'asc'
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      const response = await api.get(`/categories/${categoryId}/products?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    try {
      const response = await api.get(`/products/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get popular products
  async getPopularProducts(limit = 10) {
    try {
      const response = await api.get(`/products/popular?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get recommended products
  async getRecommendedProducts(userId, limit = 10) {
    try {
      const response = await api.get(`/products/recommendations?userId=${userId}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get discounted products
  async getDiscountedProducts(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        minDiscount = 5,
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
      

      const response = await api.get(`/products/discounted?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
// Get trending products
async getTrendingProducts(limit = 10) {
  try {
    const response = await api.get(`/products/trending?limit=${limit}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

  // Get product reviews
  async getProductReviews(productId, params = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        rating
      } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder
      });

      if (rating) queryParams.append('rating', rating.toString());

      const response = await api.get(`/products/${productId}/reviews?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add product review
  async addProductReview(productId, reviewData) {
    try {
      const response = await api.post(`/products/${productId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

// Update product review
  async updateProductReview(productId, reviewId, reviewData) {
    try {
      const response = await api.put(`/products/${productId}/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }


// Get related products (alias for similar products)
async getRelatedProducts(productId, limit = 8) {
  try {
    const response = await api.get(`/products/${productId}/related?limit=${limit}`);
    return response.data;
  } catch (error) {
    // Fallback to similar products if related endpoint doesn't exist
    return this.getSimilarProducts(productId, limit);
  }
}

  // Delete product review
  async deleteProductReview(productId, reviewId) {
    try {
      const response = await api.delete(`/products/${productId}/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product variants
  async getProductVariants(productId) {
    try {
      const response = await api.get(`/products/${productId}/variants`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Check product availability
  async checkProductAvailability(productId, variantId = null) {
    try {
      const url = variantId 
        ? `/products/${productId}/variants/${variantId}/availability`
        : `/products/${productId}/availability`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get similar products
  async getSimilarProducts(productId, limit = 8) {
    try {
      const response = await api.get(`/products/${productId}/similar?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get frequently bought together
  async getFrequentlyBoughtTogether(productId, limit = 5) {
    try {
      const response = await api.get(`/products/${productId}/frequently-bought-together?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add to favorites
  async addToFavorites(productId) {
    try {
      const response = await api.post(`/products/${productId}/favorites`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Remove from favorites
  async removeFromFavorites(productId) {
    try {
      const response = await api.delete(`/products/${productId}/favorites`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get favorite products
  async getFavoriteProducts(params = {}) {
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

      const response = await api.get(`/products/favorites?${queryParams}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Report product
  async reportProduct(productId, reportData) {
    try {
      const response = await api.post(`/products/${productId}/report`, reportData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get categories
  async getCategories() {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get category by ID
  async getCategoryById(categoryId) {
    try {
      const response = await api.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product filters
  async getProductFilters() {
    try {
      const response = await api.get('/products/filters');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Admin/Vendor methods
  // Create product
  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update product
  async updateProduct(productId, productData) {
    try {
      const response = await api.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete product
  async deleteProduct(productId) {
    try {
      const response = await api.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update product availability
  async updateProductAvailability(productId, isAvailable) {
    try {
      const response = await api.patch(`/products/${productId}/availability`, {
        isAvailable
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Upload product image
  async uploadProductImage(productId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Delete product image
  async deleteProductImage(productId, imageId) {
    try {
      const response = await api.delete(`/products/${productId}/images/${imageId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Bulk update products
  async bulkUpdateProducts(updates) {
    try {
      const response = await api.patch('/products/bulk-update', { updates });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get product analytics
  async getProductAnalytics(productId, timeRange = '30d') {
    try {
      const response = await api.get(`/products/${productId}/analytics?timeRange=${timeRange}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Helper functions for products
export const productHelpers = {
  // Format product price with currency
  formatPrice: (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  },

  // Calculate discounted price
  calculateDiscountedPrice: (originalPrice, discountPercentage) => {
    return originalPrice - (originalPrice * discountPercentage / 100);
  },

  // Check if product is on sale
  isOnSale: (product) => {
    return product.discountPercentage > 0 && 
           product.saleEndDate && 
           new Date(product.saleEndDate) > new Date();
  },

  // Get product display price
  getDisplayPrice: (product) => {
    if (productHelpers.isOnSale(product)) {
      return productHelpers.calculateDiscountedPrice(
        product.price, 
        product.discountPercentage
      );
    }
    return product.price;
  },

  // Format product rating
  formatRating: (rating, maxRating = 5) => {
    return Math.round(rating * 10) / 10; // Round to 1 decimal place
  },

  // Get product availability status
  getAvailabilityStatus: (product) => {
    if (!product.isAvailable) return 'unavailable';
    if (product.stock <= 0) return 'out_of_stock';
    if (product.stock <= product.lowStockThreshold) return 'low_stock';
    return 'available';
  },

  // Sort products by various criteria
  sortProducts: (products, sortBy, sortOrder = 'asc') => {
    const sorted = [...products].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = productHelpers.getDisplayPrice(a);
          bValue = productHelpers.getDisplayPrice(b);
          break;
        case 'rating':
          aValue = a.averageRating || 0;
          bValue = b.averageRating || 0;
          break;
        case 'popularity':
          aValue = a.orderCount || 0;
          bValue = b.orderCount || 0;
          break;
        case 'discount':
          aValue = a.discountPercentage || 0;
          bValue = b.discountPercentage || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  },

  
  // Group products by category
  groupByCategory: (products) => {
    return products.reduce((groups, product) => {
      const category = product.category?.name || 'Uncategorized';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
      return groups;
    }, {});
  },

  // Filter products by price range
  filterByPriceRange: (products, minPrice, maxPrice) => {
    return products.filter(product => {
      const price = productHelpers.getDisplayPrice(product);
      return price >= minPrice && price <= maxPrice;
    });
  },

  // Filter products by rating
  filterByRating: (products, minRating) => {
    return products.filter(product => 
      (product.averageRating || 0) >= minRating
    );
  },

  // Get product image URL with fallback
  getProductImageUrl: (product, size = 'medium') => {
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      return image.sizes?.[size] || image.url;
    }
    return '/images/product-placeholder.jpg';
  },

  // Check if product is new (within last 30 days)
  isNewProduct: (product, daysThreshold = 30) => {
    const createdDate = new Date(product.createdAt);
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    return createdDate > thresholdDate;
  },

  // Generate product URL slug
  generateSlug: (productName) => {
    return productName
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  },

  // Calculate savings amount
  calculateSavings: (originalPrice, discountPercentage) => {
    return originalPrice * discountPercentage / 100;
  },

  // Format product attributes for display
  formatProductAttributes: (product) => {
    return {
      ...product,
      formattedPrice: productHelpers.formatPrice(product.price),
      displayPrice: productHelpers.getDisplayPrice(product),
      formattedDisplayPrice: productHelpers.formatPrice(
        productHelpers.getDisplayPrice(product)
      ),
      isOnSale: productHelpers.isOnSale(product),
      isNew: productHelpers.isNewProduct(product),
      availabilityStatus: productHelpers.getAvailabilityStatus(product),
      savings: productHelpers.calculateSavings(
        product.price, 
        product.discountPercentage || 0
      ),
      imageUrl: productHelpers.getProductImageUrl(product),
      slug: productHelpers.generateSlug(product.name)
    };
  }
};

// Cache management
export const productCache = {
  cache: new Map(),
  
  set: (key, data, ttl = 300000) => { // 5 minutes default TTL
    const expiry = Date.now() + ttl;
    productCache.cache.set(key, { data, expiry });
  },
  
  get: (key) => {
    const item = productCache.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      productCache.cache.delete(key);
      return null;
    }
    
    return item.data;
  },
  
  clear: () => {
    productCache.cache.clear();
  },
  
  delete: (key) => {
    productCache.cache.delete(key);
  }
};

// Search utilities
export const searchUtils = {
  // Highlight search terms in text
  highlightSearchTerms: (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  // Get search suggestions
  getSearchSuggestions: (query, products, limit = 5) => {
    const suggestions = products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description?.toLowerCase().includes(query.toLowerCase()) ||
        product.category?.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit)
      .map(product => ({
        id: product.id,
        name: product.name,
        category: product.category?.name,
        imageUrl: productHelpers.getProductImageUrl(product, 'small')
      }));

    return suggestions;
  },

  // Save search history
  saveSearchHistory: (query) => {
    const history = searchUtils.getSearchHistory();
    const updatedHistory = [query, ...history.filter(item => item !== query)].slice(0, 10);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  },

  // Get search history
  getSearchHistory: () => {
    try {
      return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    } catch {
      return [];
    }
  },

  // Clear search history
  clearSearchHistory: () => {
    localStorage.removeItem('searchHistory');
  }
};

const productService = new ProductService();
export default productService;

// End of file mein named exports mein add karo
export const {
  getProducts,
  getProductById,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getPopularProducts,
  getRecommendedProducts,
  getDiscountedProducts,
  getProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getProductVariants,
  checkProductAvailability,
  getSimilarProducts,
  getRelatedProducts,        // ADD THIS LINE
  getFrequentlyBoughtTogether,
  addToFavorites,
  removeFromFavorites,
  getFavoriteProducts,
  reportProduct,
  getCategories,
  getCategoryById,
  getProductFilters,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductAvailability,
  uploadProductImage,
  deleteProductImage,
  bulkUpdateProducts,
  getProductAnalytics
} = productService;
export const addProduct = productService.createProduct