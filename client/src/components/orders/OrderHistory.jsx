import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaTruck, 
  FaBox, 
  FaStore,
  FaSortAmountDown,
  FaSortAmountUp,
  FaExclamationTriangle
} from 'react-icons/fa';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data for demonstration
        const mockOrders = [
          {
            id: 'ORD-12345',
            date: '2023-06-15T10:30:00',
            status: 'out_for_delivery',
            items: [
              {
                name: 'Organic Bananas',
                quantity: 2,
                price: 3.99,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Bananas'
              },
              {
                name: 'Whole Grain Bread',
                quantity: 1,
                price: 4.50,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Bread'
              }
            ],
            total: 18.48,
            vendor: 'Fresh Grocery Market',
            estimatedDelivery: '2023-06-15T14:30:00'
          },
          {
            id: 'ORD-67890',
            date: '2023-06-14T18:45:00',
            status: 'delivered',
            items: [
              {
                name: 'Margherita Pizza',
                quantity: 1,
                price: 12.99,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Pizza'
              },
              {
                name: 'Caesar Salad',
                quantity: 1,
                price: 8.50,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Salad'
              }
            ],
            total: 29.48,
            vendor: 'Italian Delights',
            deliveredAt: '2023-06-14T20:05:00'
          },
          {
            id: 'ORD-54321',
            date: '2023-06-13T14:20:00',
            status: 'processing',
            items: [
              {
                name: 'Cotton T-Shirt - Blue',
                quantity: 2,
                price: 19.99,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Tshirt'
              },
              {
                name: 'Denim Jeans - Black',
                quantity: 1,
                price: 49.99,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Jeans'
              }
            ],
            total: 94.96,
            vendor: 'Fashion Trends',
            estimatedDelivery: '2023-06-16T12:00:00'
          },
          {
            id: 'ORD-98765',
            date: '2023-06-10T09:15:00',
            status: 'delivered',
            items: [
              {
                name: 'Wireless Headphones',
                quantity: 1,
                price: 79.99,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Headphones'
              }
            ],
            total: 86.39,
            vendor: 'Tech Gadgets',
            deliveredAt: '2023-06-11T15:20:00'
          },
          {
            id: 'ORD-24680',
            date: '2023-06-05T16:40:00',
            status: 'cancelled',
            items: [
              {
                name: 'Fitness Tracker',
                quantity: 1,
                price: 49.99,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Tracker'
              },
              {
                name: 'Yoga Mat',
                quantity: 1,
                price: 29.99,
                image: 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=YogaMat'
              }
            ],
            total: 85.98,
            vendor: 'Fitness Essentials',
            cancelledAt: '2023-06-05T17:30:00',
            cancellationReason: 'Customer requested cancellation'
          }
        ];
        
        setOrders(mockOrders);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      case 'processing':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'preparing':
        return <FaBox className="text-blue-500" />;
      case 'ready_for_pickup':
        return <FaStore className="text-purple-500" />;
      case 'out_for_delivery':
        return <FaTruck className="text-orange-500" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'processing':
        return 'Processing';
      case 'preparing':
        return 'Preparing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      default:
        return 'Processing';
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const filteredOrders = orders
    .filter(order => {
      // Filter by search term
      if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !order.vendor.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Filter by status
      if (filterStatus !== 'all' && order.status !== filterStatus) {
        return false;
      }
      
      // Filter by date range
      if (dateRange.start && new Date(order.date) < new Date(dateRange.start)) {
        return false;
      }
      
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        if (new Date(order.date) > endDate) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Order History</h1>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, vendor, or item..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            <div className="flex items-center">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mr-2"
                value={filterStatus}
                onChange={handleFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="preparing">Preparing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <button
                onClick={handleSortToggle}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {sortOrder === 'desc' ? (
                  <FaSortAmountDown className="mr-1" />
                ) : (
                  <FaSortAmountUp className="mr-1" />
                )}
                {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaFilter className="mr-1" />
                Filters
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Date Range</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    type="date"
                    id="start-date"
                    name="start"
                    value={dateRange.start}
                    onChange={handleDateRangeChange}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    type="date"
                    id="end-date"
                    name="end"
                    value={dateRange.end}
                    onChange={handleDateRangeChange}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                                      onClick={() => setDateRange({ start: '', end: '' })}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Dates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* No Orders Message */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex flex-col items-center">
              <FaBox className="text-gray-400 text-5xl mb-4" />
              <h2 className="text-xl font-medium text-gray-800 mb-2">No orders found</h2>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' || dateRange.start || dateRange.end
                  ? "No orders match your search criteria. Try adjusting your filters."
                  : "You haven't placed any orders yet. Start shopping to see your orders here."}
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Products
              </Link>
            </div>
          </div>
        )}
        
        {/* Orders List */}
        {filteredOrders.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <li key={order.id} className="hover:bg-gray-50">
                  <Link to={`/orders/${order.id}`} className="block">
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        {/* Order Info */}
                        <div className="mb-4 sm:mb-0">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-blue-600">{order.id}</h3>
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{getStatusText(order.status)}</span>
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Ordered on {formatDate(order.date)}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {order.vendor}
                          </p>
                        </div>
                        
                        {/* Order Status & Price */}
                        <div className="flex flex-col items-end">
                          <p className="text-lg font-medium text-gray-900">${order.total.toFixed(2)}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {order.status === 'delivered' && order.deliveredAt && `Delivered on ${formatDate(order.deliveredAt)}`}
                            {order.status === 'cancelled' && order.cancelledAt && `Cancelled on ${formatDate(order.cancelledAt)}`}
                            {(order.status === 'processing' || order.status === 'preparing' || order.status === 'ready_for_pickup' || order.status === 'out_for_delivery') && 
                              order.estimatedDelivery && `Estimated delivery: ${formatDate(order.estimatedDelivery)}`}
                          </p>
                        </div>
                      </div>
                      
                      {/* Order Items */}
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center">
                              <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/60x60/f9fafb/1e3a8a?text=Product';
                                  }}
                                />
                              </div>
                              <div className="ml-2">
                                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity} × ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* View Details Button */}
                      <div className="mt-4 flex justify-end">
                        <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
                          View Details <span aria-hidden="true" className="ml-1">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;

