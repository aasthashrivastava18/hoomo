import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaCheckCircle, 
  FaHourglassHalf, 
  FaTruck, 
  FaBox, 
  FaStore, 
  FaUtensils, 
  FaTshirt, 
  FaExclamationTriangle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowLeft
} from 'react-icons/fa';

const TrackOrder = () => {
  const { orderId } = useParams();
  const [searchOrderId, setSearchOrderId] = useState(orderId || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock order statuses and their corresponding steps
  const orderStatuses = {
    'processing': 1,
    'preparing': 2,
    'ready_for_pickup': 3,
    'out_for_delivery': 4,
    'delivered': 5
  };

  // Fetch order details when orderId is available
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // Simulating API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data for demonstration
      const mockOrders = {
        'ORD-12345': {
          id: 'ORD-12345',
          date: '2023-06-15T10:30:00',
          status: 'out_for_delivery',
          estimatedDelivery: '2023-06-15T14:30:00',
          customer: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            address: '123 Main St, Apt 4B, New York, NY 10001'
          },
          items: [
            {
              id: 1,
              name: 'Organic Bananas',
              quantity: 2,
              price: 3.99,
              image: 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Bananas',
              vendor: {
                name: 'Fresh Grocery Market',
                type: 'grocery'
              }
            },
            {
              id: 2,
              name: 'Whole Grain Bread',
              quantity: 1,
              price: 4.50,
              image: 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Bread',
              vendor: {
                name: 'Fresh Grocery Market',
                type: 'grocery'
              }
            }
          ],
          delivery: {
            method: 'Standard Delivery',
            fee: 5.99,
            courier: {
              name: 'Express Delivery',
              trackingNumber: 'EXP-987654',
              phone: '(555) 987-6543'
            }
          },
          payment: {
            method: 'Credit Card',
            total: 18.48,
            subtotal: 12.49,
            tax: 0.00
          },
          timeline: [
            { status: 'Order Placed', date: '2023-06-15T10:30:00', completed: true },
            { status: 'Payment Confirmed', date: '2023-06-15T10:32:00', completed: true },
            { status: 'Processing', date: '2023-06-15T10:45:00', completed: true },
            { status: 'Preparing', date: '2023-06-15T11:15:00', completed: true },
            { status: 'Ready for Pickup', date: '2023-06-15T12:30:00', completed: true },
            { status: 'Out for Delivery', date: '2023-06-15T13:00:00', completed: true },
            { status: 'Delivered', date: null, completed: false }
          ]
        },
        'ORD-67890': {
          id: 'ORD-67890',
          date: '2023-06-14T18:45:00',
          status: 'delivered',
          estimatedDelivery: '2023-06-14T20:15:00',
          customer: {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '(555) 987-6543',
            address: '456 Park Ave, Suite 10C, New York, NY 10022'
          },
          items: [
            {
              id: 3,
              name: 'Margherita Pizza',
              quantity: 1,
              price: 12.99,
              image: 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Pizza',
              vendor: {
                name: 'Italian Delights',
                type: 'restaurant'
              }
            },
            {
              id: 4,
              name: 'Caesar Salad',
              quantity: 1,
              price: 8.50,
              image: 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Salad',
              vendor: {
                name: 'Italian Delights',
                type: 'restaurant'
              }
            }
          ],
          delivery: {
            method: 'Express Delivery',
            fee: 7.99,
            courier: {
              name: 'Rapid Delivery',
              trackingNumber: 'RAP-123456',
              phone: '(555) 456-7890'
            }
          },
          payment: {
            method: 'PayPal',
            total: 29.48,
            subtotal: 21.49,
            tax: 0.00
          },
          timeline: [
            { status: 'Order Placed', date: '2023-06-14T18:45:00', completed: true },
            { status: 'Payment Confirmed', date: '2023-06-14T18:47:00', completed: true },
            { status: 'Processing', date: '2023-06-14T18:50:00', completed: true },
            { status: 'Preparing', date: '2023-06-14T19:00:00', completed: true },
            { status: 'Ready for Pickup', date: '2023-06-14T19:30:00', completed: true },
            { status: 'Out for Delivery', date: '2023-06-14T19:35:00', completed: true },
            { status: 'Delivered', date: '2023-06-14T20:05:00', completed: true }
          ]
        },
        'ORD-54321': {
          id: 'ORD-54321',
          date: '2023-06-13T14:20:00',
          status: 'processing',
          estimatedDelivery: '2023-06-16T12:00:00',
          customer: {
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            phone: '(555) 234-5678',
            address: '789 Broadway, Apt 15D, New York, NY 10003'
          },
          items: [
            {
              id: 5,
              name: 'Cotton T-Shirt - Blue',
              quantity: 2,
              price: 19.99,
              image: 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Tshirt',
              vendor: {
                name: 'Fashion Trends',
                type: 'clothing'
              }
            },
            {
              id: 6,
              name: 'Denim Jeans - Black',
              quantity: 1,
              price: 49.99,
              image: 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Jeans',
              vendor: {
                name: 'Fashion Trends',
                type: 'clothing'
              }
            }
          ],
          delivery: {
            method: 'Standard Shipping',
            fee: 4.99,
            courier: {
              name: 'Standard Shipping',
              trackingNumber: 'STD-456789',
              phone: '(555) 345-6789'
            }
          },
          payment: {
            method: 'Credit Card',
            total: 94.96,
            subtotal: 89.97,
            tax: 0.00
          },
          timeline: [
            { status: 'Order Placed', date: '2023-06-13T14:20:00', completed: true },
            { status: 'Payment Confirmed', date: '2023-06-13T14:22:00', completed: true },
            { status: 'Processing', date: '2023-06-13T15:00:00', completed: true },
            { status: 'Preparing', date: null, completed: false },
            { status: 'Ready for Pickup', date: null, completed: false },
            { status: 'Out for Delivery', date: null, completed: false },
            { status: 'Delivered', date: null, completed: false }
          ]
        }
      };
      
      const foundOrder = mockOrders[id];
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check the order ID and try again.');
      }
    } catch (err) {
      setError('Failed to fetch order details. Please try again later.');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      fetchOrderDetails(searchOrderId.trim());
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const getVendorIcon = (type) => {
    switch (type) {
      case 'grocery':
        return <FaStore className="text-green-500" />;
      case 'restaurant':
        return <FaUtensils className="text-red-500" />;
      case 'clothing':
        return <FaTshirt className="text-purple-500" />;
      default:
        return <FaStore className="text-blue-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <FaHourglassHalf className="text-yellow-500" />;
      case 'preparing':
        return <FaBox className="text-blue-500" />;
      case 'ready_for_pickup':
        return <FaStore className="text-purple-500" />;
      case 'out_for_delivery':
        return <FaTruck className="text-orange-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'preparing':
        return 'Preparing';
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Track Your Order</h1>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Enter your order ID (e.g., ORD-12345)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <FaSearch className="mr-2" />
                  Track Order
                </span>
              )}
            </button>
          </form>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
                    {!order && !loading && !error && (
            <div className="text-center py-8">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-blue-500 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Track Your Order Status</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Enter your order ID above to check the current status of your order and estimated delivery time.
              </p>
            </div>
          )}
        </div>
        
        {order && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Order #{order.id}</h2>
                  <p className="text-blue-100">Placed on {formatDate(order.date)}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white text-blue-700 font-medium text-sm">
                    {getStatusIcon(order.status)}
                    <span className="ml-2">{getStatusText(order.status)}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Order Progress */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Progress</h3>
              
              <div className="relative">
                {/* Progress Bar */}
                <div className="hidden md:block absolute left-0 top-1/2 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                
                {/* Progress Steps */}
                <div className="flex flex-col md:flex-row justify-between relative z-10">
                  {order.timeline.map((step, index) => (
                    <div key={index} className="flex md:flex-col items-center md:items-center mb-4 md:mb-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : index === order.timeline.findIndex(s => !s.completed) 
                            ? 'bg-blue-500 text-white animate-pulse' 
                            : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <FaCheckCircle />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="ml-3 md:ml-0 md:mt-2 md:text-center">
                        <p className={`font-medium ${
                          step.completed 
                            ? 'text-gray-800' 
                            : index === order.timeline.findIndex(s => !s.completed)
                              ? 'text-blue-600'
                              : 'text-gray-400'
                        }`}>
                          {step.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.date ? formatDate(step.date) : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Estimated Delivery */}
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <FaTruck className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Estimated Delivery</h4>
                    <p className="text-blue-600 font-medium">{formatDate(order.estimatedDelivery)}</p>
                    {order.status === 'out_for_delivery' && (
                      <p className="text-sm text-gray-600 mt-1">
                        Your order is on the way! The courier will contact you upon arrival.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Details */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={item.image} 
                                alt={item.name} 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Product';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="mr-2">{getVendorIcon(item.vendor.type)}</span>
                            <span className="text-sm text-gray-700">{item.vendor.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          ${item.price.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Payment Method: {order.payment.method}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                        Subtotal:
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        ${order.payment.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        Delivery Method: {order.delivery.method}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                        Delivery Fee:
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        ${order.delivery.fee.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                        {order.delivery.courier && (
                          <span>Tracking #: {order.delivery.courier.trackingNumber}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                        Tax:
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        ${order.payment.tax.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="px-4 py-3"></td>
                      <td className="px-4 py-3 text-right text-base font-bold text-gray-900">
                        Total:
                      </td>
                      <td className="px-4 py-3 text-right text-base font-bold text-gray-900">
                        ${order.payment.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Delivery Information */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex">
                      <FaMapMarkerAlt className="text-gray-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800">{order.customer.name}</p>
                        <p className="text-gray-600 whitespace-pre-line">{order.customer.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaPhoneAlt className="text-gray-500 mr-3" />
                      <span className="text-gray-800">{order.customer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-500 mr-3" />
                      <span className="text-gray-800">{order.customer.email}</span>
                    </div>
                  </div>
                  
                  {order.delivery.courier && order.status !== 'delivered' && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Courier Information</h4>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="font-medium text-gray-800">{order.delivery.courier.name}</p>
                        <div className="flex items-center mt-2">
                          <FaPhoneAlt className="text-gray-500 mr-3" />
                          <span className="text-gray-800">{order.delivery.courier.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Help Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-600 mb-4">
                  If you have any questions or issues with your order, please contact our customer support team.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="tel:+18001234567" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaPhoneAlt className="mr-2" />
                    Call Support
                  </a>
                  <Link 
                    to="/contact" 
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    <FaEnvelope className="mr-2" />
                    Email Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;

