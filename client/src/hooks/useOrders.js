import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import useAuth from './useAuth';
import { 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  cancelOrder 
} from '../services/orderService';

/**
 * Custom hook for managing orders
 * @param {boolean} fetchOnMount - Whether to fetch orders when component mounts
 * @param {string} initialOrderId - Initial order ID to fetch details for
 * @returns {Object} Order-related state and functions
 */
const useOrders = (fetchOnMount = true, initialOrderId = null) => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  /**
   * Fetch all orders for the current user
   * @param {Object} filters - Optional filters for orders
   */
  const fetchOrders = useCallback(async (filters = {}) => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await getOrders(filters);
      setOrders(response.orders);
      
      // Calculate order statistics
      if (response.orders) {
        const stats = {
          total: response.orders.length,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        };
        
        response.orders.forEach(order => {
          stats[order.status.toLowerCase()]++;
        });
        
        setOrderStats(stats);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch a specific order by ID
   * @param {string} orderId - The ID of the order to fetch
   */
  const fetchOrderById = useCallback(async (orderId) => {
    if (!orderId || !isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const order = await getOrderById(orderId);
      setCurrentOrder(order);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Update the status of an order
   * @param {string} orderId - The ID of the order to update
   * @param {string} newStatus - The new status for the order
   * @returns {Promise<boolean>} Whether the update was successful
   */
  const updateOrder = async (orderId, newStatus) => {
    if (!orderId || !isAuthenticated) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      await updateOrderStatus(orderId, newStatus);
      
      // Update orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Update current order if it's the one being modified
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(prev => ({ ...prev, status: newStatus }));
      }
      
      toast.success(`Order status updated to ${newStatus}`);
      return true;
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
      toast.error('Failed to update order status');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel an order
   * @param {string} orderId - The ID of the order to cancel
   * @param {string} reason - The reason for cancellation
   * @returns {Promise<boolean>} Whether the cancellation was successful
   */
  const handleCancelOrder = async (orderId, reason) => {
    if (!orderId || !isAuthenticated) return false;
    
    try {
      setLoading(true);
      setError(null);
      
      await cancelOrder(orderId, reason);
      
      // Update orders list
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled', cancellationReason: reason } : order
        )
      );
      
      // Update current order if it's the one being cancelled
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(prev => ({ 
          ...prev, 
          status: 'cancelled', 
          cancellationReason: reason 
        }));
      }
      
      toast.success('Order cancelled successfully');
      return true;
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError('Failed to cancel order. Please try again.');
      toast.error('Failed to cancel order');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on mount if requested
  useEffect(() => {
    if (fetchOnMount && isAuthenticated) {
      fetchOrders();
    }
  }, [fetchOnMount, isAuthenticated, fetchOrders]);

  // Fetch specific order if initialOrderId is provided
  useEffect(() => {
    if (initialOrderId && isAuthenticated) {
      fetchOrderById(initialOrderId);
    }
  }, [initialOrderId, isAuthenticated, fetchOrderById]);

  return {
    orders,
    currentOrder,
    loading,
    error,
    orderStats,
    fetchOrders,
    fetchOrderById,
    updateOrder,
    cancelOrder: handleCancelOrder,
  };
};

export default useOrders;
