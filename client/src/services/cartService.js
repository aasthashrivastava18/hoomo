import api from './api';
import { handleApiError } from '../utils/errorHandler';

class CartService {
  // Get cart items
  async getCart() {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Add item to cart
  async addToCart(productId, quantity = 1, options = {}) {
    try {
      const response = await api.post('/cart/add', {
        productId,
        quantity,
        options
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Update cart item quantity
  async updateCartItem(itemId, quantity) {
    try {
      const response = await api.put(`/cart/items/${itemId}`, {
        quantity
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Remove item from cart
  async removeFromCart(itemId) {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Clear entire cart
  async clearCart() {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Apply coupon code
  async applyCoupon(couponCode) {
    try {
      const response = await api.post('/cart/coupon', {
        couponCode
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Remove coupon
  async removeCoupon() {
    try {
      const response = await api.delete('/cart/coupon');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get cart summary
  async getCartSummary() {
    try {
      const response = await api.get('/cart/summary');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Validate cart before checkout
  async validateCart() {
    try {
      const response = await api.post('/cart/validate');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Save cart for later
  async saveForLater(itemId) {
    try {
      const response = await api.post(`/cart/items/${itemId}/save-for-later`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Move item from saved to cart
  async moveToCart(itemId) {
    try {
      const response = await api.post(`/cart/saved-items/${itemId}/move-to-cart`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get saved items
  async getSavedItems() {
    try {
      const response = await api.get('/cart/saved-items');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Merge guest cart with user cart
  async mergeCart(guestCartItems) {
    try {
      const response = await api.post('/cart/merge', {
        guestCartItems
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Calculate shipping
  async calculateShipping(address) {
    try {
      const response = await api.post('/cart/shipping', {
        address
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Get available coupons
  async getAvailableCoupons() {
    try {
      const response = await api.get('/cart/available-coupons');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  // Local storage methods for guest cart
  getGuestCart() {
    try {
      const cart = localStorage.getItem('guestCart');
      return cart ? JSON.parse(cart) : { items: [], total: 0 };
    } catch {
      return { items: [], total: 0 };
    }
  }

  setGuestCart(cart) {
    localStorage.setItem('guestCart', JSON.stringify(cart));
  }

  addToGuestCart(product, quantity = 1, options = {}) {
    const cart = this.getGuestCart();
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === product.id && 
      JSON.stringify(item.options) === JSON.stringify(options)
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        id: Date.now().toString(),
        productId: product.id,
        product,
        quantity,
        options,
        price: product.price
      });
    }

    this.calculateGuestCartTotal(cart);
    this.setGuestCart(cart);
    return cart;
  }

  updateGuestCartItem(itemId, quantity) {
    const cart = this.getGuestCart();
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
      this.calculateGuestCartTotal(cart);
      this.setGuestCart(cart);
    }
    
    return cart;
  }

  removeFromGuestCart(itemId) {
    const cart = this.getGuestCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    this.calculateGuestCartTotal(cart);
    this.setGuestCart(cart);
    return cart;
  }

  clearGuestCart() {
    const emptyCart = { items: [], total: 0 };
    this.setGuestCart(emptyCart);
    return emptyCart;
  }

  calculateGuestCartTotal(cart) {
    cart.subtotal = cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    cart.tax = cart.subtotal * 0.1; // 10% tax
    cart.total = cart.subtotal + cart.tax;
    
    return cart;
  }

  getCartItemCount() {
    const cart = this.getGuestCart();
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }
}

const cartService = new CartService();
export default cartService;

export const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  getCartSummary,
  validateCart,
  saveForLater,
  moveToCart,
  getSavedItems,
  mergeCart,
  calculateShipping,
  getAvailableCoupons
} = cartService;


