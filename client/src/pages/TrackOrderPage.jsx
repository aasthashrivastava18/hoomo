// import React, { useEffect, useState } from 'react';
// import orderService from '../services/orderService'; // Fixed import
// import { useParams } from 'react-router-dom';

// const statusSteps = ['Placed', 'Packed', 'Out for Delivery', 'Delivered'];

// const TrackOrder = () => {
//   const { orderId } = useParams();
//   const [orderStatus, setOrderStatus] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStatus = async () => {
//       try {
//         // Use orderService.trackOrder instead of getOrderStatus
//         const data = await orderService.trackOrder(orderId);
//         setOrderStatus(data.status); // expected: "Placed", "Packed", etc.
//       } catch (error) {
//         console.error('Failed to fetch order status:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStatus();
//   }, [orderId]);

//   const getStatusIndex = () => statusSteps.indexOf(orderStatus);

//   if (loading) {
//     return <p className="text-center py-10">Loading order status...</p>;
//   }

//   return (
//     <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
//       <h2 className="text-2xl font-bold mb-6 text-center">Track Your Order</h2>
//       <div className="flex justify-between items-center relative mb-4">
//         {statusSteps.map((step, index) => (
//           <div key={step} className="flex-1 text-center relative z-10">
//             <div
//               className={`w-6 h-6 rounded-full mx-auto ${
//                 index <= getStatusIndex() ? 'bg-green-500' : 'bg-gray-300'
//               }`}
//             />
//             <p
//               className={`mt-2 text-sm ${
//                 index <= getStatusIndex() ? 'text-green-600 font-semibold' : 'text-gray-500'
//               }`}
//             >
//               {step}
//             </p>
//           </div>
//         ))}
//         <div className="absolute top-3 left-6 right-6 h-1 bg-gray-300 z-0" />
//         <div
//           className="absolute top-3 left-6 h-1 bg-green-500 z-0"
//           style={{
//             width: `${(getStatusIndex() / (statusSteps.length - 1)) * 100}%`,
//           }}
//         />
//       </div>
//       <p className="text-center mt-4 text-gray-600">Current Status: <strong>{orderStatus}</strong></p>
//     </div>
//   );
// };

// export default TrackOrder;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaPhone, FaExclamationTriangle, FaCheckCircle, FaTruck, FaBox, FaUtensils } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import orderService from '../services/orderService';
import Loader from '../components/common/Loader';
import Breadcrumb from '../components/common/Breadcrumb';

const statusSteps = [
  {
    key: 'Placed',
    label: 'Order Placed',
    icon: FaCheckCircle,
    description: 'Your order has been received'
  },
  {
    key: 'Confirmed',
    label: 'Confirmed',
    icon: FaUtensils,
    description: 'Restaurant is preparing your food'
  },
  {
    key: 'Packed',
    label: 'Ready',
    icon: FaBox,
    description: 'Your order is ready for pickup'
  },
  {
    key: 'Out for Delivery',
    label: 'Out for Delivery',
    icon: FaTruck,
    description: 'Your order is on the way'
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    icon: FaCheckCircle,
    description: 'Order delivered successfully'
  }
];

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [deliveryAgent, setDeliveryAgent] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError('Invalid order ID');
      setLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch order tracking details
        const trackingData = await orderService.trackOrder(orderId);
        
        // Fetch full order details
        const orderDetails = await orderService.getOrderById(orderId);
        
        setOrderData(orderDetails);
        setOrderStatus(trackingData.status);
        setEstimatedTime(trackingData.estimatedDeliveryTime);
        setDeliveryAgent(trackingData.deliveryAgent);
        setLastUpdated(trackingData.lastUpdated || new Date());
        
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        setError(error.message || 'Failed to load order details');
        toast.error('Failed to load order tracking information');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    // Set up polling for real-time updates
    const interval = setInterval(fetchOrderDetails, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusIndex = () => {
    return statusSteps.findIndex(step => step.key === orderStatus);
  };

  const getCurrentStep = () => {
    return statusSteps.find(step => step.key === orderStatus);
  };

  const getEstimatedDeliveryTime = () => {
    if (!estimatedTime) return null;
    
    const now = new Date();
    const delivery = new Date(estimatedTime);
    const diffMinutes = Math.max(0, Math.floor((delivery - now) / (1000 * 60)));
    
    if (diffMinutes === 0) return 'Arriving now';
    if (diffMinutes < 60) return `${diffMinutes} minutes`;
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const handleRetry = () => {
    setError('');
    window.location.reload();
  };

  const handleCallSupport = () => {
    window.open('tel:+1-800-FOOD-HELP');
  };

  const handleCallDeliveryAgent = () => {
    if (deliveryAgent?.phone) {
      window.open(`tel:${deliveryAgent.phone}`);
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Home', path: '/' },
      { label: 'Orders', path: '/orders' }
    ];

    if (orderId) {
      items.push({
        label: `Order #${orderId.slice(-6)}`,
        path: `/track-order/${orderId}`,
        current: true
      });
    }

    return items;
  };

  const getStatusColor = (stepIndex) => {
    const currentIndex = getStatusIndex();
    if (stepIndex < currentIndex) return 'text-green-600 bg-green-500';
    if (stepIndex === currentIndex) return 'text-blue-600 bg-blue-500';
    return 'text-gray-400 bg-gray-300';
  };

  const getProgressWidth = () => {
    const currentIndex = getStatusIndex();
    if (currentIndex === -1) return '0%';
    return `${(currentIndex / (statusSteps.length - 1)) * 100}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-600">Loading order tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <FaExclamationTriangle className="mx-auto text-6xl text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unable to Track Order
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              
              <button
                onClick={() => navigate('/orders')}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FaArrowLeft className="inline mr-2" />
                Back to Orders
              </button>
              
              <button
                onClick={handleCallSupport}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                <FaPhone className="inline mr-2" />
                Call Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Track Your Order
              </h1>
              <p className="text-gray-600">
                Order ID: <span className="font-mono font-semibold">#{orderId?.slice(-8)}</span>
              </p>
              {orderData?.restaurant && (
                <p className="text-gray-600">
                  From: <span className="font-semibold">{orderData.restaurant.name}</span>
                </p>
              )}
            </div>
            
            <div className="mt-4 lg:mt-0 text-right">
              {estimatedTime && orderStatus !== 'Delivered' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center text-blue-700">
                    <FaClock className="mr-2" />
                    <span className="font-semibold">ETA: {getEstimatedDeliveryTime()}</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Expected by {new Date(estimatedTime).toLocaleTimeString()}
                  </p>
                </div>
              )}
              
              {orderStatus === 'Delivered' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center text-green-700">
                    <FaCheckCircle className="mr-2" />
                    <span className="font-semibold">Order Delivered!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Status Tracker */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Progress</h2>
          
          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="flex justify-between items-center relative z-10">
              {statusSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index <= getStatusIndex();
                const isCurrent = index === getStatusIndex();
                
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive
                          ? 'bg-green-500 border-green-500 text-white'
                          : isCurrent
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="mt-3 text-center">
                      <p
                        className={`text-sm font-medium ${
                          isActive ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isActive ? 'text-green-500' : isCurrent ? 'text-blue-500' : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 z-0" />
            <div
              className="absolute top-6 left-6 h-1 bg-green-500 z-0 transition-all duration-500"
              style={{ width: getProgressWidth() }}
            />
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Current Status: <span className="text-blue-600">{orderStatus}</span>
                </h3>
                {getCurrentStep() && (
                  <p className="text-gray-600 text-sm mt-1">
                    {getCurrentStep().description}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm font-medium">
                  {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Just now'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Agent Info */}
        {deliveryAgent && orderStatus === 'Out for Delivery' && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Agent</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {deliveryAgent.name?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{deliveryAgent.name}</p>
                  <p className="text-gray-600 text-sm">Delivery Partner</p>
                  {deliveryAgent.vehicle && (
                    <p className="text-gray-500 text-sm">
                      {deliveryAgent.vehicle} • {deliveryAgent.vehicleNumber}
                    </p>
                  )}
                </div>
              </div>
              
              {deliveryAgent.phone && (
                <button
                  onClick={handleCallDeliveryAgent}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <FaPhone className="inline mr-2" />
                  Call
                </button>
              )}
            </div>
          </div>
        )}

              {/* Order Details */}
        {orderData && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Items Ordered</h4>
                <div className="space-y-3">
                  {orderData.items?.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.customizations && item.customizations.length > 0 && (
                          <p className="text-sm text-gray-600">
                            {item.customizations.join(', ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${orderData.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    
                    {orderData.deliveryFee && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="text-gray-900">${orderData.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {orderData.tax && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">${orderData.tax.toFixed(2)}</span>
                      </div>
                    )}
                    
                    {orderData.discount && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${orderData.discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${orderData.total?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Delivery Information</h4>
                
                <div className="space-y-4">
                  {/* Delivery Address */}
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Delivery Address</p>
                      <p className="text-gray-600 text-sm">
                        {orderData.deliveryAddress?.street}<br />
                        {orderData.deliveryAddress?.city}, {orderData.deliveryAddress?.state} {orderData.deliveryAddress?.zipCode}
                      </p>
                      {orderData.deliveryAddress?.instructions && (
                        <p className="text-gray-500 text-sm mt-1">
                          <strong>Instructions:</strong> {orderData.deliveryAddress.instructions}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Time */}
                  <div className="flex items-start space-x-3">
                    <FaClock className="text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-gray-600 text-sm">
                        {orderData.createdAt ? new Date(orderData.createdAt).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {orderData.paymentMethod && (
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded mt-1 flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs">$</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Payment Method</p>
                        <p className="text-gray-600 text-sm capitalize">
                          {orderData.paymentMethod}
                          {orderData.paymentStatus && (
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              orderData.paymentStatus === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {orderData.paymentStatus}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Restaurant Info */}
                  {orderData.restaurant && (
                    <div className="flex items-start space-x-3">
                      <FaUtensils className="text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Restaurant</p>
                        <p className="text-gray-600 text-sm">{orderData.restaurant.name}</p>
                        {orderData.restaurant.phone && (
                          <button
                            onClick={() => window.open(`tel:${orderData.restaurant.phone}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm mt-1"
                          >
                            <FaPhone className="inline mr-1" />
                            Call Restaurant
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {orderStatus !== 'Delivered' && orderStatus !== 'Cancelled' && (
              <button
                onClick={handleCallSupport}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                <FaPhone className="inline mr-2" />
                Contact Support
              </button>
            )}
            
            {orderStatus === 'Delivered' && (
              <Link
                to={`/order/${orderId}/review`}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors text-center"
              >
                Rate Your Experience
              </Link>
            )}
            
            <Link
              to="/orders"
              className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-md hover:bg-gray-700 transition-colors text-center"
            >
              View All Orders
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition-colors text-center"
            >
              Refresh Status
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Common Issues</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Order taking longer than expected</li>
                <li>• Missing items from your order</li>
                <li>• Delivery address issues</li>
                <li>• Payment or billing questions</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Contact Options</h4>
              <div className="space-y-2">
                <button
                  onClick={handleCallSupport}
                  className="block w-full text-left text-sm text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <FaPhone className="inline mr-2" />
                  Call Support: 1-800-FOOD-HELP
                </button>
                
                <Link
                  to="/help"
                  className="block w-full text-left text-sm text-blue-700 hover:text-blue-900 transition-colors"
                >
                  📧 Email Support
                </Link>
                
                <Link
                  to="/help/chat"
                  className="block w-full text-left text-sm text-blue-700 hover:text-blue-900 transition-colors"
                >
                  💬 Live Chat
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline (if available) */}
        {orderData?.timeline && orderData.timeline.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-4">
              {orderData.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {event.description && (
                      <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                    )}
                    {event.location && (
                      <p className="text-gray-500 text-xs mt-1">
                        <FaMapMarkerAlt className="inline mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-refresh Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🔄 This page automatically refreshes every 30 seconds to show the latest updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;

