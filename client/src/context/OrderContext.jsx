import React, { createContext, useContext, useReducer, useEffect } from 'react';
import orderService from '../services/orderService';
import { useAuth } from './AuthContext';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  orderHistory: [],
  recentOrders: [],
  orderStats: {
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  },
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {
    status: '',
    dateRange: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
};

// Action types
const ORDER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOAD_ORDERS_SUCCESS: 'LOAD_ORDERS_SUCCESS',
  LOAD_ORDER_SUCCESS: 'LOAD_ORDER_SUCCESS',
  CREATE_ORDER_SUCCESS: 'CREATE_ORDER_SUCCESS',
  UPDATE_ORDER_SUCCESS: 'UPDATE_ORDER_SUCCESS',
  CANCEL_ORDER_SUCCESS: 'CANCEL_ORDER_SUCCESS',
  LOAD_ORDER_HISTORY_SUCCESS: 'LOAD_ORDER_HISTORY_SUCCESS',
  LOAD_RECENT_ORDERS_SUCCESS: 'LOAD_RECENT_ORDERS_SUCCESS',
  LOAD_ORDER_STATS_SUCCESS: 'LOAD_ORDER_STATS_SUCCESS',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  TRACK_ORDER_SUCCESS: 'TRACK_ORDER_SUCCESS',
  REORDER_SUCCESS: 'REORDER_SUCCESS'
};

// Reducer
const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDER_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ORDER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ORDER_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ORDER_ACTIONS.LOAD_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload.orders,
        pagination: {
          ...state.pagination,
          ...action.payload.pagination
        },
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.LOAD_ORDER_SUCCESS:
      return {
        ...state,
        currentOrder: action.payload,
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
        recentOrders: [action.payload, ...state.recentOrders.slice(0, 4)],
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id 
          ? action.payload 
          : state.currentOrder,
        recentOrders: state.recentOrders.map(order =>
          order.id === action.payload.id ? action.payload : order
        ),
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.CANCEL_ORDER_SUCCESS:
      const cancelledOrder = { ...action.payload, status: 'cancelled' };
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? cancelledOrder : order
        ),
        currentOrder: state.currentOrder?.id === action.payload.id 
          ? cancelledOrder 
          : state.currentOrder,
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.LOAD_ORDER_HISTORY_SUCCESS:
      return {
        ...state,
        orderHistory: action.payload,
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.LOAD_RECENT_ORDERS_SUCCESS:
      return {
        ...state,
        recentOrders: action.payload,
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.LOAD_ORDER_STATS_SUCCESS:
      return {
        ...state,
        orderStats: action.payload,
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        }
      };

    case ORDER_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload
        }
      };

    case ORDER_ACTIONS.TRACK_ORDER_SUCCESS:
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          tracking: action.payload
        },
        isLoading: false,
        error: null
      };

    case ORDER_ACTIONS.REORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const OrderContext = createContext();

// Order provider component
export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Load orders when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadRecentOrders();
      loadOrderStats();
    }
  }, [isAuthenticated]);

  // Load orders with filters and pagination
  const loadOrders = async (customFilters = {}, customPagination = {}) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const filters = { ...state.filters, ...customFilters };
      const pagination = { ...state.pagination, ...customPagination };

      const response = await orderService.getOrders({
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      });

      dispatch({
        type: ORDER_ACTIONS.LOAD_ORDERS_SUCCESS,
        payload: response
      });
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
    }
  };

  // Load single order by ID
  const loadOrder = async (orderId) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const order = await orderService.getOrderById(orderId);

      dispatch({
        type: ORDER_ACTIONS.LOAD_ORDER_SUCCESS,
        payload: order
      });

      return order;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const newOrder = await orderService.createOrder(orderData);

      dispatch({
        type: ORDER_ACTIONS.CREATE_ORDER_SUCCESS,
        payload: newOrder
      });

      return newOrder;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Update order
  const updateOrder = async (orderId, updateData) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const updatedOrder = await orderService.updateOrder(orderId, updateData);

      dispatch({
        type: ORDER_ACTIONS.UPDATE_ORDER_SUCCESS,
        payload: updatedOrder
      });

      return updatedOrder;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Cancel order
  const cancelOrder = async (orderId, reason = '') => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const cancelledOrder = await orderService.cancelOrder(orderId, reason);

      dispatch({
        type: ORDER_ACTIONS.CANCEL_ORDER_SUCCESS,
        payload: cancelledOrder
      });

      return cancelledOrder;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Load order history
  const loadOrderHistory = async (params = {}) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const orderHistory = await orderService.getOrderHistory(params);

      dispatch({
        type: ORDER_ACTIONS.LOAD_ORDER_HISTORY_SUCCESS,
        payload: orderHistory
      });
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
    }
  };

  // Load recent orders
  const loadRecentOrders = async (limit = 5) => {
    try {
      const recentOrders = await orderService.getRecentOrders(limit);

      dispatch({
        type: ORDER_ACTIONS.LOAD_RECENT_ORDERS_SUCCESS,
        payload: recentOrders
      });
    } catch (error) {
      console.error('Error loading recent orders:', error);
    }
  };

  // Load order statistics
  const loadOrderStats = async () => {
    try {
      const stats = await orderService.getOrderStats();

      dispatch({
        type: ORDER_ACTIONS.LOAD_ORDER_STATS_SUCCESS,
        payload: stats
      });
    } catch (error) {
      console.error('Error loading order stats:', error);
    }
  };

  // Track order
  const trackOrder = async (orderId) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const tracking = await orderService.trackOrder(orderId);

      dispatch({
        type: ORDER_ACTIONS.TRACK_ORDER_SUCCESS,
        payload: tracking
      });

      return tracking;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Reorder items from previous order
  const reorder = async (orderId) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const result = await orderService.reorder(orderId);

      dispatch({
        type: ORDER_ACTIONS.REORDER_SUCCESS
      });

      return result;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Download order invoice
  const downloadInvoice = async (orderId) => {
    try {
      return await orderService.downloadInvoice(orderId);
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Add order review
  const addOrderReview = async (orderId, reviewData) => {
    try {
      const review = await orderService.addOrderReview(orderId, reviewData);
      
      // Update the order with the new review
      const updatedOrder = {
        ...state.currentOrder,
        review: review
      };

      dispatch({
        type: ORDER_ACTIONS.UPDATE_ORDER_SUCCESS,
        payload: updatedOrder
      });

      return review;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Request order refund
  const requestRefund = async (orderId, refundData) => {
    try {
      return await orderService.requestRefund(orderId, refundData);
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Set filters
  const setFilters = (newFilters) => {
    dispatch({
      type: ORDER_ACTIONS.SET_FILTERS,
      payload: newFilters
    });

    // Reload orders with new filters
    loadOrders(newFilters, { page: 1 });
  };

  // Set pagination
  const setPagination = (newPagination) => {
    dispatch({
      type: ORDER_ACTIONS.SET_PAGINATION,
      payload: newPagination
    });

    // Reload orders with new pagination
    loadOrders({}, newPagination);
  };

  // Clear current order
  const clearCurrentOrder = () => {
    dispatch({
      type: ORDER_ACTIONS.LOAD_ORDER_SUCCESS,
      payload: null
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: ORDER_ACTIONS.CLEAR_ERROR });
  };

  // Get order by ID from current orders
  const getOrderById = (orderId) => {
    return state.orders.find(order => order.id === orderId);
  };

  // Get orders by status
  const getOrdersByStatus = (status) => {
    return state.orders.filter(order => order.status === status);
  };

  // Check if order can be cancelled
  const canCancelOrder = (order) => {
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    return cancellableStatuses.includes(order.status);
  };

  // Check if order can be returned
  const canReturnOrder = (order) => {
    const returnableStatuses = ['delivered'];
    const deliveryDate = new Date(order.deliveredAt);
    const daysSinceDelivery = (Date.now() - deliveryDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return returnableStatuses.includes(order.status) && daysSinceDelivery <= 30;
  };

  // Get order status color
  const getOrderStatusColor = (status) => {
    const statusColors = {
      pending: 'orange',
      confirmed: 'blue',
      processing: 'purple',
      shipped: 'indigo',
      delivered: 'green',
      cancelled: 'red',
      refunded: 'gray'
    };
    
    return statusColors[status] || 'gray';
  };

  // Calculate order total
  const calculateOrderTotal = (order) => {
    if (!order || !order.items) return 0;
    
    const subtotal = order.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
        return subtotal + (order.tax || 0) + (order.shipping || 0) - (order.discount || 0);
  };

  // Format order date
  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get estimated delivery date
  const getEstimatedDeliveryDate = (order) => {
    if (!order.estimatedDelivery) return null;
    
    const deliveryDate = new Date(order.estimatedDelivery);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if order is overdue
  const isOrderOverdue = (order) => {
    if (!order.estimatedDelivery || order.status === 'delivered') return false;
    
    const estimatedDate = new Date(order.estimatedDelivery);
    return Date.now() > estimatedDate.getTime();
  };

  // Get order progress percentage
  const getOrderProgress = (order) => {
    const statusProgress = {
      pending: 10,
      confirmed: 25,
      processing: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0,
      refunded: 0
    };
    
    return statusProgress[order.status] || 0;
  };

  // Search orders
  const searchOrders = async (query) => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const results = await orderService.searchOrders(query);

      dispatch({
        type: ORDER_ACTIONS.LOAD_ORDERS_SUCCESS,
        payload: { orders: results, pagination: state.pagination }
      });

      return results;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Export orders
  const exportOrders = async (format = 'csv', filters = {}) => {
    try {
      return await orderService.exportOrders(format, filters);
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Get order notifications
  const getOrderNotifications = () => {
    const notifications = [];
    
    state.orders.forEach(order => {
      if (isOrderOverdue(order)) {
        notifications.push({
          id: `overdue-${order.id}`,
          type: 'warning',
          title: 'Order Overdue',
          message: `Order #${order.orderNumber} is overdue for delivery`,
          orderId: order.id
        });
      }
      
      if (order.status === 'shipped' && !order.notificationSent) {
        notifications.push({
          id: `shipped-${order.id}`,
          type: 'info',
          title: 'Order Shipped',
          message: `Order #${order.orderNumber} has been shipped`,
          orderId: order.id
        });
      }
    });
    
    return notifications;
  };

  // Bulk operations
  const bulkCancelOrders = async (orderIds, reason = '') => {
    try {
      dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true });

      const results = await orderService.bulkCancelOrders(orderIds, reason);

      // Update orders in state
      results.forEach(cancelledOrder => {
        dispatch({
          type: ORDER_ACTIONS.CANCEL_ORDER_SUCCESS,
          payload: cancelledOrder
        });
      });

      return results;
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Get order analytics
  const getOrderAnalytics = async (timeRange = '30d') => {
    try {
      return await orderService.getOrderAnalytics(timeRange);
    } catch (error) {
      dispatch({
        type: ORDER_ACTIONS.SET_ERROR,
        payload: error.message
      });
      throw error;
    }
  };

  // Subscribe to order updates (WebSocket)
  const subscribeToOrderUpdates = (orderId, callback) => {
    return orderService.subscribeToOrderUpdates(orderId, (update) => {
      // Update order in state
      dispatch({
        type: ORDER_ACTIONS.UPDATE_ORDER_SUCCESS,
        payload: update
      });
      
      // Call callback if provided
      if (callback) callback(update);
    });
  };

  // Unsubscribe from order updates
  const unsubscribeFromOrderUpdates = (orderId) => {
    return orderService.unsubscribeFromOrderUpdates(orderId);
  };

  // Refresh orders
  const refreshOrders = () => {
    loadOrders();
    loadRecentOrders();
    loadOrderStats();
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      status: '',
      dateRange: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    setFilters(defaultFilters);
  };

  // Get filtered orders count
  const getFilteredOrdersCount = () => {
    return state.pagination.total;
  };

  // Check if there are any active orders
  const hasActiveOrders = () => {
    const activeStatuses = ['pending', 'confirmed', 'processing', 'shipped'];
    return state.orders.some(order => activeStatuses.includes(order.status));
  };

  // Get next page
  const loadNextPage = () => {
    if (state.pagination.page < state.pagination.totalPages) {
      setPagination({ page: state.pagination.page + 1 });
    }
  };

  // Get previous page
  const loadPreviousPage = () => {
    if (state.pagination.page > 1) {
      setPagination({ page: state.pagination.page - 1 });
    }
  };

  // Go to specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= state.pagination.totalPages) {
      setPagination({ page });
    }
  };

  const value = {
    // State
    ...state,
    
    // Actions
    loadOrders,
    loadOrder,
    createOrder,
    updateOrder,
    cancelOrder,
    loadOrderHistory,
    loadRecentOrders,
    loadOrderStats,
    trackOrder,
    reorder,
    downloadInvoice,
    addOrderReview,
    requestRefund,
    searchOrders,
    exportOrders,
    bulkCancelOrders,
    getOrderAnalytics,
    subscribeToOrderUpdates,
    unsubscribeFromOrderUpdates,
    refreshOrders,
    
    // Filters and Pagination
    setFilters,
    setPagination,
    resetFilters,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    
    // Utility functions
    clearCurrentOrder,
    clearError,
    getOrderById,
    getOrdersByStatus,
    canCancelOrder,
    canReturnOrder,
    getOrderStatusColor,
    calculateOrderTotal,
    formatOrderDate,
    getEstimatedDeliveryDate,
    isOrderOverdue,
    getOrderProgress,
    getOrderNotifications,
    getFilteredOrdersCount,
    hasActiveOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  
  return context;
};

// Custom hook for order tracking
export const useOrderTracking = (orderId) => {
  const { trackOrder, subscribeToOrderUpdates, unsubscribeFromOrderUpdates } = useOrder();
  const [tracking, setTracking] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      
      // Load initial tracking data
      trackOrder(orderId)
        .then(setTracking)
        .catch(console.error)
        .finally(() => setIsLoading(false));

      // Subscribe to real-time updates
      const unsubscribe = subscribeToOrderUpdates(orderId, (update) => {
        if (update.tracking) {
          setTracking(update.tracking);
        }
      });

      return () => {
        unsubscribeFromOrderUpdates(orderId);
        if (unsubscribe) unsubscribe();
      };
    }
  }, [orderId]);

  return { tracking, isLoading };
};

// Custom hook for order statistics
export const useOrderStats = () => {
  const { orderStats, loadOrderStats } = useOrder();

  React.useEffect(() => {
    loadOrderStats();
  }, []);

  return orderStats;
};

export default OrderContext;


