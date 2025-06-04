import React, { createContext, useContext, useReducer, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  coupon: null,
  isLoading: false,
  error: null,
  savedItems: []
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOAD_CART_SUCCESS: 'LOAD_CART_SUCCESS',
  ADD_ITEM_SUCCESS: 'ADD_ITEM_SUCCESS',
  UPDATE_ITEM_SUCCESS: 'UPDATE_ITEM_SUCCESS',
  REMOVE_ITEM_SUCCESS: 'REMOVE_ITEM_SUCCESS',
  CLEAR_CART_SUCCESS: 'CLEAR_CART_SUCCESS',
  APPLY_COUPON_SUCCESS: 'APPLY_COUPON_SUCCESS',
  REMOVE_COUPON_SUCCESS: 'REMOVE_COUPON_SUCCESS',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS',
  SAVE_FOR_LATER_SUCCESS: 'SAVE_FOR_LATER_SUCCESS',
  MOVE_TO_CART_SUCCESS: 'MOVE_TO_CART_SUCCESS',
  LOAD_SAVED_ITEMS_SUCCESS: 'LOAD_SAVED_ITEMS_SUCCESS'
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case CART_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case CART_ACTIONS.LOAD_CART_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.ADD_ITEM_SUCCESS:
      const existingItemIndex = state.items.findIndex(
        item => item.productId === action.payload.productId &&
        JSON.stringify(item.options) === JSON.stringify(action.payload.options)
      );

      let newItems;
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        newItems = [...state.items, action.payload];
      }

      return {
        ...state,
        items: newItems,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.REMOVE_ITEM_SUCCESS:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.CLEAR_CART_SUCCESS:
      return {
        ...initialState,
        savedItems: state.savedItems
      };

    case CART_ACTIONS.APPLY_COUPON_SUCCESS:
      return {
        ...state,
        coupon: action.payload.coupon,
        discount: action.payload.discount,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.REMOVE_COUPON_SUCCESS:
      return {
        ...state,
        coupon: null,
        discount: 0,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.CALCULATE_TOTALS:
      const subtotal = state.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const totalItems = state.items.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);

      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax + state.shipping - state.discount;

      return {
        ...state,
        subtotal,
        totalItems,
        tax,
        total: Math.max(0, total)
      };

    case CART_ACTIONS.SAVE_FOR_LATER_SUCCESS:
      const itemToSave = state.items.find(item => item.id === action.payload.itemId);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.itemId),
        savedItems: itemToSave ? [...state.savedItems, itemToSave] : state.savedItems,
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.MOVE_TO_CART_SUCCESS:
      const itemToMove = state.savedItems.find(item => item.id === action.payload.itemId);
      return {
        ...state,
        items: itemToMove ? [...state.items, itemToMove] : state.items,
               savedItems: state.savedItems.filter(item => item.id !== action.payload.itemId),
        isLoading: false,
        error: null
      };

    case CART_ACTIONS.LOAD_SAVED_ITEMS_SUCCESS:
      return {
        ...state,
        savedItems: action.payload,
        isLoading: false,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Calculate totals whenever items, discount, or shipping changes
  useEffect(() => {
    dispatch({ type: CART_ACTIONS.CALCULATE_TOTALS });
  }, [state.items, state.discount, state.shipping]);

  // Load cart when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
      loadSavedItems();
    } else {
      // Load from localStorage for guest users
      loadGuestCart();
    }
  }, [isAuthenticated]);

  // Load cart from server
  const loadCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
      
      const cartData = await cartService.getCart();
      
      dispatch({
        type: CART_ACTIONS.LOAD_CART_SUCCESS,
        payload: cartData
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
    }
  };

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart) {
        const cartData = JSON.parse(guestCart);
        dispatch({
          type: CART_ACTIONS.LOAD_CART_SUCCESS,
          payload: cartData
        });
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = () => {
    if (!isAuthenticated) {
      localStorage.setItem('guestCart', JSON.stringify({
        items: state.items,
        coupon: state.coupon,
        discount: state.discount
      }));
    }
  };

  // Add item to cart
  const addItem = async (productId, quantity = 1, options = {}) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        const response = await cartService.addToCart(productId, quantity, options);
        dispatch({
          type: CART_ACTIONS.ADD_ITEM_SUCCESS,
          payload: response.item
        });
      } else {
        // Handle guest cart
        const newItem = {
          id: Date.now().toString(),
          productId,
          quantity,
          options,
          price: options.price || 0,
          name: options.name || 'Product',
          image: options.image || ''
        };
        
        dispatch({
          type: CART_ACTIONS.ADD_ITEM_SUCCESS,
          payload: newItem
        });
        
        saveGuestCart();
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Update item quantity
  const updateItem = async (itemId, quantity) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (quantity <= 0) {
        return removeItem(itemId);
      }

      if (isAuthenticated) {
        await cartService.updateCartItem(itemId, quantity);
      }

      dispatch({
        type: CART_ACTIONS.UPDATE_ITEM_SUCCESS,
        payload: { id: itemId, quantity }
      });

      if (!isAuthenticated) {
        saveGuestCart();
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        await cartService.removeFromCart(itemId);
      }

      dispatch({
        type: CART_ACTIONS.REMOVE_ITEM_SUCCESS,
        payload: itemId
      });

      if (!isAuthenticated) {
        saveGuestCart();
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        await cartService.clearCart();
      } else {
        localStorage.removeItem('guestCart');
      }

      dispatch({ type: CART_ACTIONS.CLEAR_CART_SUCCESS });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Apply coupon
  const applyCoupon = async (couponCode) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      const response = await cartService.applyCoupon(couponCode);
      
      dispatch({
        type: CART_ACTIONS.APPLY_COUPON_SUCCESS,
        payload: response
      });

      return response;
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Remove coupon
  const removeCoupon = async () => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        await cartService.removeCoupon();
      }

      dispatch({ type: CART_ACTIONS.REMOVE_COUPON_SUCCESS });

      if (!isAuthenticated) {
        saveGuestCart();
      }
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Save item for later
  const saveForLater = async (itemId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        await cartService.saveForLater(itemId);
      }

      dispatch({
        type: CART_ACTIONS.SAVE_FOR_LATER_SUCCESS,
        payload: { itemId }
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Move item back to cart
  const moveToCart = async (itemId) => {
    try {
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      if (isAuthenticated) {
        await cartService.moveToCart(itemId);
      }

      dispatch({
        type: CART_ACTIONS.MOVE_TO_CART_SUCCESS,
        payload: { itemId }
      });
    } catch (error) {
      dispatch({
        type: CART_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Load saved items
  const loadSavedItems = async () => {
    try {
      if (isAuthenticated) {
        const savedItems = await cartService.getSavedItems();
        dispatch({
          type: CART_ACTIONS.LOAD_SAVED_ITEMS_SUCCESS,
          payload: savedItems
        });
      }
    } catch (error) {
      console.error('Error loading saved items:', error);
    }
  };

  // Get item count for specific product
  const getItemCount = (productId, options = {}) => {
    const item = state.items.find(
      item => item.productId === productId &&
      JSON.stringify(item.options) === JSON.stringify(options)
    );
    return item ? item.quantity : 0;
  };

  // Check if item is in cart
  const isInCart = (productId, options = {}) => {
    return getItemCount(productId, options) > 0;
  };

  // Get cart summary
  const getCartSummary = () => {
    return {
      totalItems: state.totalItems,
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      discount: state.discount,
      total: state.total,
      coupon: state.coupon
    };
  };

  // Estimate shipping
  const estimateShipping = async (address) => {
    try {
      const shipping = await cartService.estimateShipping(address);
      dispatch({
        type: CART_ACTIONS.LOAD_CART_SUCCESS,
        payload: { ...state, shipping }
      });
      return shipping;
    } catch (error) {
      throw error;
    }
  };

  // Validate cart before checkout
  const validateCart = async () => {
    try {
      if (isAuthenticated) {
        return await cartService.validateCart();
      }
      return { valid: true, errors: [] };
    } catch (error) {
      throw error;
    }
  };

  // Merge guest cart with user cart on login
  const mergeGuestCart = async () => {
    try {
      const guestCart = localStorage.getItem('guestCart');
      if (guestCart && isAuthenticated) {
        const guestCartData = JSON.parse(guestCart);
        
        for (const item of guestCartData.items) {
          await addItem(item.productId, item.quantity, item.options);
        }
        
        localStorage.removeItem('guestCart');
      }
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    // State
    ...state,
    
    // Actions
    addItem,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    saveForLater,
    moveToCart,
    loadCart,
    loadSavedItems,
    estimateShipping,
    validateCart,
    mergeGuestCart,
    clearError,
    
    // Utility functions
    getItemCount,
    isInCart,
    getCartSummary
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};

export default CartContext;


