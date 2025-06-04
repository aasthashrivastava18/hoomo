import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHourglassHalf, 
  FaTruck, 
  FaBox, 
  FaStore, 
  FaUtensils, 
  FaTshirt, 
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaReceipt,
  FaStar,
  FaExclamationTriangle,
  FaExclamationCircle,
  FaPrint,
  FaDownload,
  FaClipboard,
  FaHeadset
} from 'react-icons/fa';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContactSupport, setShowContactSupport] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, this would be an API call
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
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
              tax: 0.00,
              discount: 0.00,
              last4: '4242'
            },
            timeline: [
              { status: 'Order Placed', date: '2023-06-15T10:30:00', completed: true },
              { status: 'Payment Confirmed', date: '2023-06-15T10:32:00', completed: true },
              { status: 'Processing', date: '2023-06-15T10:45:00', completed: true },
              { status: 'Preparing', date: '2023-06-15T11:15:00', completed: true },
              { status: 'Ready for Pickup', date: '2023-06-15T12:30:00', completed: true },
              { status: 'Out for Delivery', date: '2023-06-15T13:00:00', completed: true },
              { status: 'Delivered', date: null, completed: false }
            ],
            canCancel: false,
            canReturn: false,
            canReorder: true,
            canReview: false
          },
          'ORD-67890': {
            id: 'ORD-67890',
            date: '2023-06-14T18:45:00',
            status: 'delivered',
            estimatedDelivery: '2023-06-14T20:15:00',
            actualDelivery: '2023-06-14T20:05:00',
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
              tax: 0.00,
              discount: 0.00,
              email: 'jane.smith@example.com'
            },
            timeline: [
              { status: 'Order Placed', date: '2023-06-14T18:45:00', completed: true },
              { status: 'Payment Confirmed', date: '2023-06-14T18:47:00', completed: true },
              { status: 'Processing', date: '2023-06-14T18:50:00', completed: true },
              { status: 'Preparing', date: '2023-06-14T19:00:00', completed: true },
              { status: 'Ready for Pickup', date: '2023-06-14T19:30:00', completed: true },
              { status: 'Out for Delivery', date: '2023-06-14T19:35:00', completed: true },
              { status: 'Delivered', date: '2023-06-14T20:05:00', completed: true }
            ],
            canCancel: false,
            canReturn: true,
            canReorder: true,
            canReview: true,
            reviewed: false
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
              tax: 0.00,
              discount: 0.00,
              last4: '1234'
            },
            timeline: [
              { status: 'Order Placed', date: '2023-06-13T14:20:00', completed: true },
              { status: 'Payment Confirmed', date: '2023-06-13T14:22:00', completed: true },
              { status: 'Processing', date: '2023-06-13T15:00:00', completed: true },
              { status: 'Preparing', date: null, completed: false },
              { status: 'Ready for Pickup', date: null, completed: false },
              { status: 'Out for Delivery', date: null, completed: false },
              { status: 'Delivered', date: null, completed: false }
            ],
            canCancel: true,
            canReturn: false,
            canReorder: false,
            canReview: false
          }
        };
        
        const foundOrder = mockOrders[orderId];
        
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
    
    fetchOrderDetails();
  }, [orderId]);

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

  const handleCancelOrder = () => {
    // In a real app, this would make an API call to cancel the order
    alert('Order cancellation functionality would be implemented here.');
  };

  const handleReorder = () => {
    // In a real app, this would add all items to cart
    alert('Reorder functionality would be implemented here.');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    alert('Download invoice functionality would be implemented here.');
  };

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId)
      .then(() => {
        alert('Order ID copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy order ID: ', err);
      });
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-12 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="mr-2" />
              Back to Orders
            </Link>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
          
          <div className="text-center py-8">
            <button
              onClick={() => navigate('/orders')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View All Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <FaArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
        
        {/* Order Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Order #{order.id}</h1>
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
          
          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleCopyOrderId}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaClipboard className="mr-1.5 text-gray-500" />
                Copy Order ID
              </button>
              
              <button 
                onClick={handlePrintReceipt}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaPrint className="mr-1.5 text-gray-500" />
                Print Receipt
              </button>
              
              <button 
                onClick={handleDownloadInvoice}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaDownload className="mr-1.5 text-gray-500" />
                Download Invoice
              </button>
              
              <button 
                onClick={() => setShowContactSupport(!showContactSupport)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <FaHeadset className="mr-1.5 text-gray-500" />
                Contact Support
              </button>
            </div>
            
            {/* Contact Support Panel */}
            {showContactSupport && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-gray-800 mb-2">Need help with your order?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Our customer support team is available to assist you with any questions or issues.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={`tel:+1800123456`} 
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    <FaPhoneAlt className="mr-1.5" />
                    Call Support
                  </a>
                  <a 
                    href={`mailto:support@example.com?subject=Help with Order ${order.id}`} 
                    className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
                  >
                    <FaEnvelope className="mr-1.5" />
                    Email Support
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Order Progress */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Progress</h2>
            
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
                  <h4 className="font-medium text-gray-800">
                    {order.status === 'delivered' 
                      ? 'Delivered on' 
                      : order.status === 'cancelled'
                        ? 'Cancelled on'
                        : 'Estimated Delivery'}
                  </h4>
                  <p className="text-blue-600 font-medium">
                    {order.status === 'delivered' && order.actualDelivery 
                      ? formatDate(order.actualDelivery) 
                      : formatDate(order.estimatedDelivery)}
                  </p>
                  {order.status === 'out_for_delivery' && (
                    <p className="text-sm text-gray-600 mt-1">
                      Your order is on the way! The courier will contact you upon arrival.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-200 mr-4 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/80x80/f9fafb/1e3a8a?text=Product';
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="text-base font-medium text-gray-800">{item.name}</h3>
                          <p className="text-base font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{getVendorIcon(item.vendor.type)}</span>
                          <span className="ml-1">{item.vendor.name}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="p-6 bg-gray-50">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">${order.payment.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="text-gray-800">${order.delivery.fee.toFixed(2)}</span>
                </div>
                {order.payment.discount > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-green-600">Discount:</span>
                    <span className="text-green-600">-${order.payment.discount.toFixed(2)}</span>
                  </div>
                )}
                {order.payment.tax > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="text-gray-800">${order.payment.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium text-base pt-2 mt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${order.payment.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Delivery Address</h3>
                    <div className="flex">
                      <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-800">{order.customer.address}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Recipient</h3>
                    <p className="text-gray-800">{order.customer.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                    <div className="flex items-center mb-1">
                      <FaPhoneAlt className="text-gray-400 mr-2 flex-shrink-0" />
                      <p className="text-gray-800">{order.customer.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2 flex-shrink-0" />
                      <p className="text-gray-800">{order.customer.email}</p>
                    </div>
                  </div>
                  
                  {order.delivery.courier && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Shipping Method</h3>
                      <p className="text-gray-800">{order.delivery.method}</p>
                      
                      <h3 className="text-sm font-medium text-gray-500 mt-3 mb-1">Tracking Number</h3>
                      <p className="text-gray-800">{order.delivery.courier.trackingNumber}</p>
                      
                                            <h3 className="text-sm font-medium text-gray-500 mt-3 mb-1">Courier</h3>
                      <p className="text-gray-800">{order.delivery.courier.name}</p>
                      
                      <h3 className="text-sm font-medium text-gray-500 mt-3 mb-1">Courier Contact</h3>
                      <div className="flex items-center">
                        <FaPhoneAlt className="text-gray-400 mr-2 flex-shrink-0" />
                        <p className="text-gray-800">{order.delivery.courier.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                    <p className="text-gray-800">
                      {order.payment.method}
                      {order.payment.last4 && ` (ending in ${order.payment.last4})`}
                      {order.payment.email && ` (${order.payment.email})`}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Total Amount</h3>
                    <p className="text-gray-800 text-lg font-medium">${order.payment.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Order Actions */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Actions</h2>
                
                <div className="space-y-3">
                  {order.canCancel && (
                    <button 
                      onClick={handleCancelOrder}
                      className="w-full flex justify-center items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <FaTimesCircle className="mr-2" />
                      Cancel Order
                    </button>
                  )}
                  
                  {order.canReturn && (
                    <button 
                      onClick={() => navigate(`/returns/new?orderId=${order.id}`)}
                      className="w-full flex justify-center items-center px-4 py-2 border border-orange-300 text-orange-700 rounded-md hover:bg-orange-50 transition-colors"
                    >
                      <FaExclamationCircle className="mr-2" />
                      Request Return
                    </button>
                  )}
                  
                  {order.canReorder && (
                    <button 
                      onClick={handleReorder}
                      className="w-full flex justify-center items-center px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <FaReceipt className="mr-2" />
                      Reorder Items
                    </button>
                  )}
                  
                  {order.canReview && !order.reviewed && (
                    <button 
                      onClick={() => navigate(`/reviews/new?orderId=${order.id}`)}
                      className="w-full flex justify-center items-center px-4 py-2 border border-yellow-300 text-yellow-700 rounded-md hover:bg-yellow-50 transition-colors"
                    >
                      <FaStar className="mr-2" />
                      Write a Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

