import api from './api';

class OrderService {
  // Get all orders with filters and pagination
  async getOrders(params = {}) {
    try {
      const response = await api.get('/orders', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  }

  // Get single order by ID
  async getOrderById(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  }

  // Create new order
  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  }

  // Update order
  async updateOrder(orderId, updateData) {
    try {
      const response = await api.put(`/orders/${orderId}`, updateData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order');
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason = '') {
    try {
      const response = await api.post(`/orders/${orderId}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  }

  // Get order history
  async getOrderHistory(params = {}) {
    try {
      const response = await api.get('/orders/history', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order history');
    }
  }

  // Get recent orders
  async getRecentOrders(limit = 5) {
    try {
      const response = await api.get(`/orders/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent orders');
    }
  }

  // Get order statistics
  async getOrderStats() {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order stats');
    }
  }

  // Track order
  async trackOrder(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/track`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to track order');
    }
  }

  // Reorder items from previous order
  async reorder(orderId) {
    try {
      const response = await api.post(`/orders/${orderId}/reorder`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reorder');
    }
  }

  // Download order invoice
  async downloadInvoice(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download invoice');
    }
  }

  // Add order review
  async addOrderReview(orderId, reviewData) {
    try {
      const response = await api.post(`/orders/${orderId}/review`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add review');
    }
  }

  // Request refund
  async requestRefund(orderId, refundData) {
    try {
      const response = await api.post(`/orders/${orderId}/refund`, refundData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to request refund');
    }
  }

  // Search orders
  async searchOrders(query) {
    try {
      const response = await api.get(`/orders/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search orders');
    }
  }

  // Export orders
  async exportOrders(format = 'csv', filters = {}) {
    try {
      const response = await api.get('/orders/export', {
        params: { format, ...filters },
        responseType: 'blob'
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to export orders');
    }
  }

  // Bulk cancel orders
  async bulkCancelOrders(orderIds, reason = '') {
    try {
      const response = await api.post('/orders/bulk-cancel', { orderIds, reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel orders');
    }
  }

  // Get order analytics
  async getOrderAnalytics(timeRange = '30d') {
    try {
      const response = await api.get(`/orders/analytics?range=${timeRange}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }

  // WebSocket methods for real-time updates
  subscribeToOrderUpdates(orderId, callback) {
    // This would typically use WebSocket or Socket.IO
    // For now, we'll use polling as fallback
    const interval = setInterval(async () => {
      try {
        const order = await this.getOrderById(orderId);
        callback(order);
      } catch (error) {
        console.error('Error polling order updates:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }

  unsubscribeFromOrderUpdates(orderId) {
    // Implementation would depend on WebSocket setup
    console.log(`Unsubscribed from order ${orderId} updates`);
  }

  // Estimate delivery date
  async estimateDelivery(orderId, address) {
    try {
      const response = await api.post(`/orders/${orderId}/estimate-delivery`, address);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to estimate delivery');
    }
  }

  // Update delivery address
  async updateDeliveryAddress(orderId, address) {
    try {
      const response = await api.put(`/orders/${orderId}/delivery-address`, address);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update delivery address');
    }
  }

  // Get order timeline
  async getOrderTimeline(orderId) {
    try {
      const response = await api.get(`/orders/${orderId}/timeline`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order timeline');
    }
  }

  // Rate delivery
  async rateDelivery(orderId, rating, feedback = '') {
    try {
      const response = await api.post(`/orders/${orderId}/rate-delivery`, {
        rating,
        feedback
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to rate delivery');
    }
  }

  // Report order issue
  async reportOrderIssue(orderId, issueData) {
    try {
      const response = await api.post(`/orders/${orderId}/report-issue`, issueData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to report issue');
    }
  }
}

// Create and export instance
const orderService = new OrderService();
export default orderService;


